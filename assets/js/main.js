// Nadia Fitness Dance Studio — interacciones mínimas, sin dependencias.
(function () {
  var WHATSAPP = '34654691336';

  // Menú móvil
  var btn = document.querySelector('.nf-menu');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
      menu.classList.toggle('is-open', !open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Abrir menú');
        btn.focus();
      }
    });
  }

  // Formulario → abre WhatsApp con el mensaje ya escrito
  var form = document.getElementById('form-contacto');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = form.nombre.value.trim();
      var tel = form.telefono.value.trim();
      var clase = form.clase.value;
      var msg = form.mensaje.value.trim();
      var texto = '¡Hola! Soy ' + (nombre || '[nombre]') + '. Me interesa ' + clase + '.';
      if (msg) texto += ' ' + msg;
      if (tel) texto += ' Mi teléfono: ' + tel + '.';
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    });
  }

  // Año del pie
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
