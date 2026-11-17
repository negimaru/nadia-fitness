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

  // Horario: botones para resaltar las horas de cada clase
  var CLASES = [
    ['dance-baby', 'Dance Baby', 'k-dance'],
    ['dance-intermedio', 'Dance Intermedio', 'k-dance'],
    ['dance-avanzado', 'Dance Avanzado', 'k-dance'],
    ['wedance-adultos', 'WeDance Adultos', 'k-dance'],
    ['fitdance', 'Fitdance', 'k-dance'],
    ['powerhiit', 'PowerHIIT', 'k-fit'],
    ['aquafitness', 'Aquafitness', 'k-fit']
  ];
  Array.prototype.forEach.call(document.querySelectorAll('.nf-filter'), function (bar) {
    var scroll = bar.nextElementSibling;
    var table = scroll && scroll.querySelector('.nf-schedule');
    if (!table) return;
    var cells = table.querySelectorAll('td[data-c]');
    var status = document.createElement('p');
    status.className = 'sr-only';
    status.setAttribute('aria-live', 'polite');
    var group = document.createElement('div');
    group.className = 'nf-chips';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Resaltar en el horario');

    function select(slug, label) {
      var n = 0;
      Array.prototype.forEach.call(cells, function (td) {
        var on = !!slug && td.getAttribute('data-c') === slug;
        td.classList.toggle('is-on', on);
        if (on) n++;
      });
      table.classList.toggle('is-filtering', !!slug);
      Array.prototype.forEach.call(group.children, function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-c') === (slug || '')));
      });
      status.textContent = slug ? label + ': ' + n + (n === 1 ? ' sesión' : ' sesiones') + ' a la semana' : 'Mostrando todas las clases';
    }

    function chip(slug, label, type) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'nf-chip' + (type ? ' ' + type : '');
      b.setAttribute('data-c', slug);
      b.textContent = label;
      b.addEventListener('click', function () {
        var active = b.getAttribute('aria-pressed') === 'true';
        select(active || !slug ? '' : slug, label);
      });
      group.appendChild(b);
    }

    chip('', 'Todas');
    CLASES.forEach(function (c) {
      if (table.querySelector('td[data-c="' + c[0] + '"]')) chip(c[0], c[1], c[2]);
    });
    bar.appendChild(group);
    bar.appendChild(status);
    bar.hidden = false;
    select('');
    status.textContent = '';
  });

  // Año del pie
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
