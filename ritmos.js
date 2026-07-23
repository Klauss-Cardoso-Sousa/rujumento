/* =====================================================================
   ritmos.js — os grooves, em formato declarativo
   ---------------------------------------------------------------------
   Cada ritmo descreve as vozes do kit numa GRADE de passos iguais.
   Por voz, uma string com um símbolo por passo:
     .  = nada           x = toque normal        X = toque acentuado
     g  = ghost note (só caixa; sai fraca e entre parênteses)
     o  = chimbal aberto (só chimbal)
   Vozes (de cima para baixo na pauta):
     prato   = prato de condução / ride (mão)
     chimbal = chimbal / hi-hat (mão; ou pé, quando há prato)
     caixa   = caixa (tarol)
     aro     = cross-stick / aro (caixa abafada)
     bumbo   = bumbo (pé)
   "passosPorTempo": 2 = colcheias, 3 = tercinas, 4 = semicolcheias.
   Para pedir um ritmo novo, basta copiar um bloco e trocar as strings.
   ===================================================================== */

const Ritmos = (function () {

  function lerVoz(texto, total) {
    const passos = texto.trim().split(/\s+/);
    if (passos.length !== total) {
      throw new Error('Voz com ' + passos.length + ' passos, esperado ' + total + ': ' + texto);
    }
    return passos.map(function (s) { return s === '.' ? null : s; });
  }

  const brutos = [

    /* ================= BRASILEIROS ================= */
    {
      id: 'samba', nome: 'Samba', origem: 'Brasileiro', nivel: 'Avançado',
      compasso: '2/4', passosPorTempo: 4, tempos: 2, revisar: true,
      descricao: 'Base do samba de bateria. O bumbo faz o papel do surdo (forte no 2º tempo) e a ' +
                 'caixa costura o "telecoteco" com ghost notes. Toque leve e adiantando o suingue.',
      vozes: {
        chimbal: 'x . x . x . x .',
        caixa:   '. g x g . g x g',
        bumbo:   'x . . x X . . x'
      }
    },
    {
      id: 'bossa-nova', nome: 'Bossa Nova', origem: 'Brasileiro', nivel: 'Intermediário',
      compasso: '4/4', passosPorTempo: 4, tempos: 4, revisar: true,
      descricao: 'Groove suave de vassourinha/aro: o cross-stick toca a clave da bossa e o bumbo ' +
                 'marca leve. Tudo baixinho e constante — é acompanhamento, não protagonismo.',
      vozes: {
        chimbal: 'x . x . x . x . x . x . x . x .',
        aro:     'x . . x . . x . . . x . x . . .',
        bumbo:   'x . . . . . x . x . . . . . x .'
      }
    },
    {
      id: 'baiao', nome: 'Baião', origem: 'Brasileiro', nivel: 'Intermediário',
      compasso: '2/4', passosPorTempo: 4, tempos: 2, revisar: true,
      descricao: 'Do Nordeste: o bumbo imita a zabumba com a levada "dum... dum-dum", e o aro/caixa ' +
                 'responde no 2º tempo. Balanço firme e seco.',
      vozes: {
        chimbal: 'x . x . x . x .',
        aro:     '. . . . x . . .',
        bumbo:   'x . . x . . x .'
      }
    },
    {
      id: 'xote', nome: 'Xote', origem: 'Brasileiro', nivel: 'Básico',
      compasso: '2/4', passosPorTempo: 4, tempos: 2, revisar: true,
      descricao: 'Nordestino mais calmo que o baião, para dançar de par. Bumbo nos dois tempos e ' +
                 'aro nos contratempos — cadência "quadrada" e gostosa.',
      vozes: {
        chimbal: 'x . x . x . x .',
        aro:     '. . x . . . x .',
        bumbo:   'x . . . x . . .'
      }
    },
    {
      id: 'maracatu', nome: 'Maracatu', origem: 'Brasileiro', nivel: 'Avançado',
      compasso: '4/4', passosPorTempo: 4, tempos: 4, revisar: true,
      descricao: 'Baque virado de Pernambuco, marcial e grave. O bumbo (alfaia) faz a figura ' +
                 'sincopada pesada e a caixa preenche. Toque com peso e intenção.',
      vozes: {
        caixa:   'x x g x  x x g x  x x g x  x x g x',
        bumbo:   'X . . x  . . X .  x . . X  . . x .'
      }
    },
    {
      id: 'frevo', nome: 'Frevo', origem: 'Brasileiro', nivel: 'Avançado',
      compasso: '2/4', passosPorTempo: 4, tempos: 2, revisar: true,
      descricao: 'Carnaval de Pernambuco, rápido e agitado. Caixa marcada e picotada, bumbo firme ' +
                 'no tempo. Exige pulso solto — comece devagar no trainer.',
      vozes: {
        caixa:   'X . x x  X . x x',
        bumbo:   'x . . . x . . .'
      }
    },
    {
      id: 'partido-alto', nome: 'Partido Alto', origem: 'Brasileiro', nivel: 'Avançado',
      compasso: '4/4', passosPorTempo: 4, tempos: 4, revisar: true,
      descricao: 'Vertente do samba com a síncope do partido no aro/caixa e o bumbo respondendo. ' +
                 'Muita ginga; deixe a mão fraca fazer os ghosts.',
      vozes: {
        chimbal: 'x . x . x . x . x . x . x . x .',
        aro:     '. . x . . x . . . . x . . x . .',
        caixa:   '. g . . g . . g . g . . g . . g',
        bumbo:   'x . . x . . x . x . . x . . x .'
      }
    },

    /* ================= ESTRANGEIROS ================= */
    {
      id: 'rock', nome: 'Rock (8th note groove)', origem: 'Estrangeiro', nivel: 'Básico',
      compasso: '4/4', passosPorTempo: 2, tempos: 4,
      descricao: 'O groove mais usado do mundo: chimbal em colcheias, caixa em 2 e 4, bumbo em 1 e 3. ' +
                 'A base de quase todo louvor animado.',
      vozes: {
        chimbal: 'x x x x x x x x',
        caixa:   '. . x . . . x .',
        bumbo:   'x . . . x . . .'
      }
    },
    {
      id: 'funk', nome: 'Funk (ghost notes)', origem: 'Estrangeiro', nivel: 'Avançado',
      compasso: '4/4', passosPorTempo: 4, tempos: 4, revisar: true,
      descricao: 'O groove das ghost notes: caixa cheia de notinhas fracas entre os acentos de 2 e 4, ' +
                 'bumbo sincopado. Segredo: a diferença entre o forte e o quase-inaudível.',
      vozes: {
        chimbal: 'x . x . x . x . x . x . x . x .',
        caixa:   '. . g . X . . g . . g . X . g .',
        bumbo:   'x . . x . . x . x . . . x . . .'
      }
    },
    {
      id: 'shuffle', nome: 'Shuffle', origem: 'Estrangeiro', nivel: 'Intermediário',
      compasso: '4/4', passosPorTempo: 3, tempos: 4, revisar: true,
      descricao: 'Levada em tercinas: o chimbal toca a 1ª e a 3ª de cada tercina (o "chram-chá"), ' +
                 'com caixa em 2 e 4. Base do blues e de muito gospel.',
      vozes: {
        chimbal: 'x . x  x . x  x . x  x . x',
        caixa:   '. . .  X . .  . . .  X . .',
        bumbo:   'x . .  . . .  x . .  . . .'
      }
    },
    {
      id: 'swing', nome: 'Swing / Jazz', origem: 'Estrangeiro', nivel: 'Avançado',
      compasso: '4/4', passosPorTempo: 3, tempos: 4, revisar: true,
      descricao: 'A condução clássica do jazz no prato (ride) em tercinas, com o chimbal no pé ' +
                 'fechando em 2 e 4. A caixa e o bumbo entram improvisando (aqui ficam a seu critério).',
      vozes: {
        prato:   'x . .  x . x  x . .  x . x',
        chimbal: '. . .  x . .  . . .  x . .'
      }
    },
    {
      id: 'reggae-one-drop', nome: 'Reggae One Drop', origem: 'Estrangeiro', nivel: 'Intermediário',
      compasso: '4/4', passosPorTempo: 2, tempos: 4, revisar: true,
      descricao: 'A marca do reggae: o "drop" — bumbo e aro juntos no 3º tempo, com o 1º vazio. ' +
                 'O espaço é tão importante quanto a nota.',
      vozes: {
        chimbal: 'x x x x x x x x',
        aro:     '. . . . x . . .',
        bumbo:   '. . . . x . . .'
      }
    },
    {
      id: 'bolero', nome: 'Bolero', origem: 'Estrangeiro', nivel: 'Básico',
      compasso: '4/4', passosPorTempo: 4, tempos: 4, revisar: true,
      descricao: 'Balada latina lenta e romântica: cross-stick em 2 e 4, bumbo em 1 e 3, tudo ' +
                 'delicado. Ótimo para momentos de adoração.',
      vozes: {
        chimbal: 'x . x . x . x . x . x . x . x .',
        aro:     '. . . . x . . . . . . . x . . .',
        bumbo:   'x . . . . . . . x . . . . . . .'
      }
    },
    {
      id: 'songo', nome: 'Songo (afro-cubano)', origem: 'Estrangeiro', nivel: 'Avançado',
      compasso: '4/4', passosPorTempo: 4, tempos: 4, revisar: true,
      descricao: 'Groove cubano moderno: caixa com ghosts e acentos deslocados, bumbo em tumbao. ' +
                 'Muita conversa entre as vozes.',
      vozes: {
        chimbal: 'x . x . x . x . x . x . x . x .',
        caixa:   '. . g . X . g . . . g . X . g .',
        bumbo:   '. . . x . . x . . . . x . . x .'
      }
    },
    {
      id: 'cascara', nome: 'Cáscara', origem: 'Estrangeiro', nivel: 'Avançado',
      compasso: '4/4', passosPorTempo: 4, tempos: 4, revisar: true,
      descricao: 'O padrão tocado na "casca" (corpo) do timbau, aqui no prato, com a clave son no ' +
                 'cross-stick. Base rítmica da salsa.',
      vozes: {
        prato:   'x . x x . x . x  x . x x . x . x',
        aro:     'x . . x . . x .  . . x . x . . .',
        bumbo:   '. . . x . . . .  . . . x . . . .'
      }
    }
  ];

  /* ordem de desenho na pauta (de cima para baixo) */
  const ORDEM = ['prato', 'chimbal', 'caixa', 'aro', 'bumbo'];

  const lista = brutos.map(function (r) {
    const copia = Object.assign({}, r);
    copia.totalPassos = r.tempos * r.passosPorTempo;
    copia.vozesLista = ORDEM.filter(function (v) { return r.vozes[v]; }).map(function (v) {
      return { voz: v, passos: lerVoz(r.vozes[v], copia.totalPassos) };
    });
    // marca se há chimbal de pé (quando existe prato de mão junto)
    copia.chimbalDePe = !!(r.vozes.prato && r.vozes.chimbal);
    return copia;
  });

  function porId(id) {
    return lista.filter(function (r) { return r.id === id; })[0] || null;
  }

  return { lista: lista, porId: porId };
})();
