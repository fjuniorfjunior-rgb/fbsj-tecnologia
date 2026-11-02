/* =========================================================
   FBSJ Tecnologia — interações do site
   Sem dependências externas. Respeita prefers-reduced-motion.
   ========================================================= */
(() => {
  'use strict';
  const WHATSAPP = '5561986183317';
  const EMAIL = 'fbsj.tecnologia@outlook.com';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Ano do rodapé ---------- */
  const ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Cabeçalho: fundo ao rolar + barra de progresso ---------- */
  const nav = $('#nav');
  const bar = $('.progress span');
  const timeline = $('.timeline');
  const timelineFill = $('.timeline__line span');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (nav && !nav.classList.contains('nav--solid')) nav.classList.toggle('is-scrolled', y > 24);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (timeline && timelineFill) {
      const r = timeline.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / r.height));
      timeline.style.setProperty('--p', p.toFixed(3));
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const toggle = $('.nav__toggle');
  const menu = $('#menu');
  const closeMenu = () => {
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir menu');
  };
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  addEventListener('resize', () => { if (innerWidth > 900) closeMenu(); });

  /* ---------- Scroll reveal com escalonamento ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // atraso escalonado para itens irmãos
    reveals.forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      const i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty('--d', `${Math.min(i, 6) * 0.08}s`);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Link ativo no menu ---------- */
  const links = $$('[data-nav]');
  if ('IntersectionObserver' in window && links.length) {
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && map.has(en.target.id)) {
          links.forEach((a) => a.classList.remove('is-active'));
          map.get(en.target.id).classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Cards: brilho que segue o cursor ---------- */
  $$('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Hero: parallax discreto com o ponteiro ---------- */
  const art = $('.hero__art');
  if (art && !reduceMotion && matchMedia('(pointer: fine)').matches) {
    const items = $$('[data-parallax]', art);
    const stack = $('.stack', art);
    art.closest('.hero').addEventListener('pointermove', (e) => {
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      items.forEach((el) => {
        const k = parseFloat(el.dataset.parallax || 1) * 10;
        if (el === stack) {
          el.style.transform = `translate(-50%, -50%) rotateX(${56 - y * 6}deg) rotateZ(${-38 + x * 6}deg)`;
        } else {
          el.style.transform = `translate3d(${x * k}px, ${y * k}px, 0)`;
        }
      });
    });
  }

  /* ---------- Hero: rede de partículas (canvas leve) ---------- */
  const canvas = $('.hero__canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, pts = [], raf = null, visible = true;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 16000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.6,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
          if (d2 < 15000) {
            ctx.strokeStyle = `rgba(0, 190, 255, ${0.16 * (1 - d2 / 15000)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(0, 212, 255, .75)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = visible ? requestAnimationFrame(draw) : null;
    };
    resize();
    addEventListener('resize', resize);
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    }).observe(canvas);
    document.addEventListener('visibilitychange', () => {
      visible = !document.hidden;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
  }

  /* ---------- Formulário de contato ----------
     Envio: FormSubmit (https://formsubmit.co), serviço gratuito que encaminha
     o formulário para o e-mail da FBSJ. Na primeira mensagem o FormSubmit envia
     um e-mail de ativação para fbsj.tecnologia@outlook.com — basta confirmar.
     Alternativa sempre disponível: botão "Enviar pelo WhatsApp". */
  const form = $('#form-contato');
  if (form) {
    const msg = $('.form__msg', form);
    const submitBtn = $('button[type="submit"]', form);
    const setMsg = (t, cls) => { msg.textContent = t; msg.className = `form__msg ${cls || ''}`; };
    const data = () => Object.fromEntries(new FormData(form).entries());
    const validate = () => {
      let ok = true;
      ['nome', 'email', 'mensagem'].forEach((n) => {
        const f = form.elements[n];
        const valid = f.value.trim() !== '' && (n !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.classList.toggle('is-invalid', !valid);
        f.setAttribute('aria-invalid', String(!valid));
        if (!valid) ok = false;
      });
      if (!ok) setMsg('Preencha nome, um e-mail válido e a descrição do projeto.', 'err');
      return ok;
    };
    const whatsappText = (d) => [
      'Olá, FBSJ Tecnologia! Vim pelo site.',
      `Nome: ${d.nome || '-'}`,
      d.empresa ? `Empresa: ${d.empresa}` : '',
      d.email ? `E-mail: ${d.email}` : '',
      d.whatsapp ? `WhatsApp: ${d.whatsapp}` : '',
      `Serviço: ${d.servico}`,
      `Projeto: ${d.mensagem || '-'}`,
    ].filter(Boolean).join('\n');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.elements._honey.value) return; // bot
      if (!validate()) return;
      submitBtn.disabled = true;
      setMsg('Enviando…');
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data()),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || String(json.success) === 'false') throw new Error(json.message || 'erro');
        form.reset();
        setMsg('Mensagem enviada! A FBSJ vai responder em breve.', 'ok');
      } catch (err) {
        setMsg('Não foi possível enviar agora. Use o botão "Enviar pelo WhatsApp" ou escreva para ' + EMAIL + '.', 'err');
      } finally {
        submitBtn.disabled = false;
      }
    });

    $('#form-whatsapp')?.addEventListener('click', () => {
      if (!validate()) return;
      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappText(data()))}`;
      window.open(url, '_blank', 'noopener');
      setMsg('Abrindo o WhatsApp com a sua mensagem…', 'ok');
    });
  }
})();
