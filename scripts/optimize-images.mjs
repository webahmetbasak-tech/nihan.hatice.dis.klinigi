#!/usr/bin/env node
/**
 * Google Flow'dan indirilen ham görselleri web'e hazırlar (AVIF + WebP, doğru boyut).
 *
 *   1) Ham dosyaları şu klasöre koyun (adlar prompt pack'teki dosya adlarıyla aynı):
 *        assets-src/shared/services/implant.png
 *        assets-src/shared/process/consult.png
 *        assets-src/shared/contact-band.png
 *        assets-src/clinics/kutahyaakademi/interior-01.jpg   ← GERÇEK klinik fotoğrafları
 *        assets-src/clinics/kutahyaakademi/og.png
 *   2) npm run images:optimize
 *   3) Çıktılar public/ altına aynı yapıda yazılır:
 *        shared/…   → public/images/shared/…(.webp + .avif)
 *        clinics/<id>/… → public/clinics/<id>/…(.webp + .avif)   (build'de /clinic/… olarak yayınlanır)
 *        og.*        → 1200×630 JPG (sosyal paylaşım önizlemesi)
 */
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, sep } from 'node:path';
import sharp from 'sharp';

const SRC = 'assets-src';
const RULES = [
  { test: /contact-band/, width: 2400 },
  { test: /interior|process\//, width: 1600 },
  { test: /doctor-/, width: 1000 },
  { test: /.*/, width: 1200 },
];

if (!existsSync(SRC)) {
  mkdirSync(join(SRC, 'shared', 'services'), { recursive: true });
  mkdirSync(join(SRC, 'shared', 'process'), { recursive: true });
  console.log(`"${SRC}/" klasörü oluşturuldu. Ham görselleri buraya koyup komutu tekrar çalıştırın.`);
  process.exit(0);
}

const files = walk(SRC).filter((f) => /\.(png|jpe?g|webp|avif|tiff?)$/i.test(f));
if (!files.length) {
  console.log(`"${SRC}/" içinde görsel bulunamadı.`);
  process.exit(0);
}

let saved = 0;
for (const file of files) {
  const rel = relative(SRC, file).split(sep).join('/');
  const base = rel.slice(0, -extname(rel).length);
  const outBase = rel.startsWith('clinics/') ? join('public', base) : join('public', 'images', base);
  mkdirSync(dirname(outBase), { recursive: true });

  if (/(^|\/)og$/.test(base)) {
    await sharp(file).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${outBase}.jpg`);
    console.log(`✔ ${rel} → ${outBase}.jpg`);
    continue;
  }

  const width = RULES.find((r) => r.test.test(base)).width;
  const img = sharp(file).rotate().resize({ width, withoutEnlargement: true });
  const [webp, avif] = await Promise.all([
    img.clone().webp({ quality: 80, effort: 5 }).toFile(`${outBase}.webp`),
    img.clone().avif({ quality: 52, effort: 5 }).toFile(`${outBase}.avif`),
  ]);
  const before = statSync(file).size;
  saved += before - Math.min(webp.size, avif.size);
  console.log(
    `✔ ${rel} → ${width}px  webp ${(webp.size / 1024).toFixed(0)} KB · avif ${(avif.size / 1024).toFixed(0)} KB  (${webp.width}×${webp.height})`,
  );
}
console.log(`\nToplam kazanç ≈ ${(saved / 1024 / 1024).toFixed(1)} MB`);
console.log('Not: config\'teki image.width/height değerlerini çıktı ölçüleriyle eşleştirin (CLS = 0 için).');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}
