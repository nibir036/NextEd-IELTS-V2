// Quick network diagnostic — uploads a tiny (few-byte) object to your R2
// bucket to isolate whether the ECONNRESET is size-related (large audio
// files only) or affects ALL traffic to Cloudflare R2 from this network.
//
// Run: node --env-file=.env scripts/r2-listening-seed/diagnose-r2.mjs

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;

console.log('Testing basic HTTPS reachability to the R2 endpoint first...');
try {
  const res = await fetch(`https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, { method: 'HEAD' });
  console.log(`  HEAD request reached the host — status ${res.status} (any status here is fine, we just want a response, not a hang/reset)`);
} catch (err) {
  console.log(`  FAILED to even reach the host: ${err.code || err.name || err.message}`);
  console.log('  -> Something (firewall/DNS/proxy) is blocking this host entirely, not just large uploads.');
}

console.log('\nNow testing a tiny (14-byte) PutObject through the S3 SDK...');
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

try {
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: '_diagnostic-test.txt',
    Body: 'hello from node',
    ContentType: 'text/plain',
  }));
  console.log('  SUCCESS — tiny upload worked.');
  console.log('  -> This means R2 access itself is fine; the problem is specific to larger/longer');
  console.log('     uploads (a proxy or antivirus TLS-inspection resetting long-lived connections).');
} catch (err) {
  console.log(`  FAILED: ${err.code || err.name || err.message}`);
  console.log('  -> Even a tiny upload fails, so this is NOT about file size — something is');
  console.log('     blocking/resetting ALL traffic to this specific host on this network.');
}
