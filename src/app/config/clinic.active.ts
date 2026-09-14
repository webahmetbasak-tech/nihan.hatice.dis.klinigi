/**
 * AKTİF KLİNİK
 *
 * Bu dosya build sırasında angular.json'daki `fileReplacements` ile değiştirilir:
 *   npm run build:kadriye-ozkul  →  src/app/config/active/kadriye-ozkul.ts
 * Böylece her deploy'da YALNIZCA ilgili kliniğin config'i bundle'a girer
 * (rakip kliniklerin bilgileri kaynak kodda görünmez).
 *
 * Yapılandırmasız `ng serve` / `ng build` varsayılanı: kutahyaakademi
 */
export { default as ACTIVE_CLINIC } from './clinics/kutahyaakademi';
