import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ClinicConfigService } from '../../../core/config/clinic-config.service';
import { UiStateService } from '../../../core/ui/ui-state.service';
import { IconComponent } from '../../../shared/ui/icon.component';

/** Marka ikon setindeki diş silüeti (24px grid) — illüstrasyonda 10x büyütülür. */
const TOOTH =
  'M8 3C5.6 3 4 4.8 4 7.4c0 2.1.9 3.5 1.5 5.1.7 1.9.8 4.4 1.4 6.8.4 1.6 1.8 1.8 2.2.2l.8-3.2c.4-1.4 1.2-1.9 2.1-1.9s1.7.5 2.1 1.9l.8 3.2c.4 1.6 1.8 1.4 2.2-.2.6-2.4.7-4.9 1.4-6.8.6-1.6 1.5-3 1.5-5.1C20 4.8 18.4 3 16 3c-1.6 0-2.6 1-4 1s-2.4-1-4-1Z';

/**
 * SCENE 03 — TEDAVİ YOLCULUĞU
 * Yapışkan bölünmüş düzen: sağda adımlar akar; solda yapışkan illüstrasyon kaydırmayla canlanır —
 * ilerleme halkası akıcı dolar, her adımda dişin etrafında o adımın çizimi belirir.
 * Senkron: her karede adımların ekran ortasına göre konumu okunur (yalnızca bölüm görünürken).
 */
@Component({
  selector: 'app-process-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: { 'data-tone': 'day', class: 'process', id: 'surec' },
  template: `
    <div class="wrap journey">
      <aside class="journey__aside">
        <div class="journey__sticky">
          <p class="eyebrow"><span class="eyebrow__index">02</span><span class="eyebrow__rule"></span>{{ p().eyebrow }}</p>

          <figure class="viz" [attr.data-step]="active()" aria-hidden="true">
            <svg class="viz__svg" viewBox="0 0 400 400" fill="none">
              <defs>
                <radialGradient id="viz-orb" cx="42%" cy="36%" r="70%">
                  <stop offset="0" stop-color="#fffdf8" />
                  <stop offset="0.7" stop-color="#f1ebe1" />
                  <stop offset="1" stop-color="#e4dace" />
                </radialGradient>
              </defs>

              <!-- zemin küresi -->
              <circle class="viz__orb" cx="200" cy="200" r="170" fill="url(#viz-orb)" />

              <!-- ilerleme halkası (kaydırmayla akıcı dolar) -->
              <circle class="viz__track" cx="200" cy="200" r="186" />
              <circle class="viz__ring" cx="200" cy="200" r="186" pathLength="1" />
              @for (d of dots; track $index; let i = $index) {
                <circle class="viz__dot" [class.is-on]="active() >= i" [attr.cx]="d[0]" [attr.cy]="d[1]" r="5" />
              }

              <!-- 01 · dinleme dalgaları -->
              <g class="viz__layer" [class.is-on]="active() === 0">
                <path pathLength="1" d="M104 172q-16 28 0 56" />
                <path pathLength="1" d="M86 156q-30 44 0 88" />
                <path pathLength="1" d="M296 172q16 28 0 56" />
                <path pathLength="1" d="M314 156q30 44 0 88" />
              </g>

              <!-- 02 · tarama çerçevesi + ölçü çizgileri -->
              <g class="viz__layer" [class.is-on]="active() === 1">
                <path pathLength="1" d="M112 124v-22h24M288 124v-22h-24M112 296v22h24M288 296v22h-24" />
                <path pathLength="1" class="viz__dash" d="M112 170h176M112 230h176M200 102v216" />
                <line class="viz__scan" x1="112" x2="288" y1="0" y2="0" />
              </g>

              <!-- 03 · konfor halesi -->
              <g class="viz__layer" [class.is-on]="active() === 2">
                <circle class="viz__halo" cx="200" cy="200" r="128" />
                <path pathLength="1" d="M292 112l4 11 11 4-11 4-4 11-4-11-11-4 11-4Z" />
                <path pathLength="1" d="M112 282l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
                <path pathLength="1" d="M306 262l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" />
              </g>

              <!-- 04 · koruma kalkanı -->
              <g class="viz__layer" [class.is-on]="active() === 3">
                <path pathLength="1" d="M200 74l104 36v92c0 64-44 110-104 132-60-22-104-68-104-132v-92Z" />
                <circle class="viz__badge" cx="296" cy="298" r="22" />
                <path pathLength="1" d="M285 298l8 8 15-16" />
              </g>

              <!-- diş (her adımda hafif döner) -->
              <g class="viz__tooth">
                <path [attr.d]="tooth" transform="translate(80 78) scale(10)" vector-effect="non-scaling-stroke" />
              </g>
            </svg>

            <figcaption class="viz__caption">
              @for (step of p().steps; track step.title; let i = $index) {
                <span class="viz__label" [class.is-on]="active() === i">{{ step.title }}</span>
              }
            </figcaption>
          </figure>
        </div>
      </aside>

      <ol class="journey__steps" role="list">
        @for (step of p().steps; track step.title; let i = $index) {
          <li #stepEl class="step" [class.is-active]="active() === i">
            <span class="step__num" aria-hidden="true">{{ num(i) }}</span>
            <div class="step__content">
              <p class="step__meta">
                <span class="step__dot" aria-hidden="true"></span>
                {{ step.meta }}
              </p>
              <h3 class="step__title">{{ step.title }}</h3>
              <p class="step__text">{{ step.description }}</p>
            </div>
          </li>
        }

        <li class="journey__cta">
          <p class="journey__cta-title">İlk adımı <em>birlikte</em> atalım.</p>
          <p class="t-body-l t-muted">Muayene randevunuzu birkaç dakikada planlayın; gerisini adım adım konuşalım.</p>
          <button type="button" class="btn btn--lg" (click)="ui.openAssistant()">
            <span class="btn__dot" aria-hidden="true"></span>
            İlk muayeneyi planla
            <span class="btn__icon"><app-icon name="arrow-right" /></span>
          </button>
        </li>
      </ol>
    </div>
  `,
  styleUrl: './process.section.scss',
})
export class ProcessSection {
  private readonly cfg = inject(ClinicConfigService);
  protected readonly ui = inject(UiStateService);
  protected readonly p = computed(() => this.cfg.config().process);

