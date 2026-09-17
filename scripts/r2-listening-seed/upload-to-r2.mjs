// Uploads the audio (one continuous file per test, matching how the real
// IELTS Listening test is played) and Section 2 map images for IELTS
// Listening Mock Tests 11-14 to Cloudflare R2.
//
// This mirrors scripts/r2-writing-seed/upload-to-r2.mjs, adapted for
// listening.
//
// BEFORE RUNNING — put your files here (rename to match exactly):
//
//   scripts/r2-listening-seed/local_assets/TEST11/full.mp3
//   scripts/r2-listening-seed/local_assets/TEST11/section-2-map.jpg
//   ...same 2 files under TEST12/, TEST13/, TEST14/
//
// full.mp3 is the ONE continuous track for the whole test (all 4 sections,
// intro through the final "you now have ten minutes to transfer your
// answers") — same as how it's played in the real exam. Every
// test_sections row for that test points at this same file; there's no
// need to cut it into per-section pieces.
//
// It's fine to run this before every file exists: missing files are
// skipped with a warning, and you can re-run after adding the rest
// (already-uploaded files are simply re-uploaded, which is harmless).
//
// Setup:
//   @aws-sdk/client-s3 is already a devDependency.
//   @aws-sdk/lib-storage is ALSO now required (multipart upload — much more
//   resilient to the ECONNRESET/timeout errors a single huge PutObject can
//   hit on a flaky connection or behind antivirus/VPN HTTPS inspection):
//     npm install --save-dev @aws-sdk/lib-storage
//
// Env vars required (already in your .env):
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET,
//   R2_PUBLIC_BASE_URL
//
// Run (from repo root):
//   node --env-file=.env scripts/r2-listening-seed/upload-to-r2.mjs
//
// Output:
//   scripts/r2-listening-seed/asset-urls.json — { "11:full.mp3": "<url>", ... }
//   Re-run generate_seed_sql.py afterwards to bake these URLs into the
//   migration SQL.
//
// Resilience notes (added after repeated ECONNRESET failures uploading
// large audio files):
//   - Uploads stream from disk in 8MB parts via @aws-sdk/lib-storage's
//     Upload helper instead of one single PutObject with the whole file
//     buffered in memory. A dropped connection only loses the current part,
//     and the SDK's own retry logic (maxAttempts below) retries just that
//     part rather than restarting the whole file.
//   - requestHandler timeouts are raised well above the defaults, since a
//     multi-MB part on a slow/unstable connection can take longer than the
//     SDK's ~1s default connection timeout.
//   - Each file also gets its own outer retry loop (RETRIES) in case a
//     whole upload attempt still fails outright (e.g. the connection drops
//     between parts) — same file, fresh attempt, small backoff.

import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { createReadStream, statSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_BASE_URL,
} = process.env;

for (const [k, v] of Object.entries({
  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE_URL,
})) {
  if (!v) {
    console.error(`Missing required env var: ${k}`);
    process.exit(1);
  }
}

const RETRIES = 4; // outer per-file retry count, on top of the SDK's own per-part retries

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  maxAttempts: 5,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 30_000,
    requestTimeout: 300_000, // 5 min per request — generous for an 8MB part on a slow link
    httpsAgent: { keepAlive: true, maxSockets: 4 },
  }),
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const manifest = JSON.parse(readFileSync(join(__dirname, 'manifest.json'), 'utf8'));

const contentTypeFor = (file) => {
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg';
  return 'audio/mpeg';
};

// Collect the unique set of local asset files this manifest actually needs:
// one full.mp3 per test, plus one Section 2 map image per test (only if that
// test's Section 2 map-labelling block asks for one).
const assets = [];
for (const test of manifest.tests) {
  assets.push({ num: test.num, file: test.audio_local });
  for (const section of test.sections) {
    if (section.image_local) {
      assets.push({ num: test.num, file: section.image_local });
    }
  }
}

const existingUrls = existsSync(join(__dirname, 'asset-urls.json'))
  ? JSON.parse(readFileSync(join(__dirname, 'asset-urls.json'), 'utf8'))
  : {};

const urls = { ...existingUrls };
let uploaded = 0;
let skipped = 0;

for (const { num, file } of assets) {
  const key = `${num}:${file}`;
  const localPath = join(__dirname, 'local_assets', `TEST${num}`, file);
  if (!existsSync(localPath)) {
    console.warn(`SKIP  test ${num}: ${file} not found at ${localPath}`);
    skipped += 1;
    continue;
  }

  const sizeMb = (statSync(localPath).size / (1024 * 1024)).toFixed(1);
  const r2Key = `listening-tests/test-${num}/${file}`;

  let lastErr;
  let ok = false;
  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      console.log(`Uploading test ${num}: ${file} (${sizeMb}MB) — attempt ${attempt}/${RETRIES}...`);
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: R2_BUCKET,
          Key: r2Key,
          // Stream from disk instead of loading the whole file into memory,
          // and let Upload split it into multipart parts.
          Body: createReadStream(localPath),
          ContentType: contentTypeFor(file),
          CacheControl: 'public, max-age=31536000, immutable',
        },
        // 8MB parts, up to 4 in flight — small enough that a dropped
        // connection only costs one part's worth of retry, not the whole file.
        partSize: 8 * 1024 * 1024,
        queueSize: 4,
      });
      await upload.done();
      ok = true;
      break;
    } catch (err) {
      lastErr = err;
      console.warn(`  attempt ${attempt} failed: ${err.code || err.name || err.message}`);
      if (attempt < RETRIES) {
        const backoffMs = attempt * 3000;
        console.warn(`  retrying in ${backoffMs / 1000}s...`);
        await sleep(backoffMs);
      }
    }
  }

  if (!ok) {
    console.error(`FAILED test ${num}: ${file} after ${RETRIES} attempts — ${lastErr?.message || lastErr}`);
    console.error('  Skipping this file for now; already-succeeded files below are still saved. Re-run the script to retry just this one.');
    skipped += 1;
    continue;
  }

  const publicUrl = `${R2_PUBLIC_BASE_URL.replace(/\/$/, '')}/${r2Key}`;
  urls[key] = publicUrl;
  uploaded += 1;
  console.log(`Uploaded test ${num}: ${file} -> ${publicUrl}`);
}

writeFileSync(join(__dirname, 'asset-urls.json'), JSON.stringify(urls, null, 2));
console.log(`\nDone. Uploaded ${uploaded}, skipped ${skipped} (missing locally). Wrote asset-urls.json.`);
if (skipped > 0) {
  console.log('Add the missing files and re-run this script when ready — already-uploaded files are unaffected.');
}
