/* =========================================================
   Este script es compartido por las 3 páginas. Cada bloque
   se activa solo si encuentra los elementos de su página,
   así que no hace falta tocar nada acá.
   ========================================================= */

function generarEstrellas(contenedor, total) {
  for (let i = 0; i < total; i++) {
    const e = document.createElement('div');
    e.className = 'estrella';
    e.style.left = Math.random() * 100 + '%';
    e.style.top = Math.random() * 100 + '%';
    const dur = 2 + Math.random() * 3.5;
    e.style.animationDuration = dur + 's';
    e.style.animationDelay = (Math.random() * dur) + 's';
    contenedor.appendChild(e);
  }
}

/* =========================================================
   PÁGINA 1 — Estrellas + Pergamino
   ========================================================= */
if (document.getElementById('pagina1')) {
  const cielo = document.getElementById('cielo');
  generarEstrellas(cielo, 90);

  const btnAbrir = document.getElementById('btnAbrir');
  const textoIntro = document.getElementById('textoIntro');
  setTimeout(() => { textoIntro.classList.add('mostrar'); }, 700);
  setTimeout(() => { btnAbrir.classList.add('mostrar'); }, 4000);

  const pergaminoCaja = document.getElementById('pergaminoCaja');
  const rolloWrap = document.getElementById('rolloWrap');
  const cartaTexto = document.getElementById('cartaTexto');
  const btnSiguiente = document.getElementById('btnSiguiente');
  const avisoScroll = document.getElementById('avisoScroll');

  const textoConNegritas = TEXTO_CARTA
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>');
  cartaTexto.innerHTML = textoConNegritas +
    '<span class="firma">' + FIRMA_CARTA + '</span>';

  btnAbrir.addEventListener('click', () => {
    btnAbrir.classList.remove('mostrar');
    setTimeout(() => { btnAbrir.classList.add('oculta'); }, 800);
    textoIntro.classList.remove('mostrar');
    setTimeout(() => { textoIntro.classList.add('oculta'); }, 1100);
    pergaminoCaja.classList.add('mostrar');
    cielo.classList.add('fugaces-activas');

    let necesitaScroll = false;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // El pergamino nunca crece más de lo que entra en pantalla:
        // si la carta es más larga que eso, se lee con scroll interno.
        const alturaMaxima = window.innerHeight * 0.5;
        const alturaFinal = Math.min(cartaTexto.scrollHeight, alturaMaxima);
        rolloWrap.style.height = alturaFinal + 'px';
        necesitaScroll = cartaTexto.scrollHeight > alturaMaxima;
      });
    });

    rolloWrap.addEventListener('scroll', () => {
      if (!necesitaScroll) return;
      const alFinal = rolloWrap.scrollTop + rolloWrap.clientHeight >= rolloWrap.scrollHeight - 4;
      avisoScroll.classList.toggle('mostrar', !alFinal);
    });

    rolloWrap.addEventListener('transitionend', function mostrarSiguiente(ev) {
      if (ev.propertyName !== 'height') return;
      rolloWrap.removeEventListener('transitionend', mostrarSiguiente);
      if (necesitaScroll) avisoScroll.classList.add('mostrar');
      btnSiguiente.classList.add('mostrar');
    });
  });

  btnSiguiente.addEventListener('click', () => {
    document.getElementById('pagina1').classList.add('desvanecer');
    setTimeout(() => {
      window.location.href = 'pagina2.html';
    }, 650);
  });
}

/* =========================================================
   PÁGINA 2 — Jardín de tulipanes
   ========================================================= */
