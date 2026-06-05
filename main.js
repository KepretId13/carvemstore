/* ============================================
   CARVENSTORE — main.js (Shared)
   ============================================ */
(function () {

  /* ---- SIDEBAR TOGGLE (mobile) ---- */
  var sidebar  = document.getElementById('sidebar');
  var overlay  = document.getElementById('sidebarOverlay');
  var burger   = document.getElementById('burger');

  function openSidebar()  { sidebar.classList.add('open');  overlay.classList.add('show'); }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }

  if (burger)  burger.addEventListener('click', openSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  /* Close sidebar on nav link click (mobile) */
  document.querySelectorAll('.nav-item').forEach(function (el) {
    el.addEventListener('click', function () {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });

  /* ---- SCROLL REVEAL ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---- COUNTER ANIMATION ---- */
  function animateCount(el) {
    if (el.dataset.static) return;
    var target   = parseFloat(el.dataset.target);
    var suffix   = el.dataset.suffix || '';
    var prefix   = el.dataset.prefix || '';
    var decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    var dur      = 1600;
    var start    = performance.now();

    function fmt(v) {
      return prefix + (decimals ? v.toFixed(decimals) : Math.round(v)) + suffix;
    }

    function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(e * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-target]');
  if (counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---- PLATFORM FILTER (social.html) ---- */
  var pfBtns = document.querySelectorAll('.pf-btn');
  pfBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pfBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      document.querySelectorAll('.service-item').forEach(function (item) {
        if (filter === 'all' || item.dataset.platform === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ---- GENERIC FORM HANDLER ---- */
  var forms = document.querySelectorAll('.crv-form');
  forms.forEach(function (form) {
    var fields = form.querySelectorAll('[data-required]');
    var successEl = form.querySelector('.success-banner');

    function clearErrs() {
      fields.forEach(function (f) {
        f.classList.remove('err');
        var errEl = document.getElementById('err-' + f.id);
        if (errEl) errEl.classList.remove('show');
      });
    }

    function validate() {
      var ok = true;
      fields.forEach(function (f) {
        if (!f.value.trim()) {
          f.classList.add('err');
          var errEl = document.getElementById('err-' + f.id);
          if (errEl) errEl.classList.add('show');
          ok = false;
        }
      });
      return ok;
    }

    fields.forEach(function (f) {
      f.addEventListener('input', function () {
        f.classList.remove('err');
        var errEl = document.getElementById('err-' + f.id);
        if (errEl) errEl.classList.remove('show');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrs();
      if (successEl) successEl.classList.remove('show');
      if (!validate()) return;

      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.textContent = 'MENGIRIM...'; btn.disabled = true; }

      setTimeout(function () {
        if (successEl) {
          successEl.classList.add('show');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
        if (btn) { btn.textContent = btn.dataset.label || 'KIRIM ORDER'; btn.disabled = false; }
      }, 900);
    });
  });

  /* ---- SERVICE ITEM CLICK → fill select ---- */
  document.querySelectorAll('.service-item[data-service]').forEach(function (item) {
    item.addEventListener('click', function () {
      var sel = document.getElementById('f-service');
      if (sel) {
        sel.value = item.dataset.service;
        sel.dispatchEvent(new Event('change'));
        var panel = document.getElementById('order-panel');
        if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
