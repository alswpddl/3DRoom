// src/index.html 을 www/ 로 복사하면서, 인터넷에서 받던 라이브러리(three.js, MapLibre)를 앱 안에 넣어 오프라인에서도 3D가 뜨게 함
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nm = (...p) => path.join(root, 'node_modules', ...p);
const www = path.join(root, 'www');

const copies = [
  [nm('three', 'build', 'three.module.js'), 'vendor/three/three.module.js'],
  [nm('three', 'examples', 'jsm', 'controls', 'OrbitControls.js'), 'vendor/three/addons/controls/OrbitControls.js'],
  [nm('three', 'examples', 'jsm', 'geometries', 'RoundedBoxGeometry.js'), 'vendor/three/addons/geometries/RoundedBoxGeometry.js'],
  [nm('maplibre-gl', 'dist', 'maplibre-gl.js'), 'vendor/maplibre/maplibre-gl.js'],
  [nm('maplibre-gl', 'dist', 'maplibre-gl.css'), 'vendor/maplibre/maplibre-gl.css'],
];
const swaps = [
  ['https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js', './vendor/three/three.module.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/', './vendor/three/addons/'],
  ['https://cdn.jsdelivr.net/npm/maplibre-gl@5.23.0/dist/', './vendor/maplibre/'],
];

fs.rmSync(www, { recursive: true, force: true });
for (const [from, to] of copies) {
  if (!fs.existsSync(from)) throw new Error(`없음: ${from}\n먼저 npm install 을 실행하세요.`);
  const dest = path.join(www, to);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(from, dest);
}
let html = fs.readFileSync(path.join(root, 'src', 'index.html'), 'utf8');
for (const [a, b] of swaps) {
  if (!html.includes(a)) throw new Error(`index.html 에서 주소를 못 찾았어요: ${a}`);
  html = html.split(a).join(b);
}
fs.writeFileSync(path.join(www, 'index.html'), html);
console.log(`www/ 준비 완료 (index.html ${(html.length / 1024).toFixed(0)} KB + 라이브러리 ${copies.length}개)`);
