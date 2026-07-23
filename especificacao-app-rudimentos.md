# Especificação — App de Rudimentos de Bateria e Ritmos (offline, celular)

## 1. Contexto e quem sou eu

Sou advogado e baterista amador (toco na igreja). **Não tenho nenhuma experiência com programação.** Por isso:

1. **Explique cada etapa em português simples** antes de executá-la.
2. **Sempre me pergunte antes de:** instalar programas no computador, apagar arquivos ou enviar dados para serviços externos.
3. **Prefiro ver algo funcionando rápido** e ir melhorando, em vez de receber tudo pronto só no final. Construa em fases e me mostre o resultado no navegador ao fim de cada fase.
4. Treino rudimentos em um **pad de treino** (superfície única). Isso importa para o som dos exemplos (ver seção 5).

## 2. O que é o produto

Um aplicativo **que funcione 100% offline no meu celular**, para:

- **Treinar rudimentos de bateria** (do básico ao avançado), com indicação de mão direita (R) e esquerda (L), partitura animada e metrônomo.
- **Estudar ritmos** brasileiros e estrangeiros nominados, com partitura de bateria animada e exemplo sonoro do groove completo.

## 3. Arquitetura técnica

- **PWA (Progressive Web App)** em HTML/CSS/JavaScript puro, sem frameworks pesados. Ideal: o mínimo de arquivos possível.
- **Service worker** para cache completo — depois de aberto uma vez, funciona sem internet.
- **Todos os sons sintetizados via Web Audio API** (metrônomo, caixa, bumbo, chimbal, aro, prato). **Nenhum arquivo de áudio.** Isso mantém o app leve e evita problemas de licença.
- **Nenhum backend, nenhuma API externa, nenhum dado enviado para fora.** Favoritos e registros de prática salvos em `localStorage`.
- Timing do metrônomo e dos exemplos deve usar agendamento preciso do Web Audio (lookahead scheduler), **não** `setInterval` puro — precisão rítmica é o coração do app.
- Mobile-first: tela de celular em pé (~380 px de largura), botões grandes, uso com uma mão.

## 4. Metrônomo

- BPM ajustável de 30 a 300 (botões −/+, ajuste rápido de ±5 e ±1, e "tap tempo").
- Fórmulas de compasso: 4/4 (padrão), 3/4, 6/8.
- Subdivisões selecionáveis: semínima, colcheia, semicolcheia, tercina.
- **Acento no primeiro tempo** (som mais agudo), com opção de desligar.
- Indicador visual pulsando junto com o clique (para treinar mesmo sem som).
- **Trainer de velocidade:** o BPM sobe automaticamente (ex.: +5 BPM a cada 4 compassos), com valores configuráveis de incremento e intervalo, até um BPM-alvo.
- **Gap click:** alterna X compassos com clique e Y compassos em silêncio (configurável), para testar o tempo interno.
- O metrônomo funciona sozinho (tela própria) **e** integrado às telas de rudimentos e ritmos.

## 5. Rudimentos

### 5.1 Conteúdo

Os **40 rudimentos oficiais da PAS (Percussive Arts Society)**, com os stickings oficiais, organizados em lista por categoria e nível:

- **Roll rudiments:** Single Stroke Roll, Single Stroke Four, Single Stroke Seven, Multiple Bounce Roll, Double Stroke Open Roll, Five Stroke Roll, Six Stroke Roll, Seven Stroke Roll, Nine Stroke Roll, Ten Stroke Roll, Eleven Stroke Roll, Thirteen Stroke Roll, Fifteen Stroke Roll, Seventeen Stroke Roll, Triple Stroke Roll.
- **Diddle rudiments:** Single Paradiddle, Double Paradiddle, Triple Paradiddle, Single Paradiddle-Diddle.
- **Flam rudiments:** Flam, Flam Accent, Flam Tap, Flamacue, Flam Paradiddle, Single Flammed Mill, Flam Paradiddle-Diddle, Pataflafla, Swiss Army Triplet, Inverted Flam Tap, Flam Drag.
- **Drag rudiments:** Drag, Single Drag Tap, Double Drag Tap, Lesson 25, Single Dragadiddle, Drag Paradiddle #1, Drag Paradiddle #2, Single Ratamacue, Double Ratamacue, Triple Ratamacue.

Cada rudimento marcado com nível: **Básico / Intermediário / Avançado** (use classificação didática usual; ex.: Single Stroke Roll e Single Paradiddle = básico; Flam Drag e Triple Ratamacue = avançado).

### 5.2 Tela do rudimento

