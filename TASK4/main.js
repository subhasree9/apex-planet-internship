// year
document.getElementById('year').textContent = new Date().getFullYear();

// mobile menu
const burger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => nav.classList.toggle('open'));
}

// contact form (demo validation)
const form = document.getElementById('contactForm');
if (form) {
  const status = document.getElementById('contactStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const msg = document.getElementById('cMsg').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (!name || !emailOk || !msg) {
      status.textContent = "Please fill all fields with a valid email.";
      status.style.color = "#fca5a5";
      return;
    }
    status.textContent = "Thanks! Your message was captured (demo).";
    status.style.color = "#86efac";
    form.reset();
  });
}
