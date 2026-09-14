# Tosba · 14 Yıllık Yörünge

Tosba · 14 Yıllık Yörünge, 2012 model bir Volkswagen Golf'ün ilk sahibiyle geçirdiği 14 yılı kalıcı olarak saklayan kişisel bir araç arşividir. Tosba 8 Mart 2012'de yeni alındı ve 14 Eylül 2026'da yeni sahibine uğurlandı.

## Neden bu proje?

Bu proje önce Tosba'yı bütün geçmişiyle anlatan şeffaf bir araç sitesi olarak hazırlandı. Satışın ardından aynı yapı, fotoğraflar ve teknik kayıtlar korunarak on dört yıllık ilk sahiplik döneminin arşivine dönüştürüldü.

Amacı kusurları gizlemek ya da geçmişi parlatmak değil; hatırlananları, belgelenenleri ve hâlâ doğrulanmamış noktaları açıkça saklamak.

## Sitede neler var?

- Aracın temel bilgileri ve 14 yıllık sahiplik hikâyesi
- Her sayfa yüklemesinde açılan, kapatılabilir veda perdesi
- Kullanım, bakım ve donanım bilgileri
- Hasar ve onarım geçmişine ait açıklamalar ve fotoğraflar
- Bilinen, bilinmeyen ve doğrulanmayı bekleyen bilgilerin açık gösterimi
- Seyahat haritası, araç atlası ve fotoğraf galerisi
- Satış tarihiyle tamamlanan kalıcı veda kaydı

## İçeriği güncellemek

Araçla ilgili bilgiler [`src/content/arac-bilgileri.txt`](src/content/arac-bilgileri.txt) dosyasında tutulur. Sahiplik tarihleri, kilometre, son kayıtlı konum ve diğer arşiv detayları buradan güncellenebilir.

## Yerel olarak çalıştırmak

Projeyi bilgisayarınızda açmak için:

```bash
pnpm install
pnpm dev
```

Ardından tarayıcınızda `http://localhost:4321` adresini ziyaret edin.

## Projenin yaklaşımı

Bu proje üç temel ilkeye dayanır: kişisel bir hikâyeyi korumak, araç hakkında şeffaf olmak ve yalnızca doğrulanmış bilgileri kesinmiş gibi sunmak. Site statiktir, analitik kullanmaz ve ziyaretçi verisi toplamaz.
