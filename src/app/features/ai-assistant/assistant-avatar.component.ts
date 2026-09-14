import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Asistan avatarı: jenerik robot yerine marka dili — porselen küre + şampanya orbit + mine ışığı. */
@Component({
  selector: 'app-assistant-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <span class="core"></span>
    <svg viewBox="0 0 48 48" class="orbit"><ellipse cx="24" cy="24" rx="22" ry="9" /></svg>
  `,
  styles: `
    :host {
      position: relative;
      display: grid;
      place-items: center;
      width: var(--avatar-size, 44px);
      height: var(--avatar-size, 44px);
      flex: none;
    }
    .core {
      width: 64%;
      height: 64%;
      border-radius: 50%;
      background:
        radial-gradient(circle at 35% 30%, #fffdf8 0%, #efe6d8 45%, #cdbb9d 100%);
      box-shadow:
        inset -3px -4px 8px rgb(120 96 60 / 25%),
        0 6px 16px -6px rgb(22 24 27 / 35%);
      animation: breathe 4s var(--ease-in-out) infinite;
    }
    .orbit {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      fill: none;
      stroke: var(--color-accent);
      stroke-width: 1;
      transform: rotate(-24deg);
      animation: orbit 9s linear infinite;
    }
    @keyframes breathe {
      50% {
        transform: scale(0.93);
      }
    }
    @keyframes orbit {
      to {
        transform: rotate(336deg);
      }
    }
  `,
})
export class AssistantAvatarComponent {}
