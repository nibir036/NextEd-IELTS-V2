// Uploads all Task-1 chart images for the writing test bank to Cloudflare R2.
//
// Setup:
//   npm install @aws-sdk/client-s3 --save-dev   (run once, from repo root)
//
// Env vars required (put these in a local .env file, never commit it):
//   R2_ACCOUNT_ID          - Cloudflare account ID
//   R2_ACCESS_KEY_ID       - R2 API token access key
//   R2_SECRET_ACCESS_KEY   - R2 API token secret
//   R2_BUCKET              - bucket name, e.g. "nexted-ielts-assets"
//   R2_PUBLIC_BASE_URL     - the public base URL for the bucket, e.g.
//                            "https://pub-xxxxxxxx.r2.dev" (dev subdomain)
//                            or "https://assets.yourdomain.com" (custom domain)
//
// Run (from repo root):
//   node --env-file=.env scripts/r2-writing-seed/upload-to-r2.mjs
//
// Output:
//   scripts/r2-writing-seed/image-urls.json  — { "1": "<public url>", ... }

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, writeFileSync } from 'node:fs';
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

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const manifest = JSON.parse(readFileSync(join(__dirname, 'manifest.json'), 'utf8'));

const contentTypeFor = (key) =>
  key.endsWith('.png') ? 'image/png' : 'image/jpeg';

const urls = {};

for (const entry of manifest) {
  const localPath = join(__dirname, entry.local_file);
  const body = readFileSync(localPath);

  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: entry.r2_key,
      Body: body,
      ContentType: contentTypeFor(entry.r2_key),
      // 1-year cache: these images never change once seeded.
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  const publicUrl = `${R2_PUBLIC_BASE_URL.replace(/\/$/, '')}/${entry.r2_key}`;
  urls[entry.num] = publicUrl;
  console.log(`Uploaded test ${entry.num}: ${publicUrl}`);
}

writeFileSync(join(__dirname, 'image-urls.json'), JSON.stringify(urls, null, 2));
console.log(`\nDone. Wrote ${Object.keys(urls).length} URLs to image-urls.json`);
