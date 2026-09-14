import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClinicConfigService } from '../core/config/clinic-config.service';
import { UiStateService } from '../core/ui/ui-state.service';
import { IconComponent } from '../shared/ui/icon.component';
import { FooterWordmarkComponent } from './footer-wordmark.component';
import { NavService } from './nav.service';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, FooterWordmarkComponent],
  host: { 'data-tone': 'lab', class: 'scene--lab' },
  template: `
    <footer class="foot">
      <div class="wrap">
        <div class="foot__top">
          <p class="foot__lead t-h1">
            Gülüşünüz için<br /><em>ilk adımı</em> birlikte planlayalım.
          </p>
          <button type="button" class="btn btn--lg" (click)="ui.openAssistant()">
            <span class="btn__dot" aria-hidden="true"></span> Randevu Al
            <span class="btn__icon"><app-icon name="arrow-right" /></span>
          </button>
        </div>

        <div class="foot__grid">
          <nav aria-label="Hizmetler">
            <h2 class="t-caption foot__h">Hizmetler</h2>
            <ul role="list">
              @for (s of cfg.services(); track s.id) {
                <li><a [routerLink]="['/hizmetler', s.id]">{{ s.shortTitle }}</a></li>
              }
            </ul>
          </nav>
          <div>
            <h2 class="t-caption foot__h">Ziyaret</h2>
            <address>
              {{ cfg.addressLine() }}
              @if (cfg.mapsHref(); as maps) {
                <br /><a [href]="maps" target="_blank" rel="noopener">Yol tarifi al ↗</a>
              }
            </address>
            <dl class="foot__hours">
              @for (h of cfg.hoursSummary(); track $index) {
                <div>
                  <dt>{{ h.days }}</dt>
                  <dd>{{ h.time }}</dd>
                </div>
              }
            </dl>
          </div>
          <div>
            <h2 class="t-caption foot__h">İletişim</h2>
            <ul role="list">
              <li>
                @if (cfg.phoneHref(); as tel) {
                  <a [href]="tel">{{ cfg.contact().phoneDisplay }}</a>
                } @else {
                  <span>{{ cfg.contact().phoneDisplay }}</span>
                }
              </li>
              @if (cfg.whatsappHref('Merhaba, bilgi almak istiyorum.'); as wa) {
                <li><a [href]="wa" target="_blank" rel="noopener">WhatsApp ↗</a></li>
              }
              <li>
                @if (cfg.emailHref(); as mail) {
                  <a [href]="mail">{{ cfg.contact().email }}</a>
                } @else {
                  <span>{{ cfg.contact().email }}</span>
                }
              </li>
            </ul>
            @if (cfg.socialLinks().length) {
              <ul role="list" class="foot__social">
                @for (s of cfg.socialLinks(); track s.icon) {
                  <li>
                    <a [href]="s.url" target="_blank" rel="noopener" [attr.aria-label]="s.label">
                      <app-icon [name]="s.icon" />
                    </a>
                  </li>
                }
              </ul>
            }
          </div>
          <nav aria-label="Sayfa">
            <h2 class="t-caption foot__h">Sayfa</h2>
            <ul role="list">
              @for (item of nav.items; track item.id) {
                <li>
                  <a [href]="'/#' + item.id" (click)="$event.preventDefault(); nav.goTo(item.id)">{{ item.label }}</a>
                </li>
              }
              <li><a routerLink="/kvkk">KVKK Aydınlatma Metni</a></li>
            </ul>
          </nav>
        </div>

        <app-footer-wordmark class="foot__wordmark" [text]="cfg.clinic().shortName" />

        <div class="foot__legal t-small">
          <p>{{ cfg.config().legal.disclaimer }}</p>
          <p>
            © {{ year }} {{ cfg.clinic().name }}
            @if (cfg.config().appointment.showDemoNotice) {
              <span class="foot__demo t-mono">Demo sürüm</span>
            }
          </p>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly ui = inject(UiStateService);
  protected readonly nav = inject(NavService);
  protected readonly year = new Date().getFullYear();
}
