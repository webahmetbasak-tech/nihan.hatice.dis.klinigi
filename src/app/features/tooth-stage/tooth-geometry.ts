import { edgeTable, triTable } from 'three/addons/objects/MarchingCubes.js';

/**
 * PROSEDÜREL AZI DİŞİ
 *
 * Harici GLB yerine işaretli mesafe alanı (SDF) + marching cubes:
 *  - 0 KB model indirme (Draco/GLB gerekmez), çözünürlük cihaza göre ayarlanır (LOD)
 *  - Mine / dentin / pulpa aynı alan fonksiyonundan türetilir → katmanlar birebir hizalı
 *  - Anatomik olarak stilize: 4 tüberkül, santral fissür, 3 kök, pulpa odası ve kök kanalları
 *
 * Bu modül saf hesaplamadır (DOM/WebGL yok) → Web Worker içinde çalışır, ana thread'i bloklamaz.
 */

type V3 = [number, number, number];
export type Sdf = (x: number, y: number, z: number) => number;

const smin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

const sphere = (x: number, y: number, z: number, c: V3, r: number) => Math.hypot(x - c[0], y - c[1], z - c[2]) - r;

const ellipsoid = (x: number, y: number, z: number, c: V3, r: V3) => {
  const px = (x - c[0]) / r[0];
  const py = (y - c[1]) / r[1];
  const pz = (z - c[2]) / r[2];
  const k0 = Math.hypot(px, py, pz);
  const k1 = Math.hypot(px / r[0], py / r[1], pz / r[2]);
  return k1 === 0 ? -Math.min(...r) : (k0 * (k0 - 1)) / k1;
};

/** Konik kapsül: a→b boyunca yarıçap r1→r2 */
const taper = (x: number, y: number, z: number, a: V3, b: V3, r1: number, r2: number) => {
  const bx = b[0] - a[0];
  const by = b[1] - a[1];
  const bz = b[2] - a[2];
  const px = x - a[0];
  const py = y - a[1];
  const pz = z - a[2];
  const t = Math.min(1, Math.max(0, (px * bx + py * by + pz * bz) / (bx * bx + by * by + bz * bz)));
  return Math.hypot(px - bx * t, py - by * t, pz - bz * t) - (r1 + (r2 - r1) * t);
};

/** İki segmentli, hafif kıvrımlı kök */
const root = (x: number, y: number, z: number, a: V3, m: V3, b: V3, r: V3) =>
  smin(taper(x, y, z, a, m, r[0], r[1]), taper(x, y, z, m, b, r[1], r[2]), 0.12);

const CUSPS: V3[] = [
  [-0.44, 0.93, 0.36],
  [0.44, 0.95, 0.34],
  [-0.42, 0.9, -0.36],
  [0.46, 0.92, -0.34],
];

export const toothSdf: Sdf = (x, y, z) => {
  let crown = ellipsoid(x, y, z, [0, 0.52, 0], [1.0, 0.6, 0.86]);
  for (const c of CUSPS) crown = smin(crown, sphere(x, y, z, c, 0.4), 0.32);
  crown = smax(crown, -sphere(x, y, z, [0, 1.36, 0], 0.44), 0.22); // santral fissür
  crown = smax(crown, -ellipsoid(x, y, z, [0, 1.22, 0], [0.12, 0.2, 0.9]), 0.12); // meziyo-distal oluk

  const roots = Math.min(
    root(x, y, z, [-0.5, 0.18, 0.08], [-0.54, -0.55, 0.04], [-0.36, -1.36, -0.02], [0.36, 0.24, 0.07]),
    root(x, y, z, [0.5, 0.18, 0.06], [0.56, -0.52, 0.02], [0.44, -1.3, 0.08], [0.36, 0.24, 0.07]),
    root(x, y, z, [0.0, 0.18, -0.38], [0.02, -0.48, -0.56], [0.06, -1.12, -0.62], [0.32, 0.2, 0.06]),
  );
  return smin(crown, roots, 0.38);
};

export const dentinSdf: Sdf = (x, y, z) => {
  // Mine kronda kalın, kökte ince: smoothstep ile dikişsiz geçiş
  const t = Math.min(1, Math.max(0, (y + 0.1) / 0.7));
  const inset = 0.1 + 0.07 * t * t * (3 - 2 * t);
  return toothSdf(x, y, z) + inset;
};

