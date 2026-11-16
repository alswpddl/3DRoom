// npx cap add android 뒤에 실행: 위치 권한 추가, 버전 번호 설정
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const gradle = path.join(root, 'android', 'app', 'build.gradle');
if (!fs.existsSync(manifest)) throw new Error('android 폴더가 없어요. 먼저 npx cap add android 를 실행하세요.');

let m = fs.readFileSync(manifest, 'utf8');
for (const perm of ['android.permission.ACCESS_COARSE_LOCATION', 'android.permission.ACCESS_FINE_LOCATION']) {
  if (!m.includes(perm)) m = m.replace('</manifest>', `    <uses-permission android:name="${perm}" />\n</manifest>`);
}
fs.writeFileSync(manifest, m);

const n = Math.max(1, parseInt(process.env.BUILD_NUMBER || '1', 10));
let g = fs.readFileSync(gradle, 'utf8');
g = g.replace(/versionCode\s+\d+/, `versionCode ${n}`).replace(/versionName\s+"[^"]*"/, `versionName "1.0.${n}"`);
fs.writeFileSync(gradle, g);
console.log(`안드로이드 설정 완료: 위치 권한, 버전 1.0.${n} (코드 ${n})`);
