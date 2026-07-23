/* =====================================================================
   mestres.js — o Jumestre e os 4 mestres desbloqueáveis
   ---------------------------------------------------------------------
   100% baseado em regras e textos escritos à mão. Nenhuma IA, nenhuma
   internet, nenhum dado sai do aparelho.
   {nome} nas falas é trocado pelo apelido do aluno.
   Faixas de avaliação: pessimo (0–3) fraco (3–5) medio (5–7) bom (7–9) otimo (9–10)
   ===================================================================== */

const Mestres = (function () {

  /* ================== JUMESTRE (padrão, sempre disponível) ================== */
  const jumestre = {
    id: 'jumestre',
    nome: 'Jumestre',
    titulo: 'o professor da casa',
    estilo: 'Fundamentos e paciência',
    personalidade: 'Zomba com carinho e sempre termina te empurrando para frente.',
    paleta: 'padrao',
    timbre: 'padrao',
    bloqueado: false,

    boasVindas: [
      'Bem-vindo ao RUJUMENTO, {nome}. Aqui ninguém nasce sabendo — e isso é uma boa notícia.',
      'Prazer, {nome}. Sou o Jumestre. Vou te tratar com carinho e com metrônomo, nessa ordem.',
      'Chegou, {nome}? Pendure a vaidade na porta e pegue as baquetas.'
    ],

    saudacao: [
      'Bom dia, {nome}. O pasto está limpo e o metrônomo, ligado.',
      'Olha quem apareceu. Achei que você tinha virado cavalo e ido embora, {nome}.',
      '{nome}! Hoje o clique está com saudade das suas mãos.',
      'De volta ao curral, {nome}. Cinco minutos honestos valem mais que uma hora fingida.',
      'Chegou cedo hoje, {nome}? O jumento acorda antes do dono.',
      'Vamos com calma, {nome}: devagar é a velocidade oficial do aprendizado.',
      '{nome}, hoje eu quero ouvir a sua mão fraca. Sim, aquela.',
      'Bem-vindo de volta. O pad não reclamou da sua ausência, mas eu reclamei.',
      'Pegue a baqueta, {nome}. A inspiração chega depois do primeiro compasso, nunca antes.',
      'Você voltou. Isso já te coloca à frente de 90% dos jumentos, {nome}.',
      'Antes de acelerar, {nome}, lembre: rapidez sem limpeza é só barulho organizado.',
      '{nome}, respire. O metrônomo não morde — só conta a verdade.',
      'Hoje tem estudo, {nome}. Amanhã tem estudo. Depois de amanhã, adivinhe.',
      'O segredo do rufo, {nome}, é o mesmo da vida: repetição com atenção.',
      'Que bom te ver, {nome}. Traga humildade, que o resto eu empresto.',
      '{nome}, a mão direita já está convencida. Falta convencer a esquerda.',
      'Um jumento por dia, {nome}. Não adianta querer ser tropa inteira de uma vez.',
      'Sente-se, {nome}. Vamos fazer pouca coisa, muito bem feita.',
      '{nome}, se hoje render pouco, tudo bem. Se hoje não tiver nada, aí não.',
      'A estante está te esperando, {nome}. E ela não aceita desculpa esfarrapada.'
    ],

    streak: [
      '{nome}, {dias} dias seguidos. Isso já é disciplina, não é mais empolgação.',
      'Olha a sequência: {dias} dias! Cuidado para não virar cavalo de exposição.',
      '{dias} dias sem falhar, {nome}. O jumento teimoso agora está teimando para o lado certo.',
      'Sequência quebrada acontece, {nome}. Jumento cai, sacode a poeira e volta a carregar.'
    ],

    avaliacao: {
      pessimo: [
        '{nome}, foi ruim. Mas você tocou, e quem toca ruim hoje toca menos ruim amanhã.',
        'Nota {nota}. Olha, o metrônomo pediu para sentar. Baixe 20 BPM e tente de novo.',
        'Isso aí não foi um rudimento, {nome}, foi uma discussão entre as suas mãos. Vamos apaziguar: mais devagar.',
        'Nota {nota}, {nome}. A boa notícia é que daqui só melhora. A má é que só melhora estudando.'
      ],
      fraco: [
        'Nota {nota}. Tem música aí dentro, {nome}, só está encoberta de pressa.',
        '{nome}, você está quase no tempo — e "quase no tempo" é o nome artístico de "fora do tempo".',
        'Nota {nota}. Baixe o BPM, ganhe limpeza, depois acelere. Nessa ordem, sempre.',
        'Melhorou, {nome}, mas a sua mão fraca ainda está pedindo emprestado para a forte.'
      ],
      medio: [
        'Nota {nota}. Já dá para reconhecer o rudimento, {nome}. Comemore pouco e repita muito.',
        '{nome}, isso já serve para tocar no culto. Ainda não serve para você se achar.',
        'Nota {nota}. Está redondo por fora, meio quadrado por dentro. Continue.',
        'Boa, {nome}. Agora faça igual dez vezes seguidas — aí eu acredito.'
      ],
      bom: [
        'Nota {nota}! Agora sim, {nome}. Isso é jumento treinado.',
        '{nome}, ficou limpo. Suba 5 BPM e vamos estragar tudo de novo, com alegria.',
        'Nota {nota}. Se continuar assim, vou ter que parar de te zoar. Não faça isso comigo.',
        'Muito bom, {nome}. Guarde o orgulho no bolso e a baqueta na mão.'
      ],
      otimo: [
        'Nota {nota}! {nome}, isso foi limpo que dava para comer no chão.',
        'Excelente, {nome}. Agora a parte difícil: fazer de novo amanhã.',
        'Nota {nota}. O metrônomo pediu autógrafo, mas eu mandei ele estudar.',
        '{nome}, se o jumentinho de Jerusalém te visse, ele te deixava carregar a sela.'
      ]
    },

    supremo: [
      'MODO JUMENTO SUPREMO! Por 30 segundos você é o maior jumento deste pasto, {nome}. Aproveite: a humildade volta logo.',
      'Zurro dourado liberado! {nome}, isso não melhora seu paradiddle, mas melhora sua autoestima.',
      'O pasto se curva. Por meio minuto, {nome}, você reina. Depois volta a varrer o curral.'
    ],

    desbloqueio: [
      'Novidade no curral, {nome}! Corra na aba Prêmios.',
      'Você desbloqueou algo, {nome}. Não pergunte como, o pasto tem seus mistérios.',
      'Marco batido! {nome}, tem coisa nova esperando você.'
    ]
  };

  /* ================== MESTRES DESBLOQUEÁVEIS ================== */

  const zurrildo = {
    id: 'zurrildo',
    nome: 'Jumestre Zurrildo',
    titulo: 'o exigente do metal',
    estilo: 'Metal — dobras, velocidade e precisão militar',
    personalidade: 'Grita, cobra e exige, mas no fundo torce por você. No fundo bem no fundo.',
    paleta: 'zurrildo',
    timbre: 'metal',
    curtidasNecessarias: 8,
    silhueta: 'Um jumento de jaqueta preta e cara amarrada.',

    saudacao: [
      'DE PÉ, {nome}! O metrônomo não espera fraco.',
      '{nome}. Você atrasou 3 milissegundos na vida. Vamos recuperar.',
      'Aqui não tem carinho, {nome}. Tem semicolcheia.',
      'Aqueceu? Não? Aqueça. Rudimento frio quebra pulso, {nome}.',
      'Hoje é dobra até a baqueta pedir água, {nome}.',
      '{nome}, o pad é o seu adversário. E ele nunca cansa.',
      'Velocidade sem limpeza é covardia sonora, {nome}. Não seja covarde.',
      'Silêncio. Baqueta. Clique. Nessa ordem, {nome}.',
      '{nome}, eu não quero ouvir "quase". Quero ouvir "no lugar".',
      'Você veio estudar ou veio ser aplaudido, {nome}? Escolha rápido.'
    ],

    avaliacao: {
      pessimo: [
        'Nota {nota}. Isso foi um desastre, {nome}. Bonito no ruído, péssimo no tempo.',
        '{nome}, o metrônomo pediu demissão. Baixe o BPM AGORA.',
        'Nota {nota}. Nem o zurro sai no tempo. Recomece.'
      ],
      fraco: [
        'Nota {nota}, {nome}. Não me venha com "estava quase".',
        'Fraco. Mas fraco com potencial, {nome}. Repita 20 vezes.',
        'Nota {nota}. Sua mão esquerda está de férias. Cancele as férias.'
      ],
      medio: [
        'Nota {nota}. Aceitável. Aceitável não é bom, {nome}.',
        '{nome}, no meio do caminho é onde morre a maioria. Passe dele.',
        'Nota {nota}. Suba 10 BPM e sofra comigo.'
      ],
      bom: [
        'Nota {nota}. Agora sim tem aço nesse pulso, {nome}.',
        '{nome}, isso já assusta um pouco. Continue assustando.',
        'Nota {nota}. Bom. Não relaxe, bom é o inimigo de ótimo.'
      ],
      otimo: [
        'Nota {nota}! {nome}, ISSO é precisão. Estou quase orgulhoso.',
        'Impecável, {nome}. Vou negar que falei isso.',
        'Nota {nota}. Você domou o clique. Agora dome a sua vaidade.'
      ]
    }
  };

  const jegue = {
    id: 'jegue',
    nome: 'Mestre Jegue do Samba',
    titulo: 'o malandro do suingue',
    estilo: 'Samba e partido alto — suingue acima de tudo',
    personalidade: 'Fala manso, ri de tudo e acha que pressa é falta de ginga.',
    paleta: 'jegue',
    timbre: 'samba',
    curtidasNecessarias: 18,
    silhueta: 'Um jegue de chapéu de palha, recostado numa caixa.',

    saudacao: [
      'Ô {nome}, chegou! Senta aí que o tempo a gente ajeita.',
      '{nome}, meu camarada, hoje é dia de deixar a mão solta.',
      'Devagar, {nome}. Samba não se atropela, se namora.',
      'Tá tenso, {nome}? Solta o ombro. Rudimento duro é rudimento feio.',
      '{nome}, o segredo não é bater forte, é bater na hora certa e sorrindo.',
      'Ô jumento bom! Vamos de suingue hoje, {nome}?',
      '{nome}, quem toca com raiva perde o balanço. E sem balanço não tem festa.',
      'Chegou atrasado? Relaxe, {nome}, o samba também entra depois do tempo.',
      'Bora, {nome}. Um pouquinho todo dia é mais que um monte de vez em quando.',
      '{nome}, a mão esquerda é a comadre da direita. Trate ela bem.'
    ],

    avaliacao: {
      pessimo: [
        'Nota {nota}, {nome}. Ficou meio atropelado, meu velho. Respira e vem de novo.',
        'Ô {nome}, isso aí foi corrida, não foi samba. Devagarinho.',
        'Nota {nota}. Não desanima não, todo mundo já tropeçou no próprio pé.'
      ],
      fraco: [
        'Nota {nota}. Tem molho, {nome}, mas o feijão ainda tá cru.',
        '{nome}, você quase pegou o balanço. Quase é começo.',
        'Nota {nota}. Baixa o BPM e deixa a mão relaxar, camarada.'
      ],
      medio: [
        'Nota {nota}. Já dá pra dançar, {nome}. Ainda não dá pra gravar.',
        '{nome}, tá no caminho. Agora capricha na mão fraca.',
        'Nota {nota}. Bonitinho. Agora faz de novo sem pensar.'
      ],
      bom: [
        'Ôôô, nota {nota}! Aí sim, {nome}, isso tem ginga.',
        '{nome}, ficou gostoso de ouvir. Repete pra ver se não foi sorte.',
        'Nota {nota}. Tá com suingue, camarada. Não perde isso.'
      ],
      otimo: [
        'Nota {nota}! {nome}, isso aí já é roda de samba, meu irmão.',
        'Que beleza, {nome}. O jumento aqui ficou emocionado.',
        'Nota {nota}. Toca assim no culto que o povo levanta.'
      ]
    }
  };

  const burrico = {
    id: 'burrico',
    nome: 'Burrico Groove',
    titulo: 'o obcecado por ghost notes',
    estilo: 'Funk — ghost notes, sujeira controlada e groove gordo',
    personalidade: 'Só fala de ghost note. Sonha com ghost note. Ouve ghost note onde não tem.',
    paleta: 'burrico',
    timbre: 'funk',
    curtidasNecessarias: 30,
    silhueta: 'Um burrico de óculos escuros grudado na caixa.',

    saudacao: [
      'E aí, {nome}! Cadê as ghost notes? Eu não ouvi ghost note nenhuma ainda.',
      '{nome}, groove é o que acontece ENTRE as notas. Bora preencher.',
      'Levanta o volume da alma e baixa o da mão, {nome}. Isso é ghost note.',
      '{nome}, se todo mundo ouvir, não é ghost note, é grito.',
      'Hoje a meta é simples, {nome}: fazer barulhinho que ninguém percebe mas todo mundo sente.',
      '{nome}, o funk não perdoa mão pesada. Alivia aí.',
      'Chegou, {nome}? Então segura o groove que eu solto o clique.',
      '{nome}, sua caixa está gritando. Peça pra ela sussurrar.',
      'Ghost note é humildade em som, {nome}. Pratique a humildade.',
      '{nome}, deixa a mão flutuar. Baqueta apertada mata o groove.'
    ],

    avaliacao: {
      pessimo: [
        'Nota {nota}. {nome}, tudo saiu no mesmo volume. Isso é parede, não é groove.',
        '{nome}, sem dinâmica não tem funk. Vamos do zero, mais leve.',
        'Nota {nota}. Alivia a mão, meu chapa. Tá tudo forte demais.'
      ],
      fraco: [
        'Nota {nota}. Já tem intenção, {nome}, falta controle.',
        '{nome}, suas ghost notes ainda são notas normais tímidas.',
        'Nota {nota}. Baixa o BPM e trabalha a diferença entre forte e fraco.'
      ],
      medio: [
        'Nota {nota}. Tá funkeando, {nome}, mas ainda dá pra sujar mais bonito.',
        '{nome}, o acento apareceu. Agora esconde o resto.',
        'Nota {nota}. Já dá pra sentir o balanço. Capricha na dinâmica.'
      ],
      bom: [
        'Nota {nota}! Isso, {nome}! Agora tem gordura no groove.',
        '{nome}, essas ghost notes me deram arrepio. Continua.',
        'Nota {nota}. Tá gostoso. Segura esse peso e sobe 5 BPM.'
      ],
      otimo: [
        'Nota {nota}! {nome}, isso é groove de gente grande.',
        'Perfeito, {nome}. Até o jumento aqui balançou a orelha.',
        'Nota {nota}. Dinâmica limpa, tempo firme. É isso.'
      ]
    }
  };

  const mula = {
    id: 'mula',
    nome: 'Madame Mula',
    titulo: 'a refinada do jazz',
    estilo: 'Jazz — condução de prato, vassourinha e bom gosto',
    personalidade: 'Elegante, irônica com classe e alérgica a exagero.',
    paleta: 'mula',
    timbre: 'jazz',
    curtidasNecessarias: 45,
    silhueta: 'Uma mula de vestido longo ao lado de um prato de condução.',

    saudacao: [
      'Boa noite, {nome}. Sente-se direito, por favor. Postura é metade do som.',
      '{nome}, querido, elegância não é tocar muito. É tocar o suficiente.',
      'Pegue a baqueta com delicadeza, {nome}. Ela não te fez nada.',
      '{nome}, o silêncio também é uma nota. A mais difícil, aliás.',
      'Comecemos, {nome}. E, por favor, nada de exagero hoje.',
      '{nome}, a pressa é uma grosseria musical.',
      'Bom te ver, {nome}. Vamos trabalhar o gosto antes da velocidade.',
      '{nome}, quem sussurra bem não precisa gritar nunca.',
      'Refinamento, {nome}, é o acento no lugar certo — e só nele.',
      '{nome}, toque como quem conversa, não como quem discute.'
    ],

    avaliacao: {
      pessimo: [
        'Nota {nota}. Foi… entusiasmado, {nome}. Vamos tentar com menos entusiasmo e mais atenção.',
        '{nome}, querido, isso feriu meus ouvidos com carinho. Mais devagar.',
        'Nota {nota}. Reduza o andamento e recupere a compostura.'
      ],
      fraco: [
        'Nota {nota}. Há intenção, {nome}, falta refinamento.',
        '{nome}, você está tocando contra o tempo. Toque com ele.',
        'Nota {nota}. Menos força, mais escuta.'
      ],
      medio: [
        'Nota {nota}. Aceitável, {nome}. Aceitável é um começo educado.',
        '{nome}, está limpo o bastante para ser ouvido, ainda não para ser lembrado.',
        'Nota {nota}. Continue. O bom gosto se aprende repetindo.'
      ],
      bom: [
        'Nota {nota}. Agora sim, {nome}, isso tem elegância.',
        '{nome}, ficou bonito. Vamos manter esse padrão, sim?',
        'Nota {nota}. Muito bem. Discreto e preciso, como deve ser.'
      ],
      otimo: [
        'Nota {nota}. Impecável, {nome}. Eu aplaudiria, mas seria vulgar.',
        '{nome}, isso foi delicioso de ouvir. Repita, por gentileza.',
        'Nota {nota}. Precisão com bom gosto. Raro, {nome}. Muito raro.'
      ]
    }
  };

  const todos = [jumestre, zurrildo, jegue, burrico, mula];

  function porId(id) {
    return todos.filter(function (m) { return m.id === id; })[0] || jumestre;
  }

  /* Escolhe uma fala sem repetir a última usada daquele grupo */
  const ultimas = {};
  function fala(mestre, grupo, sub) {
    let lista = mestre[grupo];
    if (sub && lista) lista = lista[sub];
    if (!lista || !lista.length) lista = jumestre[grupo] && (sub ? jumestre[grupo][sub] : jumestre[grupo]);
    if (!lista || !lista.length) return '';
    const chave = mestre.id + '|' + grupo + '|' + (sub || '');
    let i = Math.floor(Math.random() * lista.length);
    if (lista.length > 1 && i === ultimas[chave]) i = (i + 1) % lista.length;
    ultimas[chave] = i;
    return lista[i];
  }

  function preencher(texto, dados) {
    return String(texto)
      .replace(/\{nome\}/g, (dados && dados.nome) || 'jumento')
      .replace(/\{nota\}/g, (dados && dados.nota) !== undefined ? dados.nota : '')
      .replace(/\{dias\}/g, (dados && dados.dias) !== undefined ? dados.dias : '');
  }

  function faixaDaNota(nota) {
    if (nota < 3) return 'pessimo';
    if (nota < 5) return 'fraco';
    if (nota < 7) return 'medio';
    if (nota < 9) return 'bom';
    return 'otimo';
  }

  return {
    jumestre: jumestre,
    desbloqueaveis: [zurrildo, jegue, burrico, mula],
    todos: todos,
    porId: porId,
    fala: fala,
    preencher: preencher,
    faixaDaNota: faixaDaNota
  };
})();
