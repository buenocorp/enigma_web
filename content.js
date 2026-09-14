/* ==========================================================================
   O ENIGMA DO PROFESSOR BASTOS — banco de dados do caso
   10 salas, cobrindo HTML, CSS, JavaScript, MVC e Servlet, com dificuldade
   crescente. Cada sala tem um POOL de perguntas e um POOL de desafios de
   porta — a cada nova partida o motor (app.js) sorteia um subconjunto,
   embaralha a posição dos móveis e embaralha a ordem das alternativas, então
   replays não são idênticos e a resposta certa não fica sempre na mesma
   posição.

   Mecânica da porta: só é possível tentar a porta depois de resolver todas
   as perguntas da sala. Ao tentar, o jogador primeiro precisa reconhecer —
   entre as pistas já recolhidas no caderno — qual delas é a "chave" daquela
   porta (campo keyPuzzleId). Só depois disso o desafio de síntese da porta é
   liberado. O motor garante que a pista-chave sorteada sempre esteja entre
   as perguntas sorteadas para aquela sala.
   ========================================================================== */

const CASE_DATA = {
  title: "O Enigma do Professor Bastos",
  subtitle: "Caso #07 — Laboratório de Desenvolvimento Web, CEDUP",

  intro: {
    ficha: [
      { label: "Local", value: "Laboratório de Programação, CEDUP" },
      { label: "Desaparecido", value: "Prof. Elias Bastos, coordenador do SGA" },
      { label: "Última atividade", value: "Terça-feira, 23h47 — commit no repositório do sistema" },
      { label: "Situação", value: "Prédio trancado por dentro. Luzes apagadas. Sistema fora do ar." }
    ],
    paragrafos: [
      "A noite estava fria quando você recebeu a ligação. O professor Elias Bastos, responsável pelo Sistema de Gestão Acadêmica (SGA) do CEDUP, desapareceu horas antes de apresentar a nova versão da plataforma.",
      "O prédio foi encontrado trancado por dentro, sala após sala. Ninguém mais tem acesso ao código — só você, que estudou a fundo HTML, CSS, JavaScript e a arquitetura MVC com Servlets, pode atravessar os dez cômodos e reconstruir o que aconteceu.",
      "Você não tem uma lanterna de verdade — tem algo melhor: conhecimento. Mova o cursor (ou o dedo, em telas de toque) pelos cômodos para iluminar o ambiente. Cada pista encontrada é a chave para a porta seguinte. Só quem entende o código enxerga a verdade no escuro."
    ],
    instrucoes: "Mova o mouse para acender sua lanterna. Objetos iluminados podem ser examinados. Resolva os enigmas para recolher pistas — reúna todas antes de tentar a porta, e use a pista certa para destravá-la. Um cronômetro registra sua investigação do início ao fim; cada resposta errada soma 30 segundos de penalidade."
  },

  slots: [
    { top: "18%", left: "14%" },
    { top: "18%", left: "50%" },
    { top: "18%", left: "86%" },
    { top: "80%", left: "14%" },
    { top: "80%", left: "50%" },
    { top: "80%", left: "86%" }
  ],
  doorSlot: { top: "48%", left: "50%" },

  rooms: [
    // ---------------------------------------------------------------- 1 --
    {
      id: "html-estrutura",
      number: 1,
      theme: "wood",
      name: "Sala de Estar",
      icon: "🕯️",
      entryFlavor: "O cheiro de papel velho toma conta do cômodo. Estantes, uma escrivaninha e um quadro tremido na parede. Em algum lugar aqui, o professor deixou o primeiro rastro.",
      puzzlePool: [
        {
          id: "html-1",
          furniture: "gaveta",
          icon: "🗄️",
          label: "Escrivaninha",
          type: "mc",
          flavor: "Dentro da gaveta, um bilhete rasgado com um trecho de HTML. A palavra “section” está sublinhada três vezes.",
          prompt: "Qual alternativa descreve corretamente quando usar <section> em vez de <div>?",
          options: [
            "Quando o conteúdo é apenas um agrupamento visual, sem significado próprio",
            "<section> substitui totalmente o <div> em qualquer situação",
            "Quando o conteúdo representa uma seção temática independente, geralmente com um heading próprio",
            "<section> só pode ser usado diretamente dentro de <body>, nunca dentro de <article>"
          ],
          correct: 2,
          hint: "Pense em significado, não em aparência: um <div> não diz nada sobre o conteúdo; uma tag semântica, sim.",
          clue: "“A estrutura revela a intenção. Semântica não é estilo, é significado.” — anotado à mão, no verso do bilhete."
        },
        {
          id: "html-3",
          furniture: "computador",
          icon: "💻",
          label: "Computador Antigo",
          type: "mc",
          flavor: "A tela antiga pisca, mostrando um documento HTML pela metade.",
          prompt: "Qual é a ordem correta e válida do início de um documento HTML5?",
          options: [
            "<!DOCTYPE html> → <html> → <head> (com <meta> e <title>) → <body>",
            "<html> → <!DOCTYPE html> → <body> → <head>",
            "<head> → <!DOCTYPE html> → <html> → <body>",
            "<!DOCTYPE html> → <body> → <head> → <html>"
          ],
          correct: 0,
          hint: "O DOCTYPE vem antes de tudo, fora da tag <html>.",
          clue: "No canto da tela, uma janela de terminal minimizada mostra o nome de um arquivo: “biblioteca_notas.txt”."
        },
        {
          id: "html-6",
          furniture: "lareira",
          icon: "🔥",
          label: "Lareira Apagada",
          type: "multi",
          flavor: "Nas cinzas da lareira, restos de uma folha impressa com uma lista de tags HTML.",
          prompt: "Marque TODAS as tags abaixo que são elementos vazios (void elements) — ou seja, não possuem tag de fechamento:",
          options: ["<p>", "<br>", "<div>", "<img>", "<input>"],
          correct: [1, 3, 4],
          hint: "Elementos vazios não têm conteúdo interno nem </tag> de fechamento — pense em quebra de linha, imagem e campo de formulário.",
          clue: "Um fragmento sobrevivente: “<br>, <img> e <input> se fecham sozinhos. <p> e <div> sempre precisam do par.”"
        },
        {
          id: "html-7",
          furniture: "relogio",
          icon: "🕰️",
          label: "Relógio de Pêndulo",
          type: "mc",
          flavor: "Dentro do relógio parado, um diagrama de layout de página com setores marcados.",
          prompt: "Qual elemento semântico é o mais adequado para um conteúdo relacionado, mas secundário em relação ao principal — como uma barra lateral com links relacionados?",
          options: ["<nav>", "<div>", "<main>", "<aside>"],
          correct: 3,
          hint: "Pense em algo que fica “ao lado” do conteúdo principal, sem fazer parte dele diretamente.",
          clue: "No diagrama: “<aside> é o vizinho — relacionado, mas não essencial. <main> é o coração da página.”"
        }
      ],
      doorPool: [
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Sala de Estar",
          keyPuzzleId: "html-7",
          type: "multi",
          flavor: "A porta tem uma hierarquia de títulos entalhada na madeira, fora de ordem.",
          code:
`<h1>Sistema Acadêmico</h1>
<h3>Bem-vindo</h3>
<h2>Painel do Aluno</h2>
<h4>Notificações</h4>`,
          prompt: "Marque TODAS as afirmações corretas sobre os problemas de hierarquia nesta estrutura de headings:",
          options: [
            "A hierarquia pula de <h1> direto para <h3>, sem um <h2> correspondente antes",
            "A ordem incorreta de headings prejudica quem usa leitor de tela, que se baseia nos níveis para montar um índice da página",
            "Deveria haver apenas um <h1> por página — e isso já está sendo respeitado corretamente aqui",
            "A ordem dos headings é apenas estética; não afeta acessibilidade",
            "O <h4> aparecer logo após o <h2>, sem um <h3> entre eles, também quebra a sequência lógica esperada"
          ],
          correct: [0, 1, 4],
          hint: "Uma das afirmações descreve algo VERDADEIRO, mas que não é um problema — não marque essa. Outra afirma algo tecnicamente falso.",
          successFlavor: "A porta se abre com um estalo seco. No batente, gravado a lápis: “Sala seguinte: onde os formulários escondem seus próprios segredos.”"
        },
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Sala de Estar",
          keyPuzzleId: "html-1",
          type: "multi",
          flavor: "A porta está entalhada com uma estrutura de blog feita inteiramente de <div>s.",
          code:
`<div id="content">
  <div class="post">
    <div class="post-title">Como funciona o SGA</div>
    <div class="post-body">Texto do artigo...</div>
  </div>
</div>`,
          prompt: "Marque as substituições semânticas mais adequadas para este trecho:",
          options: [
            '<div id="content"> deveria virar <main>',
            '<div class="post"> deveria virar <article>',
            '<div class="post-title"> deveria virar um heading, como <h2>',
            '<div class="post-body"> deveria virar <table>',
            "Nenhuma mudança é necessária — divs já são suficientes para qualquer estrutura"
          ],
          correct: [0, 1, 2],
          hint: "Pense em qual elemento representa a página inteira, qual representa um item independente, e qual representa um título.",
          successFlavor: "A porta se abre com um estalo seco. No batente, gravado a lápis: “Sala seguinte: onde os formulários escondem seus próprios segredos.”"
        }
      ]
    },

    // ---------------------------------------------------------------- 2 --
    {
      id: "html-formularios",
      number: 2,
      theme: "wood",
      name: "Sala de Jantar",
      icon: "🍽️",
      entryFlavor: "Uma mesa comprida, cadeiras empilhadas e um telefone antigo na parede. Tudo aqui parece girar em torno de como pedir e validar informações.",
      puzzlePool: [
        {
          id: "html-2",
          furniture: "estante",
          icon: "📚",
          label: "Estante de Livros",
          type: "fill",
          flavor: "Atrás de um livro de capa dura, uma folha impressa com um formulário incompleto.",
          code:
`<form action="/cadastro" method="post">
  <input type="email" ______ >
  <button type="submit">Enviar</button>
</form>`,
          prompt: "Qual atributo deve preencher a lacuna para impedir o envio do formulário se o campo estiver vazio — usando apenas validação nativa do HTML, sem JavaScript?",
          answers: ["required"],
          hint: "É um atributo booleano: basta escrevê-lo, sem valor.",
          clue: "Uma nota na margem da folha: “O navegador já sabe validar. Confie nele antes de escrever JS.”"
        },
        {
          id: "html-4",
          furniture: "quadro",
          icon: "🖼️",
          label: "Quadro na Parede",
          type: "mc",
          flavor: "Atrás do quadro torto, uma folha escaneada de um relatório financeiro.",
          prompt: "Para que um leitor de tela descreva corretamente essa imagem escaneada, qual código está correto?",
          options: [
            '<img src="relatorio.png">',
            '<img src="relatorio.png" alt="">',
            '<img src="relatorio.png" title="relatorio">',
            '<img src="relatorio.png" alt="Relatório financeiro de outubro com gráfico de barras mostrando queda de 12%">'
          ],
          correct: 3,
          hint: "alt=\"\" é reservado para imagens puramente decorativas — essa imagem carrega informação importante.",
          clue: "Atrás da moldura, um pedaço de papel colado: “O que a lanterna não mostra, o texto alternativo revela.”"
        },
        {
          id: "html-5",
          furniture: "poltrona",
          icon: "🛋️",
          label: "Poltrona Empoeirada",
          type: "mc",
          flavor: "Entre as almofadas da poltrona, um cartão de um curso antigo sobre formulários acessíveis.",
          prompt: "Qual código associa corretamente um <label> ao seu campo, permitindo que clicar no texto foque o input (essencial para acessibilidade)?",
          options: [
            '<input type="text" name="nome" label="Nome">',
            "<label>Nome</label><input type=\"text\" name=\"nome\">",
            '<label for="nome">Nome</label><input type="text" id="nome" name="nome">',
            '<label id="nome">Nome</label><input type="text" name="nome">'
          ],
          correct: 2,
          hint: "O atributo for do <label> precisa apontar para o id do input correspondente.",
          clue: "No verso do cartão: “for aponta para id. Sem essa ligação, o clique no rótulo não faz nada.”"
        },
        {
          id: "html-8",
          furniture: "telefone",
          icon: "☎️",
          label: "Telefone Antigo",
          type: "mc",
          flavor: "Ao lado do telefone de disco, uma anotação sobre tipos de campo de formulário.",
          prompt: "Para um campo que deve receber um número de telefone, qual é a abordagem HTML5 mais adequada?",
          options: [
            '<input type="text">',
            '<input type="number">',
            '<input type="email">',
            '<input type="tel">'
          ],
          correct: 3,
          hint: "type=\"number\" força um formato numérico rígido demais para telefones (que têm parênteses e traços). Existe um tipo pensado exatamente para isso.",
          clue: "Rabiscado no bloco de notas: “tel ativa o teclado certo no celular sem forçar formatação numérica estrita.”"
        }
      ],
      doorPool: [
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Sala de Jantar",
          keyPuzzleId: "html-4",
          type: "multi",
          flavor: "A porta está entalhada com um trecho de código malformado. Parece um teste final antes de seguir em frente.",
          code:
`<div class="header">
  <div class="title">Sistema Acadêmico</div>
</div>
<div class="content">
  <img src="grafico.png">
  <div class="nav">
    <div onclick="location.href='/home'">Início</div>
    <div onclick="location.href='/sobre'">Sobre</div>
  </div>
</div>`,
          prompt: "Marque TODOS os problemas semânticos e de acessibilidade presentes neste trecho:",
          options: [
            "O <div class=\"header\"> deveria ser substituído por <header>",
            "A <img> não possui atributo alt",
            "Os links de navegação foram feitos com <div onclick=\"...\"> em vez de <a href=\"...\">",
            "O <div class=\"nav\"> deveria ser substituído por <nav>",
            "O uso de \"class\" em vez de \"id\" está incorreto"
          ],
          correct: [0, 1, 2, 3],
          hint: "Pense em: elementos estruturais semânticos, navegação acessível por teclado, e imagens descritas. \"class\" vs \"id\" não é um erro aqui.",
          successFlavor: "A porta se abre com um estalo seco. No batente, gravado a lápis: “Sala seguinte: onde tudo ganha estilo — e às vezes, disfarce.”"
        },
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Sala de Jantar",
          keyPuzzleId: "html-5",
          type: "multi",
          flavor: "A porta tem uma tabela HTML antiga entalhada na madeira — um formulário de login construído do jeito errado.",
          code:
`<table>
  <tr><td>Usuário:</td><td><input type="text"></td></tr>
  <tr><td>Senha:</td><td><input type="password"></td></tr>
  <tr><td></td><td><input type="submit" value="Entrar"></td></tr>
</table>`,
          prompt: "Marque TODAS as afirmações corretas sobre usar <table> para estruturar este formulário de login:",
          options: [
            "Tabelas devem ser usadas apenas para exibir dados tabulares, não para layout de formulários",
            "O formulário não está dentro de uma tag <form>, então os dados nunca serão enviados a um servidor",
            "Usar <table> aqui prejudica a acessibilidade: leitores de tela anunciam a estrutura como uma tabela de dados",
            "Essa é a abordagem recomendada atualmente pelo W3C para formulários responsivos",
            "O ideal seria usar <label>, <input> dentro de um <form>, organizados com CSS (flexbox ou grid)"
          ],
          correct: [0, 1, 2, 4],
          hint: "Falta a tag <form>? A tabela é semanticamente apropriada para um formulário? Existe alternativa moderna de layout?",
          successFlavor: "A porta racha e se abre. Gravado nela: “Tabelas contam dados. Não organizam formulários.”"
        }
      ]
    },

    // ---------------------------------------------------------------- 3 --
    {
      id: "css-seletores",
      number: 3,
      theme: "library",
      name: "Biblioteca",
      icon: "📖",
      entryFlavor: "Fileiras de livros antigos e uma mesa de leitura iluminada pela lua. Cada regra CSS aqui parece disputar espaço com outra.",
      puzzlePool: [
        {
          id: "css-1",
          furniture: "estante",
          icon: "📚",
          label: "Estante Alta",
          type: "mc",
          flavor: "Um caderno de anotações CSS está aberto numa página sublinhada em vermelho.",
          code:
`#aviso { color: red; }
.aviso { color: blue; }
p { color: green !important; }

<p id="aviso" class="aviso">Mensagem</p>`,
          prompt: "Qual será a cor final do texto exibido?",
          options: ["Vermelho", "Verde", "Azul", "Preto (cor padrão)"],
          correct: 1,
          hint: "Especificidade importa — exceto quando existe uma regra ainda mais forte que ignora a especificidade.",
          clue: "Uma anotação na margem: “!important não respeita especificidade. Use com extrema cautela.”"
        },
        {
          id: "css-5",
          furniture: "espelho",
          icon: "🪞",
          label: "Espelho Rachado",
          type: "mc",
          flavor: "No reflexo do espelho rachado, um trecho de CSS parece se mover sozinho.",
          prompt: "Qual pseudo-classe aplica um estilo enquanto um campo de formulário está com o foco ativo (por clique ou tabulação)?",
          options: [":active", ":visited", ":focus", ":checked"],
          correct: 2,
          hint: "Pense no que acontece quando você clica ou usa Tab para entrar em um campo de texto.",
          clue: "Escrito no vidro embaçado: “:focus mostra onde você está. :hover, por onde você passa.”"
        },
        {
          id: "css-7",
          furniture: "regua",
          icon: "📐",
          label: "Régua Antiga",
          type: "mc",
          flavor: "Marcado a lápis na régua de madeira, um seletor CSS incompleto.",
          prompt: "Qual seletor aplica um estilo apenas aos <li> em posições ÍMPARES de uma lista?",
          options: ["li:only-child", "li:first-child", "li:not(:last-child)", "li:nth-child(odd)"],
          correct: 3,
          hint: "Você precisa de um seletor que avalie a posição numérica do elemento entre os irmãos.",
          clue: "Na régua: “nth-child(odd) conta a posição. first-child e last-child só olham as pontas.”"
        },
        {
          id: "css-8",
          furniture: "luminaria",
          icon: "💡",
          label: "Luminária de Mesa",
          type: "mc",
          flavor: "Sob a luz da luminária, um bilhete sobre seletores de atributo.",
          prompt: "Qual seletor de atributo seleciona todo <a> cujo href COMEÇA com \"https\"?",
          options: ['a[href*="https"]', 'a[href$="https"]', 'a[href^="https"]', 'a[href~="https"]'],
          correct: 2,
          hint: "O símbolo ^ lembra o início de uma seta apontando para cima — pense em “começa com”.",
          clue: "No bilhete: “^ é início, $ é fim, * é “contém em qualquer lugar”.”"
        }
      ],
      doorPool: [
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Biblioteca",
          keyPuzzleId: "css-8",
          type: "multi",
          flavor: "A porta tem um seletor CSS complexo entalhado na madeira, como um enigma final.",
          code: `ul.menu > li:not(:last-child) a::after { content: " |"; }`,
          prompt: "Marque TODAS as afirmações corretas sobre esse seletor:",
          options: [
            "Aplica-se a links <a> dentro de <li> que são filhos diretos de um <ul class=\"menu\">",
            "O efeito NÃO é aplicado ao último <li> da lista",
            "::after insere o conteúdo \" |\" depois do conteúdo de cada <a> selecionado",
            "O combinador \">\" seleciona qualquer <li> descendente de .menu, mesmo netos ou bisnetos",
            "O seletor funciona mesmo se os <li> estiverem soltos, fora de uma <ul class=\"menu\">"
          ],
          correct: [0, 1, 2],
          hint: "\">\" é filho direto, não qualquer descendente. E ::after sempre atua depois do conteúdo do elemento.",
          successFlavor: "A porta desliza, revelando um corredor estreito. O ar fica mais frio — e mais colorido. É hora do layout."
        },
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Biblioteca",
          keyPuzzleId: "css-1",
          type: "mc",
          flavor: "A porta guarda um cálculo de especificidade CSS quase apagado, exigindo atenção total.",
          code:
`#main .box p { color: navy; }
.box p.intro { color: coral; }
p { color: black; }`,
          prompt: "Considerando <div id=\"main\"><div class=\"box\"><p class=\"intro\">Texto</p></div></div> e nenhuma regra usando !important, qual a cor final do texto?",
          options: ["black", "coral", "navy", "Nenhuma das cores — é um erro de CSS"],
          correct: 2,
          hint: "Compare especificidade por partes: IDs valem mais que classes, que valem mais que tags. #main conta como 1 ID na primeira regra.",
          successFlavor: "A porta desliza, revelando um corredor estreito. O ar fica mais frio — e mais colorido. É hora do layout."
        }
      ]
    },

    // ---------------------------------------------------------------- 4 --
    {
      id: "css-layout",
      number: 4,
      theme: "library",
      name: "Ateliê",
      icon: "🧵",
      entryFlavor: "Tecidos, molduras e móveis meio montados. Tudo aqui é uma questão de medidas, espaçamento e posição — layout em estado puro.",
      puzzlePool: [
        {
          id: "css-2",
          furniture: "mesa",
          icon: "🗃️",
          label: "Mesa de Costura",
          type: "mc",
          flavor: "Sobre a mesa, um esboço de caixa desenhado à mão, com medidas anotadas.",
          prompt: "Um elemento tem width: 200px; padding: 20px; border: 5px solid; e box-sizing: content-box (o padrão). Qual é a largura TOTAL renderizada do elemento?",
          options: ["200px", "225px", "250px", "245px"],
          correct: 2,
          hint: "Some: largura + padding dos dois lados + borda dos dois lados.",
          clue: "Embaixo do esboço: “No content-box, o navegador soma tudo por fora. No border-box, tudo cabe dentro.”"
        },
        {
          id: "css-4",
          furniture: "janela",
          icon: "🪟",
          label: "Janela",
          type: "mc",
          flavor: "Através da janela embaçada, um reflexo mostra um trecho de CSS escrito no vidro com o dedo.",
          prompt: "Um elemento com position: absolute será posicionado em relação a:",
          options: [
            "Seu elemento pai mais próximo que tenha position diferente de static",
            "Sempre à janela do navegador (viewport)",
            "Seu elemento irmão anterior na árvore DOM",
            "Sempre ao <body>, nunca a outro elemento"
          ],
          correct: 0,
          hint: "Procure pelo ancestral posicionado mais próximo — se nenhum existir, aí sim cai para o bloco inicial (viewport).",
          clue: "No vidro embaçado: “Todo absolute precisa de um relative por perto. Ou vira um fantasma solto na página.”"
        },
        {
          id: "css-6",
          furniture: "candelabro",
          icon: "🕯️",
          label: "Candelabro",
          type: "mc",
          flavor: "Pendurado no candelabro, um bilhete balança suavemente sobre unidades de medida.",
          prompt: "Qual unidade CSS é relativa ao tamanho de fonte do elemento RAIZ (<html>), e não do elemento pai?",
          options: ["em", "%", "px", "rem"],
          correct: 3,
          hint: "Pense em “root em” — a unidade carrega a raiz no próprio nome.",
          clue: "No bilhete: “em multiplica sobre o pai. rem sempre olha para a raiz do documento.”"
        },
        {
          id: "css-3",
          furniture: "cofre",
          icon: "🔒",
          label: "Cofre de Retalhos",
          type: "fill",
          flavor: "Um pequeno cofre esconde uma folha com regras de layout incompletas.",
          code:
`.container {
  display: flex;
  ______: center; /* alinha os itens no eixo principal (horizontal) */
}`,
          prompt: "Qual propriedade completa a lacuna?",
          answers: ["justify-content"],
          hint: "É a propriedade que controla o alinhamento ao longo do eixo principal do flex container.",
          clue: "Dentro do cofre, uma chave de fenda e um post-it: “align-items cuida do eixo cruzado. Não confunda os dois.”"
        }
      ],
      doorPool: [
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta do Ateliê",
          keyPuzzleId: "css-3",
          type: "mc",
          flavor: "A porta tem uma grade CSS entalhada, com colunas marcadas em relevo.",
          code:
`.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}`,
          prompt: "Quantas colunas de largura IGUAL este grid cria, e qual propriedade define o espaçamento entre elas?",
          options: [
            "2 colunas; o espaçamento é definido por margin",
            "3 colunas; o espaçamento é definido por gap",
            "3 colunas; o espaçamento é definido por padding",
            "1 coluna repetida 3 vezes; gap não tem efeito em grid"
          ],
          correct: 1,
          hint: "repeat(3, 1fr) cria três faixas de mesma largura fracionária. gap é a propriedade nativa de espaçamento em grid e flex.",
          successFlavor: "A porta desliza, revelando um corredor estreito. O ar fica mais frio — e mais elétrico. É hora do JavaScript."
        },
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta do Ateliê",
          keyPuzzleId: "css-2",
          type: "mc",
          flavor: "A porta guarda um trecho de CSS sobre box-sizing, quase apagado pelo tempo.",
          code:
`* { box-sizing: border-box; }
.card { width: 300px; padding: 24px; border: 2px solid #000; }`,
          prompt: "Com box-sizing: border-box aplicado, qual é a largura TOTAL renderizada do elemento .card, incluindo padding e borda?",
          options: ["300px", "348px", "352px", "276px"],
          correct: 0,
          hint: "border-box redefine o que width significa: padding e borda passam a caber DENTRO da largura declarada, não somados a ela.",
          successFlavor: "A porta desliza, revelando um corredor estreito. O ar fica mais frio — e mais elétrico. É hora do JavaScript."
        }
      ]
    },

    // ---------------------------------------------------------------- 5 --
    {
      id: "js-fundamentos",
      number: 5,
      theme: "basement",
      name: "Porão dos Terminais",
      icon: "🖥️",
      entryFlavor: "Monitores antigos piscam em verde no escuro. O zumbido baixo de máquinas ligadas é o único som. Cada terminal guarda um mistério sobre como o código realmente se comporta.",
      puzzlePool: [
        {
          id: "js-1",
          furniture: "terminal",
          icon: "🖥️",
          label: "Console Antigo",
          type: "mc",
          flavor: "Um terminal exibe um laço de repetição congelado no meio da execução.",
          code:
`for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
          prompt: "O que será impresso no console?",
          options: ["0 1 2", "0 0 0", "Erro de execução", "3 3 3"],
          correct: 3,
          hint: "var não tem escopo de bloco — todas as funções do setTimeout compartilham a MESMA variável i.",
          clue: "Colado na tela: “var vaza para fora do bloco. Use let quando quiser uma cópia por iteração.”"
        },
        {
          id: "js-2",
          furniture: "caixa",
          icon: "🧰",
          label: "Caixa de Ferramentas",
          type: "mc",
          flavor: "Dentro da caixa, um pedaço de código sobre o valor de 'this'.",
          code:
`const obj = {
  nome: "Professor",
  saudacao: function() {
    setTimeout(function() {
      console.log("Olá, " + this.nome);
    }, 100);
  }
};
obj.saudacao();`,
          prompt: "O que será impresso?",
          options: [
            "Olá, Professor",
            "Olá, undefined",
            "Erro: this is not defined",
            "Olá, [object Object]"
          ],
          correct: 1,
          hint: "A função comum passada ao setTimeout perde o 'this' de obj — ela não é uma arrow function.",
          clue: "Uma etiqueta na caixa: “Função comum dentro de callback perde o contexto. Arrow function herda o de fora.”"
        },
        {
          id: "js-6",
          furniture: "radio",
          icon: "📻",
          label: "Rádio Antigo",
          type: "mc",
          flavor: "O rádio antigo emite estática, sintonizado numa estação que só repete um trecho de código.",
          code: `console.log(0 == "0", 0 === "0");`,
          prompt: "Qual é o resultado impresso?",
          options: ["true true", "false false", "true false", "false true"],
          correct: 2,
          hint: "== converte os tipos antes de comparar (coerção). === compara também o tipo, sem converter.",
          clue: "Uma nota colada no rádio: “== compara valor com conversão de tipo. === exige tipo e valor idênticos.”"
        },
        {
          id: "js-7",
          furniture: "disquetes",
          icon: "💾",
          label: "Caixa de Disquetes",
          type: "mc",
          flavor: "Dentro de uma caixa de disquetes empoeirada, uma folha com valores truthy e falsy.",
          prompt: "Qual das expressões abaixo resulta em true?",
          options: ['Boolean("")', "Boolean(0)", 'Boolean("0")', "Boolean(null)"],
          correct: 2,
          hint: "Strings não vazias são sempre truthy, mesmo que o conteúdo pareça um número zero.",
          clue: "Rabiscado na caixa: “Só '', 0, null, undefined, NaN e false são falsy. Qualquer string não vazia, mesmo \"0\", é truthy.”"
        }
      ],
      doorPool: [
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta do Porão",
          keyPuzzleId: "js-1",
          type: "mc",
          flavor: "A porta tem um código de closures gravado a fogo na superfície metálica.",
          code:
`function criarContador() {
  let contagem = 0;
  return function() {
    contagem++;
    return contagem;
  };
}
const contador1 = criarContador();
const contador2 = criarContador();
console.log(contador1());
console.log(contador1());
console.log(contador2());`,
          prompt: "Quais valores são impressos, em ordem?",
          options: ["1, 2, 3", "1, 1, 1", "1, 2, 2", "1, 2, 1"],
          correct: 3,
          hint: "Cada chamada de criarContador() gera uma NOVA closure, com sua própria variável 'contagem' independente.",
          successFlavor: "A porta blindada se abre com um chiado de ar comprimido. Do outro lado, o zumbido de máquinas fica mais forte."
        },
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta do Porão",
          keyPuzzleId: "js-1",
          type: "mc",
          flavor: "A porta tem um trecho de código sobre hoisting, com a tinta quase apagada.",
          code:
`console.log(a);
var a = 10;
console.log(b);
let b = 20;`,
          prompt: "Qual é o resultado das duas chamadas de console.log?",
          options: [
            "undefined, depois 20",
            "10, depois 20",
            "undefined, depois ReferenceError (b está na zona morta temporal)",
            "ReferenceError nas duas linhas"
          ],
          correct: 2,
          hint: "var é hoisted e inicializada com undefined. let também é hoisted, mas fica inacessível (zona morta temporal) até sua declaração ser executada.",
          successFlavor: "A porta blindada se abre com um chiado de ar comprimido. Do outro lado, o zumbido de máquinas fica mais forte."
        }
      ]
    },

    // ---------------------------------------------------------------- 6 --
    {
      id: "js-assincrono",
      number: 6,
      theme: "basement",
      name: "Sala de Máquinas",
      icon: "⚙️",
      entryFlavor: "Engrenagens giram fora de sincronia, algumas rápidas, outras atrasadas. Nada aqui acontece na ordem que você espera — exatamente como o código assíncrono.",
      puzzlePool: [
        {
          id: "js-3",
          furniture: "arquivo",
          icon: "🗃️",
          label: "Gaveta de Eventos",
          type: "mc",
          flavor: "Uma gaveta trancada guarda um trecho sobre a ordem de execução assíncrona.",
          code:
`console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`,
          prompt: "Qual é a ordem de impressão?",
          options: ["A B C D", "A D B C", "A D C B", "A C D B"],
          correct: 2,
          hint: "Código síncrono primeiro. Depois, microtasks (Promises) antes de macrotasks (setTimeout).",
          clue: "Um post-it amarelo: “Fila de microtarefas sempre esvazia antes da próxima macrotarefa. Promises furam a fila do setTimeout.”"
        },
        {
          id: "js-9",
          furniture: "ampulheta",
          icon: "⏳",
          label: "Ampulheta Quebrada",
          type: "mc",
          flavor: "A areia da ampulheta parou no meio, ao lado de um trecho de código com Promises encadeadas.",
          code: `Promise.resolve(1).then(v => v + 1).then(v => console.log(v));`,
          prompt: "O que é impresso no console?",
          options: ["Error", "undefined", "1", "2"],
          correct: 3,
          hint: "Cada .then() recebe o valor retornado pelo .then() anterior — os retornos se encadeiam.",
          clue: "Escrito na base da ampulheta: “Cada .then() recebe o que o anterior retornou. A cadeia carrega o valor adiante.”"
        },
        {
          id: "js-10",
          furniture: "relogiodigital",
          icon: "⏰",
          label: "Relógio Digital",
          type: "mc",
          flavor: "O relógio digital pisca 00:00 sem parar, ao lado de uma anotação sobre funções async.",
          prompt: "Uma função declarada como async function SEMPRE retorna:",
          options: [
            "O valor literal retornado dentro dela, sem nenhuma transformação",
            "undefined, independentemente do que for retornado dentro dela",
            "Um array com todos os valores intermediários calculados",
            "Uma Promise, que resolve com o valor retornado (ou rejeita, se um erro for lançado)"
          ],
          correct: 3,
          hint: "Por isso é preciso usar .then() ou await para obter o valor “de dentro” de uma função async.",
          clue: "Na anotação: “async sempre embrulha o retorno numa Promise, mesmo que você não veja isso acontecer.”"
        },
        {
          id: "js-13",
          furniture: "vaso",
          icon: "🏺",
          label: "Vaso Antigo",
          type: "mc",
          flavor: "Dentro de um vaso rachado, um pedaço de papel com uma pergunta sobre tipos.",
          code: `console.log(typeof Promise.resolve());`,
          prompt: "O que é impresso no console?",
          options: ["\"promise\"", "\"function\"", "\"object\"", "\"undefined\""],
          correct: 2,
          hint: "Em JavaScript, typeof não tem uma categoria especial para Promise — ela é uma instância de objeto, como quase tudo que não é primitivo.",
          clue: "No papel: “typeof não conhece “promise” como categoria. Para o JS, uma Promise é só mais um object.”"
        }
      ],
      doorPool: [
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Sala de Máquinas",
          keyPuzzleId: "js-3",
          type: "mc",
          flavor: "A porta tem um trecho de código assíncrono gravado, com a tinta quase apagada.",
          code:
`async function foo() {
  console.log("1");
  await null;
  console.log("2");
}
console.log("0");
foo();
console.log("3");`,
          prompt: "Qual é a ordem de impressão?",
          options: ["0 1 2 3", "0 1 3 2", "1 0 3 2", "0 3 1 2"],
          correct: 1,
          hint: "Tudo antes do primeiro 'await' dentro de foo() roda de forma síncrona, assim que foo() é chamada. Depois do await, o resto vira uma microtask.",
          successFlavor: "A porta blindada se abre com um chiado de ar comprimido. Do outro lado, engrenagens elétricas zumbem — a oficina."
        },
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Sala de Máquinas",
          keyPuzzleId: "js-9",
          type: "mc",
          flavor: "A porta guarda um trecho sobre Promise.all e tratamento de erros.",
          code:
`Promise.all([
  Promise.resolve(1),
  Promise.reject("erro"),
  Promise.resolve(3)
]).then(vals => console.log(vals))
  .catch(err => console.log("Falhou:", err));`,
          prompt: "O que será impresso?",
          options: ['[1, "erro", 3]', "Falhou: erro", "[1, 3]", "undefined"],
          correct: 1,
          hint: "Promise.all rejeita assim que QUALQUER uma das promises rejeitar — o .then() de sucesso nunca roda nesse caso.",
          successFlavor: "A porta blindada se abre com um chiado de ar comprimido. Do outro lado, engrenagens elétricas zumbem — a oficina."
        }
      ]
    },

    // ---------------------------------------------------------------- 7 --
    {
      id: "js-dom-eventos",
      number: 7,
      theme: "basement",
      name: "Oficina Elétrica",
      icon: "🔌",
      entryFlavor: "Fios expostos, painéis abertos e uma campainha que dispara sozinha de vez em quando. Tudo aqui reage a alguma coisa — a pergunta é: reage a quê, exatamente?",
      puzzlePool: [
        {
          id: "js-4",
          furniture: "painel",
          icon: "🎛️",
          label: "Painel de Disjuntores",
          type: "mc",
          flavor: "Um painel cheio de interruptores tem um manual aberto sobre manipulação do DOM.",
          prompt: "Qual método adiciona um novo elemento filho SEM destruir e recriar (e sem remover os listeners de) os elementos já existentes, ao contrário de usar innerHTML +=?",
          options: ["appendChild()", "innerHTML +=", "outerHTML =", "document.write()"],
          correct: 0,
          hint: "innerHTML += reconstrói todo o HTML interno do zero — inclusive o que já existia.",
          clue: "Escrito a giz no painel: “innerHTML += relê e recria tudo. appendChild() apenas acrescenta.”"
        },
        {
          id: "js-5",
          furniture: "quadroavisos",
          icon: "📌",
          label: "Quadro de Avisos",
          type: "mc",
          flavor: "Preso por um alfinete, um bilhete sobre métodos de array que confundem muita gente.",
          prompt: "Qual método de array abaixo retorna um NOVO array, sem modificar o array original?",
          options: ["array.push(x)", "array.map(fn)", "array.splice(0, 1)", "array.sort()"],
          correct: 1,
          hint: "push, splice e sort alteram o array original (são mutáveis). Apenas um deles sempre devolve uma cópia nova.",
          clue: "No bilhete: “map, filter e slice não tocam no original. push, splice, sort e reverse mutam.”"
        },
        {
          id: "js-11",
          furniture: "campainha",
          icon: "🔔",
          label: "Campainha Elétrica",
          type: "mc",
          flavor: "A campainha dispara sozinha. Ao lado, uma anotação sobre formas de registrar eventos.",
          prompt: "Qual a principal vantagem de usar elemento.addEventListener(\"click\", fn) em vez de elemento.onclick = fn?",
          options: [
            "addEventListener é mais rápido de digitar",
            "addEventListener permite registrar MÚLTIPLOS ouvintes para o mesmo evento no mesmo elemento, sem que um sobrescreva o outro",
            "onclick funciona em mais navegadores que addEventListener",
            "Não há diferença real entre os dois"
          ],
          correct: 1,
          hint: "elemento.onclick = fn2 substitui qualquer fn1 anterior. addEventListener empilha vários ouvintes independentes.",
          clue: "Na anotação: “onclick só guarda UM ouvinte por vez. addEventListener empilha quantos você quiser.”"
        },
        {
          id: "js-12",
          furniture: "fiacao",
          icon: "⚡",
          label: "Painel de Fiação",
          type: "mc",
          flavor: "Atrás do painel de fiação, um diagrama sobre delegação de eventos.",
          prompt: "Em delegação de eventos, por que event.target pode ser diferente do elemento onde addEventListener foi registrado (event.currentTarget)?",
          options: [
            "Porque event.target sempre aponta para o document, independente de onde o clique ocorreu",
            "Porque event.target é o elemento que efetivamente originou o evento (ex: um <li> clicado), enquanto currentTarget é o elemento onde o listener está anexado (ex: a <ul> pai)",
            "target e currentTarget são sempre exatamente o mesmo elemento",
            "Porque o navegador escolhe aleatoriamente qual elemento reportar a cada clique"
          ],
          correct: 1,
          hint: "Pense num clique num <li> dentro de uma <ul> que tem o listener: quem originou o clique, e onde o listener está de fato anexado?",
          clue: "No diagrama: “target é quem disparou. currentTarget é quem está ouvindo. Delegação vive dessa diferença.”"
        }
      ],
      doorPool: [
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Oficina",
          keyPuzzleId: "js-11",
          type: "mc",
          flavor: "A porta tem um trecho de validação de formulário gravado, com fios saindo da fechadura.",
          code:
`form.addEventListener("submit", function(event) {
  if (nomeInput.value.trim() === "") {
    event.preventDefault();
    alert("Preencha o nome!");
  }
});`,
          prompt: "O que acontece se o campo estiver vazio ao submeter o formulário?",
          options: [
            "O formulário é enviado normalmente e, depois, o alert aparece",
            "event.preventDefault() impede o envio do formulário; a página não recarrega e o alert é exibido",
            "O navegador ignora addEventListener em eventos submit",
            "O JavaScript lança uma exceção porque preventDefault() não existe"
          ],
          correct: 1,
          hint: "preventDefault() cancela a ação padrão do evento — no caso de submit, cancela o envio/recarregamento da página.",
          successFlavor: "A porta se abre com uma faísca. Do outro lado, um corredor estreito leva a uma sala cheia de arquivos — a arquitetura do sistema."
        },
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Oficina",
          keyPuzzleId: "js-4",
          type: "mc",
          flavor: "A porta guarda um trecho sobre NodeList estática, quase ilegível.",
          code:
`const items = document.querySelectorAll(".item");
items.forEach(item => item.remove());
console.log(items.length);`,
          prompt: "O que é impresso, sabendo que querySelectorAll retorna uma NodeList ESTÁTICA?",
          options: [
            "0, pois a lista se atualiza automaticamente ao remover os elementos",
            "O número original de itens encontrados, pois a NodeList estática não muda mesmo depois que os elementos são removidos do DOM",
            "undefined",
            "Um erro é lançado ao tentar remover elementos dentro de um forEach"
          ],
          correct: 1,
          hint: "Diferente de uma HTMLCollection “viva” (como a retornada por getElementsByClassName), a NodeList de querySelectorAll é um retrato congelado do momento da consulta.",
          successFlavor: "A porta se abre com uma faísca. Do outro lado, um corredor estreito leva a uma sala cheia de arquivos — a arquitetura do sistema."
        }
      ]
    },

    // ---------------------------------------------------------------- 8 --
    {
      id: "mvc",
      number: 8,
      theme: "server",
      name: "Sala de Arquivos",
      icon: "🗃️",
      entryFlavor: "Prateleiras cheias de pastas etiquetadas: Model, View, Controller. Tudo aqui tem um lugar certo — e um problema aparece toda vez que algo fica fora dele.",
      puzzlePool: [
        {
          id: "mvc-1",
          furniture: "painel",
          icon: "🎛️",
          label: "Painel de Arquitetura MVC",
          type: "mc",
          flavor: "Um diagrama MVC está afixado no painel, com anotações apagadas em parte.",
          prompt: "No padrão MVC aplicado a uma aplicação Java web com Servlets e JSP, qual associação está correta?",
          options: [
            "Model = classes de dados e regras de negócio; View = JSP (apresentação); Controller = Servlet (recebe a requisição e coordena)",
            "Model = JSP; View = Servlet; Controller = classe de negócio",
            "Model = apenas o banco de dados; View = Servlet; Controller = JSP",
            "MVC não se aplica a aplicações com Servlet, apenas a frameworks como Spring"
          ],
          correct: 0,
          hint: "O Servlet é a porta de entrada da requisição — quem recebe e coordena é o Controller.",
          clue: "Rabiscado no canto do diagrama: “Controller decide o quê. Model sabe o como. View mostra o resultado.”"
        },
        {
          id: "mvc-2",
          furniture: "planta",
          icon: "📐",
          label: "Planta do Sistema",
          type: "mc",
          flavor: "Uma planta baixa do sistema antigo está pendurada, com anotações sobre manutenção.",
          prompt: "Por que a separação MVC facilita a manutenção de um sistema ao longo do tempo?",
          options: [
            "Porque concentra tudo em um único arquivo, mais fácil de editar de uma vez",
            "Porque permite mudar a aparência (View) sem mexer na lógica de negócio (Model) nem no fluxo de controle (Controller), e vice-versa",
            "Porque elimina completamente a necessidade de testar o sistema",
            "Porque o banco de dados deixa de ser necessário"
          ],
          correct: 1,
          hint: "Pense em responsabilidades isoladas: mudar uma cor no site não deveria exigir tocar na regra que calcula a média de um aluno.",
          clue: "Na planta: “Separar não é burocracia — é isolar o que muda por um motivo do que muda por outro.”"
        },
        {
          id: "mvc-3",
          furniture: "arquivocentral",
          icon: "📁",
          label: "Arquivo Central",
          type: "mc",
          flavor: "Uma pasta etiquetada “Regras de Negócio” está fora do lugar, dentro da gaveta errada.",
          prompt: "Em uma aplicação MVC bem estruturada, para onde o Controller deve delegar uma regra de negócio complexa, como calcular a média final de um aluno?",
          options: [
            "Para a View, que deveria conter toda a lógica de exibição e também os cálculos",
            "Para o Model, responsável pelos dados e pelas regras de negócio",
            "Para o navegador do cliente, calculando tudo em JavaScript no front-end",
            "Para o próprio Controller, que deve concentrar toda a lógica da aplicação"
          ],
          correct: 1,
          hint: "Regra de negócio é dado + comportamento sobre esse dado — isso é papel do Model, não do Controller nem da View.",
          clue: "Na pasta remendada: “Cálculo de nota é regra de negócio. Regra de negócio mora no Model.”"
        },
        {
          id: "mvc-4",
          furniture: "quadrobranco",
          icon: "🗒️",
          label: "Quadro Branco",
          type: "mc",
          flavor: "No quadro branco, meio apagado, um aviso sobre um erro comum de arquitetura.",
          prompt: "Qual problema surge quando um Servlet (Controller) acessa diretamente o banco de dados E também gera HTML manualmente dentro da resposta?",
          options: [
            "Nenhum — essa é exatamente a forma recomendada de organizar um Servlet",
            "As responsabilidades de Model e View ficam misturadas no Controller, dificultando manutenção e reuso — quebra a separação do MVC",
            "O sistema automaticamente fica mais rápido",
            "O Servlet simplesmente deixa de funcionar e não compila"
          ],
          correct: 1,
          hint: "Pense em quantos motivos diferentes esse único método passaria a ter para mudar: layout, regra de negócio, acesso a dados...",
          clue: "No quadro: “Um método com três motivos para mudar é um método com três chances de quebrar.”"
        }
      ],
      doorPool: [
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta dos Arquivos",
          keyPuzzleId: "mvc-1",
          type: "mc",
          flavor: "A porta tem três nomes de arquivo gravados, esperando serem classificados.",
          code:
`AlunoServlet.java      (recebe requisições HTTP em /aluno)
Aluno.java              (classe com nome, notas, calcularMedia())
listaAlunos.jsp         (exibe uma tabela de alunos)`,
          prompt: "Qual associação identifica corretamente o papel de cada arquivo no padrão MVC?",
          options: [
            "AlunoServlet = Model; Aluno = View; listaAlunos.jsp = Controller",
            "AlunoServlet = Controller; Aluno = Model; listaAlunos.jsp = View",
            "AlunoServlet = View; Aluno = Controller; listaAlunos.jsp = Model",
            "Os três arquivos desempenham o papel de Controller"
          ],
          correct: 1,
          hint: "Quem recebe a requisição HTTP? Quem guarda dados e regras? Quem exibe uma tabela na tela?",
          successFlavor: "A porta se abre revelando racks de servidor piscando em vermelho e âmbar — o coração do sistema."
        },
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta dos Arquivos",
          keyPuzzleId: "mvc-4",
          type: "multi",
          flavor: "A porta guarda um Servlet inteiro, com SQL, regras de negócio e HTML todos misturados no mesmo método.",
          code:
`protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("text/html");
    PrintWriter out = resp.getWriter();
    out.println("<html><body><h1>Alunos</h1><table>");
    // ... 40 linhas de SQL, regras de negócio e HTML misturados aqui
    out.println("</table></body></html>");
}`,
          prompt: "Marque TODOS os problemas causados por concentrar SQL, regras de negócio e geração de HTML dentro de um único método do Servlet:",
          options: [
            "O código fica difícil de testar isoladamente — não dá para testar a regra de negócio sem simular uma requisição HTTP completa",
            "Qualquer mudança visual no HTML exige mexer no mesmo arquivo Java que contém a lógica de negócio, aumentando o risco de bugs",
            "O código se torna automaticamente mais rápido de executar",
            "Reutilizar a mesma regra de negócio em outro Servlet exige copiar e colar código",
            "Esse é exatamente o padrão MVC funcionando como deveria"
          ],
          correct: [0, 1, 3],
          hint: "Pense em testabilidade, acoplamento entre camadas, e reuso de código — três sintomas clássicos de responsabilidades misturadas.",
          successFlavor: "A porta se abre revelando racks de servidor piscando em vermelho e âmbar — o coração do sistema."
        }
      ]
    },

    // ---------------------------------------------------------------- 9 --
    {
      id: "servlet-ciclo",
      number: 9,
      theme: "server",
      name: "Sala dos Servidores",
      icon: "🖴",
      entryFlavor: "Racks de servidor zumbem em vermelho e âmbar. É aqui que o Sistema de Gestão Acadêmica realmente vive — e é aqui que algo deu muito errado.",
      puzzlePool: [
        {
          id: "servlet-1",
          furniture: "rack",
          icon: "🗄️",
          label: "Rack de Servidores",
          type: "mc",
          flavor: "Uma etiqueta presa ao rack lista o ciclo de vida de um Servlet.",
          prompt: "Qual método de um Servlet é chamado automaticamente pelo container apenas UMA VEZ, quando o Servlet é carregado pela primeira vez?",
          options: ["service()", "init()", "doGet()", "destroy()"],
          correct: 1,
          hint: "É o método de inicialização — pense no nome.",
          clue: "Na etiqueta: “init() prepara o terreno uma única vez. service()/doGet()/doPost() rodam a cada requisição.”"
        },
        {
          id: "servlet-2",
          furniture: "arquivo",
          icon: "📁",
          label: "Arquivo de Configuração",
          type: "mc",
          flavor: "Uma pasta com a configuração de rotas do sistema está aberta sobre uma mesa metálica.",
          code:
`@WebServlet("/cadastro")
public class CadastroServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        // ...
    }
}`,
          prompt: "Um formulário HTML envia dados com method=\"post\" para /cadastro. O que acontece ao submeter?",
          options: [
            "Os dados são processados normalmente pelo doGet",
            "O Servlet converte automaticamente POST em GET",
            "O container retorna erro HTTP 405 (Method Not Allowed), pois doPost não foi implementado",
            "Uma exceção de compilação impede o deploy"
          ],
          correct: 2,
          hint: "HttpServlet despacha cada verbo HTTP para o método correspondente. Se o método não existir, o padrão herdado responde com erro.",
          clue: "Um bilhete grudado na pasta: “method=\"post\" exige doPost(). Sem ele, o container recusa a requisição.”"
        },
        {
          id: "servlet-6",
          furniture: "extintor",
          icon: "🧯",
          label: "Extintor de Incêndio",
          type: "mc",
          flavor: "Preso ao extintor, um adesivo com uma anotação sobre anotações Java (sim, isso mesmo).",
          prompt: "Qual anotação registra um Servlet em uma URL específica sem precisar editar o arquivo web.xml?",
          options: ["@Override", "@WebServlet(\"/rota\")", "@RequestMapping(\"/rota\")", "@Controller"],
          correct: 1,
          hint: "@RequestMapping e @Controller são anotações do Spring MVC, não da API padrão de Servlets.",
          clue: "No adesivo: “@WebServlet mapeia a URL direto na classe. web.xml virou opcional.”"
        },
        {
          id: "servlet-7",
          furniture: "interruptor",
          icon: "🔌",
          label: "Interruptor Geral",
          type: "mc",
          flavor: "Ao lado do interruptor geral do prédio, uma anotação sobre o fim do ciclo de vida de um Servlet.",
          prompt: "Qual método do ciclo de vida é chamado pelo container quando a aplicação está sendo encerrada, permitindo liberar recursos como conexões abertas?",
          options: ["init()", "service()", "destroy()", "finalize()"],
          correct: 2,
          hint: "É o oposto de init() — o método de “desligamento” do Servlet.",
          clue: "Na anotação: “destroy() é a última chance de fechar conexões antes do Servlet sair de cena.”"
        }
      ],
      doorPool: [
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Sala de Controle",
          keyPuzzleId: "servlet-2",
          type: "mc",
          flavor: "No monitor principal, ainda ligado, um código continua rodando — foi a última coisa que o professor escreveu.",
          code:
`@WebServlet("/painel")
public class PainelServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        if (req.getParameter("status") == null) {
            RequestDispatcher rd = req.getRequestDispatcher("/painel");
            rd.forward(req, resp);
        } else {
            resp.getWriter().println("Painel carregado.");
        }
    }
}`,
          prompt: "O que acontece quando /painel é acessado SEM o parâmetro \"status\" na URL?",
          options: [
            "O Servlet responde normalmente com \"Painel carregado.\"",
            "Ocorre um loop infinito de forward: a condição nunca muda, e o Servlet reencaminha para si mesmo indefinidamente até o servidor travar",
            "O navegador ignora o forward e carrega uma página em branco",
            "O container Java impede automaticamente forwards de um Servlet para si mesmo"
          ],
          correct: 1,
          hint: "req.getParameter(\"status\") nunca é definido dentro desse próprio fluxo — nada muda entre um forward e o próximo.",
          successFlavor: "Você sente um arrepio. Esse é o bug. Esse loop infinito derrubou o servidor na noite em que o professor sumiu — e talvez seja também a razão de ele estar preso. Falta pouco."
        },
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Sala de Controle",
          keyPuzzleId: "servlet-6",
          type: "multi",
          flavor: "Uma segunda tela mostra um Servlet que exclui registros com um simples clique de link.",
          code:
`@WebServlet("/excluirConta")
public class ExcluirContaServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        String id = req.getParameter("id");
        AlunoDAO.excluir(id);
    }
}`,
          prompt: "Marque TODOS os problemas de usar doGet() para excluir um registro permanentemente:",
          options: [
            "Requisições GET podem ser refeitas por engines de busca, pré-visualizações de link e pelo botão \"voltar\" do navegador, causando exclusões acidentais e repetidas",
            "GET deveria ser reservado para operações seguras (que não alteram o estado do servidor); ações destrutivas deveriam usar POST/DELETE",
            "doGet() é tecnicamente mais rápido que doPost() para excluir dados no banco",
            "Não há problema algum — GET e POST são sempre intercambiáveis em qualquer situação"
          ],
          correct: [0, 1],
          hint: "Pense em quem pode “acionar” uma URL sem querer: um crawler, um proxy, um usuário clicando voltar. GET deveria ser uma operação segura, sem efeitos colaterais.",
          successFlavor: "Você sente um arrepio. Ações destrutivas escondidas atrás de um simples link são exatamente o tipo de armadilha que derruba sistemas em produção. Falta pouco."
        }
      ]
    },

    // --------------------------------------------------------------- 10 --
    {
      id: "servlet-seguranca",
      number: 10,
      theme: "server",
      name: "Central de Segurança",
      icon: "🛡️",
      entryFlavor: "Monitores de vigilância, uma gaveta de crachás e um cofre reforçado. A última sala antes da verdade — e a mais perigosa de errar.",
      puzzlePool: [
        {
          id: "servlet-4",
          furniture: "cofre",
          icon: "🔒",
          label: "Cofre da Sessão",
          type: "mc",
          flavor: "Um cofre trancado guarda anotações sobre escopo de dados em uma requisição.",
          prompt: "Um dado gravado com request.setAttribute(\"usuario\", nome) dentro de um Servlet estará disponível:",
          options: [
            "Em qualquer requisição futura do mesmo usuário, mesmo depois de um novo request",
            "Para todos os usuários da aplicação, de forma global",
            "Somente depois que o navegador for reiniciado",
            "Apenas durante o ciclo da requisição atual, até o forward para a View — some após a resposta ser enviada"
          ],
          correct: 3,
          hint: "Compare com session.setAttribute(), que persiste entre requisições. request.setAttribute() é efêmero.",
          clue: "Dentro do cofre: “Request = escopo de uma única requisição. Session = escopo de várias requisições do mesmo usuário.”"
        },
        {
          id: "servlet-5",
          furniture: "quadrohorarios",
          icon: "🗓️",
          label: "Quadro de Horários",
          type: "mc",
          flavor: "Um quadro de horários na parede tem uma anotação sobre sessões de usuário.",
          prompt: "Qual método cria uma nova sessão HTTP caso ela ainda não exista, ou retorna a sessão já existente do usuário?",
          options: [
            "request.getSession()",
            "request.createSession()",
            "request.newSession(true)",
            "response.getSession()"
          ],
          correct: 0,
          hint: "É um método do próprio objeto HttpServletRequest, chamado sem argumentos (ou com true).",
          clue: "Anotado no quadro: “getSession() sem argumento é igual a getSession(true): cria se não existir.”"
        },
        {
          id: "servlet-8",
          furniture: "gavetacrachas",
          icon: "🪪",
          label: "Gaveta de Crachás",
          type: "mc",
          flavor: "Uma gaveta cheia de crachás antigos guarda uma anotação sobre cookies e sessões.",
          prompt: "Qual a diferença principal entre cookies e HttpSession no controle de estado de um usuário?",
          options: [
            "Cookies armazenam dados no SERVIDOR; HttpSession armazena dados no CLIENTE",
            "Cookies são pequenos dados guardados no navegador do CLIENTE; HttpSession guarda dados no SERVIDOR, identificados por um cookie de sessão (JSESSIONID)",
            "Não existe diferença real — são apenas sinônimos técnicos",
            "HttpSession só funciona em aplicações sem nenhum tipo de login"
          ],
          correct: 1,
          hint: "Pense em ONDE cada dado fica fisicamente armazenado, e o que viaja em cada requisição HTTP.",
          clue: "Na gaveta: “O cookie é só um crachá com um número. Os dados de verdade ficam guardados aqui dentro, no servidor.”"
        },
        {
          id: "servlet-9",
          furniture: "cofrereforcado",
          icon: "🔐",
          label: "Cofre Reforçado",
          type: "mc",
          flavor: "Um cofre reforçado guarda um aviso de segurança sobre dados sensíveis em sessão.",
          prompt: "Por que armazenar a senha do usuário em texto puro dentro da HttpSession é uma prática insegura, mesmo que a sessão expire depois de um tempo?",
          options: [
            "Não é insegura — sessões são sempre criptografadas automaticamente pelo container",
            "Se a sessão for exposta (vazamento de memória, outro código no mesmo servidor, fixação de sessão), a senha real fica acessível; o ideal é nunca guardar a senha após autenticar, só um identificador do usuário",
            "HttpSession tecnicamente não permite salvar valores do tipo String",
            "Isso deixa o sistema perceptivelmente mais rápido"
          ],
          correct: 1,
          hint: "Pense no princípio de “menor privilégio”: depois de autenticar, o sistema realmente PRECISA continuar sabendo a senha em texto puro?",
          clue: "No aviso: “Depois do login, guarde quem é o usuário — nunca a senha dele.”"
        }
      ],
      doorPool: [
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Central de Segurança",
          keyPuzzleId: "servlet-5",
          type: "mc",
          flavor: "Uma segunda tela mostra o código de um filtro de autenticação que o professor estava testando.",
          code:
`@WebFilter("/*")
public class AuthFilter implements Filter {
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest hreq = (HttpServletRequest) req;
        if (hreq.getSession().getAttribute("usuario") == null) {
            ((HttpServletResponse) resp).sendRedirect("/login");
            return;
        }
        chain.doFilter(req, resp);
    }
}`,
          prompt: "O que acontece se o método chain.doFilter(req, resp) NÃO for chamado, mesmo quando o usuário está autenticado?",
          options: [
            "Nada muda: o Servlet de destino é chamado normalmente mesmo assim",
            "A requisição para nesse Filter e NUNCA chega ao Servlet de destino, mesmo que o usuário esteja autenticado",
            "O container Java chama o Servlet automaticamente depois de 5 segundos",
            "Um erro de compilação impede o deploy da aplicação"
          ],
          correct: 1,
          hint: "Uma Filter é uma etapa no meio do caminho — sem chamar chain.doFilter(), a requisição nunca segue adiante.",
          successFlavor: "Você sente um arrepio. Um filtro que barra a requisição sem seguir a cadeia teria efeito parecido: tudo trava antes de chegar a algum lugar. A verdade está logo ali."
        },
        {
          furniture: "porta",
          icon: "🚪",
          label: "Porta da Central de Segurança",
          keyPuzzleId: "servlet-4",
          type: "mc",
          flavor: "A porta guarda o código de um logout malfeito, escrito às pressas.",
          code:
`protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
    HttpSession session = req.getSession();
    session.setAttribute("usuario", null);
    resp.sendRedirect("/login");
}`,
          prompt: "Esse código tenta implementar “logout” apenas removendo o atributo \"usuario\". Qual problema de segurança ainda persiste?",
          options: [
            "Nenhum — esse logout está implementado corretamente",
            "A sessão HTTP em si continua ATIVA, com o mesmo identificador; o ideal é chamar session.invalidate() para destruir a sessão por completo",
            "setAttribute nunca pode receber null como valor, então o código nem compila",
            "O redirecionamento para /login está com a sintaxe incorreta"
          ],
          correct: 1,
          hint: "Remover UM atributo não é o mesmo que encerrar a sessão inteira — o identificador de sessão (JSESSIONID) continua válido.",
          successFlavor: "Você sente um arrepio. Uma sessão que nunca morre de verdade é uma porta que parece fechada, mas continua destrancada. A verdade está logo ali."
        }
      ]
    }
  ],

  // As 4 salas-marco que encerram cada bloco temático entregam um dígito ao
  // resolver a porta. Na Sala da Verdade, os 4 dígitos precisam ser
  // combinados na ORDEM CERTA (que não é a ordem em que foram encontrados)
  // para destravar a fechadura final.
  digitRooms: ["html-formularios", "css-layout", "js-dom-eventos", "servlet-seguranca"],

  finalRoom: {
    id: "final",
    name: "Sala da Verdade",
    icon: "🔎",
    entryFlavor: "No centro do laboratório, uma porta reforçada não abre — travada pelo próprio sistema, em loop. Do outro lado, ouve-se batidas fracas. É hora de juntar tudo o que você descobriu em dez salas.",
    orderPrompt: "Primeiro, reconstrua o fluxo de uma requisição em uma aplicação MVC com Servlet. Clique nos cartões na ordem correta:",
    orderSteps: [
      { id: "s1", text: "O navegador do usuário envia uma requisição HTTP (GET/POST) para uma URL" },
      { id: "s2", text: "O container (ex: Tomcat) direciona a requisição ao Servlet mapeado (Controller)" },
      { id: "s3", text: "O Servlet (Controller) processa os parâmetros e aciona o Model para as regras de negócio" },
      { id: "s4", text: "O Model retorna os dados já processados ao Controller" },
      { id: "s5", text: "O Controller encaminha (forward) os dados para a View (JSP/HTML) via RequestDispatcher" },
      { id: "s6", text: "A View renderiza o HTML final, enviado como resposta HTTP ao navegador" }
    ],
    lockPrompt: "Agora, a fechadura numérica da porta. Você recolheu quatro números pelo caminho, anotados no seu caderno de evidências — mas a ordem em que os encontrou NÃO é a combinação certa. Consulte suas anotações, digite os números no teclado abaixo e teste até encontrar a combinação correta.",
    accusationPrompt: "Com base em TODAS as evidências recolhidas, o que realmente aconteceu com o Professor Elias Bastos?",
    accusationOptions: [
      "Ele foi sequestrado por um invasor externo que apagou os rastros",
      "Ele ficou preso tentando depurar um loop infinito de forward no Servlet /painel, que travou o sistema e o isolou no laboratório durante a madrugada",
      "Um erro de CSS quebrou o layout do sistema e ele foi embora com raiva",
      "Ele esqueceu uma tag HTML e o sistema simplesmente parou de funcionar, sem mais consequências"
    ],
    accusationCorrect: 1,
    accusationHint: "Volte à Sala de Controle na memória: o que o código do /painel (ou os filtros e sessões da Central de Segurança) revelavam sobre condições que nunca mudavam?",
    ending: [
      "A porta se destrava com um clique metálico. Do outro lado, o professor Elias Bastos, exausto mas ileso, está sentado ao lado de um servidor desligado.",
      "\"Eu passei horas tentando entender por que o painel não carregava\", ele diz. \"Um forward chamando a si mesmo, sem condição de parada. Eu estava tão perto da resposta quanto você.\"",
      "Graças à sua investigação — cada pista de HTML, CSS, JavaScript, arquitetura MVC e Servlet, sala após sala — o mistério está resolvido. O sistema será corrigido, e o CEDUP tem um novo detetive de código."
    ]
  }
};
