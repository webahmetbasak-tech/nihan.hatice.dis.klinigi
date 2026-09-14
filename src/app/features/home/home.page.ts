import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MotionService } from '../../core/motion/motion.service';
import { ViewportService } from '../../core/platform/viewport.service';
import { SeoService } from '../../core/seo/seo.service';
import { ToothStageComponent } from '../tooth-stage/tooth-stage.component';
import type { ToothScene, ToothState } from '../tooth-stage/tooth-scene';
import { AssistantSection } from './sections/assistant.section';
import { ClinicSection } from './sections/clinic.section';
import { ContactSection } from './sections/contact.section';
import { DoctorsSection } from './sections/doctors.section';
import { HeroSection } from './sections/hero.section';
import { ProcessSection } from './sections/process.section';
import { ServicesSection } from './sections/services.section';

type Layer = 'enamel' | 'dentin' | 'pulp';

/**
 * STORYBOARD — hastanın sorularına göre:
 *  01 Hero ─ THE SMILE            "Burası kaliteli mi?"              ┐ yapışkan 3D diş sahnesi:
 *  02 Hizmetler ─ TREATMENTS      "Benim sorunum burada çözülür mü?" ┘ diş sağdan sola geçer, hizmetler sağda kayar
 *  03 Tedavi Yolculuğu ─ JOURNEY  "Ne yaşayacağım?"
 *  04 Klinik ─ THE CLINIC         "Temiz ve düzenli mi?"
 *  05 Hekim ─ THE DOCTOR          "Kime gideceğim?"
 *  06 AI Asistan ─ APPOINTMENT    "Hemen randevu alabilir miyim?"
 *  07 İletişim ─ NEXT SMILE
 */
@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ToothStageComponent,
    HeroSection,
    ServicesSection,
    ProcessSection,
    ClinicSection,
    DoctorsSection,
    AssistantSection,
    ContactSection,
  ],
  template: `
    <div class="stage" #stage [class.is-directed]="directed()">
      <div class="stage__sticky">
        <app-tooth-stage />
      </div>
      <app-hero-section />
      <app-services-section />
    </div>

    <!--
      Artımlı hydration: ekran altı bölümler sunucuda tam HTML olarak gelir (SEO + anında görünür),
      JS'leri ise tarayıcı boşta kaldığında parça parça hydrate edilir → ilk yüklemede uzun görev yok.
    -->
    @defer (on immediate; hydrate on idle) {
      <app-process-section />
    }
    @defer (on immediate; hydrate on idle) {
      <app-clinic-section />
    }
    @defer (on immediate; hydrate on idle) {
      <app-doctors-section />
    }
    @defer (on immediate; hydrate on idle) {
      <app-assistant-section />
    }
    @defer (on immediate; hydrate on idle) {
      <app-contact-section />
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .stage {
      position: relative;
      background-color: var(--color-bg);
    }
    .stage__sticky {
      position: sticky;
      top: 0;
      z-index: var(--z-stage);
      height: 100svh;
      margin-bottom: -100svh;
      overflow: hidden;
    }
  `,
})
export class HomePage {
  private readonly motion = inject(MotionService);
  private readonly viewport = inject(ViewportService);
  private readonly stageEl = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly tooth = viewChild.required(ToothStageComponent);

  protected readonly directed = signal(false);

