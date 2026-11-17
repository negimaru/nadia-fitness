# Nadia Fitness Dance Studio — web

Sitio estático multipágina (HTML + CSS + JS sin dependencias ni build), listo para GitHub Pages.

```
/                 Inicio (resumen: clases, horario, pasos, contacto)
/clases/          Una ficha por clase, con ancla (#aquafitness, #powerhiit…)
/horario/         Horario curso 26/27
/tienda/          Apagada de momento: redirige a la portada
/contacto/        Teléfono, horario de llamadas, formulario → WhatsApp, mapa
404.html, robots.txt, sitemap.xml, .nojekyll
assets/css/styles.css   Tokens + componentes del sistema de diseño
assets/css/fonts.css    Fuentes servidas desde la propia web (assets/fonts/)
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

- Aviso legal y Privacidad (`/aviso-legal/`, `/privacidad/`): rellenar titular, NIF y email (resaltados en la página) y quitar el `noindex` de ambas. Añadirlas al `sitemap.xml`.
- Texto de «Quién soy» en la portada: sustituir por las palabras de Nadia (hay un `TODO`). La cifra de reseñas (5,0 · 29) es fija: actualizarla de vez en cuando.
- Fotos reales de Dance Baby, Intermedio, Avanzado, PowerHIIT y Aquafitness: ahora son imágenes de muestra en `assets/img/clases/<clase>.webp`. Para poner la foto real, sustituye el archivo por uno con el mismo nombre (WebP, ~1200×750, horizontal; el encuadre se hace solo).
- Logo: `assets/img/logo.png` (PNG con fondo transparente). Si tenéis el original en SVG o en mayor resolución, sustituidlo.
- Confirmar que el 654 691 336 tiene WhatsApp (botón flotante y formulario usan `wa.me/34654691336`).

## Tienda (apagada)

La tienda está desactivada: no aparece en el menú, el pie, la portada ni el sitemap, y `/tienda/` redirige a la portada. Para recuperarla, la versión completa está en el commit `78494a6` (`git show 78494a6:tienda/index.html`, y la sección de la portada en `git show 78494a6:index.html`). Las fotos (`tirantes.jpg`, `ninas.jpg`) siguen en `assets/img/`.

## Privacidad y terceros

La web no carga nada de terceros: las fuentes están en `assets/fonts/` y el mapa de contacto es una imagen fija (`assets/img/mapa.webp`, © OpenStreetMap) que enlaza a Google Maps. Por eso no necesita banner de cookies. Si se añade algo externo (analítica, mapas embebidos, vídeos), revisar `/privacidad/`.
- `tools/make_placeholders.py`: regenera las imágenes de muestra de las clases.
