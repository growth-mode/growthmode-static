(function () {
  // Inject modal HTML
  var modal = document.createElement('div');
  modal.id = 'contact-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML =
    '<div class="modal-box">' +
      '<button class="modal-close" aria-label="Close">&times;</button>' +
      '<h2 class="modal-title">START A PROJECT</h2>' +
      '<p class="modal-subtitle">Tell us about your project and we\'ll get back to you within 24 hours.</p>' +
      '<form id="contact-form" class="modal-form">' +
        '<div class="form-group">' +
          '<label for="cf-name">NAME *</label>' +
          '<input type="text" id="cf-name" name="name" placeholder="Your name" required>' +
        '</div>' +
        '<div class="form-group">' +
          '<label for="cf-email">EMAIL *</label>' +
          '<input type="email" id="cf-email" name="email" placeholder="you@company.com" required>' +
        '</div>' +
        '<div class="form-group">' +
          '<label for="cf-company">COMPANY</label>' +
          '<input type="text" id="cf-company" name="company" placeholder="Company name (optional)">' +
        '</div>' +
        '<div class="form-group">' +
          '<label for="cf-message">PROJECT BRIEF *</label>' +
          '<textarea id="cf-message" name="message" placeholder="Tell us about your project, goals, and timeline..." rows="5" required></textarea>' +
        '</div>' +
        '<button type="submit" class="modal-submit">SUBMIT &#8599;</button>' +
        '<p class="modal-status" id="form-status"></p>' +
      '</form>' +
    '</div>';
  document.body.appendChild(modal);

  var overlay = document.getElementById('contact-modal');
  var closeBtn = overlay.querySelector('.modal-close');
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  function openModal(e) {
    if (e) e.preventDefault();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Wire up all CTA links
  document.querySelectorAll('a[href="/#contact"], a[href="#contact"], .nav-cta').forEach(function (el) {
    el.addEventListener('click', openModal);
  });

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector('.modal-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...';
    status.textContent = '';
    status.className = 'modal-status';

    var data = {
      name: form.name.value,
      email: form.email.value,
      company: form.company.value,
      message: form.message.value
    };

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.json().then(function (d) { return { ok: res.ok, data: d }; }); })
      .then(function (result) {
        if (result.ok) {
          status.textContent = 'Message sent! We\'ll be in touch within 24 hours.';
          status.className = 'modal-status success';
          form.reset();
          setTimeout(closeModal, 3000);
        } else {
          status.textContent = result.data.error || 'Something went wrong. Please try again.';
          status.className = 'modal-status error';
        }
      })
      .catch(function () {
        status.textContent = 'Network error. Please try again.';
        status.className = 'modal-status error';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'SUBMIT \u2197';
      });
  });
})();