  constructor() {
    inject(SeoService).set({ path: '/' });

    const destroyRef = inject(DestroyRef);
    afterNextRender(async () => {
      // Mobil: hero'daki 3D alanını ölç → poster ve 3D diş bu alana hizalanır (metinle çakışmaz)
      this.measureHeroVisual();
      const onResize = () => this.measureHeroVisual();
      window.addEventListener('resize', onResize, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));

      const { gsap, ScrollTrigger } = await this.motion.load();
      const stage = this.stageEl().nativeElement;
      const hero = stage.querySelector<HTMLElement>('app-hero-section')!;
      const services = stage.querySelector<HTMLElement>('app-services-section')!;
      const css = getComputedStyle(document.documentElement);
      const dayBg = css.getPropertyValue('--color-bg').trim();
      const labBg = css.getPropertyValue('--lab-bg').trim();
      const reduced = !this.motion.enabled;

      const setLayer = (l: Layer) => this.tooth().layer.set(l);
      const layerAt = (p: number): Layer => (p < 0.33 ? 'enamel' : p < 0.6 ? 'dentin' : 'pulp');

      const ctx = gsap.context(() => {
        // Katman durumu hizmetler bölümündeki ilerlemeye bağlı (poster modu ve hareket azaltılmış mod için)
        ScrollTrigger.create({
          trigger: services,
          start: 'top 60%',
          end: 'bottom bottom',
          onUpdate: (self) => setLayer(layerAt(self.progress)),
          onLeaveBack: () => setLayer('enamel'),
        });

        this.directed.set(true);
        // Poster modu için kompozisyon: hero'da sağda, hizmetlerde solda
        ScrollTrigger.create({ trigger: services, start: 'top 55%', end: 'bottom top', toggleClass: { targets: stage, className: 'in-lab' } });

        if (reduced) {
          ScrollTrigger.create({
            trigger: services,
            start: 'top 50%',
            end: 'bottom top',
            onToggle: (self) => gsap.set(stage, { backgroundColor: self.isActive || self.progress === 1 ? labBg : dayBg }),
          });
          return;
        }

        // L4 — Gündüzden laboratuvara zemin geçişi
        gsap.fromTo(
          stage,
          { backgroundColor: dayBg },
          {
            backgroundColor: labBg,
            ease: 'none',
            scrollTrigger: { trigger: services, start: 'top 85%', end: 'top 20%', scrub: true },
          },
        );
      }, stage);

      ScrollTrigger.refresh();
      destroyRef.onDestroy(() => ctx.revert());

      // 3D sahne hazır olduğunda (ilk etkileşimden sonra) koreografiye eklenir; o ana kadar poster aynı durumları gösterir.
      const scene = await this.tooth().whenReady();
      if (!scene) return;
      ctx.add(() =>
        reduced ? this.bindStaticScene(scene, services, ScrollTrigger) : this.bindSceneTimeline(scene, stage, hero, services, gsap),
      );
      ScrollTrigger.refresh();
    });
  }

  /**
   * L5 — Tek, deterministik master timeline: tüm sahne boyunca scrub.
   * Hero'da sağdaki diş sola geçer ve döner; hizmetler sağda kayarken tarama → dentin → pulpa geçişleri oynar.
   * Mutlak değerler + piksel konumları → sayfanın herhangi bir noktasından girildiğinde diş doğru durumda olur.
   */
  /** Mobil hero'daki 3D alanının sayfa başına göre konumu (px) */
  private heroVisual: { top: number; height: number } | null = null;

  private measureHeroVisual(): void {
    const stage = this.stageEl().nativeElement;
    if (!this.viewport.isMobile()) {
      this.heroVisual = null;
      stage.style.removeProperty('--hero-visual-top');
      stage.style.removeProperty('--hero-visual-h');
      return;
    }
    const el = stage.querySelector<HTMLElement>('.hero__visual');
    if (!el) return;
    const r = el.getBoundingClientRect();
    const top = r.top - stage.getBoundingClientRect().top;
    this.heroVisual = { top, height: r.height };
    stage.style.setProperty('--hero-visual-top', `${Math.round(top)}px`);
    stage.style.setProperty('--hero-visual-h', `${Math.round(r.height)}px`);
  }

  private bindSceneTimeline(
    scene: ToothScene,
    stage: HTMLElement,
    hero: HTMLElement,
    services: HTMLElement,
    gsap: typeof import('gsap').gsap,
  ): void {
    const s = scene.state;
    const mobile = this.viewport.isMobile();
    const vh = window.innerHeight;
    const stageTop = stage.getBoundingClientRect().top + window.scrollY;
    const servicesTop = services.getBoundingClientRect().top + window.scrollY - stageTop;
    const servicesH = services.offsetHeight;
    const total = stage.offsetHeight;
    const rot0 = -0.5;
    const PI = Math.PI;

    // Mobil başlangıç: hero'daki ayrılmış alanın ortası ve yüksekliği (dişin 1x ölçekte ~%51 vh boyunda olduğu varsayımıyla)
    const visual = mobile ? this.heroVisual : null;
    const mobileStart = visual
      ? {
          x: 0,
          y: 1 - (2 * (visual.top + visual.height / 2)) / vh,
          scale: Math.min(1, Math.max(0.36, ((visual.height / vh) * 0.9) / 0.51)),
        }
      : { x: 0, y: -0.2, scale: 0.78 };
    Object.assign(s, mobile ? { ...mobileStart, rotY: rot0 } : { x: 0.36, y: -0.02, scale: 1.08, rotY: rot0 });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom top', scrub: 1 },
    });

    // Hero → Hizmetler: diş sola kayar, döner, dijital taramaya geçer
    const heroEnd = hero.offsetHeight;
    tl.to(s, { ...(mobile ? { y: 0.5, scale: 0.58 } : { x: -0.42, scale: 1.18 }), rotY: rot0 + PI * 0.85, rotX: 0.28, duration: heroEnd }, 0);
    tl.to(s, { points: 0.9, rings: 0.35, duration: heroEnd * 0.65 }, heroEnd * 0.35);

    // Hizmetler kayarken: tarama → dentin → pulpa (önceki anatomi koreografisiyle aynı)
    const at = (f: number) => servicesTop + servicesH * f - vh * 0.5;
    const span = (from: number, to: number) => ({ start: Math.max(heroEnd, at(from)), duration: Math.max(1, at(to) - Math.max(heroEnd, at(from))) });

    const p1 = span(0.02, 0.3);
    tl.to(s, { scan: 1, points: 0.25, rotY: rot0 + PI * 1.2, duration: p1.duration }, p1.start);
    const p2 = span(0.3, 0.55);
    tl.to(s, { enamel: 0, dentin: 1, points: 0, rings: 0.2, rotX: 0.05, rotY: rot0 + PI * 1.6, duration: p2.duration }, p2.start);
    const p3 = span(0.55, 0.8);
    tl.to(s, { pulp: 1, scale: mobile ? 0.64 : 1.3, rotX: 0.18, rotY: rot0 + PI * 1.9, duration: p3.duration }, p3.start);

    // Çıkış: sahne sönümlenir, sonraki bölüm üstüne kayar
    tl.to(s, { opacity: 0, y: mobile ? 0.8 : 0.35, scale: mobile ? 0.55 : 1.12, duration: vh * 0.45 }, total - vh * 1.05);
    tl.set({}, {}, total);
  }

  /** prefers-reduced-motion: animasyon yok, katman değiştikçe tek kare çizilir. */
  private bindStaticScene(
    scene: ToothScene,
    services: HTMLElement,
    ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
  ): void {
    const statics: Record<Layer, Partial<ToothState>> = {
      enamel: { enamel: 1, dentin: 0, pulp: 0 },
      dentin: { enamel: 0, dentin: 1, pulp: 0 },
      pulp: { enamel: 0, dentin: 1, pulp: 1 },
    };
    ScrollTrigger.create({
      trigger: services,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: () => {
        Object.assign(scene.state, statics[this.tooth().layer()]);
        scene.renderOnce();
      },
    });
  }
}