export const pulpSdf: Sdf = (x, y, z) => {
  let p = ellipsoid(x, y, z, [0, 0.44, 0], [0.44, 0.2, 0.34]);
  for (const c of CUSPS) p = smin(p, sphere(x, y, z, [c[0] * 0.55, 0.58, c[2] * 0.55], 0.065), 0.16);
  const canals = Math.min(
    root(x, y, z, [-0.36, 0.34, 0.04], [-0.46, -0.5, 0.03], [-0.36, -1.22, -0.02], [0.1, 0.07, 0.05]),
    root(x, y, z, [0.36, 0.34, 0.03], [0.48, -0.48, 0.02], [0.43, -1.16, 0.07], [0.1, 0.07, 0.05]),
    root(x, y, z, [0.0, 0.34, -0.26], [0.02, -0.44, -0.5], [0.06, -1.0, -0.58], [0.09, 0.065, 0.05]),
  );
  return smin(p, canals, 0.14);
};

export interface MeshData {
  positions: Float32Array;
  normals: Float32Array;
}

// Köşe ofsetleri (three.js MarchingCubes bit sıralamasıyla birebir): bit → (dx, dy, dz)
const CORNERS: V3[] = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
];
// Kenar → iki köşe indeksi
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [3, 2],
  [0, 3],
  [4, 5],
  [5, 6],
  [7, 6],
  [4, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

/**
 * SDF'i marching cubes ile üçgenler; normaller SDF gradyanından (pürüzsüz, tutarlı) hesaplanır.
 * @param resolution eksen başına örnek sayısı: ~48 (mobil) – ~80 (desktop)
 */
export function marchSdf(sdf: Sdf, resolution: number, extent = 1.6, offsetY = -0.02): MeshData {
  const n = resolution;
  const half = n / 2;
  const coord = (i: number) => ((i - half) / half) * extent;
  const field = new Float32Array(n * n * n);
  for (let k = 0; k < n; k++) {
    const z = coord(k);
    for (let j = 0; j < n; j++) {
      const y = coord(j) + offsetY;
      const row = k * n * n + j * n;
      for (let i = 0; i < n; i++) field[row + i] = -sdf(coord(i), y, z);
    }
  }

  let positions = new Float32Array(1 << 20);
  let count = 0;
  const vals = new Float32Array(8);
  const edgeVerts = new Float32Array(36);
  const cell = 2 * extent / n;

  for (let k = 0; k < n - 1; k++) {
    for (let j = 0; j < n - 1; j++) {
      for (let i = 0; i < n - 1; i++) {
        let cube = 0;
        for (let c = 0; c < 8; c++) {
          const [dx, dy, dz] = CORNERS[c];
          const v = field[(k + dz) * n * n + (j + dy) * n + (i + dx)];
          vals[c] = v;
          if (v < 0) cube |= 1 << c;
        }
        const bits = edgeTable[cube];
        if (!bits) continue;

        for (let e = 0; e < 12; e++) {
          if (!(bits & (1 << e))) continue;
          const [a, b] = EDGES[e];
          const t = vals[a] / (vals[a] - vals[b]);
          const ca = CORNERS[a];
          const cb = CORNERS[b];
          edgeVerts[e * 3] = coord(i) + (ca[0] + (cb[0] - ca[0]) * t) * cell;
          edgeVerts[e * 3 + 1] = coord(j) + offsetY + (ca[1] + (cb[1] - ca[1]) * t) * cell;
          edgeVerts[e * 3 + 2] = coord(k) + (ca[2] + (cb[2] - ca[2]) * t) * cell;
        }

        const base = cube << 4;
        for (let t = 0; triTable[base + t] !== -1; t += 3) {
          if (count + 9 > positions.length) {
            const grown = new Float32Array(positions.length * 2);
            grown.set(positions);
            positions = grown;
          }
          for (let v = 0; v < 3; v++) {
            const e = triTable[base + t + v] * 3;
            positions[count++] = edgeVerts[e];
            positions[count++] = edgeVerts[e + 1];
            positions[count++] = edgeVerts[e + 2];
          }
        }
      }
    }
  }

  const pos = positions.slice(0, count);
  const normals = new Float32Array(count);
  const h = cell * 0.5;
  for (let v = 0; v < count; v += 3) {
    const x = pos[v];
    const y = pos[v + 1];
    const z = pos[v + 2];
    const nx = sdf(x + h, y, z) - sdf(x - h, y, z);
    const ny = sdf(x, y + h, z) - sdf(x, y - h, z);
    const nz = sdf(x, y, z + h) - sdf(x, y, z - h);
    const len = Math.hypot(nx, ny, nz) || 1;
    normals[v] = nx / len;
    normals[v + 1] = ny / len;
    normals[v + 2] = nz / len;
  }
  return { positions: pos, normals };
}

export interface ToothLayers {
  enamel: MeshData;
  dentin: MeshData;
  pulp: MeshData;
}

export function buildLayers(quality: 'high' | 'low'): ToothLayers {
  const high = quality === 'high';
  return {
    enamel: marchSdf(toothSdf, high ? 68 : 52),
    dentin: marchSdf(dentinSdf, high ? 56 : 44),
    pulp: marchSdf(pulpSdf, high ? 68 : 52),
  };
}
