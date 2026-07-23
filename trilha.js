/* =====================================================================
   trilha.js — currículo progressivo dos 40 rudimentos da PAS
   ---------------------------------------------------------------------
   12 módulos em ordem de dificuldade. Um módulo abre quando TODOS os
   rudimentos já implementados do módulo anterior atingem a meta
   (nota mínima naquele BPM alvo).
   Os rudimentos ainda não implementados (Fase 2) já estão posicionados:
   quando entrarem em dados.js, a trilha se preenche sozinha.
   ===================================================================== */

const Trilha = (function () {

  const modulos = [
    {
      n: 1, nome: 'Primeiros passos no pasto', nivel: 'Básico',
      resumo: 'As três pedras fundamentais. Tudo o mais nasce daqui.',
      metaNota: 7, metaBpm: 80,
      rudimentos: ['single-stroke-roll', 'double-stroke-open-roll', 'single-paradiddle']
    },
    {
      n: 2, nome: 'Zurro firme', nivel: 'Básico',
      resumo: 'Grupos curtos com acento: a mão aprende a mandar e a obedecer.',
      metaNota: 7, metaBpm: 90,
      rudimentos: ['single-stroke-four', 'five-stroke-roll', 'double-paradiddle']
    },
    {
      n: 3, nome: 'Rolls curtos', nivel: 'Intermediário',
      resumo: 'O rebote entra em cena. Aqui o pulso aprende a economizar.',
      metaNota: 7, metaBpm: 90,
      rudimentos: ['multiple-bounce-roll', 'six-stroke-roll', 'seven-stroke-roll', 'single-stroke-seven']
    },
    {
      n: 4, nome: 'Rolls longos I', nivel: 'Intermediário',
      resumo: 'Contar dobras sem perder o tempo. Paciência de jumento.',
      metaNota: 7, metaBpm: 100,
      rudimentos: ['nine-stroke-roll', 'ten-stroke-roll', 'eleven-stroke-roll', 'triple-stroke-roll']
    },
    {
      n: 5, nome: 'Rolls longos II', nivel: 'Avançado',
      resumo: 'Rolls compridos: resistência e regularidade sob pressão.',
      metaNota: 7, metaBpm: 100,
      rudimentos: ['thirteen-stroke-roll', 'fifteen-stroke-roll', 'seventeen-stroke-roll']
    },
    {
      n: 6, nome: 'Diddles avançados', nivel: 'Intermediário',
      resumo: 'Paradiddles longos: a troca de mão vira automática.',
      metaNota: 7, metaBpm: 100,
      rudimentos: ['triple-paradiddle', 'single-paradiddle-diddle']
    },
    {
      n: 7, nome: 'Flams I', nivel: 'Intermediário',
      resumo: 'Duas alturas de baqueta. Aqui começa a elegância.',
      metaNota: 7, metaBpm: 90,
      rudimentos: ['flam', 'flam-accent', 'flam-tap', 'flamacue']
    },
    {
      n: 8, nome: 'Flams II', nivel: 'Avançado',
      resumo: 'Flam misturado com diddle: coordenação fina.',
      metaNota: 7.5, metaBpm: 100,
      rudimentos: ['flam-paradiddle', 'single-flammed-mill', 'flam-paradiddle-diddle', 'pataflafla']
    },
    {
      n: 9, nome: 'Flams III', nivel: 'Avançado',
      resumo: 'Os flams que invertem a lógica da mão. Território de mestre.',
      metaNota: 8, metaBpm: 100,
      rudimentos: ['swiss-army-triplet', 'inverted-flam-tap', 'flam-drag']
    },
    {
      n: 10, nome: 'Drags I', nivel: 'Avançado',
      resumo: 'A apojatura dupla. O rufo mais difícil de fazer soar bonito.',
      metaNota: 7.5, metaBpm: 90,
      rudimentos: ['drag', 'single-drag-tap', 'double-drag-tap', 'lesson-25']
    },
    {
      n: 11, nome: 'Drags II', nivel: 'Avançado',
      resumo: 'Drag dentro do paradiddle. Poucos chegam aqui inteiros.',
      metaNota: 8, metaBpm: 100,
      rudimentos: ['single-dragadiddle', 'drag-paradiddle-1', 'drag-paradiddle-2']
    },
    {
      n: 12, nome: 'Ratamacues', nivel: 'Avançado',
      resumo: 'O fim da linha da PAS. Depois daqui, é repertório.',
      metaNota: 8, metaBpm: 100,
      rudimentos: ['single-ratamacue', 'double-ratamacue', 'triple-ratamacue']
    }
  ];

  /* Nomes dos 40 — os que ainda não têm partitura aparecem como "Fase 2" */
  const nomes = {
    'single-stroke-roll': 'Single Stroke Roll',
    'single-stroke-four': 'Single Stroke Four',
    'single-stroke-seven': 'Single Stroke Seven',
    'multiple-bounce-roll': 'Multiple Bounce Roll',
    'double-stroke-open-roll': 'Double Stroke Open Roll',
    'five-stroke-roll': 'Five Stroke Roll',
    'six-stroke-roll': 'Six Stroke Roll',
    'seven-stroke-roll': 'Seven Stroke Roll',
    'nine-stroke-roll': 'Nine Stroke Roll',
    'ten-stroke-roll': 'Ten Stroke Roll',
    'eleven-stroke-roll': 'Eleven Stroke Roll',
    'thirteen-stroke-roll': 'Thirteen Stroke Roll',
    'fifteen-stroke-roll': 'Fifteen Stroke Roll',
    'seventeen-stroke-roll': 'Seventeen Stroke Roll',
    'triple-stroke-roll': 'Triple Stroke Roll',
    'single-paradiddle': 'Single Paradiddle',
    'double-paradiddle': 'Double Paradiddle',
    'triple-paradiddle': 'Triple Paradiddle',
    'single-paradiddle-diddle': 'Single Paradiddle-Diddle',
    'flam': 'Flam',
    'flam-accent': 'Flam Accent',
    'flam-tap': 'Flam Tap',
    'flamacue': 'Flamacue',
    'flam-paradiddle': 'Flam Paradiddle',
    'single-flammed-mill': 'Single Flammed Mill',
    'flam-paradiddle-diddle': 'Flam Paradiddle-Diddle',
    'pataflafla': 'Pataflafla',
    'swiss-army-triplet': 'Swiss Army Triplet',
    'inverted-flam-tap': 'Inverted Flam Tap',
    'flam-drag': 'Flam Drag',
    'drag': 'Drag',
    'single-drag-tap': 'Single Drag Tap',
    'double-drag-tap': 'Double Drag Tap',
    'lesson-25': 'Lesson 25',
    'single-dragadiddle': 'Single Dragadiddle',
    'drag-paradiddle-1': 'Drag Paradiddle #1',
    'drag-paradiddle-2': 'Drag Paradiddle #2',
    'single-ratamacue': 'Single Ratamacue',
    'double-ratamacue': 'Double Ratamacue',
    'triple-ratamacue': 'Triple Ratamacue'
  };

  /* ---------- graduações ---------- */
  const graduacoes = [
    { id: 'potro',   nome: 'Potro Perdido',    min: 0,  descricao: 'Acabou de chegar ao pasto e ainda procura as próprias patas.' },
    { id: 'jegue',   nome: 'Jegue Arisco',     min: 3,  descricao: 'Já não foge do metrônomo, mas ainda dá coice de vez em quando.' },
    { id: 'carga',   nome: 'Jumento de Carga', min: 9,  descricao: 'Aguenta o trabalho pesado sem reclamar. O time confia em você.' },
    { id: 'mula',    nome: 'Mula de Elite',    min: 19, descricao: 'Precisão e resistência. Poucos chegam aqui.' },
    { id: 'jumestre',nome: 'Jumestre',         min: 33, descricao: 'Domina o pasto inteiro. Agora ensine alguém.' }
  ];

  function graduacaoPor(aprovados) {
    let atual = graduacoes[0];
    for (let i = 0; i < graduacoes.length; i++) {
      if (aprovados >= graduacoes[i].min) atual = graduacoes[i];
    }
    return atual;
  }

  function proximaGraduacao(aprovados) {
    for (let i = 0; i < graduacoes.length; i++) {
      if (aprovados < graduacoes[i].min) return graduacoes[i];
    }
    return null;
  }

  function nome(id) { return nomes[id] || id; }

  function implementado(id) {
    return typeof Dados !== 'undefined' && !!Dados.porId(id);
  }

  /* Um módulo está concluído quando todos os seus rudimentos JÁ
     IMPLEMENTADOS bateram a meta. Se nenhum estiver implementado,
     o módulo fica "aguardando conteúdo" e não trava a trilha. */
  function moduloConcluido(mod, registros) {
    const disponiveis = mod.rudimentos.filter(implementado);
    if (!disponiveis.length) return false;
    return disponiveis.every(function (id) {
      const r = registros[id];
      return r && r.melhorNota >= mod.metaNota && r.bpmDaMelhor >= mod.metaBpm;
    });
  }

  function estado(registros) {
    let liberado = true;
    return modulos.map(function (mod) {
      const disponiveis = mod.rudimentos.filter(implementado);
      const concluido = moduloConcluido(mod, registros);
      const info = {
        modulo: mod,
        liberado: liberado,
        concluido: concluido,
        semConteudo: disponiveis.length === 0,
        implementados: disponiveis.length,
        total: mod.rudimentos.length
      };
      // o próximo só abre se este foi concluído; módulo sem conteúdo
      // ainda não pode ser concluído, então a trilha para nele.
      if (liberado && !concluido) liberado = false;
      return info;
    });
  }

  function proximaLicao(registros) {
    const lista = estado(registros);
    for (let i = 0; i < lista.length; i++) {
      const info = lista[i];
      if (!info.liberado) break;
      if (info.concluido) continue;
      const pendente = info.modulo.rudimentos.filter(function (id) {
        if (!implementado(id)) return false;
        const r = registros[id];
        return !(r && r.melhorNota >= info.modulo.metaNota && r.bpmDaMelhor >= info.modulo.metaBpm);
      });
      if (pendente.length) return { moduloN: info.modulo.n, rudimentoId: pendente[0], meta: info.modulo };
      return { moduloN: info.modulo.n, rudimentoId: null, meta: info.modulo, aguardando: true };
    }
    return null;
  }

  function totalAprovados(registros) {
    let n = 0;
    Object.keys(registros).forEach(function (id) {
      if (registros[id] && registros[id].melhorNota >= 7) n++;
    });
    return n;
  }

  return {
    modulos: modulos, nomes: nomes, graduacoes: graduacoes,
    nome: nome, implementado: implementado, estado: estado,
    proximaLicao: proximaLicao, totalAprovados: totalAprovados,
    graduacaoPor: graduacaoPor, proximaGraduacao: proximaGraduacao
  };
})();
