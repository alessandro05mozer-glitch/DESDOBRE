export const SyllabusExatas = [
    {
        id: "mat",
        title: "Matemática",
        desc: "A linguagem universal que decodifica o mundo.",
        format: "serie",
        seasons: [
            {
                id: "mat-s1", title: "Matemática Básica",
                episodes: [
                    { id: "mat-1-1", title: "Sistema de Numeração Decimal", est: "12min", topics: ["Números naturais", "Valor posicional", "Ordens e classes", "Números inteiros", "Reta numérica"] },
                    { id: "mat-1-2", title: "Adição e Subtração", est: "10min", topics: ["Propriedades da adição", "Algoritmo da subtração", "Operações com negativos", "Problemas contextualizados"] },
                    { id: "mat-1-3", title: "Multiplicação e Divisão", est: "12min", topics: ["Propriedades da multiplicação", "Divisão exata e com resto", "Critérios de divisibilidade", "MMC e MDC"] },
                    { id: "mat-1-4", title: "Expressões Numéricas", est: "12min", topics: ["Ordem das operações", "Parênteses, colchetes e chaves", "Expressões com frações", "Expressões mistas"] },
                    { id: "mat-1-5", title: "Frações", est: "15min", topics: ["Fração própria e imprópria", "Frações equivalentes", "Simplificação de frações", "Adição e subtração de frações", "Multiplicação e divisão de frações", "Número misto"] },
                    { id: "mat-1-6", title: "Potenciação", est: "14min", topics: ["Conceito de potência", "Propriedades da potenciação", "Potência de base negativa", "Notação científica", "Potência de potência"] },
                    { id: "mat-1-7", title: "Radiciação", est: "14min", topics: ["Raiz quadrada e cúbica", "Propriedades dos radicais", "Racionalização de denominadores", "Simplificação de radicais", "Operações com radicais"] },
                    { id: "mat-1-8", title: "Produtos Notáveis", est: "15min", topics: ["Quadrado da soma", "Quadrado da diferença", "Produto da soma pela diferença", "Cubo da soma e diferença", "Fatoração"] },
                    { id: "mat-1-23", title: "Regra de Três", est: "15min", topics: ["Grandezas diretamente proporcionais", "Grandezas inversamente proporcionais", "Regra de três simples", "Regra de três composta", "Aplicações no ENEM"] },
                    { id: "mat-1-24", title: "Escalas Numéricas e Porcentagem", est: "16min", topics: ["Escala de redução e ampliação", "Cálculo de porcentagem", "Aumento e desconto percentual", "Porcentagem de porcentagem", "Aplicações em gráficos e tabelas"] },
                    { id: "mat-1-25", title: "Juros Simples", est: "14min", topics: ["Capital, taxa e tempo", "Fórmula J = C·i·t", "Montante M = C + J", "Aplicações financeiras", "Resolução de problemas"] },
                    { id: "mat-1-26", title: "Juros Compostos", est: "15min", topics: ["Fórmula M = C(1+i)^t", "Diferença para juros simples", "Taxa equivalente", "Função exponencial nos juros", "Comparação entre modalidades"] }
                ]
            },
            {
                id: "mat-s2", title: "Conjuntos e Funções",
                episodes: [
                    { id: "mat-2-1", title: "Teoria dos Conjuntos", est: "14min", topics: ["Pertinência e inclusão", "União e interseção", "Diferença e complementar", "Diagrama de Venn", "Problemas com conjuntos no ENEM"] },
                    { id: "mat-2-3", title: "Função do Primeiro Grau", est: "16min", topics: ["Definição de função", "f(x) = ax + b", "Coeficiente angular e linear", "Gráfico: reta", "Zero da função", "Função crescente e decrescente"] },
                    { id: "mat-2-4", title: "Função do Segundo Grau", est: "18min", topics: ["f(x) = ax² + bx + c", "Parábola: concavidade", "Vértice e eixo de simetria", "Discriminante Δ", "Fórmula de Bhaskara", "Estudo do sinal"] }
                ]
            },
            {
                id: "mat-s3", title: "Logaritmos e Exponenciais", isLocked: true, episodes: []
            },
            {
                id: "mat-s4", title: "Trigonometria", isLocked: true, episodes: []
            },
            {
                id: "mat-s5", title: "Progressões e Matrizes", isLocked: true, episodes: []
            },
            {
                id: "mat-s6", title: "Geometria Plana",
                episodes: [
                    { id: "mat-6-2", title: "Triângulos", est: "18min", topics: ["Classificação por lados e ângulos", "Soma dos ângulos internos", "Congruência (LLL, LAL, ALA)", "Semelhança de triângulos", "Teorema de Pitágoras", "Relações métricas"] },
                    { id: "mat-6-3", title: "Polígonos", est: "16min", topics: ["Polígonos regulares e irregulares", "Soma dos ângulos internos", "Número de diagonais", "Área de polígonos regulares", "Polígonos inscritos e circunscritos"] },
                    { id: "mat-6-6", title: "Circunferência e Círculo", est: "18min", topics: ["Circunferência vs círculo", "Raio, diâmetro e corda", "Comprimento da circunferência", "Área do círculo", "Setor circular e coroa circular", "Ângulos na circunferência"] }
                ]
            },
            {
                id: "mat-s7", title: "Geometria Espacial",
                episodes: [
                    { id: "mat-7-2", title: "Poliedros e Prismas", est: "18min", topics: ["Poliedros de Platão", "Relação de Euler: V-A+F=2", "Prisma: elementos e classificação", "Área lateral e total do prisma", "Volume do prisma"] },
                    { id: "mat-7-3", title: "Pirâmides", est: "16min", topics: ["Elementos da pirâmide", "Pirâmide regular", "Área lateral e total", "Volume: V = 1/3·Ab·h", "Tronco de pirâmide"] },
                    { id: "mat-7-4", title: "Cilindros e Cones", est: "18min", topics: ["Cilindro: elementos e classificação", "Volume e área do cilindro", "Cone: elementos", "Volume e área do cone", "Tronco de cone"] },
                    { id: "mat-7-5", title: "Esfera", est: "15min", topics: ["Volume da esfera V = 4/3πr³", "Área da esfera A = 4πr²", "Fuso e cunha esférica", "Calota esférica"] }
                ]
            }
        ]
    },
    {
        id: "port",
        title: "Português",
        desc: "Domine a língua. Domine a comunicação.",
        format: "serie",
        seasons: [
            {
                id: "port-s1", title: "Morfologia",
                episodes: [
                    { id: "port-1-1", title: "Substantivo, Artigo, Adjetivo e Numeral", est: "15min", topics: ["Classificação de substantivos", "Artigos definidos e indefinidos", "Adjetivo: concordância e locução", "Numeral: cardinal, ordinal, multiplicativo"] },
                    { id: "port-1-2", title: "Pronomes", est: "16min", topics: ["Pronomes pessoais do caso reto e oblíquo", "Pronomes possessivos e demonstrativos", "Pronomes relativos", "Pronomes indefinidos", "Colocação pronominal: próclise, mesóclise e ênclise"] },
                    { id: "port-1-3", title: "Verbos", est: "18min", topics: ["Conjugações verbais", "Tempos e modos verbais", "Verbos regulares e irregulares", "Verbos auxiliares", "Locuções verbais", "Vozes verbais: ativa, passiva e reflexiva"] },
                    { id: "port-1-6", title: "Conjunções", est: "16min", topics: ["Conjunções coordenativas", "Aditivas, adversativas e alternativas", "Conjunções subordinativas", "Causais, concessivas e temporais", "Semântica das conjunções"] }
                ]
            },
            {
                id: "port-s2", title: "Sintaxe",
                episodes: [
                    { id: "port-2-1", title: "Conceitos, Oração e Sujeitos", est: "16min", topics: ["Frase, oração e período", "Sujeito simples e composto", "Sujeito oculto e indeterminado", "Oração sem sujeito", "Predicado verbal, nominal e verbo-nominal"] },
                    { id: "port-2-7", title: "Orações Subordinadas Substantivas", est: "18min", topics: ["Oração subordinada subjetiva", "Oração objetiva direta e indireta", "Completiva nominal", "Predicativa", "Apositiva"] },
                    { id: "port-2-13", title: "Crase", est: "15min", topics: ["Regra geral: a + a", "Casos obrigatórios", "Casos proibidos", "Crase facultativa", "Crase antes de pronomes", "Dicas práticas para o ENEM"] },
                    { id: "port-2-14", title: "Pontuação", est: "14min", topics: ["Uso da vírgula", "Ponto e vírgula", "Dois-pontos", "Travessão e parênteses", "Aspas e reticências", "Pontuação e sentido"] }
                ]
            }
        ]
    },
    {
        id: "lit",
        title: "Literatura",
        desc: "As palavras que moldaram gerações.",
        format: "minisserie",
        seasons: [
            {
                id: "lit-s1", title: "Literatura Brasileira",
                episodes: [
                    { id: "lit-1-5", title: "Romantismo", est: "18min", topics: ["Contexto histórico: Independência", "1ª geração: nacionalismo e indianismo", "Gonçalves Dias e José de Alencar", "2ª geração: ultrarromantismo e mal do século", "Álvares de Azevedo e Casimiro de Abreu", "3ª geração: condoreirismo e Castro Alves"] },
                    { id: "lit-1-6", title: "Realismo", est: "16min", topics: ["Contexto: abolição e República", "Objetividade e crítica social", "Machado de Assis: maturidade literária", "Dom Casmurro e Memórias Póstumas", "Naturalismo: Aluísio Azevedo", "O Cortiço e determinismo"] },
                    { id: "lit-1-11", title: "Semana de Arte Moderna", est: "18min", topics: ["Contexto de 1922", "Ruptura com academicismo", "Mário de Andrade e Macunaíma", "Oswald de Andrade e Manifesto Antropófago", "Tarsila do Amaral e modernismo visual", "Impacto cultural"] },
                    { id: "lit-1-12", title: "Primeira Fase do Modernismo", est: "18min", topics: ["Fase heroica (1922-1930)", "Experimentação formal", "Língua brasileira na literatura", "Manuel Bandeira", "Carlos Drummond de Andrade", "Características e legado"] }
                ]
            }
        ]
    },
    {
        id: "red",
        title: "Redação",
        desc: "Sua voz no papel vale 1000 pontos.",
        format: "minisserie",
        seasons: [
            {
                id: "red-s1", title: "A Redação do ENEM",
                episodes: [
                    { id: "red-1-1", title: "Construção de um Texto e Aspectos Textuais", est: "16min", topics: ["Coesão textual", "Coerência textual", "Progressão temática", "Elementos de conexão", "Parágrafo e estrutura"] },
                    { id: "red-1-3", title: "Texto Dissertativo-Argumentativo", est: "18min", topics: ["Tese e argumentação", "Tipos de argumento", "Introdução: contextualização e tese", "Desenvolvimento: argumentação", "Conclusão: proposta de intervenção", "Repertório sociocultural"] },
                    { id: "red-1-5", title: "Competências da Redação do ENEM", est: "20min", topics: ["Competência 1: norma culta", "Competência 2: compreensão do tema", "Competência 3: seleção de argumentos", "Competência 4: mecanismos linguísticos", "Competência 5: proposta de intervenção", "Critérios de avaliação detalhados"] }
                ]
            }
        ]
    }
];
