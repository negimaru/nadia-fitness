# Nadia Fitness Dance Studio — web

Sitio estático multipágina (HTML + CSS + JS sin dependencias ni build), listo para GitHub Pages.

```
/                 Inicio (resumen: clases, horario, pasos, tienda, contacto)
/clases/          Una ficha por clase, con ancla (#aquafitness, #powerhiit…)
/horario/         Horario curso 26/27
/tienda/          Camisetas + sorteo
/contacto/        Teléfono, horario de llamadas, formulario → WhatsApp, mapa
404.html, robots.txt, sitemap.xml, .nojekyll
assets/css/styles.css   Tokens + componentes del sistema de diseño
assets/js/main.js       Menú móvil, formulario WhatsApp, año del pie
```

Todas las rutas son relativas, así que funciona igual en `usuario.github.io/repo/` que con dominio propio.

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta a la raíz del repo (rama `main`).
2. Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
3. Busca y reemplaza `https://negimaru.github.io/nadia-fitness/` por la URL final en todos los `.html`, `robots.txt` y `sitemap.xml` (canonical, Open Graph, JSON-LD y sitemap).
4. Con dominio propio: añade un archivo `CNAME` con el dominio y configura el DNS.
5. Da de alta el sitemap en Google Search Console.

Para probar en local: `python3 -m http.server` en esta carpeta y abre `http://localhost:8000` (con `file://` las URLs limpias `clases/` no resuelven).

## Pendiente (busca `TODO` en el código)

- Dirección exacta (contacto + JSON-LD) y el mapa: sustituye el iframe por el de Google Maps → Compartir → Insertar mapa.
- URLs de Instagram y TikTok, Aviso legal y Privacidad.
- Fotos reales: los huecos `.nf-photo` llevan un comentario `TODO`; mete un `<img>` dentro y se encaja solo.
- Logo: `assets/img/logo.png` (PNG con fondo transparente). Si tenéis el original en SVG o en mayor resolución, sustituidlo.
- Confirmar que el 654 691 336 tiene WhatsApp (botón flotante y formulario usan `wa.me/34654691336`).
- Quitar el bloque del sorteo en `/tienda/` cuando termine.
- Cookies: el mapa de Google y Google Fonts cargan recursos de terceros; si no queréis banner, auto-alojad las fuentes y cambiad el mapa por una imagen con enlace.
