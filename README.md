# Primefield sajt

Statički, responsive sajt bez frameworka i instalacije paketa.

## Pokretanje u Visual Studio Code-u

1. Otvori folder `primefield-site` u VS Code-u.
2. Instaliraj ekstenziju **Live Server**.
3. Desni klik na `index.html` → **Open with Live Server**.

Možeš ga pokrenuti i komandom:

```bash
python -m http.server 8080
```

Zatim otvori `http://localhost:8080`.

## Pre objavljivanja

- U `assets/js/config.js` unesi pravi email i telefon.
- Zameni `TVOJ-DOMEN.RS` u `sitemap.xml` i `robots.txt`.
- U `.media-slot` polja ubaci svoje thumbnail slike i showreel.
- Poveži pravi domen u Vercel podešavanjima.

## Dodavanje showreela

U `index.html` zameni sadržaj `.reel-frame` elementa ovim kodom:

```html
<video class="reel-video" controls preload="metadata" poster="/assets/media/showreel-poster.webp">
  <source src="/assets/media/primefield-showreel.mp4" type="video/mp4">
</video>
```

Preporuka: 1080p H.264, web optimizovan MP4 i poster u WebP formatu.

## Objavljivanje na Vercel

Prevuci folder u Vercel ili poveži GitHub repozitorijum. Framework preset može ostati **Other**, a build komanda prazna.
