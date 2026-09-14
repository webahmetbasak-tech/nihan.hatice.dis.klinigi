import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  SRGBColorSpace,
  Scene,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { MeshData, ToothLayers } from './tooth-geometry';

/** Geometri Web Worker'da üretilir; worker yoksa (eski tarayıcı) ana thread'e düşer. */
export function computeLayers(quality: 'high' | 'low'): Promise<ToothLayers> {
  const fallback = () => import('./tooth-geometry').then((m) => m.buildLayers(quality));
  if (typeof Worker === 'undefined') return fallback();
  return new Promise<ToothLayers>((resolve, reject) => {
    const worker = new Worker(new URL('./tooth.worker', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }: MessageEvent<ToothLayers>) => {
      resolve(data);
      worker.terminate();
    };
    worker.onerror = (e) => {
      worker.terminate();
      reject(e);
    };
    worker.postMessage({ quality });
  }).catch(fallback);
}

const toGeometry = ({ positions, normals }: MeshData) => {
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(positions, 3));
  g.setAttribute('normal', new BufferAttribute(normals, 3));
  g.computeBoundingSphere();
  return g;
};

/** GSAP'in doğrudan tween'lediği sahne durumu. x/y: görünür alanın yarı genişliğine/yüksekliğine oran (-1…1). */
export interface ToothState {
  x: number;
  y: number;
  scale: number;
  rotY: number;
  rotX: number;
  enamel: number; // 1 = opak porselen, 0 = neredeyse görünmez cam
  dentin: number;
  pulp: number;
  scan: number; // 0→1 tarama halkası geçişi
  points: number; // dijital nokta bulutu görünürlüğü
  rings: number;
  opacity: number; // tüm sahne
}

export interface ToothSceneOptions {
  quality: 'high' | 'low';
  colors: { accent: string; glow: string; enamel: string };
}

