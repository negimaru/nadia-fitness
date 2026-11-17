// Nadia Fitness Dance Studio — minimal interactions, no dependencies.
(function () {
  var WHATSAPP = '34654691336';

  // Light / dark theme: follows the OS until one is chosen with the toggle
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  var meta = document.querySelector('meta[name="theme-color"]');
  function stored() { try { return localStorage.getItem('nf-theme'); } catch (e) { return null; } }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (meta) meta.setAttribute('content', t === 'light' ? '#fff8fb' : '#161215');
    Array.prototype.forEach.call(document.querySelectorAll('.nf-theme'), function (b) {
      b.setAttribute('aria-label', t === 'light' ? 'Cambiar a modo noche' : 'Cambiar a modo día');
      b.setAttribute('title', t === 'light' ? 'Modo noche' : 'Modo día');
    });
  }
  applyTheme(stored() || (mq && mq.matches ? 'light' : 'dark'));
  if (mq && mq.addEventListener) mq.addEventListener('change', function (e) { if (!stored()) applyTheme(e.matches ? 'light' : 'dark'); });
  Array.prototype.forEach.call(document.querySelectorAll('.nf-theme'), function (b) {
    b.addEventListener('click', function () {
      var t = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('nf-theme', t); } catch (e) {}
      applyTheme(t);
    });
  });

  // Mobile menu
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

  // Contact form → opens WhatsApp with the message pre-filled
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.elements;
      var name = fields['contact-name'].value.trim();
      var phone = fields['contact-phone'].value.trim();
      var course = fields['contact-class'].value;
      var note = fields['contact-message'].value.trim();
      var text = '¡Hola! Soy ' + (name || '[nombre]') + '. Me interesa ' + course + '.';
      if (note) text += ' ' + note;
      if (phone) text += ' Mi teléfono: ' + phone + '.';
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }

  // Schedule: per-class filter buttons (highlight in the table) + per-day view on mobile
  var CLASSES = [
    ['dance-baby', 'Dance Baby', 'k-dance'],
    ['dance-intermedio', 'Dance Intermedio', 'k-dance'],
    ['dance-avanzado', 'Dance Avanzado', 'k-dance'],
    ['wedance-adultos', 'WeDance Adultos', 'k-dance'],
    ['fitdance', 'Fitdance', 'k-dance'],
    ['powerhiit', 'PowerHIIT', 'k-fit'],
    ['aquafitness', 'Aquafitness', 'k-fit']
  ];
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function mins(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }

  Array.prototype.forEach.call(document.querySelectorAll('.nf-filter'), function (bar) {
    var scroll = bar.nextElementSibling;
    var table = scroll && scroll.querySelector('.nf-schedule');
    if (!table) return;
    var cells = table.querySelectorAll('td[data-c]');
    var classesLink = document.querySelector('.nf-nav a[href$="clases/"]');
    var classesHref = classesLink ? classesLink.getAttribute('href') : 'clases/';

    // Data read from the table itself
    var days = Array.prototype.map.call(table.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); }).slice(1);
    var sessions = [];
    var slot = '', slotLeft = 0;
    Array.prototype.forEach.call(table.tBodies[0].rows, function (tr) {
      var th = tr.querySelector('th');
      if (th) { slot = th.textContent.trim(); slotLeft = +(th.getAttribute('rowspan') || 1); }
      Array.prototype.forEach.call(tr.querySelectorAll('td'), function (td, i) {
        if (!td.hasAttribute('data-c')) return;
        var m = (td.querySelector('time') || td).textContent.match(/(\d{1,2}:\d{2})\D+(\d{1,2}:\d{2})/);
        var small = td.querySelector('small');
        sessions.push({
          day: i, slot: slot, c: td.getAttribute('data-c'),
          type: td.classList.contains('k-fit') ? 'k-fit' : 'k-dance',
          name: td.querySelector('b').textContent, desc: small ? small.textContent : '',
          start: m ? m[1] : '', end: m ? m[2] : ''
        });
      });
    });
    sessions.sort(function (x, y) { return mins(x.start) - mins(y.start); });

    // Per-class buttons
    var status = el('p', 'sr-only'); status.setAttribute('aria-live', 'polite');
    var group = el('div', 'nf-picks');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Filtrar el horario por clase');
    var current = '';

    // Mobile view: day tabs + list
    var agenda = el('div', 'nf-agenda');
    var tabs = el('div', 'nf-days'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Día de la semana');
    var panel = el('div', 'nf-apanel'); panel.setAttribute('role', 'tabpanel'); panel.id = 'nf-apanel-' + Math.random().toString(36).slice(2, 7);
    var today = new Date().getDay(); // 0 Sunday … 6 Saturday
    var todayIdx = today >= 1 && today <= days.length ? today - 1 : -1;
    var day = todayIdx >= 0 ? todayIdx : 0;
    var tabBtns = days.map(function (d, i) {
      var n = sessions.filter(function (s) { return s.day === i; }).length;
      var t = el('button', 'nf-day');
      t.type = 'button'; t.id = panel.id + '-t' + i;
      t.setAttribute('role', 'tab'); t.setAttribute('aria-controls', panel.id);
      t.appendChild(el('b', null, d.slice(0, 3)));
      t.appendChild(el('span', null, i === todayIdx ? 'Hoy' : n + (n === 1 ? ' clase' : ' clases')));
      t.addEventListener('click', function () { day = i; if (current) select('', ''); else render(); });
      t.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!k) return;
        e.preventDefault(); go(k); tabBtns[day].focus();
      });
      tabs.appendChild(t);
      return t;
    });
    agenda.appendChild(tabs); agenda.appendChild(panel);

    function go(k) {
      if (current) return;
      day = (day + k + days.length) % days.length; render();
    }

    function card(s, label) {
      var a = el('a', 'nf-acard ' + s.type);
      a.href = classesHref + '#' + s.c;
      var t = el('div', 'nf-atime');
      t.appendChild(el('b', null, s.start));
      t.appendChild(el('span', null, s.end));
      var info = el('div', 'nf-ainfo');
      if (label) info.appendChild(el('em', null, label));
      info.appendChild(el('b', null, s.name));
      var meta = (s.desc ? s.desc + ' · ' : '') + (mins(s.end) - mins(s.start)) + ' min';
      info.appendChild(el('small', null, meta));
      a.appendChild(t); a.appendChild(info);
      a.appendChild(el('i', null, '›')).setAttribute('aria-hidden', 'true');
      a.setAttribute('aria-label', (label ? label + ', ' : '') + s.name + ', de ' + s.start + ' a ' + s.end + '. Ver clase');
      return a;
    }

    function render() {
      panel.innerHTML = '';
      agenda.classList.toggle('is-class', !!current);
      tabBtns.forEach(function (t, i) {
        var has = current && sessions.some(function (s) { return s.day === i && s.c === current; });
        t.setAttribute('aria-selected', String(!current && i === day));
        t.tabIndex = !current && i === day ? 0 : -1;
        t.classList.toggle('has-class', !!has);
      });
      var list, groupKey;
      if (current) {
        list = sessions.filter(function (s) { return s.c === current; })
          .sort(function (x, y) { return x.day - y.day || mins(x.start) - mins(y.start); });
        groupKey = function (s) { return days[s.day]; };
        panel.removeAttribute('aria-labelledby');
        panel.setAttribute('aria-label', 'Semana de ' + list[0].name);
      } else {
        list = sessions.filter(function (s) { return s.day === day; });
        groupKey = function (s) { return s.slot; };
        panel.removeAttribute('aria-label');
        panel.setAttribute('aria-labelledby', tabBtns[day].id);
      }
      if (!list.length) { panel.appendChild(el('p', 'nf-aempty', 'No hay clases este día.')); return; }
      var last = null, ol;
      list.forEach(function (s) {
        var g = groupKey(s);
        if (g !== last) {
          panel.appendChild(el('h3', 'nf-agroup', g));
          ol = el('ul', 'nf-alist'); panel.appendChild(ol); last = g;
        }
        var li = el('li'); li.appendChild(card(s)); ol.appendChild(li);
      });
    }

    // Swipe left/right to change day
    var x0 = null, y0 = 0;
    panel.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    panel.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    });

    function select(slug, label) {
      current = slug;
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
      render();
    }

    function chip(slug, label, type) {
      var b = el('button', 'nf-pick' + (type ? ' ' + type : ''), label);
      b.type = 'button';
      b.setAttribute('data-c', slug);
      b.addEventListener('click', function () {
        var active = b.getAttribute('aria-pressed') === 'true';
        select(active || !slug ? '' : slug, label);
      });
      group.appendChild(b);
    }

    chip('', 'Todas');
    CLASSES.forEach(function (c) {
      if (table.querySelector('td[data-c="' + c[0] + '"]')) chip(c[0], c[1], c[2]);
    });
    bar.appendChild(group);
    bar.appendChild(status);
    bar.hidden = false;
    scroll.parentNode.insertBefore(agenda, scroll.nextSibling);
    scroll.parentNode.classList.add('has-agenda');
    select('');
    status.textContent = '';
  });

  // "Volver" on legal pages: go back if we came from this site, otherwise the link's href (home)
  Array.prototype.forEach.call(document.querySelectorAll('[data-back]'), function (a) {
    a.addEventListener('click', function (e) {
      var ref = document.referrer;
      if (ref && ref.indexOf(location.origin) === 0 && ref !== location.href && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    });
  });

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