- Nome do rudimento (em inglês, que é o padrão, com breve descrição em português).
- **Partitura em SVG** (pauta de uma linha ou pauta padrão de caixa) mostrando um ciclo do rudimento, com:
  - Sticking **R / L** impresso abaixo de cada nota.
  - **Acentos** (sinal >) onde o rudimento oficial os tem.
  - Notas de flam/drag desenhadas como apojaturas (graces notes), como na notação oficial.
  - **Cursor/destaque animado sincronizado ao metrônomo**, destacando a nota que soa naquele instante.
- Controle de BPM + botões de trainer de velocidade e gap click.
- **Botão de exemplo sonoro (ícone de alto-falante):** toca o rudimento em loop **apenas com som de caixa** — nota acentuada com som mais forte/brilhante, nota não acentuada mais seca, graces notes mais fracas ainda. Nada de bumbo/chimbal aqui: rudimento é exercício de pad.
- **Acentos configuráveis:** opção de o usuário adicionar/remover acentos nas notas (variação de estudo), refletindo no desenho e no som.
- Botão de **favorito** e campo de **registro do BPM máximo limpo** atingido (salvo localmente, com data).

## 6. Ritmos

### 6.1 Conteúdo inicial

**Brasileiros:** Samba (chão e cruzado), Bossa Nova, Baião, Xote, Maracatu, Frevo, Partido Alto.

**Estrangeiros:** Rock básico (8th note groove), Funk (com ghost notes), Shuffle, Swing/Jazz (ride pattern + chimbal no 2 e 4), Reggae One Drop, Bolero, Songo (afro-cubano), Cáscara.

Estrutura de dados dos ritmos deve ser declarativa (ex.: JSON com as vozes e posições rítmicas), para eu poder pedir novos ritmos depois sem reescrever código.

### 6.2 Tela do ritmo

- Nome, origem e breve descrição em português (1–2 frases: contexto e dica de execução).
- **Partitura de bateria em SVG** (pauta padrão com as vozes: chimbal/prato em cima, caixa no meio, bumbo embaixo; ghost notes entre parênteses), com cursor animado sincronizado.
- **Ícone de alto-falante:** toca o groove completo em loop (bumbo + caixa + chimbal/prato sintetizados) no BPM escolhido.
- Mesmo metrônomo integrado (BPM, trainer, gap click).
- Favorito + registro de BPM, como nos rudimentos.

## 7. Interface

- Design limpo, leve e intuitivo; navegação por 3 abas: **Rudimentos | Ritmos | Metrônomo**.
- Listas com busca/filtro por nível (rudimentos) e origem (ritmos), e seção "Favoritos" no topo.
- Tema escuro por padrão (uso em ambiente de ensaio), com opção de tema claro.
- Tipografia legível à distância (o celular fica apoiado na estante do pad).
- Sem propagandas, sem login, sem coleta de dados.

## 8. Instalação no celular (offline)

- Publicar via **GitHub Pages** (gratuito), para que eu abra a URL no celular e use **"Adicionar à Tela de Início"**, ficando com ícone de app e funcionamento offline garantido pelo service worker.
- Me guie passo a passo na criação do repositório e na publicação — nunca fiz isso.
- Gere também um **ícone simples** do app (baqueta/pad) para o manifest.

## 9. Critérios de aceitação

1. Abrir o app no celular sem internet (modo avião) e tudo funcionar: listas, partituras, metrônomo e exemplos sonoros.
2. Metrônomo sem "engasgos" audíveis por pelo menos 5 minutos contínuos, inclusive com a tela do rudimento aberta e animação rodando.
3. Cursor da partitura visivelmente sincronizado com o som em 60, 120 e 200 BPM.
4. Os 40 rudimentos com sticking e acentos conferindo com a lista oficial da PAS.
5. Exemplo sonoro dos rudimentos apenas com caixa; dos ritmos, com kit completo.
6. Favoritos e registros de BPM sobrevivem ao fechamento do app.

## 10. Ordem de implementação (fases)

- **Fase 1 — Núcleo:** metrônomo completo (com trainer e gap click) + 6 rudimentos básicos com partitura animada e exemplo sonoro. Me mostrar funcionando no navegador do Mac.
- **Fase 2 — Rudimentos completos:** os 40 PAS, filtros, favoritos, registro de BPM, acentos configuráveis.
- **Fase 3 — Ritmos:** estrutura declarativa + os 15 ritmos listados, com partitura de kit e exemplo sonoro.
- **Fase 4 — Empacotamento:** PWA (manifest + service worker), ícone, publicação no GitHub Pages e teste no meu celular.

Ao final de cada fase, faça você mesmo um teste (abrir a página, verificar erros no console) antes de me chamar para validar.
