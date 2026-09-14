import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ClinicConfigService } from '../../core/config/clinic-config.service';
import { SeoService } from '../../core/seo/seo.service';

/**
 * KVKK Aydınlatma Metni — ŞABLON.
 * 6698 sayılı Kanun md. 10 kapsamındaki başlıkları içerir; yayın öncesi klinik ve hukuk danışmanı tarafından
 * gözden geçirilmeli, veri sorumlusu bilgileri ve VERBİS durumu teyit edilmelidir.
 */
@Component({
  selector: 'app-kvkk-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="legal wrap">
      <header>
        <p class="eyebrow">Kişisel Verilerin Korunması</p>
        <h1 class="t-display-m">KVKK <em>Aydınlatma Metni</em></h1>
        <p class="t-small t-muted">Son güncelleme: {{ c.legal.lastUpdated }}</p>
      </header>

      <div class="prose legal__body t-body-l">
        <p class="legal__note">
          Bu metin demo amaçlı bir şablondur. Yayına alınmadan önce veri sorumlusu tarafından hukuki olarak gözden geçirilmelidir.
        </p>

        <h2 class="t-h2">1. Veri sorumlusu</h2>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla
          <strong>{{ c.legal.dataController }}</strong> ({{ cfg.addressLine() }}) tarafından aşağıda açıklanan kapsamda işlenmektedir.
        </p>

        <h2 class="t-h2">2. İşlenen kişisel veriler</h2>
        <p>
          Web sitesindeki randevu asistanı aracılığıyla yalnızca <strong>ad-soyad</strong>, <strong>telefon numarası</strong>, talep edilen
          <strong>hizmet / randevu tipi</strong>, <strong>tarih-saat tercihi</strong> ve onay zaman damgası işlenir.
          Asistan sağlık durumunuza ilişkin bilgi talep etmez; lütfen sohbet alanına sağlık verisi (şikâyet ayrıntısı, tahlil, teşhis vb.) yazmayınız.
        </p>

        <h2 class="t-h2">3. İşleme amaçları</h2>
        <p>
          Randevu talebinizin oluşturulması, randevunun teyidi için sizinle iletişime geçilmesi ve açık izniniz olması halinde randevu
          hatırlatmalarının yapılması.
        </p>

        <h2 class="t-h2">4. Hukuki sebep ve toplama yöntemi</h2>
        <p>
          Verileriniz, web sitesi üzerinden elektronik ortamda; KVKK md. 5/2-c (bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması)
          ve hatırlatma iletişimi bakımından md. 5/1 (açık rıza) hukuki sebeplerine dayanılarak toplanır.
        </p>

        <h2 class="t-h2">5. Aktarım</h2>
        <p>
          Verileriniz, yalnızca randevu sisteminin barındırılması için hizmet alınan ve gerekli teknik-idari tedbirleri alan tedarikçilere,
          KVKK md. 8 ve 9’a uygun olarak aktarılabilir. [AKTARIM_YAPILAN_TARAFLAR] Bu sitede reklam veya analitik amaçlı üçüncü taraf çerez kullanılmamakta,
          yazı tipleri de kendi sunucumuzdan yüklenmektedir.
        </p>

        <h2 class="t-h2">6. Saklama süresi</h2>
        <p>Randevu talebi verileri, talebin sonuçlanmasından itibaren [SAKLAMA_SÜRESİ] süreyle saklanır ve süre sonunda silinir, yok edilir veya anonim hale getirilir.</p>

        <h2 class="t-h2">7. Haklarınız</h2>
        <p>
          KVKK md. 11 kapsamında; verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini isteme,
          itiraz etme ve zararın giderilmesini talep etme haklarına sahipsiniz. Başvurularınızı
          <strong>{{ c.legal.kvkkEmail }}</strong> adresine iletebilirsiniz.
        </p>

        <h2 class="t-h2">8. Yapay zekâ destekli asistan hakkında</h2>
        <p>
          Randevu asistanı otomatik bir yazılımdır; tıbbi tanı koymaz, tedavi önerisi vermez ve bir hekimin yerini tutmaz.
          Asistan yalnızca randevu planlamasına yardımcı olur; nihai randevu klinik ekibi tarafından teyit edilir.
        </p>
      </div>
    </article>
  `,
  styles: `
    .legal {
      display: grid;
      gap: var(--space-xl);
      max-width: 60rem;
      padding-top: calc(var(--header-h) + 3rem);
      padding-bottom: var(--space-section);
    }
    header {
      display: grid;
      gap: 1rem;
    }
    h1 em {
      font-style: italic;
      color: var(--color-accent-strong);
    }
    .legal__body {
      max-width: 70ch;
      color: var(--color-text);
    }
    .legal__body h2 {
      margin: 2.5rem 0 0.75rem;
    }
    .legal__body p + p {
      margin-top: 0;
    }
    .legal__note {
      padding: 1rem 1.25rem;
      border-radius: var(--radius-s);
      border: 1px dashed var(--color-border);
      font-size: var(--text-small);
      color: var(--color-muted);
    }
  `,
})
export class KvkkPage {
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly c = this.cfg.config();

  constructor() {
    inject(SeoService).set({
      title: 'KVKK Aydınlatma Metni',
      description: `${this.c.clinic.name} kişisel verilerin korunması aydınlatma metni.`,
      path: '/kvkk',
    });
  }
}
