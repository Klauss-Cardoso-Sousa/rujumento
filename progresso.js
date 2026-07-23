/* =====================================================================
   progresso.js — tudo o que o app lembra sobre você
   ---------------------------------------------------------------------
   Fica APENAS neste aparelho, em localStorage. Sem cadastro, sem login,
   sem servidor, sem envio de nada para lugar nenhum.
   ===================================================================== */

const Progresso = (function () {

  const CHAVE = 'rujumento-v1';

  const padrao = {
    versao: 1,
    nome: '',
    criadoEm: null,
    curtidas: [],            // números das frases curtidas (cada uma conta 1)
    ultimaPratica: null,     // 'AAAA-MM-DD'
    sequencia: 0,
    melhorSequencia: 0,
    favoritos: [],           // ids de rudimentos favoritados
    favoritosRitmo: [],      // ids de ritmos favoritados
    registrosRitmo: {},      // por ritmo: bpmMax, data
    acentos: {},             // acentos personalizados: id -> [índices acentuados]
    registros: {},           // por rudimento: melhorNota, bpmDaMelhor
    historico: [],           // últimas avaliações (máx. 200)
    mestre: 'jumestre',
    paleta: null,            // tema de cores escolhido entre os desbloqueados
    timbre: 'padrao',
    zurro: 'padrao',
    latenciaMs: null,        // calibração do modo microfone
    fonesConfirmados: false,
    zurrosDados: 0
  };

  let dados = null;

  function hoje() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  function diasEntre(a, b) {
    if (!a || !b) return null;
    const pa = a.split('-').map(Number), pb = b.split('-').map(Number);
    const da = Date.UTC(pa[0], pa[1] - 1, pa[2]);
    const db = Date.UTC(pb[0], pb[1] - 1, pb[2]);
    return Math.round((db - da) / 86400000);
  }

  function carregar() {
    let lido = null;
    try { lido = JSON.parse(localStorage.getItem(CHAVE)); } catch (e) { lido = null; }
    dados = Object.assign({}, padrao, lido || {});
    // garante tipos mesmo se o armazenamento vier corrompido
    if (!Array.isArray(dados.curtidas)) dados.curtidas = [];
    if (!Array.isArray(dados.historico)) dados.historico = [];
    if (!Array.isArray(dados.favoritos)) dados.favoritos = [];
    if (!Array.isArray(dados.favoritosRitmo)) dados.favoritosRitmo = [];
    if (!dados.registrosRitmo || typeof dados.registrosRitmo !== 'object') dados.registrosRitmo = {};
    if (!dados.acentos || typeof dados.acentos !== 'object') dados.acentos = {};
    if (!dados.registros || typeof dados.registros !== 'object') dados.registros = {};
    if (!dados.criadoEm) dados.criadoEm = hoje();
    return dados;
  }

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (e) {}
  }

  function obter() { return dados || carregar(); }

  function definir(campo, valor) { obter()[campo] = valor; salvar(); }

  /* ---------- primeira vez / nome ---------- */
  function primeiraVez() { return !obter().nome; }
  function definirNome(n) {
    const limpo = String(n || '').trim().slice(0, 24);
    definir('nome', limpo);
    return limpo;
  }

  /* ---------- sequência de dias (streak) ---------- */
  function registrarPratica() {
    const d = obter();
    const h = hoje();
    if (d.ultimaPratica === h) return { sequencia: d.sequencia, novoDia: false, quebrou: false };
    const dif = diasEntre(d.ultimaPratica, h);
    let quebrou = false;
    if (dif === 1) d.sequencia += 1;
    else { quebrou = d.sequencia > 1; d.sequencia = 1; }
    d.ultimaPratica = h;
    if (d.sequencia > d.melhorSequencia) d.melhorSequencia = d.sequencia;
    salvar();
    return { sequencia: d.sequencia, novoDia: true, quebrou: quebrou };
  }

  /* Só para exibir no check-in, sem marcar prática ainda */
  function sequenciaAtual() {
    const d = obter();
    if (!d.ultimaPratica) return 0;
    const dif = diasEntre(d.ultimaPratica, hoje());
    if (dif === 0) return d.sequencia;
    if (dif === 1) return d.sequencia;   // ainda dá tempo de manter hoje
    return 0;                            // sequência perdida
  }

  /* ---------- curtidas ---------- */
  function curtiu(n) { return obter().curtidas.indexOf(n) >= 0; }
  function alternarCurtida(n) {
    const d = obter();
    const i = d.curtidas.indexOf(n);
    if (i >= 0) d.curtidas.splice(i, 1); else d.curtidas.push(n);
    salvar();
    return d.curtidas.length;
  }
  function totalCurtidas() { return obter().curtidas.length; }

  /* ---------- favoritos ---------- */
  function ehFavorito(id) { return obter().favoritos.indexOf(id) >= 0; }
  function alternarFavorito(id) {
    const d = obter();
    const i = d.favoritos.indexOf(id);
    if (i >= 0) d.favoritos.splice(i, 1); else d.favoritos.push(id);
    salvar();
    return i < 0;   // true se virou favorito
  }
  function listaFavoritos() { return obter().favoritos.slice(); }

  /* ---------- acentos personalizados ---------- */
  function acentosDe(id) {
    const a = obter().acentos[id];
    return a ? a.slice() : null;
  }
  function salvarAcentos(id, indices) { obter().acentos[id] = indices.slice(); salvar(); }
  function limparAcentos(id) { delete obter().acentos[id]; salvar(); }

  /* ---------- ritmos: favoritos + registro de BPM ---------- */
  function ehFavoritoRitmo(id) { return obter().favoritosRitmo.indexOf(id) >= 0; }
  function alternarFavoritoRitmo(id) {
    const d = obter();
    const i = d.favoritosRitmo.indexOf(id);
    if (i >= 0) d.favoritosRitmo.splice(i, 1); else d.favoritosRitmo.push(id);
    salvar();
    return i < 0;
  }
  function listaFavoritosRitmo() { return obter().favoritosRitmo.slice(); }
  function registrarBpmRitmo(id, bpm) {
    const d = obter();
    const r = d.registrosRitmo[id] || { bpmMax: 0 };
    if (bpm > r.bpmMax) { r.bpmMax = bpm; r.data = hoje(); d.registrosRitmo[id] = r; salvar(); }
  }
  function registroRitmoDe(id) { return obter().registrosRitmo[id] || null; }

  /* ---------- notas ---------- */
  function registrarNota(rudimentoId, bpm, modo, resultado) {
    const d = obter();
    const reg = d.registros[rudimentoId] || { melhorNota: 0, bpmDaMelhor: 0, tentativas: 0 };
    reg.tentativas += 1;
    // conta como recorde se a nota for maior, ou igual com BPM maior
    if (resultado.nota > reg.melhorNota ||
        (resultado.nota === reg.melhorNota && bpm > reg.bpmDaMelhor)) {
      reg.melhorNota = resultado.nota;
      reg.bpmDaMelhor = bpm;
      reg.dataDaMelhor = hoje();
      reg.modoDaMelhor = modo;
    }
    d.registros[rudimentoId] = reg;

    d.historico.unshift({
      data: hoje(), rudimento: rudimentoId, bpm: bpm, modo: modo,
      nota: resultado.nota, adiantadas: resultado.adiantadas,
      atrasadas: resultado.atrasadas, mediaMs: resultado.mediaMs
    });
    if (d.historico.length > 200) d.historico.length = 200;
    salvar();
    return reg;
  }

  function registroDe(rudimentoId) { return obter().registros[rudimentoId] || null; }
  function historicoDe(rudimentoId) {
    return obter().historico.filter(function (h) { return h.rudimento === rudimentoId; });
  }

  /* ---------- desbloqueios ---------- */
  function desbloqueado(idRecompensa) {
    const r = Recompensas.porId(idRecompensa);
    return !!r && totalCurtidas() >= r.curtidas;
  }
  function mestreDesbloqueado(idMestre) {
    if (idMestre === 'jumestre') return true;
    return desbloqueado('mestre-' + idMestre);
  }

  function apagarTudo() {
    try { localStorage.removeItem(CHAVE); } catch (e) {}
    dados = null;
    return carregar();
  }

  return {
    carregar: carregar, salvar: salvar, obter: obter, definir: definir,
    hoje: hoje,
    primeiraVez: primeiraVez, definirNome: definirNome,
    registrarPratica: registrarPratica, sequenciaAtual: sequenciaAtual,
    curtiu: curtiu, alternarCurtida: alternarCurtida, totalCurtidas: totalCurtidas,
    ehFavorito: ehFavorito, alternarFavorito: alternarFavorito, listaFavoritos: listaFavoritos,
    acentosDe: acentosDe, salvarAcentos: salvarAcentos, limparAcentos: limparAcentos,
    ehFavoritoRitmo: ehFavoritoRitmo, alternarFavoritoRitmo: alternarFavoritoRitmo,
    listaFavoritosRitmo: listaFavoritosRitmo,
    registrarBpmRitmo: registrarBpmRitmo, registroRitmoDe: registroRitmoDe,
    registrarNota: registrarNota, registroDe: registroDe, historicoDe: historicoDe,
    desbloqueado: desbloqueado, mestreDesbloqueado: mestreDesbloqueado,
    apagarTudo: apagarTudo
  };
})();
