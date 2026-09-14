#!/usr/bin/env node
/**
 * Klinik bazlı build.
 *
 *   npm run build                      → CLINIC ortam değişkeni ya da varsayılan klinik
 *   npm run build:kadriye-ozkul        → belirli klinik
 *   CLINIC=dtnazliyoluc npm run build  → Vercel'de ortam değişkeniyle
 *
 * Adımlar: ng build (prerender) → sitemap.xml + robots.txt → sızıntı kontrolü → dist/app kopyası
 * Vercel "Output Directory": dist/app/browser
 */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const CLINICS = ['kutahyaakademi', 'kadriye-ozkul', 'dtnazliyoluc', 'nihan_hatice_disklinigi'];
/**
 * Klinik seçimi (öncelik sırasıyla):
 *  1) komut satırı argümanı        → npm run build:<klinik>
 *  2) CLINIC ortam değişkeni        → Vercel → Environment Variables
 *  3) Vercel'in repo adı            → VERCEL_GIT_REPO_SLUG (ortam değişkeni unutulsa bile doğru klinik)
 *  4) varsayılan                    → kutahyaakademi
 */
const REPO_TO_CLINIC = {
  kutahyaakademi: 'kutahyaakademi',
  'nihan.hatice.dis.klinigi': 'nihan_hatice_disklinigi',
};
const repoSlug = (process.env.VERCEL_GIT_REPO_SLUG || '').toLowerCase();
const clinic = process.argv[2] || process.env.CLINIC || REPO_TO_CLINIC[repoSlug] || 'kutahyaakademi';
if (repoSlug) console.log(`ℹ Vercel repo: ${repoSlug} → klinik: ${clinic}`);

if (!CLINICS.includes(clinic)) {
  console.error(`\n✖ Bilinmeyen klinik: "${clinic}". Geçerli değerler: ${CLINICS.join(', ')}\n`);
  process.exit(1);
}

console.log(`\n▶ Build: ${clinic}\n`);
const result = spawnSync('npx', ['ng', 'build', '--configuration', `production,${clinic}`], {
  stdio: 'inherit',
  shell: true,
});
if (result.status !== 0) process.exit(result.status ?? 1);

const out = join('dist', clinic, 'browser');
if (!existsSync(out)) {
  console.error(`✖ Çıktı bulunamadı: ${out}`);
  process.exit(1);
}

// ── sitemap.xml: prerender edilmiş sayfalardaki canonical etiketlerinden üretilir
const htmlFiles = walk(out).filter((f) => f.endsWith('index.html'));
const urls = [];
let noindex = false;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  if (/<meta name="robots" content="noindex/.test(html)) noindex = true;
  const m = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (m) urls.push(m[1]);
}
const siteUrl = urls[0] ? new URL(urls[0]).origin : '';
if (urls.length) {
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...new Set(urls)].map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
  writeFileSync(join(out, 'sitemap.xml'), xml);
}
writeFileSync(
  join(out, 'robots.txt'),
  `User-agent: *\nAllow: /\n${siteUrl && !noindex ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`,
);

// ── Klasör doğrudan `vercel deploy` edilirse de yönlendirmeler çalışsın
writeFileSync(
  join(out, 'vercel.json'),
  JSON.stringify(
    { cleanUrls: true, trailingSlash: false, rewrites: [{ source: '/((?!.*\\.).*)', destination: '/index.csr.html' }] },
    null,
    2,
  ),
);

// ── Sızıntı kontrolü: başka kliniklerin kimliği bu build'e girmiş mi?
const others = CLINICS.filter((c) => c !== clinic);
const leaks = [];
for (const file of walk(out).filter((f) => /\.(js|html)$/.test(f))) {
  const text = readFileSync(file, 'utf8');
  for (const other of others) {
    if (text.includes(`"${other}"`) || text.includes(`'${other}'`) || text.includes(`id:"${other}"`)) {
      leaks.push(`${relative(out, file)} → ${other}`);
    }
  }
}
if (leaks.length) {
  console.warn(`\n⚠ Diğer klinik kimlikleri çıktıda bulundu:\n  ${leaks.join('\n  ')}\n`);
} else {
  console.log(`✔ Sızıntı kontrolü: yalnızca "${clinic}" config'i paketlendi.`);
}

// ── Vercel için sabit çıktı klasörü
rmSync(join('dist', 'app'), { recursive: true, force: true });
cpSync(join('dist', clinic), join('dist', 'app'), { recursive: true });

console.log(`✔ ${htmlFiles.length} sayfa prerender edildi${noindex ? ' (noindex — demo modu)' : ''}.`);
console.log(`✔ Çıktı: dist/${clinic}/browser  ve  dist/app/browser\n`);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full.split(sep).join('/')];
  });
}
