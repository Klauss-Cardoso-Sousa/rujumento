/* =====================================================================
   motor.js — som sintetizado + agendador rítmico de precisão
   ---------------------------------------------------------------------
   Nenhum arquivo de áudio: todos os sons são criados na hora pela
   Web Audio API. O agendador ("lookahead scheduler") olha um pouco à
   frente no tempo e marca cada nota com hora exata na placa de som,
   por isso o ritmo não engasga quando a tela está animando.
   ===================================================================== */

const Motor = (function () {

  /* ---------- Estado global do metrônomo ---------- */
  const estado = {
    bpm: 100,
    compasso: '4/4',
    subdivisao: 1,          // quantos cliques por tempo
    acentoPrimeiro: true,

    trainerAtivo: false,
    trainerIncremento: 5,
    trainerCompassos: 4,
    trainerAlvo: 160,

    gapAtivo: false,
    gapSom: 4,
    gapSilencio: 4,

    somMetronomo: true,
    somRudimento: true,
    volumeMetronomo: 0.75,  // 0 a 1 — canal do clique
    volumeCaixa: 0.85,      // 0 a 1 — canal da caixa (rudimento)
    timbre: 'padrao',       // timbre de caixa (muda com o mestre ativo)
    gravarAlvos: false,     // liga o registro de tempos para a avaliação

    rudimento: null,        // objeto vindo de dados.js (ou null)
    ritmo: null,            // objeto vindo de ritmos.js (ou null)
    tocando: false,

    // leitura só para a interface
    audivel: true,
    compassoAtual: 0
  };

  /* Quantos tempos (cliques) cada compasso tem.
     Em 6/8 o pulso é a semínima pontuada: 2 pulsos por compasso. */
  const TEMPOS_POR_COMPASSO = { '4/4': 4, '3/4': 3, '2/4': 2, '6/8': 2 };

  /* Subdivisões disponíveis por fórmula de compasso */
  const SUBDIVISOES = {
    '4/4': [[1, 'Semínima'], [2, 'Colcheia'], [4, 'Semicolcheia'], [3, 'Tercina']],
    '3/4': [[1, 'Semínima'], [2, 'Colcheia'], [4, 'Semicolcheia'], [3, 'Tercina']],
    '2/4': [[1, 'Semínima'], [2, 'Colcheia'], [4, 'Semicolcheia'], [3, 'Tercina']],
    '6/8': [[1, 'Pulso (2 por compasso)'], [3, 'Colcheia'], [6, 'Semicolcheia']]
  };

  function temposPorCompasso() { return TEMPOS_POR_COMPASSO[estado.compasso]; }

  /* ---------- Áudio ---------- */
  let ctx = null;
  let mestre = null;
  let canalMetronomo = null;   // volume só do clique
  let canalCaixa = null;       // volume só da caixa
  let bufferRuido = null;

  function iniciarAudio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      mestre = ctx.createGain();
      mestre.gain.value = 0.9;
      mestre.connect(ctx.destination);

      // Dois canais separados: mexer em um não mexe no outro.
      canalMetronomo = ctx.createGain();
      canalMetronomo.gain.value = estado.volumeMetronomo;
      canalMetronomo.connect(mestre);

      canalCaixa = ctx.createGain();
      canalCaixa.gain.value = estado.volumeCaixa;
      canalCaixa.connect(mestre);

      // ruído branco de 1 segundo, reaproveitado em todos os golpes de caixa
      const n = ctx.sampleRate;
      bufferRuido = ctx.createBuffer(1, n, n);
      const dados = bufferRuido.getChannelData(0);
      for (let i = 0; i < n; i++) dados[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
  }

  /* Clique do metrônomo — onda quadrada bem curta.
     tipo: 'acento' (1º tempo), 'tempo' (demais tempos), 'sub' (subdivisão) */
  function clique(t, tipo) {
    const cfg = {
      acento: { f: 1800, v: 0.50 },
      tempo:  { f: 1200, v: 0.34 },
      sub:    { f: 880,  v: 0.16 }
    }[tipo];

    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(cfg.f, t);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(cfg.v, t + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

    osc.connect(g).connect(canalMetronomo);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  /* Ajusta o volume de um canal sem estourar nem cortar o som que já
     está soando (a rampa curta evita o "clique" de mudança brusca). */
  function definirVolume(qual, v) {
    const valor = Math.max(0, Math.min(1, Number(v)));
    if (qual === 'metronomo') {
      estado.volumeMetronomo = valor;
      if (canalMetronomo) canalMetronomo.gain.setTargetAtTime(valor, ctx.currentTime, 0.01);
    } else {
      estado.volumeCaixa = valor;
      if (canalCaixa) canalCaixa.gain.setTargetAtTime(valor, ctx.currentTime, 0.01);
    }
  }

  /* ---------- timbres de caixa (cada mestre tem o seu) ---------- */
  const TIMBRES = {
    padrao: { hp: 500, corte: 1500, corteAc: 3700, corpoA: 230, corpoB: 130, corpoVol: 0.30, dur: 0.07, durAc: 0.06, ruido: 0.55 },
    metal:  { hp: 700, corte: 2400, corteAc: 5600, corpoA: 320, corpoB: 190, corpoVol: 0.22, dur: 0.10, durAc: 0.09, ruido: 0.62 },
    samba:  { hp: 800, corte: 2100, corteAc: 5000, corpoA: 400, corpoB: 280, corpoVol: 0.18, dur: 0.045, durAc: 0.035, ruido: 0.58 },
    funk:   { hp: 350, corte: 1200, corteAc: 3100, corpoA: 190, corpoB: 105, corpoVol: 0.42, dur: 0.09, durAc: 0.08, ruido: 0.50 },
    jazz:   { hp: 400, corte: 1300, corteAc: 3100, corpoA: 210, corpoB: 140, corpoVol: 0.26, dur: 0.11, durAc: 0.10, ruido: 0.40 }
  };

  /* Caixa (pad de treino). intensidade 0..1:
     acento = forte e brilhante, nota normal = mais seca,
     grace note (flam/drag) = bem fraca. */
  function caixa(t, intensidade, nomeTimbre) {
    // proteção: uma apojatura muito adiantada pode cair antes do tempo zero
    // do áudio (ex.: 1º golpe de um drag aberto); nunca agendar no passado.
    if (t < ctx.currentTime) t = ctx.currentTime;
    const T = TIMBRES[nomeTimbre || estado.timbre] || TIMBRES.padrao;
    const dur = T.dur + T.durAc * intensidade;

    // esteira / pele — ruído filtrado
    const src = ctx.createBufferSource();
    src.buffer = bufferRuido;
    src.playbackRate.value = 1 + 0.3 * intensidade;

    const passaAlta = ctx.createBiquadFilter();
    passaAlta.type = 'highpass';
    passaAlta.frequency.value = T.hp;

    const banda = ctx.createBiquadFilter();
    banda.type = 'bandpass';
    banda.frequency.value = T.corte + (T.corteAc - T.corte) * intensidade;
    banda.Q.value = 0.6;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.02, T.ruido * intensidade), t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    src.connect(passaAlta).connect(banda).connect(g).connect(canalCaixa);
    src.start(t, Math.random() * 0.4);
    src.stop(t + dur + 0.02);

    // corpo do tambor — batidinha grave que dá "peso" ao golpe
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(T.corpoA, t);
    osc.frequency.exponentialRampToValueAtTime(T.corpoB, t + 0.05);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.exponentialRampToValueAtTime(Math.max(0.01, T.corpoVol * intensidade), t + 0.002);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

    osc.connect(g2).connect(canalCaixa);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  /* ================== VOZES DO KIT (para os ritmos) ==================
     Bumbo, chimbal (fechado/aberto), prato (ride), aro (cross-stick).
     A caixa reaproveita a função caixa() acima. Tudo sai pelo canal do
     instrumento (mesma barra de "Volume da caixa"). Nenhum arquivo de áudio. */
  function bumbo(t, forte) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(forte ? 135 : 115, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.09);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(forte ? 1.0 : 0.72, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(g).connect(canalCaixa);
    osc.start(t); osc.stop(t + 0.24);

    const cl = ctx.createBufferSource(); cl.buffer = bufferRuido;
    const clf = ctx.createBiquadFilter(); clf.type = 'highpass'; clf.frequency.value = 1600;
    const clg = ctx.createGain();
    clg.gain.setValueAtTime(0.45, t);
    clg.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
    cl.connect(clf).connect(clg).connect(canalCaixa);
    cl.start(t, Math.random() * 0.3); cl.stop(t + 0.03);
  }

  function chimbal(t, aberto, forte) {
    const dur = aberto ? 0.30 : 0.045;
    const src = ctx.createBufferSource(); src.buffer = bufferRuido;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 10500; bp.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(forte ? 0.42 : 0.26, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(hp).connect(bp).connect(g).connect(canalCaixa);
    src.start(t, Math.random() * 0.3); src.stop(t + dur + 0.02);
  }

  function prato(t, forte) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(forte ? 0.26 : 0.17, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (forte ? 0.6 : 0.42));
    g.connect(canalCaixa);
    const freqs = [523, 785, 1046, 1567, 2093];
    freqs.forEach(function (f, i) {
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.value = f * (1 + i * 0.013);
      const og = ctx.createGain(); og.gain.value = 0.13 / (i + 1);
      o.connect(og).connect(g);
      o.start(t); o.stop(t + 0.7);
    });
    const src = ctx.createBufferSource(); src.buffer = bufferRuido;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6500;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.12, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    src.connect(hp).connect(ng).connect(g);
    src.start(t, Math.random() * 0.2); src.stop(t + 0.16);
  }

  function aro(t) {
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(880, t);
    o.frequency.exponentialRampToValueAtTime(400, t + 0.02);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    o.connect(g).connect(canalCaixa);
    o.start(t); o.stop(t + 0.05);

    const src = ctx.createBufferSource(); src.buffer = bufferRuido;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 1;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.3, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
    src.connect(bp).connect(ng).connect(canalCaixa);
    src.start(t, Math.random() * 0.3); src.stop(t + 0.03);
  }

  /* Toca o símbolo de uma voz num instante t. */
  function kitVoz(t, voz, simbolo) {
    if (!simbolo) return;
    const forte = simbolo === 'X';
    if (voz === 'bumbo') bumbo(t, forte);
    else if (voz === 'caixa') caixa(t, simbolo === 'g' ? INTENSIDADE.grace : (forte ? INTENSIDADE.acento : INTENSIDADE.normal));
    else if (voz === 'chimbal') chimbal(t, simbolo === 'o', forte);
    else if (voz === 'prato') prato(t, forte);
    else if (voz === 'aro') aro(t);
  }

  /* ================== ZURRO DE JUMENTO (easter egg) ==================
     Modela o "i-ÓÓ" (hee-haw) real do jumento:
       - fase EE  ("iiii"): inspiração — sobe de tom, esganiçada, fraca e tensa;
       - fase HAW ("óó-nc"): expiração — o ronco alto e grave que desce de tom,
         cheio de aspereza nasal.
     A aspereza vem de dois dente-de-serra desafinados + distorção +
     modulação rápida de amplitude (o "ronco"). Tudo sintetizado, sem
     nenhum arquivo de áudio. Caricato de propósito. */
  const ZURROS = {
    padrao:     { ciclos: 3, fBaixo: 190, fAlto: 430, fFim: 120, durEE: 0.16, durHAW: 0.30, dist: 26, buzz: 38, buzzProf: 0.80 },
    grave:      { ciclos: 2, fBaixo: 130, fAlto: 300, fFim: 82,  durEE: 0.22, durHAW: 0.44, dist: 32, buzz: 30, buzzProf: 0.85 },
    agudo:      { ciclos: 4, fBaixo: 260, fAlto: 620, fFim: 175, durEE: 0.11, durHAW: 0.20, dist: 20, buzz: 46, buzzProf: 0.70 },
    operistico: { ciclos: 3, fBaixo: 190, fAlto: 500, fFim: 110, durEE: 0.18, durHAW: 0.34, dist: 27, buzz: 38, buzzProf: 0.82, finalLongo: true },
    trovao:     { ciclos: 2, fBaixo: 100, fAlto: 240, fFim: 62,  durEE: 0.24, durHAW: 0.52, dist: 40, buzz: 26, buzzProf: 0.90, finalLongo: true },
    raro:       { ciclos: 4, fBaixo: 175, fAlto: 540, fFim: 95,  durEE: 0.17, durHAW: 0.34, dist: 30, buzz: 40, buzzProf: 0.85, finalLongo: true }
  };

  let curvaCache = {};
  function curvaDistorcao(k) {
    if (curvaCache[k]) return curvaCache[k];
    const n = 1024, c = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      c[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
    }
    curvaCache[k] = c;
    return c;
  }

  function cicloZurro(t, durEE, durHAW, c, destino) {
    const dur = durEE + durHAW;

    // dois dente-de-serra levemente desafinados = corpo áspero e encorpado
    const osc1 = ctx.createOscillator(); osc1.type = 'sawtooth';
    const osc2 = ctx.createOscillator(); osc2.type = 'sawtooth';
    [osc1, osc2].forEach(function (o, k) {
      const det = k ? 1.012 : 1;                                    // desafinação
      o.frequency.setValueAtTime(c.fBaixo * det, t);
      o.frequency.exponentialRampToValueAtTime(c.fAlto * det, t + durEE); // "iiii" sobe
      o.frequency.exponentialRampToValueAtTime(c.fFim * det, t + dur);    // "óó" desce
    });

    // distorção: engrossa e torna rouco
    const forma = ctx.createWaveShaper();
    forma.curve = curvaDistorcao(c.dist);
    forma.oversample = '4x';

    // ressonâncias nasais da garganta do jumento
    const nasal = ctx.createBiquadFilter();
    nasal.type = 'bandpass'; nasal.frequency.value = 850; nasal.Q.value = 1.1;
    const pico = ctx.createBiquadFilter();
    pico.type = 'peaking'; pico.frequency.value = 1700; pico.Q.value = 1.4; pico.gain.value = 8;

    // rasp: modulação de amplitude rápida (o "ronco" característico).
    // Vai de (1 - buzzProf) até 1, sem passar por valores negativos.
    const buzz = ctx.createGain();
    buzz.gain.value = 1 - c.buzzProf / 2;
    const lfo = ctx.createOscillator();
    lfo.type = 'triangle';
    lfo.frequency.setValueAtTime(c.buzz * 0.7, t);                 // ee ronca devagar
    lfo.frequency.linearRampToValueAtTime(c.buzz, t + durEE);      // haw acelera o ronco
    const lfoProf = ctx.createGain();
    lfoProf.gain.value = c.buzzProf / 2;
    lfo.connect(lfoProf); lfoProf.connect(buzz.gain);
    lfo.start(t); lfo.stop(t + dur + 0.05);

    // envelope: "iiii" fraco e tenso, "óó-nc" estoura e decai
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.22, t + 0.05);              // ee entra fraco
    env.gain.linearRampToValueAtTime(0.26, t + durEE * 0.9);            // ee estica, tenso
    env.gain.exponentialRampToValueAtTime(0.85, t + durEE + 0.04);     // HAW estoura
    env.gain.exponentialRampToValueAtTime(0.34, t + durEE + durHAW * 0.55);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);            // decai

    osc1.connect(forma); osc2.connect(forma);
    forma.connect(nasal).connect(pico).connect(buzz).connect(env).connect(destino);
    osc1.start(t); osc2.start(t);
    osc1.stop(t + dur + 0.05); osc2.stop(t + dur + 0.05);

    // sopro pelas narinas: inspira agudo no começo, bufa no fim
    [t, t + durEE].forEach(function (tt, k) {
      const ar = ctx.createBufferSource();
      ar.buffer = bufferRuido;
      const arF = ctx.createBiquadFilter();
      arF.type = 'bandpass'; arF.frequency.value = k ? 1400 : 2200; arF.Q.value = 0.7;
      const arG = ctx.createGain();
      arG.gain.setValueAtTime(0.0001, tt);
      arG.gain.exponentialRampToValueAtTime(k ? 0.10 : 0.06, tt + 0.03);
      arG.gain.exponentialRampToValueAtTime(0.0001, tt + 0.12);
      ar.connect(arF).connect(arG).connect(destino);
      ar.start(tt, Math.random() * 0.4);
      ar.stop(tt + 0.16);
    });
  }

  function zurro(tipo) {
    iniciarAudio();
    const c = ZURROS[tipo] || ZURROS.padrao;
    const saida = ctx.createGain();
    saida.gain.value = 0.55;
    saida.connect(mestre);

    let t = ctx.currentTime + 0.03;
    for (let i = 0; i < c.ciclos; i++) {
      const ultimo = (i === c.ciclos - 1);
      const durHAW = (ultimo && c.finalLongo) ? c.durHAW * 1.9 : c.durHAW;
      cicloZurro(t, c.durEE, durHAW, c, saida);
      t += c.durEE + durHAW + 0.04;
    }
    return t - ctx.currentTime;   // duração total, em segundos
  }

  const INTENSIDADE = { acento: 1.0, normal: 0.52, grace: 0.20 };
  const ADIANTAMENTO_GRACE = 0.028; // ~28 ms antes da nota principal (flam/drag)

  /* Buzz (multiple bounce): vários toques fracos e rápidos que se apagam,
     imitando a baqueta quicando. Preenche ~85% da duração da nota. */
  function tocarBuzz(t, dur) {
    const janela = Math.max(0.05, dur * 0.85);
    const n = 6;
    for (let i = 0; i < n; i++) {
      const frac = i / n;
      caixa(t + janela * frac, 0.16 * (1 - frac * 0.6));
    }
  }

  /* ---------- Agendador ---------- */
  const JANELA = 0.12;        // segundos que olhamos à frente
  const INTERVALO_MS = 25;    // de quanto em quanto tempo conferimos

  let proximoTempoEm = 0;     // hora (no relógio do áudio) do próximo tempo
  let indiceTempo = 0;        // contador global de tempos desde o play
  let compassosDesdeAumento = 0;
  let temporizador = null;
  let fila = [];              // eventos visuais aguardando a hora certa
  let alvos = [];             // horas exatas em que uma batida era esperada

  function segundosPorTempo() {
    // Em 6/8 o pulso é a semínima pontuada: dura o dobro e meio de uma colcheia.
    // Mantemos o BPM referindo-se ao pulso mostrado, então é simplesmente 60/bpm.
    return 60 / estado.bpm;
  }

  function agendarTempo(i, t) {
    const posNoCompasso = i % temposPorCompasso();
    const spb = segundosPorTempo();

    // Gap click: alguns compassos soam, outros ficam mudos.
    let audivel = true;
    if (estado.gapAtivo) {
      const ciclo = estado.gapSom + estado.gapSilencio;
      audivel = (estado.compassoAtual % ciclo) < estado.gapSom;
    }

    /* --- cliques do metrônomo --- */
    for (let s = 0; s < estado.subdivisao; s++) {
      const tn = t + (s * spb) / estado.subdivisao;
      let tipo = 'sub';
      if (s === 0) tipo = (posNoCompasso === 0 && estado.acentoPrimeiro) ? 'acento' : 'tempo';
      if (estado.somMetronomo && audivel) clique(tn, tipo);
      // sem rudimento aberto, a régua da avaliação é o próprio clique
      if (estado.gravarAlvos && !estado.rudimento) alvos.push(tn);
    }

    /* --- pulso visual --- */
    fila.push({ tipo: 'pulso', tempo: t, dado: posNoCompasso, audivel: audivel });

    /* --- notas do rudimento --- */
    const rud = estado.rudimento;
    if (rud) {
      const P = rud.notasPorTempo;
      const N = rud.notas.length;
      for (let k = 0; k < P; k++) {
        const idx = ((i * P + k) % N + N) % N;
        const nota = rud.notas[idx];
        const tn = t + (k * spb) / P;
        fila.push({ tipo: 'nota', tempo: tn, dado: idx });
        if (!nota.mao) continue;                       // pausa
        // a régua da avaliação é cada golpe principal (a apojatura não conta)
        if (estado.gravarAlvos) alvos.push(tn);
        if (estado.somRudimento && audivel) {
          const graces = nota.graces || [];
          // No dragadiddle a "apojatura" é, na prática, uma dupla aberta da
          // própria mão: soa mais forte e um pouco mais espaçada.
          const forte = rud.dragAberto;
          const volGrace = forte ? INTENSIDADE.normal * 0.8 : INTENSIDADE.grace;
          const espacGrace = forte ? ADIANTAMENTO_GRACE * 2.0 : ADIANTAMENTO_GRACE;
          for (let gi = 0; gi < graces.length; gi++) {
            caixa(tn - espacGrace * (graces.length - gi), volGrace);
          }
          if (nota.buzz) tocarBuzz(tn, spb / P);
          else caixa(tn, nota.acento ? INTENSIDADE.acento : INTENSIDADE.normal);
        }
      }
    }

    /* --- vozes do ritmo (groove completo) --- */
    const rit = estado.ritmo;
    if (rit) {
      const P = rit.passosPorTempo;
      const N = rit.totalPassos;
      for (let k = 0; k < P; k++) {
        const idx = ((i * P + k) % N + N) % N;
        const tn = t + (k * spb) / P;
        fila.push({ tipo: 'passo', tempo: tn, dado: idx });
        if (estado.somRudimento && audivel) {
          for (let v = 0; v < rit.vozesLista.length; v++) {
            kitVoz(tn, rit.vozesLista[v].voz, rit.vozesLista[v].passos[idx]);
          }
        }
      }
    }

    estado.audivel = audivel;
  }

  function avancar() {
    proximoTempoEm += segundosPorTempo();
    indiceTempo++;

    if (indiceTempo % temposPorCompasso() === 0) {
      estado.compassoAtual++;
      compassosDesdeAumento++;

      if (estado.trainerAtivo && compassosDesdeAumento >= estado.trainerCompassos) {
        compassosDesdeAumento = 0;
        if (estado.bpm < estado.trainerAlvo) {
          estado.bpm = Math.min(estado.trainerAlvo, estado.bpm + estado.trainerIncremento);
        }
      }
    }
  }

  function ciclo() {
    while (proximoTempoEm < ctx.currentTime + JANELA) {
      agendarTempo(indiceTempo, proximoTempoEm);
      avancar();
    }
    // Se a aba ficar escondida a animação para de consumir a fila:
    // não deixamos ela crescer sem fim.
    if (fila.length > 400) fila = fila.slice(-200);
    if (alvos.length > 4000) alvos = alvos.slice(-2000);
  }

  function tocar() {
    iniciarAudio();
    if (estado.tocando) return;
    estado.tocando = true;
    indiceTempo = 0;
    estado.compassoAtual = 0;
    compassosDesdeAumento = 0;
    fila = [];
    proximoTempoEm = ctx.currentTime + 0.16;   // folga p/ apojaturas adiantadas
    temporizador = setInterval(ciclo, INTERVALO_MS);
    ciclo();
  }

  function parar() {
    estado.tocando = false;
    clearInterval(temporizador);
    temporizador = null;
    fila = [];
    estado.audivel = true;
  }

  function alternar() { estado.tocando ? parar() : tocar(); }

  /* Chamado a cada quadro pela interface: devolve os eventos cuja hora
     já chegou, para o cursor da partitura ficar colado no som. */
  function eventosVencidos() {
    if (!ctx) return [];
    const agora = ctx.currentTime;
    const saida = [];
    while (fila.length && fila[0].tempo <= agora) saida.push(fila.shift());
    return saida;
  }

  /* Tap tempo */
  let toques = [];
  function tap() {
    const agora = performance.now();
    if (toques.length && agora - toques[toques.length - 1] > 2000) toques = [];
    toques.push(agora);
    if (toques.length > 5) toques.shift();
    if (toques.length < 2) return null;
    let soma = 0;
    for (let i = 1; i < toques.length; i++) soma += toques[i] - toques[i - 1];
    const media = soma / (toques.length - 1);
    const bpm = Math.round(60000 / media);
    if (bpm >= 30 && bpm <= 300) { estado.bpm = bpm; return bpm; }
    return null;
  }

  function definirBpm(v) {
    estado.bpm = Math.max(30, Math.min(300, Math.round(v)));
  }

  /* ---------- apoio à avaliação ---------- */
  function iniciarAlvos() { alvos = []; estado.gravarAlvos = true; }
  function pararAlvos() { estado.gravarAlvos = false; }
  function lerAlvos() { return alvos.slice(); }
  function agora() { iniciarAudio(); return ctx.currentTime; }
  function contexto() { iniciarAudio(); return ctx; }

  /* Intervalo esperado entre duas batidas seguidas, em segundos.
     É o que define a janela de tolerância da nota. */
  function intervaloAlvo() {
    const spb = 60 / estado.bpm;
    if (estado.rudimento) return spb / estado.rudimento.notasPorTempo;
    return spb / estado.subdivisao;
  }

  return {
    estado, SUBDIVISOES, temposPorCompasso, TIMBRES,
    iniciarAudio, tocar, parar, alternar, eventosVencidos, tap, definirBpm, definirVolume,
    zurro: zurro,
    iniciarAlvos, pararAlvos, lerAlvos, agora, contexto, intervaloAlvo,
    caixa: function (intensidade, timbre) { iniciarAudio(); caixa(ctx.currentTime + 0.01, intensidade, timbre); }
  };
})();
