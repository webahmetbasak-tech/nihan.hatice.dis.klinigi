import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconName } from '../../config/clinic.types';

/**
 * Tek çizgi kalınlığında (1.4), 24px gridde çizilmiş özel ikon seti.
 * Diş ikonları simetrik; hepsi aynı görsel dili taşır.
 */
const TOOTH =
  'M8 3C5.6 3 4 4.8 4 7.4c0 2.1.9 3.5 1.5 5.1.7 1.9.8 4.4 1.4 6.8.4 1.6 1.8 1.8 2.2.2l.8-3.2c.4-1.4 1.2-1.9 2.1-1.9s1.7.5 2.1 1.9l.8 3.2c.4 1.6 1.8 1.4 2.2-.2.6-2.4.7-4.9 1.4-6.8.6-1.6 1.5-3 1.5-5.1C20 4.8 18.4 3 16 3c-1.6 0-2.6 1-4 1s-2.4-1-4-1Z';

const PATHS: Record<IconName, string> = {
  tooth: `<path d="${TOOTH}"/>`,
  implant:
    '<path d="M7.5 3.8C7.5 2.8 8.4 2 9.5 2h5c1.1 0 2 .8 2 1.8v1.4c0 1.5-1.2 2.8-2.8 2.8h-3.4C8.7 8 7.5 6.7 7.5 5.2Z"/><path d="M10.5 8v2M13.5 8v2"/><path d="M8.5 10.5h7M9 13h6M9.5 15.5h5M10 18h4M11 20.5 12 22l1-1.5"/>',
  smile:
    '<path d="M3.5 9.5c2.8-1.4 5.6-1.2 8.5 0 2.9-1.2 5.7-1.4 8.5 0"/><path d="M3.5 9.5c1.8 5.3 5 7.5 8.5 7.5s6.7-2.2 8.5-7.5"/><path d="M7 11.2l.4 2.4M10.2 11.9l.2 2.8M13.8 11.9l-.2 2.8M17 11.2l-.4 2.4"/><path d="M19 2.5v2.5M17.75 3.75h2.5"/>',
  canal: `<path d="${TOOTH}"/><path d="M10 8.6c0-1.4 4-1.4 4 0v1.2"/><path d="M10 8.6c0 2.6-.4 4.6-1 6.4M14 9.8c0 2.2.4 3.8 1 5.2"/>`,
  whitening: `<path d="${TOOTH}" transform="translate(-1.5 1.5) scale(.92)"/><path d="M19.5 1.5l.55 1.45L21.5 3.5l-1.45.55L19.5 5.5l-.55-1.45L17.5 3.5l1.45-.55Z"/>`,
  aligner:
    '<path d="M4.5 6c0 7.5 3.4 13 7.5 13s7.5-5.5 7.5-13"/><path d="M2.5 5.5C2.5 14.2 6.8 21 12 21s9.5-6.8 9.5-15.5"/><path d="M6.5 11.5l-1.9.9M8.4 15l-1.6 1.4M12 16.8V19M15.6 15l1.6 1.4M17.5 11.5l1.9.9"/>',
  veneer:
    '<path d="M8.5 3h7a1.5 1.5 0 0 1 1.5 1.5v8c0 4.6-2.2 8.5-5 8.5s-5-3.9-5-8.5v-8A1.5 1.5 0 0 1 8.5 3Z"/><path d="M4.5 5.5v7c0 5.5 2.8 10 6.2 10.3" opacity=".55"/>',
  child: `<path d="${TOOTH}"/><path d="M9.6 8.4h.01M14.4 8.4h.01"/><path d="M10 10.8c1.1.9 2.9.9 4 0"/>`,
  shield: '<path d="M12 2.5 4.5 5.5v5.8c0 4.6 3.2 8.6 7.5 10.2 4.3-1.6 7.5-5.6 7.5-10.2V5.5Z"/><path d="m8.8 12 2.2 2.2 4.3-4.4"/>',
  scan: '<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M3 12h18"/>',
  sparkle:
    '<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z"/><path d="M19 16.5c.25 1.4.9 2.05 2.5 2.5-1.6.45-2.25 1.1-2.5 2.5-.25-1.4-.9-2.05-2.5-2.5 1.6-.45 2.25-1.1 2.5-2.5Z"/>',
  chair:
    '<path d="M6 3.5c1.7 0 3 1.3 3 3v5.5h8.5a2.5 2.5 0 0 1 0 5H8a3 3 0 0 1-3-3V4.5a1 1 0 0 1 1-1Z"/><path d="M9 17v3.5M16 17v3.5M6.5 20.5h12"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  phone:
    '<path d="M5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 7.7 7.7l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 5.5a2 2 0 0 1 2-2Z"/>',
  whatsapp:
    '<path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.6Z"/><path d="M9 8.2c.2-.5.6-.6 1-.5l.9 1.9-.6.8c.5 1.2 1.5 2.2 2.8 2.8l.8-.6 1.9.9c.1.4 0 .8-.5 1.1-2.9 1.6-7.6-3.3-6.3-6.4Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  pin: '<path d="M12 21.5s-7-6.1-7-12a7 7 0 0 1 14 0c0 5.9-7 12-7 12Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  'arrow-right': '<path d="M4 12h16M14 6l6 6-6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  'arrow-left': '<path d="M20 12H4M10 6l-6 6 6 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 9h16M4 15h16"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  send: '<path d="M4 12 20 4l-6 16-2.5-6.5Z"/><path d="M11.5 13.5 20 4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.4-3.6 4-5.5 7.5-5.5s6.1 1.9 7.5 5.5"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/>',
  facebook: '<path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4a20 20 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2.3H9v3h2.5V21"/>',
  youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10.5 9.5 4 2.5-4 2.5Z"/>',
  x: '<path d="M4.5 4h4l11 16h-4ZM19.5 4l-6.2 7M10.7 13 4.5 20"/>',
  'chevron-left': '<path d="m15 5-7 7 7 7"/>',
  'chevron-right': '<path d="m9 5 7 7-7 7"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5" opacity=".6"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
};

