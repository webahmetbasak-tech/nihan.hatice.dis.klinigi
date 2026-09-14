import { ClinicConfig, ClinicOverrides, ServiceConfig } from './clinic.types';
import { CLINIC_DEFAULTS } from './defaults/clinic.defaults';
import { SERVICE_CATALOG } from './defaults/services.catalog';

type Plain = Record<string, unknown>;

const isPlainObject = (v: unknown): v is Plain =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Diziler override edilir (birleştirilmez); nesneler derin birleştirilir. */
function deepMerge<T>(base: T, patch: unknown): T {
  if (patch === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(patch)) return patch as T;
  const out: Plain = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    out[key] = deepMerge((base as Plain)[key], value);
  }
  return out as T;
}

function resolveServices(sel: ClinicOverrides['services']): ServiceConfig[] {
  const include = sel?.include ?? SERVICE_CATALOG.map((s) => s.id);
  const byId = new Map(SERVICE_CATALOG.map((s) => [s.id, s]));
  const picked = include
    .map((id) => {
      const base = byId.get(id);
      if (!base) {
        const extra = sel?.extra?.find((e) => e.id === id);
        if (!extra) throw new Error(`[clinic config] Bilinmeyen hizmet id: "${id}"`);
        return extra;
      }
      return deepMerge(base, sel?.overrides?.[id]);
    })
    .filter((s) => s.enabled);
  return picked;
}

/**
 * Klinik config'ini taban değerlerle birleştirir ve metin değişkenlerini çözer.
 * Build sırasında hatalı config'i erken yakalamak için basit doğrulamalar yapar.
 */
export function defineClinic(overrides: ClinicOverrides): ClinicConfig {
  const { services, doctors, ...rest } = overrides;
  const merged = deepMerge(CLINIC_DEFAULTS, rest) as ClinicConfig;
  merged.id = overrides.id;
  merged.services = resolveServices(services);
  merged.doctors = (doctors ?? []).filter((d) => d.enabled);

  const vars: Record<string, string> = {
    name: merged.clinic.name,
    shortName: merged.clinic.shortName,
    city: merged.clinic.city,
    assistant: merged.aiAssistant.name,
  };
  const resolved = interpolateDeep(merged, vars);

  const doctorIds = new Set(resolved.doctors.map((d) => d.id));
  for (const s of resolved.services) {
    for (const id of s.doctorIds) {
      if (!doctorIds.has(id)) throw new Error(`[clinic config] "${s.id}" hizmeti bilinmeyen hekim içeriyor: "${id}"`);
    }
  }
  return resolved;
}

function interpolateDeep<T>(value: T, vars: Record<string, string>): T {
  if (typeof value === 'string') {
    return value.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m) as T;
  }
  if (Array.isArray(value)) return value.map((v) => interpolateDeep(v, vars)) as T;
  if (isPlainObject(value)) {
    const out: Plain = {};
    for (const [k, v] of Object.entries(value)) out[k] = interpolateDeep(v, vars);
    return out as T;
  }
  return value;
}

/** "[PHONE]" gibi doldurulmamış placeholder mı? */
export const isPlaceholder = (v: string | null | undefined): boolean => !v || /^\[[A-Z0-9_]+\]$/.test(v.trim());