  protected readonly active = signal(0);
  protected readonly tooth = TOOTH;
  /** Halka üzerindeki 4 adım noktası: üst, sağ, alt, sol */
  protected readonly dots: [number, number][] = [
    [200, 14],
    [386, 200],
    [200, 386],
    [14, 200],
  ];

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly stepEls = viewChildren<ElementRef<HTMLElement>>('stepEl');

  protected num(i: number): string {
    return String(i + 1).padStart(2, '0');
  }

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let raf = 0;
      const update = () => {
        raf = 0;
        const steps = this.stepEls().map((e) => e.nativeElement);
        if (!steps.length) return;
        const mid = window.innerHeight / 2;

        // Aktif adım: üst kenarı ekran ortasını geçmiş son adım
        let idx = 0;
        steps.forEach((el, i) => {
          if (el.getBoundingClientRect().top <= mid) idx = i;
        });
        if (idx !== this.active()) this.active.set(idx);

        // Akıcı ilerleme (0–1): ilk adımın üstünden son adımın ortasına kadar
        const first = steps[0].getBoundingClientRect();
        const last = steps[steps.length - 1].getBoundingClientRect();
        const start = first.top;
        const end = last.top + last.height / 2;
        const prog = Math.min(1, Math.max(0, (mid - start) / Math.max(1, end - start)));
        this.host.style.setProperty('--journey-p', prog.toFixed(4));
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(update);
      };

      // Dinleyici yalnızca bölüm görünürken aktif
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true });
          window.addEventListener('resize', onScroll, { passive: true });
          update();
        } else {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onScroll);
        }
      });
      io.observe(this.host);

      destroyRef.onDestroy(() => {
        io.disconnect();
        cancelAnimationFrame(raf);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      });
    });
  }
}