interface Shape {
  tag: 'path' | 'circle' | 'rect';
  a: Record<string, string>;
}

/** Markup tablosu modül yüklenirken bir kez ayrıştırılır → SSR güvenli (innerHTML yok, sanitizer bypass yok). */
const SHAPES = Object.fromEntries(
  Object.entries(PATHS).map(([name, markup]) => [
    name,
    [...markup.matchAll(/<(path|circle|rect)\s+([^>]*?)\/>/g)].map(
      (m): Shape => ({
        tag: m[1] as Shape['tag'],
        a: Object.fromEntries([...m[2].matchAll(/([\w-]+)="([^"]*)"/g)].map((x) => [x[1], x[2]])),
      }),
    ),
  ]),
) as Record<IconName, Shape[]>;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon', 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" [attr.stroke-width]="stroke()" stroke-linecap="round" stroke-linejoin="round">
      @for (el of shapes(); track $index) {
        @switch (el.tag) {
          @case ('path') {
            <svg:path [attr.d]="el.a['d']" [attr.opacity]="el.a['opacity']" [attr.transform]="el.a['transform']" />
          }
          @case ('circle') {
            <svg:circle [attr.cx]="el.a['cx']" [attr.cy]="el.a['cy']" [attr.r]="el.a['r']" />
          }
          @case ('rect') {
            <svg:rect [attr.x]="el.a['x']" [attr.y]="el.a['y']" [attr.width]="el.a['width']" [attr.height]="el.a['height']" [attr.rx]="el.a['rx']" />
          }
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-grid;
      place-items: center;
      width: 1em;
      height: 1em;
      flex: none;
    }
    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly stroke = input(1.4);
  protected readonly shapes = computed(() => SHAPES[this.name()] ?? []);
}
