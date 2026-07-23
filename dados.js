/* =====================================================================
   dados.js — os rudimentos, em formato declarativo
   ---------------------------------------------------------------------
   Cada rudimento é escrito como um texto simples com o sticking:
     R      = golpe com a mão direita
     L      = golpe com a mão esquerda
     >      = acento nessa nota            (ex.: "R>")
     lR     = flam  — uma apojatura (esquerda) antes do golpe (direita)
     llR    = drag  — duas apojaturas (esquerda) antes do golpe (direita)
     Rz     = buzz  — golpe que deixa a baqueta quicar (rolo de "zzz")
     -      = pausa
   "notasPorTempo" diz quantas notas cabem em um tempo do metrônomo.
   Para acrescentar um rudimento novo, basta copiar um bloco e trocar o texto.
   ===================================================================== */

const Dados = (function () {

  function lerNotas(texto) {
    return texto.trim().split(/\s+/).map(function (tok) {
      const nota = { mao: null, acento: false, graces: [], buzz: false };
      let t = tok;
      if (t.indexOf('>') >= 0) { nota.acento = true; t = t.replace('>', ''); }
      if (/[RL]z$/.test(t)) { nota.buzz = true; t = t.replace(/z$/, ''); }
      const m = t.match(/^([rl]*)([RL-])$/);
      if (!m) throw new Error('Sticking inválido: ' + tok);
      if (m[1]) nota.graces = m[1].toUpperCase().split('');
      if (m[2] !== '-') nota.mao = m[2];
      return nota;
    });
  }

  /* Quantas barras de ligação (feixes) as notas levam no desenho */
  function feixes(compasso, notasPorTempo) {
    const tabela = (compasso === '6/8')
      ? { 1: 0, 2: 1, 3: 1, 6: 2 }
      : { 1: 0, 2: 1, 3: 1, 4: 2, 6: 2, 8: 3 };
    const v = tabela[notasPorTempo];
    return (v === undefined) ? 1 : v;
  }

  const brutos = [

    /* ============ ROLL RUDIMENTS ============ */
    {
      id: 'single-stroke-roll', nome: 'Single Stroke Roll', numeroPas: 1,
      categoria: 'Roll', nivel: 'Básico', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R L R L  R L R L  R L R L  R L R L',
      descricao: 'Golpes simples alternando as mãos, sem acentos. É a base de tudo: ' +
                 'procure som e altura de baqueta idênticos nas duas mãos.'
    },
    {
      id: 'single-stroke-four', nome: 'Single Stroke Four', numeroPas: 2,
      categoria: 'Roll', nivel: 'Intermediário', compasso: '4/4', notasPorTempo: 3,
      sticking: 'R L R L> - -  L R L R> - -',
      descricao: 'Quatro golpes simples em tercina levando a um acento que cai no tempo ' +
                 '(no 2º e no 4º tempo). A cada grupo troca a mão que lidera.'
    },
    {
      id: 'single-stroke-seven', nome: 'Single Stroke Seven', numeroPas: 3,
      categoria: 'Roll', nivel: 'Intermediário', compasso: '3/4', notasPorTempo: 3,
      sticking: 'R L R  L R L  R> - -  L R L  R L R  L> - -',
      descricao: 'Seis golpes simples em duas tercinas e o sétimo acentuado caindo no tempo ' +
                 '(no 3º tempo). A cada grupo troca a mão que lidera.'
    },
    {
      id: 'multiple-bounce-roll', nome: 'Multiple Bounce Roll', numeroPas: 4,
      categoria: 'Roll', nivel: 'Intermediário', compasso: '4/4', notasPorTempo: 4,
      sticking: 'Rz Lz Rz Lz  Rz Lz Rz Lz',
      descricao: 'O "rolo fechado" (buzz): cada golpe deixa a baqueta quicar várias vezes. ' +
                 'O objetivo é um chiado liso e uniforme, sem grão nem buracos.'
    },
    {
      id: 'triple-stroke-roll', nome: 'Triple Stroke Roll', numeroPas: 5,
      categoria: 'Roll', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 6,
      sticking: 'R R R  L L L  R R R  L L L  R R R  L L L  R R R  L L L',
      descricao: 'Três golpes por mão. Os três precisam soar iguais em volume — é o que separa ' +
                 'o triple stroke limpo do "tropeço".'
    },
    {
      id: 'double-stroke-open-roll', nome: 'Double Stroke Open Roll', numeroPas: 6,
      categoria: 'Roll', nivel: 'Básico', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R R L L  R R L L  R R L L  R R L L',
      descricao: 'Dois golpes por mão. Em andamento lento os dois golpes são tocados (open roll); ' +
                 'acelerando, o segundo aproveita o rebote. Os dois precisam soar iguais.'
    },
    {
      id: 'five-stroke-roll', nome: 'Five Stroke Roll', numeroPas: 7,
      categoria: 'Roll', nivel: 'Básico', compasso: '6/8', notasPorTempo: 3,
      sticking: 'R R L L  R>  -   L L R R  L>  -',
      descricao: 'Duas duplas seguidas de um golpe acentuado — cinco golpes ao todo. ' +
                 'A pausa dá tempo de preparar a mão para a repetição invertida.'
    },
    {
      id: 'six-stroke-roll', nome: 'Six Stroke Roll', numeroPas: 8,
      categoria: 'Roll', nivel: 'Intermediário', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R> - L L R R L> -  L> - R R L L R> -',
      descricao: 'Um simples acentuado (colcheia), duas duplas em semicolcheias e outro simples ' +
                 'acentuado (colcheia): R L L R R L. Os acentos caem nas colcheias; as duplas ' +
                 'preenchem entre elas.'
    },
    {
      id: 'seven-stroke-roll', nome: 'Seven Stroke Roll', numeroPas: 9,
      categoria: 'Roll', nivel: 'Intermediário', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R R L L R R L> -  L L R R L L R> -',
      descricao: 'Três duplas e um golpe simples acentuado no fim.'
    },
    {
      id: 'nine-stroke-roll', nome: 'Nine Stroke Roll', numeroPas: 10,
      categoria: 'Roll', nivel: 'Intermediário', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R R L L R R L L R> - - -  L L R R L L R R L> - - -',
      descricao: 'Quatro duplas e um golpe simples acentuado no fim.'
    },
    {
      id: 'ten-stroke-roll', nome: 'Ten Stroke Roll', numeroPas: 11,
      categoria: 'Roll', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R R L L R R L L R> L> - -  L L R R L L R R L> R> - -',
      descricao: 'Quatro duplas seguidas de dois golpes simples acentuados.'
    },
    {
      id: 'eleven-stroke-roll', nome: 'Eleven Stroke Roll', numeroPas: 12,
      categoria: 'Roll', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R R L L R R L L R R L> -  L L R R L L R R L L R> -',
      descricao: 'Cinco duplas e um golpe simples acentuado no fim.'
    },
    {
      id: 'thirteen-stroke-roll', nome: 'Thirteen Stroke Roll', numeroPas: 13,
      categoria: 'Roll', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R R L L R R L L R R L L R> - - -  L L R R L L R R L L R R L> - - -',
      descricao: 'Seis duplas e um golpe simples acentuado no fim.'
    },
    {
      id: 'fifteen-stroke-roll', nome: 'Fifteen Stroke Roll', numeroPas: 14,
      categoria: 'Roll', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R R L L R R L L R R L L R R L> -  L L R R L L R R L L R R L L R> -',
      descricao: 'Sete duplas e um golpe simples acentuado no fim.'
    },
    {
      id: 'seventeen-stroke-roll', nome: 'Seventeen Stroke Roll', numeroPas: 15,
      categoria: 'Roll', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R R L L R R L L R R L L R R L L R> - - -  L L R R L L R R L L R R L L R R L> - - -',
      descricao: 'Oito duplas e um golpe simples acentuado no fim — o mais longo da família.'
    },

    /* ============ DIDDLE RUDIMENTS ============ */
    {
      id: 'single-paradiddle', nome: 'Single Paradiddle', numeroPas: 16,
      categoria: 'Diddle', nivel: 'Básico', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R> L R R  L> R L L  R> L R R  L> R L L',
      descricao: 'Dois golpes simples seguidos de uma dupla. O acento cai sempre no primeiro golpe ' +
                 'de cada grupo, o que faz o rudimento trocar de mão sozinho.'
    },
    {
      id: 'double-paradiddle', nome: 'Double Paradiddle', numeroPas: 17,
      categoria: 'Diddle', nivel: 'Básico', compasso: '6/8', notasPorTempo: 3,
      sticking: 'R> L R L R R   L> R L R L L',
      descricao: 'Como o Single Paradiddle, mas com quatro golpes simples antes da dupla. ' +
                 'Cai naturalmente em 6/8.'
    },
    {
      id: 'triple-paradiddle', nome: 'Triple Paradiddle', numeroPas: 18,
      categoria: 'Diddle', nivel: 'Intermediário', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R> L R L R L R R  L> R L R L R L L',
      descricao: 'Seis golpes simples antes da dupla. Excelente para acostumar a mão a longas ' +
                 'sequências simples sem perder o acento.'
    },
    {
      id: 'single-paradiddle-diddle', nome: 'Single Paradiddle-Diddle', numeroPas: 19,
      categoria: 'Diddle', nivel: 'Intermediário', compasso: '6/8', notasPorTempo: 3,
      sticking: 'R> L R R L L  R> L R R L L',
      variacao: { nome: 'Alternando as mãos', sticking: 'R> L R R L L  L> R L L R R' },
      descricao: 'Um paradiddle seguido de uma dupla extra (para-diddle-diddle). O padrão clássico ' +
                 'mantém a mesma mão liderando; use "Alternar as mãos" para trocar o lead a cada ' +
                 'grupo. Cai muito bem em levadas ternárias e no jazz.'
    },

    /* ============ FLAM RUDIMENTS ============ */
    {
      id: 'flam', nome: 'Flam', numeroPas: 20,
      categoria: 'Flam', nivel: 'Básico', compasso: '4/4', notasPorTempo: 1,
      sticking: 'lR>  rL>  lR>  rL>',
      descricao: 'Duas mãos batendo quase juntas: a apojatura chega um instante antes e bem mais ' +
                 'fraca, engrossando o golpe principal. O segredo é a diferença de altura das baquetas.'
    },
    {
      id: 'flam-accent', nome: 'Flam Accent', numeroPas: 21,
      categoria: 'Flam', nivel: 'Intermediário', compasso: '6/8', notasPorTempo: 3,
      sticking: 'lR> L R  rL> R L',
      descricao: 'Flam acentuado seguido de dois toques, em tercina; alterna a mão a cada grupo.'
    },
    {
      id: 'flam-tap', nome: 'Flam Tap', numeroPas: 22,
      categoria: 'Flam', nivel: 'Intermediário', compasso: '4/4', notasPorTempo: 4,
      sticking: 'lR> R  rL> L  lR> R  rL> L',
      descricao: 'Flam seguido de um toque com a mesma mão (a que deu o golpe principal). ' +
                 'Acento no flam, toque mais leve.'
    },
    {
      id: 'flam-paradiddle', nome: 'Flam Paradiddle', numeroPas: 24,
      categoria: 'Flam', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'lR> L R R  rL> R L L',
      descricao: 'Um paradiddle com flam acentuado no primeiro golpe de cada grupo. Também chamado ' +
                 'de "flamadiddle".'
    },
    {
      id: 'flam-paradiddle-diddle', nome: 'Flam Paradiddle-Diddle', numeroPas: 26,
      categoria: 'Flam', nivel: 'Avançado', compasso: '6/8', notasPorTempo: 3,
      sticking: 'lR> L R R L L  rL> R L L R R',
      descricao: 'Flam acentuado seguido de um paradiddle-diddle. Ótimo em levadas ternárias.'
    },
    {
      id: 'swiss-army-triplet', nome: 'Swiss Army Triplet', numeroPas: 28,
      categoria: 'Flam', nivel: 'Intermediário', compasso: '6/8', notasPorTempo: 3,
      sticking: 'lR> R L  lR> R L',
      descricao: 'Flam acentuado e dois toques em tercina, mantendo a mesma mão que lidera — ' +
                 'a alternativa "suíça" ao Flam Accent, muito usada em viradas rápidas.'
    },
    {
      id: 'flamacue', nome: 'Flamacue', numeroPas: 23,
      categoria: 'Flam', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'lR L> R L rR - - -  rL R> L R lL - - -',
      descricao: 'Flam, um acento no 2º toque, mais dois toques e um flam (sem acento) no fim. ' +
                 'O acento no meio dá o balanço característico.'
    },
    {
      id: 'single-flammed-mill', nome: 'Single Flammed Mill', numeroPas: 25,
      categoria: 'Flam', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'lR> R L R  rL> L R L',
      descricao: 'Um "moinho": flam com a dupla no começo (R R L R), invertendo a lógica do Flam Paradiddle.'
    },
    {
      id: 'pataflafla', nome: 'Pataflafla', numeroPas: 27,
      categoria: 'Flam', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'lR> L R rL>  rL> R L lR>',
      descricao: 'Toques com flams acentuados nas pontas; os dois flams centrais dão o "fla-fla" do nome.'
    },
    {
      id: 'inverted-flam-tap', nome: 'Inverted Flam Tap', numeroPas: 29,
      categoria: 'Flam', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'lR> L rL> R  lR> L rL> R',
      descricao: 'Flam Tap "invertido": os flams acentuados caem no tempo e os toques no contratempo. ' +
                 'As duplas de mesma mão se formam atravessando o tempo (o toque solto emenda no flam ' +
                 'do ciclo seguinte).'
    },
    {
      id: 'flam-drag', nome: 'Flam Drag', numeroPas: 30,
      categoria: 'Flam', nivel: 'Avançado', compasso: '6/8', notasPorTempo: 3,
      sticking: 'lR> rrL R  rL> llR L',
      descricao: 'Tercina de flam acentuado, drag e toque. Junta as duas famílias (flam + drag).'
    },

    /* ============ DRAG RUDIMENTS ============ */
    {
      id: 'drag', nome: 'Drag', numeroPas: 31,
      categoria: 'Drag', nivel: 'Intermediário', compasso: '4/4', notasPorTempo: 2,
      sticking: 'llR rrL  llR rrL  llR rrL  llR rrL',
      descricao: 'O drag (ou "ruff"): duas apojaturas antes de cada golpe principal, alternando ' +
                 'as mãos. A base de toda a família drag.'
    },
    {
      id: 'single-drag-tap', nome: 'Single Drag Tap', numeroPas: 32,
      categoria: 'Drag', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 2,
      sticking: 'llR L>  rrL R>  llR L>  rrL R>',
      descricao: 'Drag seguido de um toque acentuado. O acento fica no toque, não na nota arrastada.'
    },
    {
      id: 'double-drag-tap', nome: 'Double Drag Tap', numeroPas: 33,
      categoria: 'Drag', nivel: 'Avançado', compasso: '6/8', notasPorTempo: 3,
      sticking: 'llR llR L>  rrL rrL R>',
      descricao: 'Dois drags na MESMA mão, seguidos de um toque acentuado na mão oposta.'
    },
    {
      id: 'lesson-25', nome: 'Lesson 25', numeroPas: 34,
      categoria: 'Drag', nivel: 'Avançado', compasso: '6/8', notasPorTempo: 3,
      sticking: 'llR L R>  rrL R L>',
      descricao: 'Grupo de três notas com o drag acrescentado no início e o acento na última nota.'
    },
    {
      id: 'single-dragadiddle', nome: 'Single Dragadiddle', numeroPas: 35,
      categoria: 'Drag', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'llR> L R R  rrL> R L L',
      dragAberto: true,
      descricao: 'Um paradiddle com drag acentuado no início. Como todo paradiddle, o final em dupla ' +
                 'entrega o comando à outra mão (o lead alterna). Na prática, a primeira nota vira ' +
                 'ela mesma o drag — soa como uma dupla da própria mão (RRLRR).'
    },
    {
      id: 'drag-paradiddle-1', nome: 'Drag Paradiddle #1', numeroPas: 36,
      categoria: 'Drag', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R> llR L R R  L> rrL R L L',
      descricao: 'Um golpe simples acentuado seguido de um paradiddle com drag na primeira nota dele ' +
                 '(R-LL-R-L-R-R, espelhado).'
    },
    {
      id: 'drag-paradiddle-2', nome: 'Drag Paradiddle #2', numeroPas: 37,
      categoria: 'Drag', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'R> llR llR L R R  L> rrL rrL R L L',
      descricao: 'Como o #1, porém com dois drags na mesma mão (R-LL-R-LL-R-L-R-R, espelhado).'
    },
    {
      id: 'single-ratamacue', nome: 'Single Ratamacue', numeroPas: 38,
      categoria: 'Drag', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'llR L R L> - - - -  rrL R L R> - - - -',
      descricao: 'Drag seguido de um single stroke four terminando no acento ("cue"), alternando a ' +
                 'mão de entrada.'
    },
    {
      id: 'double-ratamacue', nome: 'Double Ratamacue', numeroPas: 39,
      categoria: 'Drag', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'llR llR L R L> - - -  rrL rrL R L R> - - -',
      descricao: 'Dois drags na mesma mão combinados com um single stroke four terminando em acento.'
    },
    {
      id: 'triple-ratamacue', nome: 'Triple Ratamacue', numeroPas: 40,
      categoria: 'Drag', nivel: 'Avançado', compasso: '4/4', notasPorTempo: 4,
      sticking: 'llR llR llR L R L> - -  rrL rrL rrL R L R> - -',
      descricao: 'Três drags na mesma mão combinados com um single stroke four terminando em acento. ' +
                 'O fim da lista da PAS.'
    }
  ];

  const lista = brutos.map(function (r) {
    const copia = Object.assign({}, r);
    copia.notas = lerNotas(r.sticking);
    copia.feixes = feixes(r.compasso, r.notasPorTempo);
    copia.tempos = copia.notas.length / r.notasPorTempo;
    if (r.variacao) {
      copia.variacao = { nome: r.variacao.nome, notas: lerNotas(r.variacao.sticking) };
    }
    return copia;
  }).sort(function (a, b) { return a.numeroPas - b.numeroPas; });

  function porId(id) {
    return lista.filter(function (r) { return r.id === id; })[0] || null;
  }

  /* Autoconferência da família drag (pega regressões de graça):
     Regra 1 — drags consecutivos caem na MESMA mão.
     Regra 2 — o acento não fica na nota arrastada, exceto no dragadiddle
               e nos drag paradiddles (que acentuam a primeira nota). */
  const problemas = validarDrags();
  function validarDrags() {
    const excecaoAcento = {
      'single-dragadiddle': true, 'drag-paradiddle-1': true, 'drag-paradiddle-2': true
    };
    // O Drag básico é o exercício mão-a-mão de drags: alterna de propósito.
    const excecaoAlternancia = { 'drag': true };
    const avisos = [];
    lista.forEach(function (r) {
      for (let i = 0; i < r.notas.length; i++) {
        const n = r.notas[i];
        if (!n.graces || n.graces.length < 2) continue;   // só notas com drag
        const prox = r.notas[i + 1];
        if (!excecaoAlternancia[r.id] && prox && prox.graces &&
            prox.graces.length >= 2 && prox.mao !== n.mao) {
          avisos.push(r.id + ': drags consecutivos em mãos diferentes (nota ' + i + ')');
        }
        if (n.acento && !excecaoAcento[r.id]) {
          avisos.push(r.id + ': acento em nota arrastada (nota ' + i + ')');
        }
      }
    });
    if (avisos.length && typeof console !== 'undefined') {
      avisos.forEach(function (a) { console.warn('RUJUMENTO — ' + a); });
    }
    return avisos;
  }

  return { lista: lista, porId: porId, lerNotas: lerNotas, problemas: problemas };
})();
