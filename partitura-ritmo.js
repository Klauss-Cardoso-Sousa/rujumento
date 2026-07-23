/* =====================================================================
   partitura-ritmo.js — desenha o groove numa pauta de kit (5 linhas)
   ---------------------------------------------------------------------
   Vozes: prato/chimbal em cima (× de prato), caixa no meio (cabeça cheia),
   aro no meio (× de cross-stick), bumbo embaixo. Chimbal de pé (quando há
   prato de mão) vai abaixo da pauta. Hastes para cima (mãos) e para baixo
   (bumbo), com feixes por tempo. Cursor destaca o passo que soa.
   ===================================================================== */

const PartituraRitmo = (function () {

  const L = 720, A = 150;
  const LINHAS = [54, 66, 78, 90, 102];         // 5 linhas da pauta
  const Y_PRATO = 44, Y_PE = 116;
  const Y_CAIXA = 78, Y_ARO = 78, Y_BUMBO = 96;
  const Y_FEIXE_CIMA = 28, Y_FEIXE_BAIXO = 124;
  const DX = 6, ESP_FEIXE = 5, ALT_FEIXE = 3.4;

  let ritAtual = null, svgEl = null, ultimo = -1;

  function laneY(voz, pe) {
    if (voz === 'prato') return Y_PRATO;
    if (voz === 'chimbal') return pe ? Y_PE : Y_PRATO;
    if (voz === 'caixa') return Y_CAIXA;
    if (voz === 'aro') return Y_ARO;
    if (voz === 'bumbo') return Y_BUMBO;
    return Y_CAIXA;
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function cabecaX(x, y, cls) {
    return '<line class="' + cls + '" x1="' + (x - 4.2) + '" y1="' + (y - 4.2) +
           '" x2="' + (x + 4.2) + '" y2="' + (y + 4.2) + '"/>' +
           '<line class="' + cls + '" x1="' + (x - 4.2) + '" y1="' + (y + 4.2) +
           '" x2="' + (x + 4.2) + '" y2="' + (y - 4.2) + '"/>';
  }
  function cabecaCheia(x, y, cls, r) {
    r = r || 6;
    return '<ellipse class="' + cls + '" cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + (r * 0.75) + '"/>';
  }

  function renderizar(rit, alvo) {
    ritAtual = rit; svgEl = alvo; ultimo = -1;
    const N = rit.totalPassos, P = rit.passosPorTempo;
    const passo = Math.min(46, (L - 90) / N);
    const inicio = 58;
    const total = passo * N;
    const X = function (i) { return inicio + passo * i + passo / 2; };
    const pe = rit.chimbalDePe;

    // separa vozes por grupo de haste
    const vozesCima = rit.vozesLista.filter(function (v) { return v.voz !== 'bumbo' && !(v.voz === 'chimbal' && pe); });
    const vozBumbo = rit.vozesLista.filter(function (v) { return v.voz === 'bumbo'; })[0] || null;
    const vozPe = pe ? rit.vozesLista.filter(function (v) { return v.voz === 'chimbal'; })[0] : null;

    // presença por coluna (grupo de cima e bumbo)
    const temCima = [], yMaisBaixoCima = [], temBumbo = [];
    for (let i = 0; i < N; i++) {
      let baixo = -1;
      vozesCima.forEach(function (v) {
        if (v.passos[i]) { const y = laneY(v.voz, pe); if (y > baixo) baixo = y; }
      });
      temCima[i] = baixo >= 0;
      yMaisBaixoCima[i] = baixo;
      temBumbo[i] = !!(vozBumbo && vozBumbo.passos[i]);
    }

    let s = '';

    // faixas de destaque (cursor)
    for (let i = 0; i < N; i++) {
      s += '<rect class="faixa-r" id="passo-' + i + '" x="' + (X(i) - passo / 2) +
           '" y="24" width="' + passo + '" height="104" rx="5"/>';
    }

    // linhas da pauta
    LINHAS.forEach(function (y) {
      s += '<line class="pauta" x1="' + (inicio - 6) + '" y1="' + y + '" x2="' + (inicio + total + 6) + '" y2="' + y + '"/>';
    });

    // divisórias de tempo (leves) e barra final
    for (let b = 0; b <= rit.tempos; b++) {
      const bx = inicio + passo * P * b;
      const forte = (b === 0 || b === rit.tempos);
      s += '<line class="' + (forte ? 'barra-r' : 'tempo-r') + '" x1="' + bx + '" y1="' + LINHAS[0] +
           '" x2="' + bx + '" y2="' + LINHAS[4] + '"/>';
    }

    // hastes + feixes do grupo de cima, por tempo
    for (let b = 0; b < rit.tempos; b++) {
      const cols = [];
      for (let k = 0; k < P; k++) { const i = b * P + k; if (temCima[i]) cols.push(i); }
      cols.forEach(function (i) {
        s += '<line class="haste-r" x1="' + (X(i) + DX) + '" y1="' + yMaisBaixoCima[i] +
             '" x2="' + (X(i) + DX) + '" y2="' + Y_FEIXE_CIMA + '"/>';
      });
      desenhaFeixe(cols, X, DX, Y_FEIXE_CIMA, 1, passo, function (str) { s += str; });
    }

    // hastes + feixes do bumbo (para baixo), por tempo
    for (let b = 0; b < rit.tempos; b++) {
      const cols = [];
      for (let k = 0; k < P; k++) { const i = b * P + k; if (temBumbo[i]) cols.push(i); }
      cols.forEach(function (i) {
        s += '<line class="haste-r" x1="' + (X(i) - DX) + '" y1="' + Y_BUMBO +
             '" x2="' + (X(i) - DX) + '" y2="' + Y_FEIXE_BAIXO + '"/>';
      });
      desenhaFeixe(cols, X, -DX, Y_FEIXE_BAIXO, -1, passo, function (str) { s += str; });
    }

    // cabeças de nota, por voz e passo (dentro de <g> por passo, para acender)
    for (let i = 0; i < N; i++) {
      s += '<g class="passo-nota" id="nota-r-' + i + '">';
      const x = X(i);
      rit.vozesLista.forEach(function (v) {
        const sim = v.passos[i];
        if (!sim) return;
        const y = laneY(v.voz, pe);
        if (v.voz === 'prato' || (v.voz === 'chimbal')) {
          s += cabecaX(x, y, 'cab-x');
          if (sim === 'o') s += '<circle class="aberto-r" cx="' + x + '" cy="' + (y - 8) + '" r="2.8"/>';
        } else if (v.voz === 'aro') {
          s += cabecaX(x, y, 'cab-aro');
        } else if (v.voz === 'caixa') {
          if (sim === 'g') {
            s += '<text class="paren-r" x="' + (x - 8) + '" y="' + (y + 4) + '">(</text>' +
                 cabecaCheia(x, y, 'cab-cheia ghost-r', 4.4) +
                 '<text class="paren-r" x="' + (x + 5) + '" y="' + (y + 4) + '">)</text>';
          } else {
            s += cabecaCheia(x, y, 'cab-cheia', 6);
            if (sim === 'X') s += acento(x, y - 12);
          }
        } else if (v.voz === 'bumbo') {
          s += cabecaCheia(x, y, 'cab-cheia', 6);
          if (sim === 'X') s += acento(x, Y_FEIXE_BAIXO + 4);
        }
      });
      s += '</g>';
    }

    // chimbal de pé (abaixo da pauta), quando houver
    if (vozPe) {
      for (let i = 0; i < N; i++) {
        if (!vozPe.passos[i]) continue;
        s += cabecaX(X(i), Y_PE, 'cab-x');
      }
      s += '<text class="rotulo-r" x="' + (inicio - 4) + '" y="' + (Y_PE + 4) + '" text-anchor="end">pé</text>';
    }

    alvo.setAttribute('viewBox', '0 0 ' + L + ' ' + A);
    alvo.innerHTML = s;
  }

  function acento(x, y) {
    return '<path class="acento-r" d="M ' + (x - 6) + ' ' + y + ' L ' + (x + 6) + ' ' + (y + 4) +
           ' L ' + (x - 6) + ' ' + (y + 8) + '"/>';
  }

  function desenhaFeixe(cols, X, dx, yFeixe, dir, passo, emit) {
    if (!cols.length) return;
    if (cols.length === 1) {
      const x1 = X(cols[0]) + dx;
      emit('<rect class="feixe-r" x="' + x1 + '" y="' + yFeixe + '" width="' +
           Math.min(15, passo * 0.34) + '" height="' + ALT_FEIXE + '"/>');
      return;
    }
    const x1 = X(cols[0]) + dx;
    const x2 = X(cols[cols.length - 1]) + dx;
    emit('<rect class="feixe-r" x="' + Math.min(x1, x2) + '" y="' + yFeixe + '" width="' +
         Math.abs(x2 - x1) + '" height="' + ALT_FEIXE + '"/>');
  }

  function destacar(i) {
    if (!svgEl || i === ultimo) return;
    if (ultimo >= 0) {
      const a = svgEl.querySelector('#passo-' + ultimo);
      const b = svgEl.querySelector('#nota-r-' + ultimo);
      if (a) a.classList.remove('ativa');
      if (b) b.classList.remove('ativa');
    }
    const a = svgEl.querySelector('#passo-' + i);
    const b = svgEl.querySelector('#nota-r-' + i);
    if (a) a.classList.add('ativa');
    if (b) b.classList.add('ativa');
    ultimo = i;
  }

  function limpar() {
    if (ultimo >= 0 && svgEl) {
      const a = svgEl.querySelector('#passo-' + ultimo);
      const b = svgEl.querySelector('#nota-r-' + ultimo);
      if (a) a.classList.remove('ativa');
      if (b) b.classList.remove('ativa');
    }
    ultimo = -1;
  }

  return { renderizar: renderizar, destacar: destacar, limpar: limpar };
})();
