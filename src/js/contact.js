/**
 * Contact form: posts to `data-endpoint` when configured (e.g. Formspree),
 * otherwise composes an email in the visitor's mail client.
 */
const COPY_RESET_MS = 1800;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const say = (msg) => (status.textContent = msg);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = ['name', 'email', 'message'].map((n) => form.elements.namedItem(n));
    let firstInvalid = null;
    fields.forEach((f) => {
      const value = f.value.trim();
      const ok = value && (f.name !== 'email' || EMAIL_RE.test(value));
      f.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      say('Please fill in your name, a valid email and a message.');
      firstInvalid.focus();
      return;
    }

    const [name, email, message] = fields.map((f) => f.value.trim());
    const endpoint = form.dataset.endpoint;

    if (!endpoint) {
      const subject = encodeURIComponent(`Hello from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${form.dataset.email}?subject=${subject}&body=${body}`;
      say('Opening your email app…');
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    say('Sending…');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      say('Thanks — your message is on its way. I’ll reply soon.');
    } catch {
      say(`Something went wrong. Please email ${form.dataset.email} directly.`);
    } finally {
      button.disabled = false;
    }
  });
}

export function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.classList.add('is-copied');
        btn.setAttribute('aria-label', 'Email address copied');
        setTimeout(() => {
          btn.classList.remove('is-copied');
          btn.setAttribute('aria-label', 'Copy email address');
        }, COPY_RESET_MS);
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
      }
    });
  });
}
