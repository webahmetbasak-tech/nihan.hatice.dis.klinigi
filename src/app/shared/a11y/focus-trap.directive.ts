import { DOCUMENT, DestroyRef, Directive, ElementRef, afterNextRender, inject, output } from '@angular/core';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dialog/drawer için klavye odak hapsi.
 * Açılışta ilk odaklanabilir öğeye (veya [data-autofocus]) gider, Tab döngüsünü içeride tutar,
 * Escape ile `escape` olayı yayınlar, kapanışta odağı tetikleyen öğeye geri verir.
 */
@Directive({ selector: '[appFocusTrap]' })
export class FocusTrapDirective {
  readonly escape = output<void>();

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const doc = inject(DOCUMENT);
    const previous = doc.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        this.escape.emit();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(host.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    afterNextRender(() => {
      host.addEventListener('keydown', onKey);
      const target = host.querySelector<HTMLElement>('[data-autofocus]') ?? host.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus({ preventScroll: true });
    });

    inject(DestroyRef).onDestroy(() => {
      host.removeEventListener('keydown', onKey);
      previous?.focus?.({ preventScroll: true });
    });
  }
}
