/* =====================================================================
   frases.js — o rol de 80 frases do rodapé + as frases secretas
   ---------------------------------------------------------------------
   Para editar: mexa só nos textos abaixo. Nada mais no app precisa mudar.
     tipo: 'versiculo'  -> traducao Almeida Revista e Corrigida (ARC), dominio publico
     tipo: 'autoral'    -> frase de efeito autoral
   O campo "ref" so existe nos versiculos e aparece entre parenteses.
   ===================================================================== */

const Frases = (function () {

  /* ---------- 1 a 40: versículos (Almeida Revista e Corrigida) ---------- */
  const versiculos = [
    { texto: 'O açoite é para o cavalo, o freio, para o jumento, e a vara, para as costas dos tolos.', ref: 'Provérbios 26:3' },
    { texto: 'Não sejais como o cavalo, nem como a mula, que não têm entendimento, cuja boca precisa de cabresto e freio, para que se não atirem a ti.', ref: 'Salmos 32:9' },
    { texto: 'O boi conhece o seu possuidor, e o jumento, a manjedoura do seu dono; mas Israel não tem conhecimento, o meu povo não entende.', ref: 'Isaías 1:3' },
    { texto: 'Mas o homem vão é falto de entendimento; sim, o homem nasce como o filho do jumento montês.', ref: 'Jó 11:12' },
    { texto: 'Porventura, zurrará o jumento montês junto à relva? Ou mugirá o boi junto ao seu pasto?', ref: 'Jó 6:5' },
    { texto: 'Então, o Senhor abriu a boca da jumenta, a qual disse a Balaão: Que te fiz eu, que me espancaste estas três vezes?', ref: 'Números 22:28' },
    { texto: 'E a jumenta disse a Balaão: Porventura, não sou a tua jumenta, em que toda a tua vida andaste até hoje?', ref: 'Números 22:30' },
    { texto: 'Mas teve a repreensão da sua transgressão; o mudo animal de carga, falando com voz humana, impediu a loucura do profeta.', ref: '2 Pedro 2:16' },
    { texto: 'Eis que o teu Rei virá a ti, justo e Salvador, pobre e montado sobre um jumento, sobre um asninho, filho de jumenta.', ref: 'Zacarias 9:9' },
    { texto: 'Dizei à filha de Sião: Eis que o teu Rei aí te vem, manso e assentado sobre uma jumenta e um jumentinho, filho de animal de carga.', ref: 'Mateus 21:5' },
    { texto: 'Não temas, ó filha de Sião; eis que o teu Rei vem assentado sobre o filho de uma jumenta.', ref: 'João 12:15' },
    { texto: 'Ide à aldeia que está defronte de vós e, logo que ali entrardes, encontrareis preso um jumentinho, sobre o qual ainda não montou homem algum; soltai-o e trazei-mo.', ref: 'Marcos 11:2' },
    { texto: 'Tomai sobre vós o meu jugo e aprendei de mim, que sou manso e humilde de coração, e encontrareis descanso para a vossa alma.', ref: 'Mateus 11:29' },
    { texto: 'Porque o meu jugo é suave, e o meu fardo é leve.', ref: 'Mateus 11:30' },
    { texto: 'Bom é para o homem suportar o jugo na sua mocidade.', ref: 'Lamentações 3:27' },
    { texto: 'Agora, pois, por que tentais a Deus, pondo sobre a cerviz dos discípulos um jugo que nem nossos pais nem nós pudemos suportar?', ref: 'Atos 15:10' },
    { texto: 'Estai, pois, firmes na liberdade com que Cristo nos libertou e não torneis a colocar-vos debaixo do jugo da servidão.', ref: 'Gálatas 5:1' },
    { texto: 'Não vos prendais a um jugo desigual com os infiéis; porque que sociedade tem a justiça com a injustiça?', ref: '2 Coríntios 6:14' },
    { texto: 'Issacar é jumento de fortes ossos, deitado entre dois fardos.', ref: 'Gênesis 49:14' },
    { texto: 'Tirei de seus ombros a carga; as suas mãos foram livres dos cestos.', ref: 'Salmos 81:6' },
    { texto: 'Porque já os meus pecados sobrepassam a minha cabeça; como carga pesada são de mais para as minhas forças.', ref: 'Salmos 38:4' },
    { texto: 'Por que fizeste mal a teu servo, e por que não achei graça aos teus olhos, pois que puseste sobre mim a carga de todo este povo?', ref: 'Números 11:11' },
    { texto: 'Levai as cargas uns dos outros e assim cumprireis a lei de Cristo.', ref: 'Gálatas 6:2' },
    { texto: 'Porque cada qual levará a sua própria carga.', ref: 'Gálatas 6:5' },
    { texto: 'Se vires o jumento daquele que te aborrece deitado debaixo da sua carga, deixarás, pois, de ajudá-lo? Certamente, o ajudarás a levantá-lo.', ref: 'Êxodo 23:5' },
    { texto: 'O jumento do teu irmão ou o seu boi não verás caídos no caminho e deles te esconderás; certamente, o ajudarás a levantá-los.', ref: 'Deuteronômio 22:4' },
    { texto: 'Qual será o de vós que, caindo-lhe num poço, em dia de sábado, o jumento ou o boi, o não tire logo?', ref: 'Lucas 14:5' },
    { texto: 'Hipócrita, no sábado não desprende da manjedoura cada um de vós o seu boi ou jumento e não o leva a beber?', ref: 'Lucas 13:15' },
    { texto: 'Uns confiam em carros, e outros, em cavalos, mas nós faremos menção do nome do Senhor, nosso Deus.', ref: 'Salmos 20:7' },
    { texto: 'O cavalo é falaz para a segurança; não livra ninguém com a sua grande força.', ref: 'Salmos 33:17' },
    { texto: 'Não se deleita na força do cavalo, nem se compraz nas pernas do varão.', ref: 'Salmos 147:10' },
    { texto: 'O cavalo prepara-se para o dia da batalha, mas do Senhor vem a vitória.', ref: 'Provérbios 21:31' },
    { texto: 'Ai dos que descem ao Egito a buscar socorro e se estribam em cavalos; e têm confiança em carros, porque são muitos, e nos cavaleiros, porque são poderosíssimos; e não atentam para o Santo de Israel.', ref: 'Isaías 31:1' },
    { texto: 'Quem despediu livre o jumento montês, e quem soltou as prisões ao jumento bravo,', ref: 'Jó 39:5' },
    { texto: 'Ora, nós pomos freios nas bocas dos cavalos, para que nos obedeçam; e conduzimos assim todo o seu corpo.', ref: 'Tiago 3:3' },
    { texto: 'Vi servos a cavalo e príncipes andando a pé como servos.', ref: 'Eclesiastes 10:7' },
    { texto: 'Cantarei ao Senhor, porque sumamente se exaltou; lançou no mar o cavalo e o seu cavaleiro.', ref: 'Êxodo 15:1' },
    { texto: 'Porém não multiplicará para si cavalos, nem fará voltar o povo ao Egito para multiplicar cavalos.', ref: 'Deuteronômio 17:16' },
    { texto: 'Naquele dia, será gravado sobre as campainhas dos cavalos: SANTIDADE AO SENHOR.', ref: 'Zacarias 14:20' },
    { texto: 'E, se alguém vos disser: Por que fazeis isso? Dizei que o Senhor precisa dele, e logo o enviará para aqui.', ref: 'Marcos 11:3' }
  ];

  /* ---------- 41 a 80: frases autorais ---------- */
  const autorais = [
    'Jumento não nasce sabendo paradiddle — e olha que ele tem a vida inteira. Você tem hoje.',
    'Se Deus falou por uma jumenta, Ele dá um jeito também nessa sua mão esquerda.',
    'O jumento carrega a carga; o Dono escolhe o caminho. Relaxe: a direção não é função sua.',
    'Pressa no rudimento é que nem coice: volta na sua cara.',
    'Orelha grande serve para ouvir o clique. Use a sua.',
    'Humildade é aceitar tocar a 60 BPM na frente dos outros.',
    'Quem toca rápido e errado só chega primeiro no lugar errado.',
    'Baqueta na mão não faz baterista, assim como sela não faz cavalo de corrida.',
    'O jumento não reclama do peso; reclama do dono apressado. Não seja o dono apressado da sua mão fraca.',
    'Deus não procura talento, procura disposição. O resto Ele carrega.',
    'Antes de querer voar como águia, aprenda a andar reto como jumento.',
    'A mão esquerda é o campo missionário da mão direita.',
    'Metrônomo é igual irmão sincero: não é bonito o que ele fala, mas é verdade.',
    'Você não está atrasado; o tempo é que está no lugar certo.',
    'Todo virtuose já foi um jumento com baqueta. A diferença é que ele continuou.',
    'Não existe rudimento difícil. Existe jumento com pressa.',
    'Errou? Zurra e recomeça. Jumento não guarda mágoa de compasso passado.',
    'O pad não julga. Ele só devolve exatamente o que você deu.',
    'Servir na igreja não é palco, é carga. E de carga quem entende é jumento.',
    'Quer humildade instantânea? Grave-se tocando.',
    'O jumentinho de Jerusalém não sabia tocar nada, mas carregou o Rei. Sua função não é brilhar, é servir.',
    'Ninguém aplaude o jumento, mas ninguém chega sem ele.',
    'Duas mãos, um coração e zero pressa: receita antiga.',
    'O maior inimigo do seu paradiddle não é a velocidade, é a vaidade.',
    'Trocar de baqueta não conserta preguiça.',
    'Se está feio devagar, vai ficar feio e rápido.',
    'Deus tem paciência com você. Tenha com o seu rufo.',
    'Jumento teimoso é só um jumento que ainda não viu o Anjo no caminho.',
    'Toque como quem carrega água na cabeça: firme, sem derramar.',
    'Talento é empréstimo; disciplina é a prestação. Pague todo dia.',
    'O clique não é seu inimigo, é seu pastor: guia você a águas tranquilas de 80 BPM.',
    'Não peça um dom maior. Peça mãos mais obedientes.',
    'Jumento que anda sozinho acha que é cavalo. Ache um mestre.',
    'Quem só toca o que já sabe está descansando, não estudando.',
    'Ghost note é humildade em forma de som: quase ninguém percebe, mas sem ela nada tem graça.',
    'Se o seu tempo interno fosse relógio, você chegaria atrasado na sua própria festa. Treine o gap click.',
    'O orgulho é o único rudimento que a gente domina sem estudar.',
    'Cinco minutos por dia vencem três horas na véspera do culto.',
    'Tem baterista que toca 240 BPM e não consegue esperar o pastor terminar a oração.',
    'No fim, não vão te perguntar quantos BPM você atingiu, mas se você serviu com o que tinha.'
  ];

  /* ---------- frases secretas (1 chance em 10 ao tocar no rodapé) ---------- */
  const secretas = [
    'Você achou o zurro secreto. Isso não te faz melhor baterista, mas te faz mais curioso — e curiosidade é meio caminho do estudo.',
    'Segredo do RUJUMENTO nº 1: não existe segredo. Existe metrônomo.',
    'Parabéns! Você desbloqueou… nada. Mas ficou feliz, né? Assim é a vaidade.',
    'Frase secreta: o jumento também acha o seu solo muito longo.',
    'Dizem que quem acha esta frase toca um paradiddle limpo a 200 BPM. Dizem.',
    'Você cutucou a frase. A frase cutucou de volta: já estudou hoje?',
    'Aviso oficial do Jumestre: cutucar frase não conta como prática.',
    'Sabedoria antiga do pasto: baqueta que cai no chão sempre rola para debaixo da bateria.',
    'Descoberta rara: o jumento tem duas orelhas e uma boca. Proporção recomendada também para bateristas.',
    'Frase secretíssima: o Senhor faz sinfonia com quem só sabe zurrar.'
  ];

  /* ---------- monta o rol final com números fixos (para você conferir) ---------- */
  const rol = [];
  versiculos.forEach(function (v, i) {
    rol.push({ n: i + 1, tipo: 'versiculo', texto: v.texto, ref: v.ref });
  });
  autorais.forEach(function (t, i) {
    rol.push({ n: versiculos.length + i + 1, tipo: 'autoral', texto: t, ref: null });
  });

  const rolSecretas = secretas.map(function (t, i) {
    return { n: 'S' + (i + 1), tipo: 'secreta', texto: t, ref: null };
  });

  function sortear() { return rol[Math.floor(Math.random() * rol.length)]; }
  function sortearSecreta() { return rolSecretas[Math.floor(Math.random() * rolSecretas.length)]; }
  function porNumero(n) { return rol.filter(function (f) { return f.n === n; })[0] || null; }

  return {
    rol: rol, secretas: rolSecretas,
    total: rol.length,
    sortear: sortear, sortearSecreta: sortearSecreta, porNumero: porNumero
  };
})();
