/* =====================================================================
   recompensas.js — o que cada marco de curtidas desbloqueia
   ---------------------------------------------------------------------
   Curtir uma frase do rodapé conta 1 (cada frase conta uma vez só).
   Enquanto bloqueada, a recompensa aparece só como silhueta.
   ===================================================================== */

const Recompensas = (function () {

  const lista = [
    { id: 'paleta-pasto',   tipo: 'paleta',  curtidas: 3,  nome: 'Tema Pasto',
      silhueta: 'Um tema de cores que cheira a capim.',
      descricao: 'Verde de pasto com toques de terra. Descanso para os olhos em ensaio longo.' },

    { id: 'zurro-grave',    tipo: 'zurro',   curtidas: 5,  nome: 'Zurro Grave',
      silhueta: 'Um som novo para a cabecinha do topo.',
      descricao: 'Zurro de jumento velho e cansado. Mais grave, mais rouco, mais sofrido.' },

    { id: 'mestre-zurrildo',tipo: 'mestre',  curtidas: 8,  nome: 'Jumestre Zurrildo',
      silhueta: 'Um jumento de jaqueta preta e cara amarrada.',
      descricao: 'Professor de metal. Exigente, ríspido e viciado em precisão. Caixa metálica.' },

    { id: 'timbre-metal',   tipo: 'timbre',  curtidas: 12, nome: 'Caixa de Metal',
      silhueta: 'Um timbre de caixa mais agressivo.',
      descricao: 'Casco de metal: ataque seco, brilho alto e esteira aberta.' },

    { id: 'zurro-agudo',    tipo: 'zurro',   curtidas: 15, nome: 'Zurro Agudo',
      silhueta: 'Outro som para a cabecinha do topo.',
      descricao: 'Zurro de jumentinho novo: fino, apressado e escandaloso.' },

    { id: 'mestre-jegue',   tipo: 'mestre',  curtidas: 18, nome: 'Mestre Jegue do Samba',
      silhueta: 'Um jegue de chapéu de palha, recostado numa caixa.',
      descricao: 'Professor de samba e partido alto. Manso, malandro e alérgico a pressa.' },

    { id: 'paleta-ferradura',tipo: 'paleta', curtidas: 22, nome: 'Tema Ferradura',
      silhueta: 'Um tema de cores metálico.',
      descricao: 'Aço escovado e brasa. Para quem estuda de madrugada.' },

    { id: 'timbre-samba',   tipo: 'timbre',  curtidas: 26, nome: 'Caixa de Samba',
      silhueta: 'Um timbre de caixa mais tenso.',
      descricao: 'Pele bem esticada e esteira curta: estalo alto, decaimento curtíssimo.' },

    { id: 'mestre-burrico', tipo: 'mestre',  curtidas: 30, nome: 'Burrico Groove',
      silhueta: 'Um burrico de óculos escuros grudado na caixa.',
      descricao: 'Professor de funk. Só fala de ghost note. Caixa gorda e afinação baixa.' },

    { id: 'timbre-funk',    tipo: 'timbre',  curtidas: 35, nome: 'Caixa Funk',
      silhueta: 'Um timbre de caixa mais gordo.',
      descricao: 'Afinação baixa e corpo cheio: perfeita para ouvir ghost note.' },

    { id: 'zurro-operistico',tipo: 'zurro',  curtidas: 40, nome: 'Zurro Operístico',
      silhueta: 'Um zurro absurdamente longo.',
      descricao: 'Três subidas, um vibrato dramático e um final que não acaba mais.' },

    { id: 'mestre-mula',    tipo: 'mestre',  curtidas: 45, nome: 'Madame Mula',
      silhueta: 'Uma mula de vestido longo ao lado de um prato de condução.',
      descricao: 'Professora de jazz. Refinada, irônica com classe e inimiga do exagero.' },

    { id: 'timbre-jazz',    tipo: 'timbre',  curtidas: 55, nome: 'Caixa de Jazz',
      silhueta: 'Um timbre de caixa mais macio.',
      descricao: 'Pele solta e esteira suave: quente, discreta e cheia de nuance.' },

    { id: 'zurro-trovao',   tipo: 'zurro',   curtidas: 60, nome: 'Zurro do Trovão',
      silhueta: 'O zurro mais exagerado de todos.',
      descricao: 'Grave, distorcido e com cauda longa. Use com moderação e fone baixo.' },

    { id: 'paleta-ouro',    tipo: 'paleta',  curtidas: 70, nome: 'Tema Ouro Puro',
      silhueta: 'O tema mais difícil de conseguir.',
      descricao: 'O dourado do Modo Jumento Supremo, agora permanente. Você mereceu.' }
  ];

  function porId(id) { return lista.filter(function (r) { return r.id === id; })[0] || null; }
  function porTipo(tipo) { return lista.filter(function (r) { return r.tipo === tipo; }); }

  function desbloqueadas(curtidas) {
    return lista.filter(function (r) { return curtidas >= r.curtidas; });
  }

  function proxima(curtidas) {
    const restantes = lista.filter(function (r) { return curtidas < r.curtidas; });
    return restantes.length ? restantes[0] : null;
  }

  return { lista: lista, porId: porId, porTipo: porTipo, desbloqueadas: desbloqueadas, proxima: proxima };
})();