export class ToothScene {
  readonly state: ToothState = {
    x: 0.42,
    y: 0,
    scale: 1,
    rotY: -0.5,
    rotX: 0.12,
    enamel: 1,
    dentin: 0,
    pulp: 0,
    scan: 0,
    points: 0,
    rings: 1,
    opacity: 1,
  };

  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(30, 1, 0.1, 100);
  private readonly root = new Group();
  private readonly tilt = new Group();
  private readonly spin = new Group();
  private readonly ringGroup = new Group();
  private enamelMat!: MeshPhysicalMaterial;
  private dentinMat!: MeshPhysicalMaterial;
  private pulpMat!: MeshStandardMaterial;
  private enamelMesh?: Mesh;
  private dentinMesh?: Mesh;
  private pulpMesh?: Mesh;
  private points?: Points;
  private scanRing!: Mesh;
  private ringMats: MeshBasicMaterial[] = [];
  private readonly rim = { uRimColor: { value: new Color() }, uRimAlpha: { value: 0 } };
  private readonly pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private raf = 0;
  private active = false;
  private idle = 0;
  private last = 0;
  private readonly resizeObserver: ResizeObserver;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: ToothSceneOptions,
  ) {
    const high = options.quality === 'high';
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: high, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, high ? 1.75 : 1.5));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.94;

    const pmrem = new PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.camera.position.set(0, 0, 10);
    this.scene.add(this.root);
    this.root.add(this.tilt);
    this.tilt.add(this.spin);
    this.tilt.add(this.ringGroup);

    const key = new DirectionalLight('#fff3e2', 1.5);
    key.position.set(-4, 5, 6);
    const rim = new DirectionalLight(options.colors.glow, 2.4);
    rim.position.set(5, 1.5, -5);
    this.scene.add(key, rim, new HemisphereLight('#ffffff', '#6d625a', 0.35));

    this.createMaterials();
    this.createRings();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement ?? canvas);
    this.resize();
  }

  /** @param precomputed Önceden (sayfa yüklenirken) Worker'da hesaplanmış geometri — varsa beklemeden kullanılır. */
  async build(precomputed?: Promise<ToothLayers>): Promise<void> {
    const high = this.options.quality === 'high';
    const layers = await (precomputed ?? computeLayers(this.options.quality));
    const enamel = toGeometry(layers.enamel);
    this.enamelMesh = new Mesh(enamel, this.enamelMat);
    this.enamelMesh.renderOrder = 3;
    this.spin.add(this.enamelMesh);

    this.dentinMesh = new Mesh(toGeometry(layers.dentin), this.dentinMat);
    this.dentinMesh.renderOrder = 2;
    this.spin.add(this.dentinMesh);

    this.pulpMesh = new Mesh(toGeometry(layers.pulp), this.pulpMat);
    this.pulpMesh.renderOrder = 1;
    this.spin.add(this.pulpMesh);

    // Dijital tarama nokta bulutu (mine yüzeyinden seyreltilmiş)
    const src = enamel.getAttribute('position').array as Float32Array;
    const stride = high ? 33 : 54;
    const pts = new Float32Array(Math.floor(src.length / stride) * 3);
    for (let i = 0, o = 0; o < pts.length; i += stride, o += 3) {
      pts[o] = src[i] * 1.045;
      pts[o + 1] = src[i + 1] * 1.045;
      pts[o + 2] = src[i + 2] * 1.045;
    }
    const pg = new BufferGeometry();
    pg.setAttribute('position', new BufferAttribute(pts, 3));
    this.points = new Points(
      pg,
      new PointsMaterial({
        color: this.options.colors.accent,
        size: high ? 0.014 : 0.02,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    this.spin.add(this.points);
    // Shader derlemesi: destekleniyorsa paralel/asenkron (ana thread'i dondurmaz)
    const r = this.renderer as WebGLRenderer & { compileAsync?: (s: Scene, c: PerspectiveCamera) => Promise<unknown> };
    if (r.compileAsync) await r.compileAsync(this.scene, this.camera);
    else this.renderer.compile(this.scene, this.camera);
  }

  setActive(active: boolean): void {
    if (active === this.active) return;
    this.active = active;
    if (active) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    } else {
      cancelAnimationFrame(this.raf);
    }
  }

  /** nx, ny: -1…1 */
  setPointer(nx: number, ny: number): void {
    this.pointer.tx = nx;
    this.pointer.ty = ny;
  }

  /** Tek kare çizer (reduced motion: statik sahne). */
  renderOnce(): void {
    this.apply(0);
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.setActive(false);
    this.resizeObserver.disconnect();
    this.scene.traverse((o) => {
      const m = o as Mesh;
      m.geometry?.dispose();
      const mat = m.material as Material | Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    this.scene.environment?.dispose();
    this.renderer.dispose();
  }

  private readonly frame = (now: number) => {
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.apply(dt);
    this.renderer.render(this.scene, this.camera);
    if (this.active) this.raf = requestAnimationFrame(this.frame);
  };

  private apply(dt: number): void {
    const s = this.state;
    this.idle += dt * 0.16;

    // Kamera uzayında konum: görünür alan oranına göre
    const visibleH = 2 * Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.position.z;
    const visibleW = visibleH * this.camera.aspect;
    this.root.position.set((s.x * visibleW) / 2, (s.y * visibleH) / 2, 0);
    const fit = Math.min(1, this.camera.aspect / 0.62); // dar ekranda taşmayı önle
    this.root.scale.setScalar(s.scale * (0.55 + 0.45 * fit));

    // İnertiyal imleç eğimi
    this.pointer.x += (this.pointer.tx - this.pointer.x) * Math.min(1, dt * 3);
    this.pointer.y += (this.pointer.ty - this.pointer.y) * Math.min(1, dt * 3);
    this.tilt.rotation.set(s.rotX + this.pointer.y * 0.18, this.pointer.x * 0.32, Math.sin(this.idle * 1.3) * 0.03);
    this.spin.rotation.y = s.rotY + this.idle;
    this.spin.position.y = Math.sin(this.idle * 2.2) * 0.06;

    // Katman görünürlükleri
    const enamelOpacity = 0.1 + 0.9 * s.enamel;
    this.enamelMat.opacity = enamelOpacity * s.opacity;
    this.enamelMat.depthWrite = s.enamel > 0.98;
    this.rim.uRimAlpha.value = 0.55 * (1 - s.enamel) * s.opacity * s.opacity;
    this.dentinMat.opacity = s.dentin * (0.25 + 0.75 * (1 - s.pulp * 0.72)) * s.opacity;
    this.pulpMat.opacity = s.pulp * s.opacity;
    if (this.dentinMesh) this.dentinMesh.visible = s.dentin > 0.01 && s.enamel < 0.99;
    if (this.pulpMesh) this.pulpMesh.visible = s.pulp > 0.01 && s.enamel < 0.99;
    this.dentinMat.depthWrite = s.dentin > 0.98 && s.pulp < 0.02;

    if (this.points) {
      (this.points.material as PointsMaterial).opacity = s.points * 0.55 * s.opacity;
      this.points.visible = s.points > 0.01;
    }

    // Halkalar
    this.ringGroup.rotation.y = this.idle * 0.6;
    this.ringMats.forEach((m, i) => (m.opacity = (i === 0 ? 0.42 : 0.26) * s.rings * s.opacity));
    const scanMat = this.scanRing.material as MeshBasicMaterial;
    scanMat.opacity = Math.sin(Math.min(1, Math.max(0, s.scan)) * Math.PI) * 0.75 * s.opacity;
    this.scanRing.visible = scanMat.opacity > 0.01;
    this.scanRing.position.y = 1.55 - s.scan * 3.1;
    const r = 1 - Math.abs(this.scanRing.position.y) * 0.18;
    this.scanRing.scale.set(r, r, 1);
  }

  private createMaterials(): void {
    const { enamel, glow } = this.options.colors;
    this.rim.uRimColor.value.set(glow);
    this.enamelMat = new MeshPhysicalMaterial({
      color: enamel,
      roughness: 0.36,
      metalness: 0,
      clearcoat: 0.85,
      clearcoatRoughness: 0.2,
      sheen: 0.45,
      sheenColor: new Color('#dcc59c'),
      sheenRoughness: 0.5,
      envMapIntensity: 0.78,
      transparent: true,
    });
    // Fresnel kenar ışığı: opak halde porselen parıltısı, şeffaf halde "röntgen" silüeti
    this.enamelMat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.rim);
      shader.fragmentShader = shader.fragmentShader
        .replace('void main() {', 'uniform vec3 uRimColor;\nuniform float uRimAlpha;\nvoid main() {')
        .replace(
          '#include <opaque_fragment>',
          `float fres = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 2.6);
           outgoingLight += uRimColor * fres * 0.35;
           #include <opaque_fragment>
           gl_FragColor.a = clamp(gl_FragColor.a + fres * uRimAlpha, 0.0, 1.0);`,
        );
    };

    this.dentinMat = new MeshPhysicalMaterial({
      color: '#e2c99a',
      roughness: 0.55,
      sheen: 0.5,
      sheenColor: new Color('#f3dfb8'),
      transparent: true,
      opacity: 0,
    });
    this.pulpMat = new MeshStandardMaterial({
      color: '#d27c63',
      emissive: '#8f3524',
      emissiveIntensity: 0.55,
      roughness: 0.45,
      transparent: true,
      opacity: 0,
    });
  }

  private createRings(): void {
    const { accent, glow } = this.options.colors;
    const specs: [number, number, number][] = [
      [2.05, 1.18, 0.2],
      [2.35, 1.42, -0.5],
    ];
    for (const [radius, rx, rz] of specs) {
      const mat = new MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.4, depthWrite: false });
      const ring = new Mesh(new TorusGeometry(radius, 0.0045, 6, 220), mat);
      ring.rotation.set(rx, 0, rz);
      this.ringMats.push(mat);
      this.ringGroup.add(ring);
    }
    this.scanRing = new Mesh(
      new TorusGeometry(1.25, 0.006, 8, 160),
      new MeshBasicMaterial({ color: glow, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending }),
    );
    this.scanRing.rotation.x = Math.PI / 2;
    this.spin.add(this.scanRing);
  }

  private resize(): void {
    const parent = this.canvas.parentElement ?? this.canvas;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (!this.active) this.renderOnce();
  }
}
