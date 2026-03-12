export const CATALOG = [
    {
        id: "t1",
        titulo: "História",
        materia: "historia",
        descricao: "Do passado que explica o presente. Revoltas, impérios e a construção do Brasil.",
        episodios: [
            { id: "t1e1", titulo: "Grécia Antiga", assunto: "Grécia Antiga", duracao: "22min", topicos: ["Períodos da Grécia", "Atenas e democracia", "Esparta e militarismo", "Guerras Médicas e Peloponeso", "Período Helenístico"], descricao: "A democracia ateniense, o militarismo espartano e o legado grego.", tags: ["Antiguidade", "Política", "Filosofia"], quiz: { pergunta: "Qual cidade-estado grega era conhecida por seu sistema democrático?", alternativas: ["A) Esparta", "B) Atenas", "C) Corinto", "D) Tebas"], correta: 1 } },
            { id: "t1e2", titulo: "Roma Antiga", assunto: "Roma Antiga", duracao: "22min", topicos: ["Monarquia romana", "República: Senado", "Expansão e guerras púnicas", "Império Romano", "Crise"], descricao: "Da fundação lendária à queda do maior império.", tags: ["Antiguidade", "Império", "República"] },
            { id: "t1e3", titulo: "Feudalismo", assunto: "Feudalismo", duracao: "20min", topicos: ["Suserania e vassalagem", "Igreja Católica", "Renascimento comercial", "Peste Negra", "Crise"], descricao: "A organização social da Europa medieval.", tags: ["Medieval", "Europa"] },
            { id: "t1e4", titulo: "Reforma Protestante", assunto: "Reforma Protestante", duracao: "15min", topicos: ["Lutero", "Calvinismo", "Anglicanismo", "Contrarreforma"], descricao: "A ruptura com Roma.", tags: ["Religião", "Europa"] },
            { id: "t1e5", titulo: "Revolução Francesa", assunto: "Revolução Francesa", duracao: "22min", topicos: ["Crise Absolutista", "Queda da Bastilha", "Direitos", "O Terror"], descricao: "Liberdade, Igualdade, Fraternidade.", tags: ["Revolução", "Iluminismo"], quiz: { pergunta: "Em que ano ocorreu a Queda da Bastilha?", alternativas: ["A) 1776", "B) 1789", "C) 1799", "D) 1804"], correta: 1 } },
            { id: "t1e6", titulo: "Era Vargas", assunto: "Era Vargas", duracao: "22min", topicos: ["Revolução de 1930", "Governo Provisório", "Constituição de 1934", "Estado Novo", "CLT"], descricao: "Getúlio Vargas e suas transformações.", tags: ["Brasil", "República"] },
            { id: "t1e7", titulo: "Segunda Guerra Mundial", assunto: "Segunda Guerra Mundial", duracao: "25min", topicos: ["Causas", "Invasão da Polônia", "Holocausto", "Bombas atômicas", "ONU"], descricao: "O conflito mais devastador da história.", tags: ["Guerras", "Geopolítica"], quiz: { pergunta: "O Holocausto foi perpetrado pelo regime:", alternativas: ["A) Fascista", "B) Nazista", "C) Franquista", "D) Militarista"], correta: 1 } },
            { id: "t1e8", titulo: "Regime Militar", assunto: "Regime Militar Brasileiro", duracao: "25min", topicos: ["Golpe de 1964", "AI-5", "Milagre econômico", "Diretas Já"], descricao: "21 anos de ditadura militar no Brasil.", tags: ["Brasil", "Ditadura"] }
        ]
    },
    {
        id: "t2",
        titulo: "Matemática",
        materia: "matematica",
        descricao: "Números, funções e raciocínio lógico. A linguagem do universo.",
        episodios: [
            { id: "t2e1", titulo: "Funções", assunto: "Funções do 1º e 2º Grau", duracao: "25min", topicos: ["Função afim", "Função quadrática", "Vértice", "Delta"], descricao: "Domínio de funções do primeiro e segundo grau.", tags: ["Álgebra", "Gráficos"], quiz: { pergunta: "Na função f(x) = 2x + 3, qual é o coeficiente angular?", alternativas: ["A) 3", "B) 2", "C) 5", "D) 1"], correta: 1 } },
            { id: "t2e2", titulo: "Progressões", assunto: "PA e PG", duracao: "20min", topicos: ["PA", "Fórmula da PA", "PG", "Soma de PG"], descricao: "Sequências numéricas no ENEM.", tags: ["Sequências", "Álgebra"] },
            { id: "t2e3", titulo: "Geometria Plana", assunto: "Geometria Plana", duracao: "22min", topicos: ["Triângulos", "Pitágoras", "Círculo", "Áreas"], descricao: "Formas e medidas planas.", tags: ["Geometria"], quiz: { pergunta: "Área do quadrado de lado 4:", alternativas: ["A) 8", "B) 16", "C) 12", "D) 20"], correta: 1 } },
            { id: "t2e4", titulo: "Geometria Espacial", assunto: "Geometria Espacial", duracao: "22min", topicos: ["Prismas", "Cilindro", "Volumes", "Planificação"], descricao: "Volumes e áreas de sólidos geométricos.", tags: ["Geometria", "Volumes"] },
            { id: "t2e5", titulo: "Trigonometria", assunto: "Trigonometria", duracao: "20min", topicos: ["Seno", "Cosseno", "Tangente", "Lei dos senos"], descricao: "Relações trigonométricas.", tags: ["Ângulos"] },
            { id: "t2e6", titulo: "Estatística", assunto: "Estatística e Probabilidade", duracao: "20min", topicos: ["Média", "Moda", "Mediana", "Probabilidade"], descricao: "Análise de dados.", tags: ["Estatística", "Dados"], quiz: { pergunta: "A probabilidade de um evento impossível é:", alternativas: ["A) 1", "B) 0.5", "C) 0", "D) 100"], correta: 2 } },
            { id: "t2e7", titulo: "Análise Combinatória", assunto: "Análise Combinatória", duracao: "18min", topicos: ["Princípio multiplicativo", "Permutação", "Combinação"], descricao: "Contagem e arranjos.", tags: ["Combinatória", "Contagem"] },
            { id: "t2e8", titulo: "Mat. Financeira", assunto: "Porcentagem e Juros", duracao: "18min", topicos: ["Porcentagem", "Juros simples", "Juros compostos"], descricao: "Aplicações financeiras.", tags: ["Financeiro", "Porcentagem"] }
        ]
    },
    {
        id: "t3",
        titulo: "Química",
        materia: "quimica",
        descricao: "Reações, elementos e a matéria em toda sua transformação.",
        episodios: [
            { id: "t3e1", titulo: "Tabela Periódica", assunto: "Tabela Periódica", duracao: "20min", topicos: ["Organização", "Famílias", "Metais", "Gases nobres"], descricao: "Os elementos do universo.", tags: ["Elementos", "Propriedades"], quiz: { pergunta: "Símbolo do Sódio?", alternativas: ["A) So", "B) Sd", "C) Na", "D) N"], correta: 2 } },
            { id: "t3e2", titulo: "Ligações Químicas", assunto: "Ligações Químicas", duracao: "20min", topicos: ["Covalente", "Iônica", "Metálica", "Geometria molecular"], descricao: "Como os átomos se unem.", tags: ["Ligações", "Moléculas"] },
            { id: "t3e3", titulo: "Reações e Estequiometria", assunto: "Estequiometria e Reações Químicas", duracao: "22min", topicos: ["Balanceamento", "Rendimento", "Limitante"], descricao: "Cálculos químicos.", tags: ["Cálculos"] },
            { id: "t3e4", titulo: "Termoquímica", assunto: "Termoquímica", duracao: "18min", topicos: ["Entalpia", "Lei de Hess", "Reações Exotérmicas"], descricao: "Energia nas reações.", tags: ["Energia", "Calor"] },
            { id: "t3e5", titulo: "Eletroquímica", assunto: "Eletroquímica", duracao: "20min", topicos: ["Pilhas", "Eletrólise", "Corrosão"], descricao: "Eletricidade e reações químicas.", tags: ["Pilhas"] },
            { id: "t3e6", titulo: "Química Orgânica", assunto: "Química Orgânica", duracao: "25min", topicos: ["Funções", "Hidrocarbonetos", "Isomeria"], descricao: "O mundo do carbono.", tags: ["Orgânica", "Carbono"], quiz: { pergunta: "Função com -OH?", alternativas: ["A) Ácido carboxílico", "B) Álcool", "C) Éter", "D) Amina"], correta: 1 } },
            { id: "t3e7", titulo: "Soluções", assunto: "Soluções", duracao: "18min", topicos: ["Concentração", "Mistura", "Coloides"], descricao: "Misturas homogêneas.", tags: ["Misturas"] },
            { id: "t3e8", titulo: "Equilíbrio Químico", assunto: "Equilíbrio Químico", duracao: "20min", topicos: ["Constante Kc", "Le Chatelier", "pH", "Tampões"], descricao: "Reações reversíveis.", tags: ["pH", "Ácidos e Bases"] }
        ]
    },
    {
        id: "t4",
        titulo: "Biologia",
        materia: "biologia",
        descricao: "A vida em toda sua complexidade — células, genes e ecossistemas.",
        episodios: [
            { id: "t4e1", titulo: "Citologia", assunto: "Citologia", duracao: "22min", topicos: ["Organelas", "Membrana", "Divisão celular"], descricao: "A célula.", tags: ["Célula", "Organelas"], quiz: { pergunta: "Respiração celular?", alternativas: ["A) Ribossomo", "B) Mitocôndria", "C) Cloroplasto", "D) Lisossomo"], correta: 1 } },
            { id: "t4e2", titulo: "Genética", assunto: "Genética", duracao: "25min", topicos: ["Leis de Mendel", "Heredograma", "Dominância", "Grupos sanguíneos"], descricao: "As leis da herança genética.", tags: ["Genética", "DNA"] },
            { id: "t4e3", titulo: "Evolução", assunto: "Evolução e Biologia", duracao: "20min", topicos: ["Mutações", "Darwin", "Seleção natural", "Especiação"], descricao: "A teoria da evolução.", tags: ["Evolução", "Seleção Natural"] },
            { id: "t4e4", titulo: "Ecologia", assunto: "Ecologia", duracao: "22min", topicos: ["Cadeias alimentares", "Biomas", "Sucessão Ecológica"], descricao: "Relações entre seres vivos.", tags: ["Ecologia"] },
            { id: "t4e5", titulo: "Botânica", assunto: "Botânica", duracao: "20min", topicos: ["Grupos", "Fotossíntese", "Reprodução vegetal"], descricao: "O reino vegetal.", tags: ["Plantas"] },
            { id: "t4e6", titulo: "Zoologia", assunto: "Zoologia", duracao: "20min", topicos: ["Vertebrados", "Invertebrados", "Adaptações"], descricao: "Classificação animal.", tags: ["Animais", "Fisiologia"] },
            { id: "t4e7", titulo: "Fisiologia Humana", assunto: "Fisiologia Humana", duracao: "25min", topicos: ["Nervoso", "Endócrino", "Circulatório", "Digestório"], descricao: "Sistemas do corpo.", tags: ["Corpo Humano"] },
            { id: "t4e8", titulo: "Saúde e Meio Ambiente", assunto: "Saúde e Meio Ambiente Biologia", duracao: "18min", topicos: ["Patógenos", "Vírus e Bactérias", "Sustentabilidade"], descricao: "Pandemias ecológicas.", tags: ["Saúde", "Conservação"] }
        ]
    },
    {
        id: "t5",
        titulo: "Física",
        materia: "fisica",
        descricao: "As leis invisíveis que governam o universo — do átomo ao cosmos.",
        episodios: [
            { id: "t5e1", titulo: "Cinemática", assunto: "Cinemática", duracao: "22min", topicos: ["Movimento", "Gráficos", "Queda livre", "Lançamento"], descricao: "O movimento dos corpos.", tags: ["Velocidade", "Aceleração"], quiz: { pergunta: "Correr 120km em 2h. Vm?", alternativas: ["A) 240", "B) 60", "C) 30", "D) 90"], correta: 1 } },
            { id: "t5e2", titulo: "Dinâmica", assunto: "Dinâmica Forças e Leis de Newton", duracao: "22min", topicos: ["Inércia", "Ação e reação", "Atrito"], descricao: "As leis de Newton.", tags: ["Newton", "Força"] },
            { id: "t5e3", titulo: "Trabalho e Energia", assunto: "Energia e Trabalho", duracao: "20min", topicos: ["Cinética", "Potencial", "Conservação"], descricao: "As formas de energia.", tags: ["Trabalho", "Conservação"] },
            { id: "t5e4", titulo: "Hidrostática", assunto: "Hidrostática", duracao: "18min", topicos: ["Pressão", "Empuxo", "Arquimedes"], descricao: "Fluidos em repouso.", tags: ["Fluidos"] },
            { id: "t5e5", titulo: "Termologia", assunto: "Termologia", duracao: "20min", topicos: ["Calorimetria", "Temperatura", "Dilatação térmica"], descricao: "Termodinâmica básica.", tags: ["Calor", "Termodinâmica"] },
            { id: "t5e6", titulo: "Eletrostática", assunto: "Eletrostática", duracao: "22min", topicos: ["Cargas", "Lei de Coulomb", "Campo elétrico"], descricao: "Cargas em repouso.", tags: ["Cargas"], quiz: { pergunta: "Corpos com cargas iguais:", alternativas: ["A) Atraem", "B) Repelem", "C) Ignoram", "D) Explodem"], correta: 1 } },
            { id: "t5e7", titulo: "Eletrodinâmica", assunto: "Eletrodinâmica Circuitos", duracao: "20min", topicos: ["Lei de Ohm", "Circuitos paralelos e série", "Potência"], descricao: "Circuitos dinâmicos.", tags: ["Corrente elétrica", "Resistência"] },
            { id: "t5e8", titulo: "Ondulatória", assunto: "Ondulatória e Óptica", duracao: "22min", topicos: ["Luz", "Lentes", "Ondas e Doppler"], descricao: "Som e espectro luminoso.", tags: ["Óptica", "Som"] }
        ]
    },
    {
        id: "t6",
        titulo: "Geografia",
        materia: "geografia",
        descricao: "O mundo é maior do que você imagina — espaço, sociedade e natureza.",
        episodios: [
            { id: "t6e1", titulo: "Geopolítica", assunto: "Geopolítica Mundial", duracao: "22min", topicos: ["Guerra Fria", "BRICS", "Conflitos do século 21"], descricao: "Poder no mundo contemporâneo.", tags: ["Poder", "Relações Internacionais"] },
            { id: "t6e2", titulo: "Urbanização", assunto: "Urbanização", duracao: "20min", topicos: ["Metropolização", "Problemas urbanos", "Gentrificação"], descricao: "Cidades e desafios.", tags: ["Cidades"] },
            { id: "t6e3", titulo: "Clima", assunto: "Climatologia Geografia", duracao: "22min", topicos: ["Massas de ar", "El Niño", "Tipos Climáticos"], descricao: "Climatologia brasileira.", tags: ["Clima"] },
            { id: "t6e4", titulo: "Indústria", assunto: "Industrialização Global e Brasileira", duracao: "20min", topicos: ["Blocos Econômicos", "Fases Industriais", "Globalização"], descricao: "Globalização e blocos.", tags: ["Economia", "Globalização"] },
            { id: "t6e5", titulo: "Recursos Naturais", assunto: "Matriz Energética e Recursos", duracao: "20min", topicos: ["Energias renováveis", "Pré-sal", "Petróleo"], descricao: "A geopolítica dos recursos.", tags: ["Sustentabilidade", "Combustíveis"] },
            { id: "t6e6", titulo: "Meio Ambiente Global", assunto: "Conferências Ambientais", duracao: "22min", topicos: ["COP", "Aquecimento Global", "Agenda 2030"], descricao: "A crise ambiental.", tags: ["Meio Ambiente"], quiz: { pergunta: "Acordo de Paris busca:", alternativas: ["A) Poluição rio", "B) Aquecimento global", "C) Solo", "D) Amazônia"], correta: 1 } },
            { id: "t6e7", titulo: "Cartografia", assunto: "Cartografia", duracao: "18min", topicos: ["Escala", "Projeções", "Fusos"], descricao: "Instrumentalização geográfica.", tags: ["Mapas"] },
            { id: "t6e8", titulo: "América Latina", assunto: "América Latina Geografia e Dependência", duracao: "18min", topicos: ["Desenvolvimento", "Indígenas", "Conflitos Sociais"], descricao: "Cultura e dependência.", tags: ["Cultura", "América Latina"] }
        ]
    },
    {
        id: "t7",
        titulo: "Redação",
        materia: "redacao",
        descricao: "Sua voz no papel. Argumentação, repertório e a nota 1000.",
        episodios: [
            { id: "t7e1", titulo: "Estrutura", assunto: "Estrutura da Redação ENEM", duracao: "20min", topicos: ["Tese", "Argumentos", "Parágrafos", "Conclusão"], descricao: "Os fundamentos da dissertação.", tags: ["ENEM", "Dissertação"], quiz: { pergunta: "As competências avaliadas no ENEM são:", alternativas: ["A) 3", "B) 4", "C) 5", "D) 6"], correta: 2 } },
            { id: "t7e2", titulo: "Competências I e II", assunto: "Competências I e II ENEM", duracao: "18min", topicos: ["Norma culta", "Gramática", "Abordagem do Tema"], descricao: "Dominando a língua portuguesa e o tema.", tags: ["Gramática"] },
            { id: "t7e3", titulo: "Competências III e IV", assunto: "Competências III e IV ENEM", duracao: "20min", topicos: ["Repertório", "Coesão Textual", "Progressão"], descricao: "Conectores lógicos e a sua defesa.", tags: ["Coesão", "Repertório"] },
            { id: "t7e4", titulo: "A Proposta de Intervenção", assunto: "Competência V Proposta ENEM", duracao: "18min", topicos: ["Agente", "Ação", "Modo", "Efeito", "Detalhamento"], descricao: "O segredo da intervenção.", tags: ["Intervenção"], quiz: { pergunta: "Quantos elementos na proposta 1000?", alternativas: ["A) 3", "B) 4", "C) 5", "D) 6"], correta: 2 } },
            { id: "t7e5", titulo: "Repertório Cultural", assunto: "Repertório Sociocultural Redação", duracao: "22min", topicos: ["Cinema", "Filósofos", "História e Atualidades"], descricao: "Evidenciando um texto analítico.", tags: ["Cultura", "Ales", "Filmes"] },
            { id: "t7e6", titulo: "Eixos Temáticos", assunto: "Eixos Temáticos ENEM", duracao: "20min", topicos: ["Direitos Humanos", "Ecologia", "Tecnologia e Redes"], descricao: "Como estudar por eixos.", tags: ["Temas"] },
            { id: "t7e7", titulo: "Coerência", assunto: "Coesão e Coerência Redação", duracao: "18min", topicos: ["Conectivos", "Evitar redundância e clichês"], descricao: "Escrevendo um texto fluido.", tags: ["Conectivos"] },
            { id: "t7e8", titulo: "Análise Nota 1000", assunto: "Análise Redações Nota 1000", duracao: "25min", topicos: ["Estudo de caso", "Erro comuns"], descricao: "Lendo e dissecando os campeões.", tags: ["Análise", "Excelência"] }
        ]
    },
    {
        id: "t8",
        titulo: "Sociologia e Filosofia",
        materia: "socfilo",
        descricao: "Questionar é o primeiro passo. A sociedade não é natural.",
        episodios: [
            { id: "t8e1", titulo: "Marx e Materialismo", assunto: "Karl Marx Sociologia", duracao: "20min", topicos: ["Mais-valia", "Materialismo histórico", "Luta de classes"], descricao: "A estrutura de opressão na visão marxista.", tags: ["Marx", "Luta de classes"], quiz: { pergunta: "A contradição é entre:", alternativas: ["A) Pobres/ricos", "B) Burguesia/Proletariado", "C) Governo/Povo", "D) Índios/Portugueses"], correta: 1 } },
            { id: "t8e2", titulo: "Durkheim e o Fato Social", assunto: "Durkheim Sociologia", duracao: "18min", topicos: ["Coerção", "Solidariedade Orgânica", "Anomia"], descricao: "A metodologia de Durkheim.", tags: ["Durkheim", "Fato Social"] },
            { id: "t8e3", titulo: "Max Weber", assunto: "Max Weber Sociologia Compreensiva", duracao: "18min", topicos: ["Ação Social", "Tipos de Dominação", "Burocracia"], descricao: "Indivíduo e racionalização social.", tags: ["Weber", "Dominação"] },
            { id: "t8e4", titulo: "Contratualistas", assunto: "Hobbes Locke Rousseau", duracao: "20min", topicos: ["Hobbes (Leviatã)", "Locke (Direitos Naturais)", "Rousseau (Vontade Geral)"], descricao: "Como o Estado nasceu.", tags: ["Política", "Filosofia Moderna"] },
            { id: "t8e5", titulo: "Filosofia Antiga", assunto: "Sócrates Platão Aristóteles", duracao: "20min", topicos: ["Sócrates", "Mito da Caverna", "Aristóteles: Ética"], descricao: "Os clássicos fundadores.", tags: ["Antiga", "Ética"], quiz: { pergunta: "Autor da Caverna:", alternativas: ["A) Aristóteles", "B) Sócrates", "C) Platão", "D) Tales"], correta: 2 } },
            { id: "t8e6", titulo: "Movimentos Sociais", assunto: "Movimentos Sociais Sociologia", duracao: "18min", topicos: ["Ambientalismo", "Feminismo", "Ação Afirmativa"], descricao: "Sociologia Brasileira e mobilização.", tags: ["Movimentos"] },
            { id: "t8e7", titulo: "Foucault", assunto: "Michel Foucault", duracao: "18min", topicos: ["Biopoder", "Vigiar e Punir", "Microfísica do Poder"], descricao: "Onde o poder e o saber se interceptam.", tags: ["Poder Contemporâneo", "Foucault"] },
            { id: "t8e8", titulo: "Escola de Frankfurt", assunto: "Escola de Frankfurt Indústria Cultural", duracao: "18min", topicos: ["Indústria Cultural", "Alienação", "Adorno e Horkheimer"], descricao: "Arte e consumo de massa.", tags: ["Frankfurt", "Cultura Crítica"] }
        ]
    }
];
