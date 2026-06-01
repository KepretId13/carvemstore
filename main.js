/* ============================================
   CARVENSTORE — main.js
   ============================================ */

/* ---- NAVBAR SCROLL STATE ---- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ---- MOBILE MENU TOGGLE ---- */
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

navBurger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});


/* ---- COUNTER ANIMATION ---- */
function animateCounter(el) {
  if (el.dataset.static) return;

  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '+';
  const duration = 1800;
  const startTime = performance.now();

  function formatValue(val) {
    if (target >= 1000000) {
      return (val / 1000000).toFixed(1) + suffix;
    }
    return Math.round(val) + suffix;
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    el.textContent = formatValue(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = formatValue(target);
    }
  }

  requestAnimationFrame(step);
}

// Trigger counter when stats bar is visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);


/* ---- SCROLL REVEAL ---- */
const revealElements = document.querySelectorAll(
  '.service-card, .price-card, .section-title, .section-sub, .section-tag'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));


/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--neon)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));


/* ---- SCROLL TO ORDER ---- */
function scrollToOrder() {
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}


/* ---- FORM VALIDATION & SUBMIT ---- */
const orderForm = document.getElementById('orderForm');
const successMsg = document.getElementById('successMsg');

const fields = [
  { id: 'f-name',    errId: 'err-name',    msg: 'Nama / brand wajib diisi.' },
  { id: 'f-contact', errId: 'err-contact', msg: 'Kontak WA atau IG wajib diisi.' },
  { id: 'f-service', errId: 'err-service', msg: 'Pilih dulu jasa yang lu mau.' },
  { id: 'f-desc',    errId: 'err-desc',    msg: 'Deskripsiin kebutuhan lu dong.' },
];

function clearErrors() {
  fields.forEach(({ id, errId }) => {
    const input = document.getElementById(id);
    const err   = document.getElementById(errId);
    if (input) input.classList.remove('error');
    if (err)   err.classList.remove('visible');
  });
}

function validateForm() {
  let valid = true;

  fields.forEach(({ id, errId, msg }) => {
    const input = document.getElementById(id);
    const err   = document.getElementById(errId);
    if (!input) return;

    const isEmpty = input.value.trim() === '' || input.value === '';

    if (isEmpty) {
      input.classList.add('error');
      if (err) {
        err.textContent = msg;
        err.classList.add('visible');
      }
      valid = false;
    }
  });

  return valid;
}

if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    successMsg.classList.remove('visible');

    if (!validateForm()) return;

    // Simulate submit (replace with actual endpoint / WA redirect logic)
    const btn = orderForm.querySelector('button[type="submit"]');
    btn.textContent = 'MENGIRIM...';
    btn.disabled = true;

    setTimeout(() => {
      successMsg.classList.add('visible');
      orderForm.reset();
      btn.textContent = 'KIRIM ORDER';
      btn.disabled = false;

      // Scroll success message into view
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1000);
  });

  // Clear error on input
  fields.forEach(({ id, errId }) => {
    const input = document.getElementById(id);
    const err   = document.getElementById(errId);
    if (!input) return;

    input.addEventListener('input', () => {
      input.classList.remove('error');
      if (err) err.classList.remove('visible');
    });
  });
}


/* ---- OPTIONAL: WA REDIRECT AFTER ORDER ---- */
// Uncomment line below to auto-open WA after form submit with pre-filled message
//
// function buildWAMessage() {
//   const name    = document.getElementById('f-name').value;
//   const contact = document.getElementById('f-contact').value;
//   const service = document.getElementById('f-service').value;
//   const desc    = document.getElementById('f-desc').value;
//   const budget  = document.getElementById('f-budget').value;
//   const msg = `Halo CarvenStore!\n\nNama: ${name}\nKontak: ${contact}\nJasa: ${service}\nDeskripsi: ${desc}\nBudget: ${budget}`;
//   return encodeURIComponent(msg);
// }
//
// Paste this inside the setTimeout callback:
// window.open(`https://wa.me/62XXXXXXXXXXXX?text=${buildWAMessage()}`, '_blank');