if (document.getElementById('pagina2')) {
  const cielo2 = document.getElementById('cielo2');
  generarEstrellas(cielo2, 70);

  const tulipanesCont = document.getElementById('tulipanes');
  const textoTocar = document.getElementById('textoTocar');
  const mensajeModal = document.getElementById('mensajeModal');
  const mensajeModalTexto = document.getElementById('mensajeModalTexto');

  const tulipanes = MENSAJES_TULIPANES.map((msg) => {
    const t = document.createElement('div');
    t.className = 'tulipan';
    t.dataset.msg = msg;
    t.style.setProperty('--rot', ((Math.random() - 0.5) * 14).toFixed(1) + 'deg');
    t.innerHTML = `
      <svg viewBox="-80 -100 160 300">
        <use href="#stemLeaves"></use>
        <g class="bloom" filter="url(#tulipGlow)">
          <use href="#lobe" class="petal-side" transform="translate(0,-3) rotate(-27) scale(0.9)"></use>
          <use href="#lobe" class="petal-side" transform="translate(0,-3) rotate(27) scale(0.9)"></use>
          <use href="#lobe" class="petal-center" transform="translate(0,-5)"></use>
          <path class="petal-highlight" d="M-2,-72 C-5,-52 -5,-30 -1,-13" stroke-width="2.6" stroke-linecap="round" fill="none"></path>
        </g>
        <ellipse class="petal-base" cx="0" cy="7" rx="3.6" ry="4.6"></ellipse>
      </svg>
    `;
    tulipanesCont.appendChild(t);
    return t;
  });

  // Entrada escalonada, orgánica
  tulipanes.forEach((t, i) => {
    setTimeout(() => t.classList.add('entrar'), 150 + i * 90);
  });
  const tiempoEntrada = 150 + (tulipanes.length - 1) * 90 + 900;
  setTimeout(() => textoTocar.classList.add('mostrar'), tiempoEntrada);

  let abiertos = 0;
  let primerToque = true;

  tulipanesCont.addEventListener('click', (ev) => {
    const t = ev.target.closest('.tulipan');
    if (!t) return;

    if (primerToque) {
      primerToque = false;
      textoTocar.classList.remove('mostrar');
    }

    if (!t.classList.contains('abierto')) {
      t.classList.add('abierto');
      abiertos++;
    }

    mensajeModalTexto.textContent = t.dataset.msg;
    mensajeModal.classList.remove('mostrar');
    void mensajeModal.offsetWidth; // reinicia la animación en cada toque
    mensajeModal.classList.add('mostrar');

    if (abiertos === MENSAJES_TULIPANES.length) {
      setTimeout(irAPagina3, 10000);
    }
  });

  function irAPagina3() {
    document.getElementById('pagina2').classList.add('desvanecer');
    setTimeout(() => {
      window.location.href = 'pagina3.html';
    }, 700);
  }
}

/* =========================================================
   PÁGINA 3 — Carrusel de fotos
   ========================================================= */
if (document.getElementById('pagina3')) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById('pagina3').classList.add('aparecer');
    });
  });

  const marco = document.getElementById('carruselMarco');
  const puntosCont = document.getElementById('puntos');
  let indiceActual = 0;

  FOTOS_CARRUSEL.forEach((foto, i) => {
    const slide = document.createElement('div');
    slide.className = 'foto-slide' + (i === 0 ? ' activa' : '');
    slide.style.background = foto.color;
    if (foto.src) {
      const posicion = foto.pos || 'center';
      slide.innerHTML = `<img src="${foto.src}" alt="${foto.texto}" style="object-position:${posicion};" onerror="this.remove()"><span>${foto.texto}</span>`;
    } else {
      slide.innerHTML = `<span>${foto.texto}</span>`;
    }
    marco.appendChild(slide);

    const punto = document.createElement('div');
    punto.className = 'punto' + (i === 0 ? ' activo' : '');
    puntosCont.appendChild(punto);
  });

  function moverCarrusel(dir) {
    const slides = document.querySelectorAll('.foto-slide');
    const puntos = document.querySelectorAll('.punto');
    slides[indiceActual].classList.remove('activa');
    puntos[indiceActual].classList.remove('activo');
    indiceActual = (indiceActual + dir + slides.length) % slides.length;
    slides[indiceActual].classList.add('activa');
    puntos[indiceActual].classList.add('activo');
  }

  document.getElementById('flechaIzq').addEventListener('click', () => moverCarrusel(-1));
  document.getElementById('flechaDer').addEventListener('click', () => moverCarrusel(1));
}