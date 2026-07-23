/* =====================================================================
   partitura.js — desenha o rudimento em SVG (pauta de uma linha)
   ---------------------------------------------------------------------
   Cabeça de nota, haste, feixes (as barrinhas que ligam as notas),
   acentos (>), apojaturas de flam e o sticking R/L embaixo.
   Cada nota fica em um grupo <g> com o número dela, para o cursor
   animado poder acender só a nota que está soando.
   ===================================================================== */

const Partitura = (function () {

  const L = 720, A = 150;      // tamanho do "papel" (viewBox)
  const Y_LINHA   = 82;        // linha da pauta / centro das cabeças
  const Y_HASTE   = 46;        // topo das hastes
  const Y_FEIXE   = 44;        // topo do primeiro feixe
  const ESP_FEIXE = 6.5;
  const ALT_FEIXE = 4;
  const Y_ACENTO  = 30;
  const Y_STICK   = 116;
  const RX = 6.5, RY = 5;      // raio da cabeça de nota
  const DX_HASTE = 6.0;        // deslocamento da haste em relação ao centro
  const PASSO_MAX = 92;

  let rudAtual = null;
  let svgEl = null;
  let ultimoDestaque = -1;

  function geometria(rud) {
    const n = rud.notas.length;
    const passo = Math.min(PASSO_MAX, (L - 70) / n);
    const total = passo * n;
    const inicio = (L - total) / 2;
    return {
      passo: passo,
      inicio: inicio,
      total: total,
      x: function (i) { return inicio + passo * i + passo / 2; }
    };
  }

  /* Agrupa as notas que serão ligadas pelo mesmo feixe.
     Divide por tempo e quebra o grupo quando encontra uma pausa. */
  function gruposDeFeixe(rud) {
    const P = rud.notasPorTempo;
    const grupos = [];
    for (let i = 0; i < rud.notas.length; i += P) {
      let atual = [];
      for (let k = 0; k < P && i + k < rud.notas.length; k++) {
        const nota = rud.notas[i + k];
        if (nota.mao) { atual.push(i + k); }
        else { if (atual.length) grupos.push(atual); atual = []; }
      }
      if (atual.length) grupos.push(atual);
    }
    return grupos;
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function renderizar(rud, alvo) {
    rudAtual = rud;
    svgEl = alvo;
    ultimoDestaque = -1;

    const g = geometria(rud);
    const P = rud.notasPorTempo;
    const temposCompasso = { '4/4': 4, '3/4': 3, '6/8': 2 }[rud.compasso];
    const porCompasso = P * temposCompasso;

    let s = '';

    /* faixas de destaque (uma por nota, invisíveis até o cursor passar) */
    for (let i = 0; i < rud.notas.length; i++) {
      s += '<rect class="faixa" id="faixa-' + i + '" x="' + (g.x(i) - g.passo / 2) +
           '" y="20" width="' + g.passo + '" height="108" rx="6"/>';
    }

    /* linha da pauta */
    s += '<line class="pauta" x1="' + (g.inicio - 16) + '" y1="' + Y_LINHA +
         '" x2="' + (g.inicio + g.total + 16) + '" y2="' + Y_LINHA + '"/>';

    /* barras de compasso */
    for (let i = porCompasso; i < rud.notas.length; i += porCompasso) {
      const bx = g.x(i) - g.passo / 2;
      s += '<line class="barra" x1="' + bx + '" y1="60" x2="' + bx + '" y2="104"/>';
    }
    s += '<line class="barra final" x1="' + (g.inicio + g.total + 14) + '" y1="60" x2="' +
         (g.inicio + g.total + 14) + '" y2="104"/>';

    /* feixes — nota solta (grupo de 1) leva só 1 feixe (vale como colcheia),
       o que faz os acentos de colcheia e os finais de roll aparecerem certos. */
    if (rud.feixes > 0) {
      gruposDeFeixe(rud).forEach(function (grupo) {
        const nb = (grupo.length === 1) ? 1 : rud.feixes;
        const x1 = g.x(grupo[0]) + DX_HASTE;
        const x2 = grupo.length > 1
          ? g.x(grupo[grupo.length - 1]) + DX_HASTE
          : g.x(grupo[0]) + DX_HASTE + Math.min(16, g.passo * 0.35);
        for (let f = 0; f < nb; f++) {
          const y = Y_FEIXE + f * ESP_FEIXE;
          s += '<rect class="feixe" x="' + x1 + '" y="' + y + '" width="' + (x2 - x1) +
               '" height="' + ALT_FEIXE + '"/>';
        }
      });
    }

    /* notas */
    for (let i = 0; i < rud.notas.length; i++) {
      const nota = rud.notas[i];
      const x = g.x(i);
      s += '<g class="nota" id="nota-' + i + '">';

      if (!nota.mao) {
        // pausa (desenho simplificado de pausa de colcheia)
        s += '<circle class="pausa" cx="' + (x - 3) + '" cy="' + (Y_LINHA - 8) + '" r="3.4"/>' +
             '<path class="pausa-haste" d="M ' + (x - 0.2) + ' ' + (Y_LINHA - 10) +
             ' L ' + (x + 4.5) + ' ' + (Y_LINHA + 9) + '"/>';
        s += '</g>';
        continue;
      }

      // apojaturas: flam = 1, drag = 2 (desenhadas menores, à esquerda)
      const graces = nota.graces || [];
      if (graces.length) {
        const ng = graces.length;
        const espac = Math.min(9, g.passo * 0.16);
        const gx0 = x - Math.min(24, g.passo * 0.40);
        const topoG = Y_LINHA - 26;
        for (let gi = 0; gi < ng; gi++) {
          const gx = gx0 + gi * espac;
          s += '<ellipse class="cabeca grace" cx="' + gx + '" cy="' + Y_LINHA + '" rx="4.2" ry="3.4"/>' +
               '<line class="haste grace" x1="' + (gx + 3.6) + '" y1="' + Y_LINHA +
               '" x2="' + (gx + 3.6) + '" y2="' + topoG + '"/>';
        }
        if (ng >= 2) {
          // feixe ligando as apojaturas do drag
          s += '<rect class="feixe grace-feixe" x="' + (gx0 + 3.6) + '" y="' + topoG +
               '" width="' + ((ng - 1) * espac) + '" height="3"/>';
        } else {
          // corte na haste do flam (apojatura solta)
          s += '<line class="corte-grace" x1="' + (gx0 - 3) + '" y1="' + (Y_LINHA - 12) +
               '" x2="' + (gx0 + 11) + '" y2="' + (Y_LINHA - 22) + '"/>';
        }
        s += '<path class="ligadura" d="M ' + (gx0 + 1) + ' ' + (Y_LINHA + 10) +
             ' Q ' + ((gx0 + x) / 2) + ' ' + (Y_LINHA + 18) + ' ' + (x - 5) + ' ' + (Y_LINHA + 9) + '"/>';
      }

      // cabeça + haste
      s += '<ellipse class="cabeca" cx="' + x + '" cy="' + Y_LINHA + '" rx="' + RX + '" ry="' + RY + '"/>';
      s += '<line class="haste" x1="' + (x + DX_HASTE) + '" y1="' + (Y_LINHA - 1) +
           '" x2="' + (x + DX_HASTE) + '" y2="' + Y_HASTE + '"/>';

      // buzz: um "Z" na haste (rolo fechado / multiple bounce)
      if (nota.buzz) {
        const bx = x + DX_HASTE;
        s += '<path class="buzz" d="M ' + (bx - 4) + ' ' + (Y_LINHA - 16) +
             ' l 8 0 l -8 6 l 8 0"/>';
      }

      // acento
      if (nota.acento) {
        s += '<path class="acento" d="M ' + (x - 7) + ' ' + Y_ACENTO +
             ' L ' + (x + 7) + ' ' + (Y_ACENTO + 5) +
             ' L ' + (x - 7) + ' ' + (Y_ACENTO + 10) + '"/>';
      }

      // sticking
      if (graces.length) {
        s += '<text class="stick menor" x="' + (x - 12) + '" y="' + Y_STICK + '">' +
             esc(graces.join('').toLowerCase()) + '</text>';
        s += '<text class="stick" x="' + (x + 6) + '" y="' + Y_STICK + '">' + esc(nota.mao) + '</text>';
      } else {
        s += '<text class="stick" x="' + x + '" y="' + Y_STICK + '">' + esc(nota.mao) + '</text>';
      }

      s += '</g>';
    }

    alvo.setAttribute('viewBox', '0 0 ' + L + ' ' + A);
    alvo.innerHTML = s;
  }

  /* Acende a nota que está soando agora e apaga a anterior. */
  function destacar(i) {
    if (!svgEl || i === ultimoDestaque) return;
    if (ultimoDestaque >= 0) {
      const ant = svgEl.querySelector('#nota-' + ultimoDestaque);
      const antF = svgEl.querySelector('#faixa-' + ultimoDestaque);
      if (ant) ant.classList.remove('ativa');
      if (antF) antF.classList.remove('ativa');
    }
    const atual = svgEl.querySelector('#nota-' + i);
    const faixa = svgEl.querySelector('#faixa-' + i);
    if (atual) atual.classList.add('ativa');
    if (faixa) faixa.classList.add('ativa');
    ultimoDestaque = i;
  }

  function limpar() {
    if (ultimoDestaque >= 0 && svgEl) {
      const ant = svgEl.querySelector('#nota-' + ultimoDestaque);
      const antF = svgEl.querySelector('#faixa-' + ultimoDestaque);
      if (ant) ant.classList.remove('ativa');
      if (antF) antF.classList.remove('ativa');
    }
    ultimoDestaque = -1;
  }

  return { renderizar: renderizar, destacar: destacar, limpar: limpar };
})();
