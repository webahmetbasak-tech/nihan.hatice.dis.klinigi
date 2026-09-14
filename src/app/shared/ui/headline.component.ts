import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input } from '@angular/core';
import { HeadlineLine } from '../../config/clinic.types';
import { MotionService } from '../../core/motion/motion.service';
import { observeReveal } from '../motion/motion.directives';

/**
 * Editoryal başlık: config'teki satırları ayrı maskelerde render eder.
 * `immediate` → sayfa açılışında CSS ile (JS beklemeden, LCP dostu) açılır.
 * Aksi halde görünür alana girince (IntersectionObserver) satırlar CSS ile sırayla yükselir.
 */
@Component({
  selector: 'app-headline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (level()) {
      @case (1) {
        <h1 [class]="classes()" [attr.aria-label]="plain()"><ng-container *ngTemplateOutlet="linesTpl" /></h1>
      }
      @case (2) {
        <h2 [class]="classes()" [attr.aria-label]="plain()"><ng-container *ngTemplateOutlet="linesTpl" /></h2>
      }
      @default {
        <p [class]="classes()" [attr.aria-label]="plain()"><ng-container *ngTemplateOutlet="linesTpl" /></p>
      }
    }
    <ng-template #linesTpl>
      @for (line of lines(); track $index) {
        <span class="headline__line" [class.headline__line--marked]="line.emphasis && markEmphasis()" aria-hidden="true">
          <span class="headline__inner" [style.animation-delay.ms]="immediate() ? 120 + $index * 110 : null" [style.--i]="$index">
            @if (line.emphasis) {
              @if (markEmphasis()) {
                <span class="mark">
                  <em>{{ line.text }}</em>
                  <!-- Fırçayla elle çizilmiş dalgalı vurgu + uçta parıltı -->
                  <svg class="mark__stroke" viewBox="0 0 300 28" preserveAspectRatio="none" fill="none">
                    <defs>
                      <linearGradient id="hl-mark-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop class="mark__c1" offset="0" />
                        <stop class="mark__c2" offset="0.55" />
                        <stop class="mark__c3" offset="1" />
                      </linearGradient>
                    </defs>
                    <path
                      class="mark__brush"
                      pathLength="1"
                      d="M4 17C38 8 62 22 98 14S160 6 196 13S258 21 296 10"
                    />
                    <path
                      class="mark__bristle"
                      pathLength="1"
                      d="M10 20C44 12 66 24 102 17S162 10 198 16S256 23 290 14"
                    />
                  </svg>
                  <svg class="mark__spark" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2c.7 5 3.3 7.6 8.3 8.3-5 .7-7.6 3.3-8.3 8.3-.7-5-3.3-7.6-8.3-8.3 5-.7 7.6-3.3 8.3-8.3Z" />
                  </svg>
                </span>
              } @else {
                <em>{{ line.text }}</em>
              }
            } @else {
              {{ line.text }}
            }
          </span>
        </span>
      }
    </ng-template>
  `,
  imports: [NgTemplateOutlet],
  styles: `
    :host {
      display: block;
    }
    .is-immediate .headline__inner {
      animation: line-up 1.25s var(--ease-out) both;
    }

    /* ── Vurgu çizgisi: satır maskesi alt boşluğu çizgiye yer açar */
    .headline__line--marked {
      padding-bottom: 0.32em;
      margin-bottom: -0.32em;
    }
    .mark {
      position: relative;
      display: inline-block;
    }
    .mark__stroke {
      position: absolute;
      left: -3%;
      bottom: -0.2em;
      width: 106%;
      height: 0.3em;
      overflow: visible;
      pointer-events: none;
    }
    .mark__c1 {
      stop-color: var(--color-accent);
    }
    .mark__c2 {
      stop-color: var(--lab-accent);
    }
    .mark__c3 {
      stop-color: var(--lab-glow);
    }
    .mark__brush,
    .mark__bristle {
      stroke: url(#hl-mark-grad);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
    }
    .mark__brush {
      stroke-width: 6.5;
      animation: mark-draw 1.15s cubic-bezier(0.65, 0, 0.35, 1) 1.25s forwards;
    }
    .mark__bristle {
      stroke-width: 1.8;
      opacity: 0.55;
      animation: mark-draw 1.3s cubic-bezier(0.65, 0, 0.35, 1) 1.4s forwards;
    }
    .mark__spark {
      position: absolute;
      right: -0.42em;
      top: -0.02em;
      width: 0.26em;
      height: 0.26em;
      overflow: visible;
      opacity: 0;
      transform: scale(0) rotate(-45deg);
      animation:
        mark-spark 900ms var(--ease-spring) 2.25s forwards,
        mark-twinkle 3.6s var(--ease-in-out) 3.4s infinite;

      path {
        fill: var(--lab-accent);
        stroke: var(--color-accent);
        stroke-width: 0.6;
      }
    }

    @keyframes mark-draw {
      to {
        stroke-dashoffset: 0;
      }
    }
    @keyframes mark-spark {
      to {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }
    @keyframes mark-twinkle {
      0%,
      100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
      50% {
        opacity: 0.55;
        transform: scale(0.72) rotate(45deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .mark__brush,
      .mark__bristle {
        stroke-dashoffset: 0;
        animation: none;
      }
      .mark__spark {
        opacity: 1;
        transform: none;
        animation: none;
      }
    }
  `,
})
export class HeadlineComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);

  readonly lines = input.required<HeadlineLine[]>();
  readonly level = input<1 | 2 | 0>(2);
  readonly size = input<'display-xl' | 'display-l' | 'display-m' | 'h1' | 'h2'>('display-m');
  readonly immediate = input(false);
  /** Vurgulu (italik) satırın altına fırça çizgisi + parıltı animasyonu ekler. */
  readonly markEmphasis = input(false);

  protected readonly plain = computed(() => this.lines().map((l) => l.text).join(' '));
  protected readonly classes = computed(
    () => `headline t-${this.size()}${this.immediate() ? ' is-immediate' : ''}`,
  );

  constructor() {
    let stop: (() => void) | undefined;
    inject(DestroyRef).onDestroy(() => stop?.());
    afterNextRender(() => {
      if (this.immediate() || !this.motion.enabled) return;
      const r = this.host.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) return;
      this.host.setAttribute('data-reveal', 'lines');
      stop = observeReveal(this.host);
    });
  }
}
