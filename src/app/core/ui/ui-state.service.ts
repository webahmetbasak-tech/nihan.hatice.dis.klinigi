import { Injectable, inject, signal } from '@angular/core';
import { MotionService } from '../motion/motion.service';

export interface Toast {
  id: number;
  message: string;
}

/** Uygulama geneli UI durumu: asistan paneli, mobil menü, toast'lar. */
@Injectable({ providedIn: 'root' })
export class UiStateService {
  private readonly motion = inject(MotionService);
  private toastId = 0;

  readonly assistantOpen = signal(false);
  /** Asistan bir hizmetle açılırsa (örn. hizmet sayfasından) ön seçim */
  readonly assistantIntent = signal<{ serviceId?: string; nonce: number } | null>(null);
  readonly menuOpen = signal(false);
  readonly toasts = signal<Toast[]>([]);

  openAssistant(serviceId?: string): void {
    this.menuOpen.set(false);
    this.assistantIntent.set({ serviceId, nonce: Date.now() });
    this.assistantOpen.set(true);
    this.motion.lockScroll(true);
  }

  closeAssistant(): void {
    this.assistantOpen.set(false);
    this.motion.lockScroll(false);
  }

  toggleMenu(open = !this.menuOpen()): void {
    this.menuOpen.set(open);
    this.motion.lockScroll(open);
  }

  toast(message: string): void {
    const id = ++this.toastId;
    this.toasts.update((t) => [...t, { id, message }]);
    setTimeout(() => this.toasts.update((t) => t.filter((x) => x.id !== id)), 4200);
  }
}
