import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════
interface Topic { id: string; title: string; content: string; duration: string }
interface Episode { id: string; title: string; icon: string; topics: Topic[] }
interface Season { id: string; title: string; episodes: Episode[] }
interface Subject { id: string; name: string; icon: string; description: string; gradient: string; seasons: Season[] }
interface Film { id: string; icon: string; title: string; works: string[]; desc: string; tip: string }
interface Mini { id: string; icon: string; title: string; desc: string; episodes: string[] }
interface Trail { id: string; title: string; badge: string; duration: string; desc: string; subjects: string[] }
interface EpProgress { theory: boolean; questions: boolean; review: boolean; completedAt: number | null }
type View = 'home' | 'dashboard' | 'series' | `subject_${string}` | 'miniseries' | 'films' | 'trails' | 'diagnostic' | 'guide' | 'cronograma';

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
const sg = <T,>(k: string, fb: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb } };
const ss = <T,>(k: string, v: T): void => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { } };

const mkEp = (title: string, icon = "📚"): Episode => ({
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50), title, icon,
    topics: [
        { id: 't1', title: 'Conceitos Fundamentais', content: 'Introdução ao tema com definições, contexto histórico e conceitos essenciais cobrados no ENEM.', duration: '12 min' },
        { id: 't2', title: 'Aprofundamento e Análise', content: 'Análise detalhada com exemplos, casos práticos e conexões interdisciplinares.', duration: '15 min' },
        { id: 't3', title: 'Questões e Estratégia', content: 'Como o tema aparece nas provas do ENEM. Resolução comentada e pegadinhas frequentes.', duration: '10 min' },
    ]
});

const mkSeason = (id: string, title: string, eps: string[], icon = "📚"): Season => ({ id, title, episodes: eps.map(e => mkEp(e, icon)) });

// --- 
// DATA: SUBJECTS
// --- 
const SUBJECTS: Subject[] = [
    {
        id: 'geo', name: 'Geografia', icon: '🌍', description: 'O mundo é maior do que você imagina.', gradient: 'from-blue-600 to-cyan-600', seasons: [
            mkSeason('geo-t1', 'Demografia', ['Conceitos e introdução', 'Pirâmides e transição demográfica'], '🌍'),
            mkSeason('geo-t2', 'Indústria', ['1ª/2ª Rev. Industrial', 'Ind. Brasileira', 'Tipos de indústria', '3ª/4ª Rev.', 'Modelos econômicos', 'Transporte', 'Blocos econômicos', 'Energia'], '🌍'),
            mkSeason('geo-t3', 'Geopolítica', ['Velha e nova ordem mundial', 'Conflitos Europa/Ásia'], '🌍'),
            mkSeason('geo-t4', 'Sociedade', ['Migrações', 'Mapa do Brasil', 'Regionalização', 'Urbanização'], '🌍'),
            mkSeason('geo-t5', 'Agrária', ['Uso da terra', 'Fatores naturais', 'Agropecuária BR'], '🌍'),
            mkSeason('geo-t6', 'Ambiente', ['Problemas ambientais', 'Conferências'], '🌍'),
            mkSeason('geo-t7', 'Cartografia', ['Representações', 'Projeções', 'Movimentos da Terra', 'Coordenadas/fusos'], '🌍'),
            mkSeason('geo-t8', 'Física da Terra', ['Relevo/rochas', 'Modelagem', 'Relevo mundial', 'Relevo BR', 'Solos', 'Mineração', 'Hidrografia', 'Climatologia', 'Biogeografia'], '🌍'),
            mkSeason('geo-t9', 'Mundo', ['África', 'Oriente Médio', 'América Latina'], '🌍'),
        ]
    },
    {
        id: 'his', name: 'História', icon: '📜', description: 'O passado explica o presente.', gradient: 'from-amber-600 to-red-600', seasons: [
            mkSeason('his-t1', 'Antiga', ['Cronologia/Mesopotâmia', 'Egito/Fenícios', 'Persas/Hebreus', 'Grécia', 'Roma'], '📜'),
            mkSeason('his-t2', 'Medieval', ['Impérios medievais', 'Alta/Baixa Idade Média'], '📜'),
            mkSeason('his-t3', 'Moderna', ['Estados modernos', 'Renascimento', 'Reforma Protestante', 'Expansão marítima', 'Civilizações pré-colombianas', 'América Espanhola', 'Revoluções Inglesas'], '📜'),
            mkSeason('his-t4', 'Contemporânea', ['Rev.Industrial/Iluminismo', 'Colonização americana', 'Expansão EUA', 'Rev.Francesa', 'Era Napoleônica', 'Ind.América Espanhola', 'Imperialismo norte-americano', 'Ideais séc.XIX', 'Unificações italiana/alemã', '2ª Rev./Neocolonialismo', 'Rev.Mexicana', 'Populismo AL', 'AL séc.XX', '1ªGM', 'Rev.Russa', 'Regimes totalitários', '2ªGM', 'Mundo pós-guerra'], '📜'),
            mkSeason('his-t5', 'Brasil', ['Colonização/açúcar', 'Séc.do ouro', 'Revoltas nativistas', 'Período Joanino', '1ºReinado', 'Regência', '2ºReinado', 'República Velha', 'Era Vargas', 'Dutra/2ºVargas', 'JK/Café Filho', 'Jânio/Jango', 'Regime Militar', 'Brasil Contemporâneo'], '📜'),
        ]
    },
    {
        id: 'soc', name: 'Sociologia', icon: '🏛️', description: 'A sociedade não é natural.', gradient: 'from-pink-600 to-purple-600', seasons: [
            mkSeason('soc-t1', 'Clássicos', ['Surgimento sociologia', 'Comte', 'Marx', 'Durkheim', 'Weber', 'Elias', 'Bourdieu', 'Adorno/Horkheimer/Benjamin'], '🏛️'),
            mkSeason('soc-t2', 'Cultura', ['Cidadania/estratificação', 'Antropologia', 'Democracia/política', 'Movimentos sociais'], '🏛️'),
            mkSeason('soc-t3', 'Brasileiros', ['Freyre', 'Sérgio Buarque', 'Caio Prado', 'Octavio Ianni', 'DaMatta', 'FHC', 'Florestan', 'Darcy Ribeiro', 'Paulo Freire', 'Bauman', 'Simone de Beauvoir'], '🏛️'),
        ]
    },
    {
        id: 'fil', name: 'Filosofia', icon: '🧠', description: 'Questionar é o primeiro passo.', gradient: 'from-violet-600 to-indigo-600', seasons: [
            mkSeason('fil-t1', 'Antiga', ['Mito/filosofia', 'Pré-socráticos', 'Sócrates', 'Platão', 'Aristóteles', 'Helenismo'], '🧠'),
            mkSeason('fil-t2', 'Medieval', ['Patrística/Agostinho', 'Escolástica/Tomás'], '🧠'),
            mkSeason('fil-t3', 'Epistemologia', ['Moral/ética', 'Utilitarismo/estética'], '🧠'),
            mkSeason('fil-t4', 'Política', ['Maquiavel', 'Montesquieu', 'Adam Smith', 'Hobbes/Locke/Rousseau'], '🧠'),
            mkSeason('fil-t5', 'Moderna', ['Descartes', 'Locke/empirismo', 'Kant', 'Hegel', 'Espinoza/Pascal', 'Bacon/Hume', 'Sartre', 'Fenomenologia/Heidegger', 'Nietzsche', 'Freud'], '🧠'),
            mkSeason('fil-t6', 'Analítica', ['Frege', 'Russell', 'Wittgenstein', 'Popper', 'Kuhn'], '🧠'),
            mkSeason('fil-t7', 'Contemporânea', ['Frankfurt', 'Foucault', 'Arendt', 'Rawls/Nozick', 'Habermas', 'Pós-modernismo'], '🧠'),
        ]
    },
    {
        id: 'qui', name: 'Química', icon: '⚗️', description: 'Cada reação conta uma história.', gradient: 'from-emerald-600 to-teal-600', seasons: [
            mkSeason('qui-t1', 'Geral', ['Estados físicos', 'Substâncias/misturas', 'Densidade', 'Alotropia', 'Sep.misturas', 'Água', 'Modelos atômicos', 'Átomo', 'Distr.eletrônica', 'Nºquânticos', 'Tab.periódica', 'Prop.periódicas', 'Lig.iônica', 'Lig.covalente', 'Forças intermoleculares', 'Polaridade', 'Óxidos', 'Ácidos', 'Bases', 'Sais', 'Teorias ácido-base', 'Reações', 'Nox', 'Redox', 'Balanceamento'], '⚗️'),
            mkSeason('qui-t2', 'Estequiometria', ['Leis ponderais', 'Relações numéricas', 'Fórmulas', 'Rel.estequiométricas', 'Gases', 'Pureza/rendimento'], '⚗️'),
            mkSeason('qui-t3', 'Radioatividade', ['Partículas', 'Leis', 'Cinética'], '⚗️'),
            mkSeason('qui-t4', 'Soluções', ['Dispersão', 'Soluções', 'Concentração', 'Diluição', 'Titulação'], '⚗️'),
            mkSeason('qui-t5', 'Coligativas', ['Prop.coligativas'], '⚗️'),
            mkSeason('qui-t6', 'Termoquímica', ['Conceitos/gráficos', 'Entalpia', 'Entropia/Gibbs'], '⚗️'),
            mkSeason('qui-t7', 'Cinética', ['Introdução', 'Fatores'], '⚗️'),
            mkSeason('qui-t8', 'Equilíbrio', ['Kc/Kp', 'Deslocamento', 'Eq.iônico', 'pH/pOH', 'Tampão/Kps'], '⚗️'),
            mkSeason('qui-t9', 'Eletroquímica', ['Pilhas', 'Eletrólise'], '⚗️'),
            mkSeason('qui-t10', 'Orgânica', ['Hibridização', 'Cadeias', 'Hidrocarbonetos', 'Álcool/fenol/ácido', 'Aldeído/éster', 'Éter/amina', 'Haletos', 'Isomeria plana', 'Isomeria geométrica', 'Isomeria óptica', 'Prop.físicas', 'Sub.substituição', 'Adição', 'Oxidação', 'Polímeros', 'Recursos orgânicos'], '⚗️'),
        ]
    },
    {
        id: 'bio', name: 'Biologia', icon: '🧬', description: 'A vida em toda sua complexidade.', gradient: 'from-green-600 to-lime-600', seasons: [
            mkSeason('bio-t1', 'Bioquímica', ['Níveis/água', 'Sais minerais', 'Carboidratos', 'Proteínas/enzimas', 'Lipídios', 'Vitaminas', 'Ácidos nucleicos'], '🧬'),
            mkSeason('bio-t2', 'Ecologia', ['Método científico', 'Dinâmica pop.', 'Relações ecológicas', 'Sucessão', 'Ciclos biogeoquímicos', 'Biociclos/biomas', 'Desequilíbrios'], '🧬'),
            mkSeason('bio-t3', 'Citologia', ['Células/membrana', 'Transporte', 'Citoplasma/organelas', 'Núcleo', 'Fotossíntese', 'Respiração', 'Fermentação', 'Síntese proteínas', 'Mitose', 'Meiose', 'Gametogênese'], '🧬'),
            mkSeason('bio-t4', 'Evolução', ['Origem da vida', 'Evolução', 'Especiação'], '🧬'),
            mkSeason('bio-t5', 'Genética', ['1ªLei Mendel', 'Heredogramas', 'ABO', 'Rh', '2ªLei', 'Genética do sexo', 'Linkage', 'Pleiotropia', 'Mutações'], '🧬'),
            mkSeason('bio-t6', 'Histologia', ['Ep.epitelial', 'Conjuntivos', 'Ósseo/cart.', 'Hematopoiético', 'Muscular', 'Nervoso', 'Digestório', 'Respiratório', 'Cardiovascular', 'Imune', 'Excretor', 'Endócrino', 'Reprodutor', 'Contracepção'], '🧬'),
            mkSeason('bio-t7', 'Microbiologia', ['Classif./taxonomia', 'Vírus', 'Viroses', 'Procariontes', 'Bacterioses', 'Protista', 'Protozooses'], '🧬'),
            mkSeason('bio-t8', 'Micologia', ['Fungi', 'Algas/ciclos'], '🧬'),
            mkSeason('bio-t9', 'Zoologia', ['Intro', 'Poríferos/cnidários', 'Platelmintos/nematóides', 'Verminoses', 'Anelídeos', 'Moluscos', 'Artrópodes', 'Equinodermos', 'Cordados', 'Aves/ruminantes', 'Mamíferos'], '🧬'),
            mkSeason('bio-t10', 'Botânica', ['Briófitas', 'Pteridófitas', 'Gimnospermas', 'Angiospermas', 'Morfologia vegetal', 'Histologia vegetal', 'Nutrição vegetal', 'Fitormônios'], '🧬'),
            mkSeason('bio-t11', 'Embriologia', ['Tipos de ovos', 'Embriogênese', 'Classif.embriológica', 'Folhetos embrionários'], '🧬'),
        ]
    },
    {
        id: 'fis', name: 'Física', icon: '⚡', description: 'As leis invisíveis do universo.', gradient: 'from-yellow-600 to-amber-600', seasons: [
            mkSeason('fis-t1', 'Termologia', ['Termometria', 'Dilatometria', 'Calorimetria', 'Gases', 'Termodinâmica', 'Máquinas'], '⚡'),
            mkSeason('fis-t2', 'Mecânica', ['Medidas', 'MU', 'MUV', 'Lanç.vertical', 'Lanç.oblíquo', 'Cinemática vetorial', 'Vetores', 'MC', 'Newton', 'Forças', 'Atrito', 'Curvilíneas', 'Estática', 'Hidrostática', 'Hidrodinâmica', 'Trabalho/energia', 'Impulso', 'Colisões', 'Gravitação', 'MHS'], '⚡'),
            mkSeason('fis-t3', 'Eletrostática', ['Carga/Coulomb', 'Campo', 'Potencial'], '⚡'),
            mkSeason('fis-t4', 'Eletrodinâmica', ['Corrente/Ohm', 'Geradores/resistores', 'Potência', 'Receptor', 'Kirchhoff', 'Capacitores'], '⚡'),
            mkSeason('fis-t5', 'Magnetismo', ['Campo magnético', 'Fontes', 'Força magnética', 'Indução', 'Indutores/transformadores'], '⚡'),
            mkSeason('fis-t6', 'Ondulatória', ['Estrutura/classif.', 'Equação de onda', 'Reflexão/refração', 'Difração/interferência', 'Ondas estacionárias', 'Acústica', 'Doppler'], '⚡'),
            mkSeason('fis-t7', 'Óptica', ['Conceitos', 'Espelhos planos', 'Espelhos esféricos', 'Refração', 'Lentes', 'Instrumentos'], '⚡'),
            mkSeason('fis-t8', 'Moderna', ['Relatividade', 'Corpo negro', 'Fotoelétrico', 'Bohr'], '⚡'),
        ]
    },
    {
        id: 'mat', name: 'Matemática', icon: '∑', description: 'Números contam histórias.', gradient: 'from-sky-600 to-blue-700', seasons: [
            mkSeason('mat-t1', 'Básica', ['Decimal', 'Adição/sub', 'Mult/div', 'Expressões', 'Frações', 'Potenciação', 'Radiciação', 'Produtos notáveis', 'Conjuntos numéricos', 'Fatoração', 'Potência de 10', 'Divisibilidade', 'Primos', 'MMC', 'MDC', 'Eq.1º', 'Eq.2º', 'Razão/proporção', 'Porcentagem', 'Juros simples', 'Juros compostos'], '∑'),
            mkSeason('mat-t2', 'Funções', ['Conjuntos', 'Funções/relações', 'Fn.1º', 'Fn.2º', 'Inequações', 'Modular', 'Exponencial', 'Logaritmo', 'Fn.logarítmica', 'Inversa/composta'], '∑'),
            mkSeason('mat-t3', 'Trigonometria', ['Arcos/circunf.', 'Seno/cosseno', 'Razões', 'Área/leis', 'Equação trig.', 'Fn.trig.'], '∑'),
            mkSeason('mat-t4', 'Estatística', ['Centralidade', 'Dispersão'], '∑'),
            mkSeason('mat-t5', 'Sequências', ['Sequências', 'PA', 'PG'], '∑'),
            mkSeason('mat-t6', 'Geo.Plana', ['Ângulos/Tales', 'Triângulos', 'Polígonos', 'Quadriláteros', 'Semelhança', 'Circunferência', 'Inscrição'], '∑'),
            mkSeason('mat-t7', 'Geo.Espacial', ['Poliedros/prismas', 'Pirâmides', 'Cil./cones', 'Esfera', 'Troncos', 'Planificação', 'Proj.ortogonal'], '∑'),
            mkSeason('mat-t8', 'Geo.Analítica', ['Plano cart.', 'Reta', 'Retas/distâncias', 'Circunferência', 'Parábola', 'Elipse', 'Hipérbole'], '∑'),
            mkSeason('mat-t9', 'Combinatória', ['Princ.fundamental', 'Arranjo/permutação', 'Combinação'], '∑'),
            mkSeason('mat-t10', 'Probabilidade', ['Experimento', 'Probabilidade', 'Complementares', 'União/inter.', 'Condicional', 'Binomial'], '∑'),
            mkSeason('mat-t11', 'Matrizes', ['Estrutura', 'Multiplicação', 'Determinantes', 'Sistemas'], '∑'),
        ]
    },
    {
        id: 'por', name: 'Português', icon: '📝', description: 'Domine a língua.', gradient: 'from-pink-600 to-rose-600', seasons: [
            mkSeason('por-t1', 'Morfologia', ['Subst./art./adj.', 'Pronomes', 'Verbos', 'Vozes/advérbio', 'Conjunções', 'Estrutura'], '📝'),
            mkSeason('por-t2', 'Sintaxe', ['Oração/sujeitos', 'Compl.verbais', 'Aposto/vocativo', 'Adj.adv.', 'Coord.', 'Subord.subst.', 'Subord.adj.', 'Subord.adv.', 'Concordância', 'Regência', 'Crase', 'Pontuação', 'Paralelismo'], '📝'),
            mkSeason('por-t3', 'Semântica', ['Funções linguagem', 'Figuras', 'Gêneros textuais', 'Acentuação', 'Ortografia', 'Discurso', 'Variação'], '📝'),
        ]
    },
    {
        id: 'lit', name: 'Literatura e Redação', icon: '✍️', description: 'Sua voz no papel.', gradient: 'from-purple-600 to-fuchsia-600', seasons: [
            mkSeason('lit-t1', 'Literatura BR', ['Arte/gêneros', 'Quinhentismo', 'Barroco', 'Arcadismo', 'Romantismo', 'Realismo', 'Naturalismo', 'Parnasianismo', 'Simbolismo', 'Pré-modernismo', 'Sem.Arte Moderna', '1ºMod.', '2ºMod.', '3ºMod.', 'Contemporânea'], '✍️'),
            mkSeason('lit-t2', 'Literatura PT', ['Trovadorismo', 'Humanismo', 'Classicismo', 'Barroco PT', 'Romantismo PT', 'Realismo PT', 'Simbolismo PT', 'Vanguardas', 'Modernismo PT'], '✍️'),
            mkSeason('lit-t3', 'Redação ENEM', ['Construção/aspectos', 'Coerência/coesão', 'Dissertativo-argumentativo', 'Análise coletânea', 'Competências ENEM'], '✍️'),
            mkSeason('lit-t4', 'Outros Gêneros', ['Artigo de opinião', 'Carta leitor', 'Carta aberta', 'Manifesto', 'Discurso político', 'Resumo/resenha'], '✍️'),
        ]
    },
];

const TOTAL_EPS = SUBJECTS.reduce((a, s) => a + s.seasons.reduce((b, sn) => b + sn.episodes.length, 0), 0);

// ═══════════════════════════════════════════
// DATA: FILMS, MINISERIES, TRAILS
// ═══════════════════════════════════════════
const FILMS: Film[] = [
    { id: 'f1', icon: '📚', title: 'Desigualdade Social', works: ['Quarto de Despejo — C.M.Jesus', 'Parasita — Bong Joon-ho', 'Série 3% — Netflix'], desc: 'Desigualdade, pobreza, exclusão social e luta de classes.', tip: 'Relacione ao tema e não resuma a obra. Conecte ao presente.' },
    { id: 'f2', icon: '💻', title: 'Tecnologia e Sociedade', works: ['1984 — George Orwell', 'O Dilema das Redes — Netflix', 'Black Mirror — Netflix'], desc: 'Vigilância digital, fake news, redes sociais e privacidade.', tip: 'A distopia de Orwell é atemporalmente aplicável ao ENEM.' },
    { id: 'f3', icon: '🌿', title: 'Meio Ambiente', works: ['Wall-E — Pixar', 'Sobradinho — Sá & Guarabyra', 'Vidas Secas — G.Ramos'], desc: 'Sustentabilidade, mudanças climáticas e degradação ambiental.', tip: 'Wall-E e Vidas Secas são clássicos recorrentes no ENEM.' },
    { id: 'f4', icon: '🎓', title: 'Educação e Conhecimento', works: ['Pedagogia do Oprimido — P.Freire', 'Escritores da Liberdade (2007)', 'Estudo Errado — Gabriel Pensador'], desc: 'Educação transformadora, inclusão e pensamento crítico.', tip: 'Paulo Freire é o autor mais cobrado em Ciências Humanas.' },
    { id: 'f5', icon: '🧠', title: 'Saúde Mental', works: ['O Alienista — Machado de Assis', 'Coringa (2019)', 'Eu Me Lembro — C.Falcão'], desc: 'Saúde mental juvenil, exclusão e responsabilidade coletiva.', tip: 'O Alienista é leitura obrigatória e muito versátil.' },
    { id: 'f6', icon: '✊', title: 'Racismo e Preconceito', works: ['P.Manual Antirracista — D.Ribeiro', 'Estrelas Além do Tempo (2016)', 'Negro Drama — Racionais MC\'s'], desc: 'Racismo estrutural, antirracismo e desigualdade racial.', tip: 'Djamila Ribeiro é referência contemporânea essencial.' },
    { id: 'f7', icon: '⚡', title: 'Questões de Gênero', works: ['O Conto da Aia — M.Atwood', 'Sufragistas (2015)', 'Triste Louca ou Má — Francisco El Hombre'], desc: 'Direitos das mulheres, feminismo e autonomia reprodutiva.', tip: 'O Conto da Aia é poderoso para dissertações sobre gênero.' },
    { id: 'f8', icon: '🏙️', title: 'Violência e Segurança', works: ['Capitães da Areia — Jorge Amado', 'Cidade de Deus (2002)', 'A Carne — Elza Soares'], desc: 'Violência urbana, sistema prisional e exclusão.', tip: 'Cidade de Deus é o mais icônico. Use com precisão.' },
    { id: 'f9', icon: '⚙️', title: 'Trabalho e Relações', works: ['Germinal — Émile Zola', 'Tempos Modernos — Chaplin (1936)', 'Construção — Chico Buarque'], desc: 'Direitos trabalhistas, alienação e exploração do trabalho.', tip: 'Tempos Modernos cabe em qualquer tema de uberização.' },
    { id: 'f10', icon: '🛒', title: 'Consumismo e Mídia', works: ['Admirável Mundo Novo — Huxley', 'O Show de Truman (1998)', 'Geração Coca-Cola — Legião Urbana'], desc: 'Consumismo, sociedade do espetáculo e manipulação midiática.', tip: 'Huxley + Orwell = dupla invencível para controle social.' },
];

const MINISERIES: Mini[] = [
    { id: 'm1', icon: '🎯', title: 'A Lógica da TRI', desc: 'O algoritmo secreto do INEP e como usá-lo a seu favor.', episodes: ['O que é TRI e como ela te afeta', 'Priorize as questões fáceis', 'Coerência pedagógica na prova', 'Simulado com estratégia TRI'] },
    { id: 'm2', icon: '✍️', title: 'Redação Nota 1000', desc: 'Estrutura Caveira e repertórios que convencem a banca.', episodes: ['As 5 Competências do ENEM', 'Estrutura de um desenvolvimento perfeito', 'Repertório sociocultural produtivo', 'Conclusão com proposta de intervenção', 'Revisão e checklist final'] },
    { id: 'm3', icon: '📖', title: 'Interpretação Textual', desc: 'Como ler e responder qualquer questão de CN e CH.', episodes: ['Tipologia de questões do ENEM', 'Leitura de textos multicódigos', 'Gráficos, tabelas e infográficos', 'Questões de interpretação inferencial'] },
    { id: 'm4', icon: '🔢', title: 'Matemática Básica 80/20', desc: '20% dos conteúdos que garantem 80% dos pontos.', episodes: ['Razão, proporção e porcentagem', 'Geometria essencial', 'Estatística e probabilidade básica', 'Funções no contexto do ENEM'] },
    { id: 'm5', icon: '🏆', title: 'Estratégia de Prova', desc: 'Gestão do tempo, chute consciente e mentalidade vencedora.', episodes: ['Gestão de tempo nas 5 horas de prova', 'A arte do chute consciente', 'Gestão emocional no dia da prova', 'Plano de estudo para os últimos 30 dias'] },
];

const TRAILS: Trail[] = [
    { id: 'tr1', title: 'Trilha Base', badge: 'COMEÇAR AQUI', duration: '~3h', desc: 'Para quem está perdido. Construa os alicerces em 7 dias.', subjects: ['por', 'mat', 'lit'] },
    { id: 'tr2', title: 'Trilha Redação 900+', badge: 'POPULAR', duration: '~5h', desc: 'Do zero à estrutura Caveira em 5 etapas.', subjects: ['lit', 'por'] },
    { id: 'tr3', title: 'Trilha Exatas Essencial', badge: '', duration: '~8h', desc: 'Garanta 700+ em exatas só com o básico.', subjects: ['mat', 'fis', 'qui'] },
    { id: 'tr4', title: 'Trilha Humanas Completa', badge: '', duration: '~12h', desc: 'História, Geo, Soc e Fil organizados por relevância.', subjects: ['his', 'geo', 'soc', 'fil'] },
    { id: 'tr5', title: 'Reta Final 30 dias', badge: 'URGENTE', duration: '~20h', desc: 'Revisão intensiva para quem está no sprint final.', subjects: ['mat', 'por', 'lit', 'his', 'geo', 'qui', 'bio', 'fis'] },
];

// --- 
// HOOKS
// --- 
const useProgress = () => {
    const [progress, setProgress] = useState<Record<string, EpProgress>>(() => sg('desdobre_v4_prog', {}));
    const [lastSeen, setLastSeen] = useState<string>(() => sg('desdobre_v4_last', ''));
    const [diagnostic, setDiagState] = useState<any>(() => sg('desdobre_v4_diag', null));
    useEffect(() => { ss('desdobre_v4_prog', progress) }, [progress]);
    useEffect(() => { ss('desdobre_v4_last', lastSeen) }, [lastSeen]);
    useEffect(() => { ss('desdobre_v4_diag', diagnostic) }, [diagnostic]);
    const getEpProgress = useCallback((id: string): EpProgress => progress[id] || { theory: false, questions: false, review: false, completedAt: null }, [progress]);
    const toggleCheck = useCallback((epId: string, key: 'theory' | 'questions' | 'review') => {
        setProgress(prev => {
            const ep = prev[epId] || { theory: false, questions: false, review: false, completedAt: null };
            const next = { ...ep, [key]: !ep[key] }; const done = next.theory && next.questions && next.review;
            next.completedAt = done ? Date.now() : null; if (done) toast.success('🎉 Episódio concluído!');
            return { ...prev, [epId]: next }
        });
    }, []);
    const setLast = useCallback((id: string) => setLastSeen(id), []);
    const setDiagnostic = useCallback((d: any) => { setDiagState(d); toast.success('GPS atualizado!') }, []);
    const totalDone = useMemo(() => Object.values(progress).filter(p => p.completedAt).length, [progress]);
    const reviewsDue = useMemo(() => {
        const now = Date.now(); const day = 86400000;
        return Object.entries(progress).filter(([, p]) => p.completedAt && now - p.completedAt > day).map(([id]) => id);
    }, [progress]);
    const exportData = useCallback(() => {
        const d = { prog: progress, last: lastSeen, diag: diagnostic };
        const b = new Blob([JSON.stringify(d)], { type: 'application/json' }); const u = URL.createObjectURL(b);
        const a = document.createElement('a'); a.href = u; a.download = 'desdobre_backup.json'; a.click();
        toast.success('Backup exportado!')
    }, [progress, lastSeen, diagnostic]);
    const importData = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader(); r.onload = ev => {
            try {
                const d = JSON.parse(ev.target?.result as string);
                if (d.prog) setProgress(d.prog); if (d.last) setLastSeen(d.last); if (d.diag) setDiagState(d.diag);
                toast.success('✅ Dados importados!')
            } catch { toast.error('❌ Arquivo inválido.') }
        }; r.readAsText(f)
    }, []);
    const getSubjectProgress = useCallback((subjectId: string) => {
        const s = SUBJECTS.find(x => x.id === subjectId); if (!s) return { done: 0, all: 0 };
        const all = s.seasons.flatMap(sn => sn.episodes); const done = all.filter(e => progress[e.id]?.completedAt).length;
        return { done, all: all.length };
    }, [progress]);
    return { progress, lastSeen, diagnostic, getEpProgress, toggleCheck, setLast, setDiagnostic, totalDone, totalEps: TOTAL_EPS, reviewsDue, exportData, importData, getSubjectProgress };
};

// --- 
// AMBIENT BACKGROUND
// --- 
const AmbientBG = () => (<div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#05070A]">
    {/* Dot Pattern Overlay */}
    <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

    <motion.div animate={{ x: ['-8%', '5%', '-8%'], y: ['-12%', '4%', '-12%'], scale: [1, 1.15, 1] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-15%] w-[800px] h-[800px] rounded-full blur-[160px]" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.15) 50%, transparent 80%)' }} />
    <motion.div animate={{ x: ['0%', '-12%', '0%'], y: ['-8%', '5%', '-8%'], scale: [1, 1.1, 1] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-5%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[140px]" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(59,130,246,0.15) 50%, transparent 80%)' }} />
    <motion.div animate={{ x: ['0%', '8%', '0%'], y: ['0%', '-18%', '0%'], scale: [0.9, 1.05, 0.9] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[35%] right-[10%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, rgba(249,115,22,0.1) 50%, transparent 80%)' }} />
    <motion.div animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[200px]" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 60%)' }} />
</div>);

// ═══════════════════════════════════════════
// ERROR BOUNDARY
// ═══════════════════════════════════════════
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false }; static getDerivedStateFromError() { return { hasError: true } }
    render() {
        if (this.state.hasError) return (<div className="min-h-screen bg-[#06040F] flex items-center justify-center p-8"><div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div><h1 className="font-display text-2xl font-bold text-white mb-2">Algo deu errado</h1>
            <p className="text-gray-500 mb-6">Erro inesperado.</p><div className="flex gap-3 justify-center">
                <button onClick={() => { const d = localStorage.getItem('desdobre_v4_prog'); if (d) { const b = new Blob([d], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'backup.json'; a.click() } }} className="px-4 py-2 bg-white/10 rounded-xl text-sm hover:bg-white/20">📦 Backup</button>
                <button onClick={() => { localStorage.clear(); window.location.reload() }} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-500/30">Reiniciar</button>
            </div></div></div>); return this.props.children
    }
}

// ═══════════════════════════════════════════
// EPISODE MODAL
// ═══════════════════════════════════════════
const EpisodeModal = ({ episode, subject, onClose, prog }: { episode: Episode; subject: Subject; onClose: () => void; prog: ReturnType<typeof useProgress> }) => {
    const [openT, setOpenT] = useState(0); const ep = prog.getEpProgress(episode.id);
    const pct = Math.round(([ep.theory, ep.questions, ep.review].filter(Boolean).length / 3) * 100);
    const tRef = useRef(0);
    useEffect(() => { prog.setLast(episode.id); const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, []);
    const CK: [('theory' | 'questions' | 'review'), string, string, string][] = [['theory', '📚', 'Estudar Teoria', 'violet'], ['questions', '❓', 'Resolver Questões', 'blue'], ['review', '🔄', 'Revisar Conteúdo', 'emerald']];
    return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-end md:items-center justify-center p-0 md:p-6" onClick={onClose}>
        <motion.div initial={{ y: 100, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.95 }} transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            onClick={e => e.stopPropagation()} role="dialog" aria-modal="true"
            onTouchStart={e => { tRef.current = e.touches[0].clientY }} onTouchEnd={e => { if (e.changedTouches[0].clientY - tRef.current > 80) onClose() }}
            className="relative w-full h-[98vh] md:h-auto md:max-h-[90vh] md:max-w-4xl glass-strong border-white/10 rounded-t-[40px] md:rounded-[40px] overflow-hidden flex flex-col z-10 shadow-3xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 z-50 overflow-hidden"><motion.div animate={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 progress-glow shadow-[0_0_15px_rgba(255,255,255,0.2)]" /></div>
            <div className="md:hidden flex justify-center pt-4 pb-2"><div className="w-12 h-1.5 bg-white/10 rounded-full" /></div>
            <div className="relative h-64 md:h-80 w-full overflow-hidden shrink-0">
                <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-40`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-6"><span className="text-sm font-medium tracking-wider text-white/50 uppercase">{subject.name}</span><span className="text-sm font-medium tracking-wider text-violet-400 border border-violet-400/20 px-3 py-1 rounded-full uppercase">Episódio</span></div>
                    <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl uppercase tracking-tighter leading-[0.85]">{episode.title}</h2></div>
                <button onClick={onClose} className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20 shadow-xl border-white/5">✕</button></div>
            <div className="flex-1 overflow-y-auto px-8 py-8 md:px-12 md:py-12 custom-scroll space-y-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-4 w-full">{CK.map(([k, ic, lb, cl], i) => (
                        <button key={k} onClick={() => prog.toggleCheck(episode.id, k)}
                            className={`w-full flex items-center gap-6 p-6 rounded-[32px] border transition-all duration-500 ${ep[k] ? `bg-emerald-500/10 border-emerald-500/30 text-emerald-400` : 'glass border-white/5 hover:border-white/20 text-gray-400 hover:bg-white/5'}`}>
                            <div className="text-3xl drop-shadow-lg">{ic}</div><span className="flex-1 text-left font-bold uppercase tracking-wider text-sm">{lb}</span>
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${ep[k] ? `border-emerald-500 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]` : 'border-white/10'}`}>
                                {ep[k] && <span className="text-white text-lg font-bold">✓</span>}</div></button>))}</div>
                    <div className="w-full md:w-80 shrink-0">
                        <div className="glass-card p-8 rounded-[40px] space-y-6 border-white/5 shadow-2xl bg-white/[0.02]">
                            <p className="text-sm font-medium tracking-wider text-white/30 uppercase">Sua Missão</p>
                            <div className="flex items-end gap-3"><span className="text-6xl font-black text-white leading-none">{pct}%</span><span className="text-gray-500 text-xs font-bold uppercase mb-2">Concluido</span></div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5 progress-glow"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-violet-600 to-pink-600 shadow-[0_0_15px_rgba(139,92,246,0.3)]" /></div>
                            <p className="text-lg text-gray-400 font-medium leading-relaxed mt-4">Conclua as 3 etapas para dominar este tema e consolidar sua evolução.</p></div></div></div>
                <div className="space-y-8 pt-4">
                    <div className="flex items-end gap-3 border-b border-white/5 pb-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight leading-none">Plano de Estudo</h3>
                        <span className="text-sm font-medium tracking-wider text-white/20 uppercase ml-auto">Conteúdo Detalhado</span></div>
                    <div className="space-y-6">{episode.topics.map((t, i) => (
                        <div key={t.id} onClick={() => setOpenT(openT === i ? -1 : i)} className={`glass border border-white/5 rounded-[32px] overflow-hidden transition-all duration-500 cursor-pointer shadow-lg ${openT === i ? 'border-violet-500/40 bg-violet-500/5' : 'hover:border-white/10 hover:bg-white/[0.02]'}`}>
                            <button className="w-full px-8 py-6 flex items-center justify-between group">
                                <span className={`font-mono text-xs font-black transition-all ${openT === i ? 'text-violet-400' : 'text-white/20'}`}>{String(i + 1).padStart(2, '0')}</span>
                                <span className="flex-1 text-left px-6 text-lg font-bold text-white group-hover:text-white leading-tight">{t.title}</span>
                                <span className="text-sm font-medium tracking-wider text-white/40 bg-white/5 px-4 py-1.5 rounded-full uppercase scale-90">{t.duration}</span></button>
                            <AnimatePresence>{openT === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="px-10 pb-8 pt-2 text-lg text-gray-400 font-medium leading-relaxed border-t border-white/5 markdown-content">"{t.content}"</div></motion.div>)}</AnimatePresence></div>))}</div></div></div>
        </motion.div></motion.div>)
};

// ═══════════════════════════════════════════
// COMMAND PALETTE
// ═══════════════════════════════════════════
const CommandPalette = ({ onClose, nav }: { onClose: () => void; nav: (v: View) => void }) => {
    const [q, setQ] = useState(''); const ref = useRef<HTMLInputElement>(null); useEffect(() => { ref.current?.focus() }, []); const ql = q.toLowerCase();
    const ms = q ? SUBJECTS.filter(s => s.name.toLowerCase().includes(ql)) : SUBJECTS.slice(0, 5);
    const me = q.length > 2 ? SUBJECTS.flatMap(s => s.seasons.flatMap(sn => sn.episodes.filter(e => e.title.toLowerCase().includes(ql)).map(e => ({ ep: e, sub: s })))).slice(0, 8) : [];
    return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]" onClick={onClose}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} onClick={e => e.stopPropagation()} className="w-full max-w-2xl bg-[#0C0A1A] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative"><input ref={ref} value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar matéria, episódio..." className="w-full pl-12 pr-10 py-5 bg-transparent text-white font-display outline-none placeholder-gray-600" role="combobox" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>{q && <button onClick={() => setQ('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">✕</button>}</div>
            <div className="max-h-80 overflow-y-auto border-t border-white/[0.06] p-2">{ms.length > 0 && <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-2 py-1">Matérias</p>
                {ms.map(s => (<button key={s.id} onClick={() => { nav(`subject_${s.id}` as View); onClose() }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] text-left">
                    <span className="text-xl">{s.icon}</span><span className="font-display font-semibold text-white text-sm flex-1">{s.name}</span><span className="text-xs text-gray-600 font-mono">{s.seasons.length}T</span></button>))}</div>}
                {me.length > 0 && <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-2 py-1 mt-2">Episódios</p>
                    {me.map(({ ep, sub }) => (<button key={ep.id + sub.id} onClick={() => { nav(`subject_${sub.id}` as View); onClose() }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left">
                        <span>{ep.icon}</span><span className="text-sm text-white flex-1 truncate">{ep.title}</span><span className="text-[10px] text-gray-600">{sub.name}</span></button>))}</div>}
                {q.length > 2 && !ms.length && !me.length && <div className="py-10 text-center text-gray-500 text-sm">Nenhum resultado para "{q}"</div>}
            </div></motion.div></motion.div>)
};

// ═══════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════
const AC = ['#8B5CF6', '#EC4899', '#F97316', '#10B981', '#0EA5E9', '#F59E0B'];
const OnBoarding = ({ onDone }: { onDone: (u: { name: string; avatarColor: string; joinedAt: string }) => void }) => {
    const [n, setN] = useState(''); const [c, setC] = useState(AC[0]);
    return (<div className="min-h-screen bg-[#06040F] flex flex-col md:flex-row">
        <div className="relative flex-1 md:w-[55%] flex flex-col items-center justify-center p-8 md:p-16 min-h-[40vh] md:min-h-screen overflow-hidden">
            <AmbientBG /><div className="relative z-10 text-center md:text-left max-w-lg">
                <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                    <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">DESDOBRE</span><span className="text-white">.</span></h1>
                <p className="text-white/60 text-lg md:text-xl mb-8">A plataforma que transforma o jeito que você estuda para o ENEM.</p>
                <div className="space-y-3">{['350+ episódios estruturados', 'GPS de diagnóstico inteligente', 'Progresso que você pode ver'].map((f, i) => (
                    <motion.div key={f} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }} className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 mr-2">
                        <span className="text-violet-400">✦</span>{f}</motion.div>))}</div></div>
            {Array.from({ length: 12 }).map((_, i) => (<motion.div key={i} className="absolute w-1 h-1 bg-white rounded-full" style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }}
                animate={{ opacity: [0.1, 0.5, 0.1], y: [0, -30, 0] }} transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }} />))}</div>
        <div className="flex-1 md:w-[45%] bg-[#F0EDF8] flex items-center justify-center p-8 md:p-16 min-h-[60vh] md:min-h-screen">
            <div className="w-full max-w-sm"><h2 className="font-display text-2xl font-bold text-[#1A1535] mb-2">Olá! Como posso te chamar?</h2>
                <p className="text-[#6B6490] text-sm mb-8">Seu progresso ficará salvo localmente.</p>
                <input value={n} onChange={e => setN(e.target.value)} placeholder="Seu nome ou apelido..." className="w-full px-5 py-4 rounded-2xl border-2 border-violet-500/30 bg-white text-[#1A1535] outline-none focus:border-violet-500 focus:shadow-lg transition-all mb-6 font-medium" />
                <p className="text-[#6B6490] text-xs font-bold uppercase tracking-widest mb-3">Escolha sua cor</p>
                <div className="flex gap-3 mb-8">{AC.map(cl => (<button key={cl} onClick={() => setC(cl)} className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all ${c === cl ? 'ring-2 ring-offset-2 ring-offset-[#F0EDF8] ring-violet-500 scale-110' : ''}`} style={{ background: cl }}>{n ? n[0].toUpperCase() : '?'}</button>))}</div>
                <button disabled={!n.trim()} onClick={() => onDone({ name: n.trim(), avatarColor: c, joinedAt: new Date().toISOString() })} className="w-full py-4 rounded-2xl font-display font-bold text-white bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 hover:brightness-110 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    Começar minha jornada →</button></div></div></div>)
};

// ═══════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════
const GRADS = ['from-violet-600 to-indigo-700', 'from-pink-600 to-rose-700', 'from-amber-500 to-orange-600', 'from-emerald-600 to-teal-700', 'from-sky-500 to-blue-700', 'from-fuchsia-600 to-purple-700', 'from-red-500 to-pink-600', 'from-cyan-500 to-blue-600'];
const getGrad = (i: number) => GRADS[i % GRADS.length];

const HomeView = ({ nav, prog, user }: { nav: (v: View) => void; prog: ReturnType<typeof useProgress>; user: any }) => (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-0">
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="pill glass border-white/10 mb-12 px-5 py-1.5 flex items-center gap-2 text-white/80 font-bold tracking-tight text-[11px] shadow-2xl backdrop-blur-xl">
                <span className="text-violet-400">✦</span> Plataforma Completa ENEM 2025</motion.div>

            <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
                className="font-display text-[80px] md:text-[120px] lg:text-[160px] font-black tracking-tight leading-[0.85] mb-8">
                <span className="text-white">Descubra.</span><br />
                <span className="bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">Não apenas</span><br />
                <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">estude.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-lg md:text-xl font-light text-gray-500 max-w-2xl mx-auto mb-16 leading-relaxed">
                Uma experiência de aprendizado imersiva com <span className="text-violet-400 font-bold">{prog.totalEps} episódios</span>,
                <span className="text-sky-400 font-bold"> estratégias comprovadas</span> e <span className="text-emerald-400 font-bold"> repertório cultural</span> que transforma.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-wrap items-center justify-center gap-4">
                <div className="glass px-6 py-3 rounded-full flex items-center gap-3 border-white/10 group hover:bg-white/5 transition-all cursor-default">
                    <span className="text-lg opacity-60">🎯</span>
                    <span className="text-xs font-black text-white uppercase tracking-widest leading-none">10 Matérias</span>
                </div>
                <div className="glass px-6 py-3 rounded-full flex items-center gap-3 border-white/10 group hover:bg-white/5 transition-all cursor-default shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                    <span className="text-lg opacity-60 text-sky-400">▶</span>
                    <span className="text-xs font-black text-white uppercase tracking-widest leading-none">{prog.totalEps} Episódios</span>
                </div>
                <div className="glass px-6 py-3 rounded-full flex items-center gap-3 border-white/10 group hover:bg-white/5 transition-all cursor-default">
                    <span className="text-lg opacity-60 text-emerald-400">📈</span>
                    <span className="text-xs font-black text-white uppercase tracking-widest leading-none">Nota 1000</span>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-20">
                <button onClick={() => nav('series')} className="btn-glow px-12 py-5 rounded-3xl font-display font-black text-white bg-gradient-to-r from-violet-600 via-pink-600 to-orange-600 hover:scale-110 transition-all uppercase tracking-[0.2em] text-[10px] shadow-2xl">
                    Começar jornada agora
                </button>
            </motion.div>
        </section>

        <section className="glass-strong py-20 px-6 md:px-16 border-y border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-transparent to-pink-900/10 pointer-events-none" />
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                {[{ n: '10', l: 'Matérias', c: 'text-violet-400' }, { n: `${prog.totalEps}`, l: 'Episódios', c: 'text-pink-400' }, { n: String(prog.totalDone), l: 'Concluídos', c: 'text-amber-400' }, { n: '100%', l: 'Gratuito', c: 'text-emerald-400' }].map(s => (
                    <div key={s.l} className="text-center group"><div className={`font-display text-5xl md:text-6xl font-black ${s.c} drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform`}>{s.n}</div>
                        <div className="label-caps mt-4 opacity-50 font-black tracking-[0.2em]">{s.l}</div></div>))}</div></section>

        <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ t: 'Séries', s: '10 matérias completas', c: 'from-violet-600/20 via-indigo-950/40 to-black', tc: 'text-violet-400', v: 'series' as View, ic: '📚', n: SUBJECTS.length },
            { t: 'Minisséries', s: 'Estratégias de prova', c: 'from-blue-600/20 via-slate-950/40 to-black', tc: 'text-sky-400', v: 'miniseries' as View, ic: '🎬', n: MINISERIES.length },
            { t: 'Filmes', s: 'Repertório cultural', c: 'from-emerald-600/20 via-teal-950/40 to-black', tc: 'text-emerald-400', v: 'films' as View, ic: '🎞️', n: FILMS.length }].map((card, i) => (
                <motion.div key={card.t} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -12, scale: 1.02 }}
                    onClick={() => nav(card.v)} className={`sweep-beam relative glass-card rounded-[48px] border-white/5 p-10 cursor-pointer group min-h-[380px] flex flex-col justify-between overflow-hidden shadow-2xl`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.c} opacity-40 group-hover:opacity-60 transition-opacity`} />
                    <div className="relative z-10"><div className="text-5xl mb-6 p-4 rounded-3xl glass w-fit shadow-xl group-hover:scale-110 transition-transform">{card.ic}</div>
                        <span className="pill glass absolute top-0 right-0 py-1.5 px-3 uppercase text-[10px] font-black">{card.n} SÉRIES</span></div>
                    <div className="relative z-10 space-y-2"><h3 className="font-display text-4xl font-black text-white uppercase tracking-tighter leading-none">{card.t}</h3>
                        <p className={`label-caps ${card.tc} opacity-70`}>{card.s}</p>
                        <div className="flex items-center gap-2 mt-6 opacity-40 group-hover:opacity-100 transition-opacity"><span className="text-xs font-black uppercase tracking-widest text-white">Explorar agora</span><span className="text-white">→</span></div></div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                </motion.div>))}</section>
    </motion.div>);

const DashView = ({ nav, prog, user }: { nav: (v: View) => void; prog: ReturnType<typeof useProgress>; user: any }) => {
    const pct = prog.totalEps ? Math.round((prog.totalDone / prog.totalEps) * 100) : 0;
    const [selEp, setSelEp] = useState<{ ep: Episode; sub: Subject } | null>(null);
    const lastEp = useMemo(() => {
        if (!prog.lastSeen) return null;
        for (const s of SUBJECTS) {
            for (const sn of s.seasons) {
                for (const e of sn.episodes) {
                    if (e.id === prog.lastSeen) return { ep: e, sub: s };
                }
            }
        }
        return null;
    }, [prog.lastSeen]);

    const subStats = useMemo(() => SUBJECTS.map(s => {
        const all = s.seasons.flatMap(sn => sn.episodes);
        const done = all.filter(e => prog.getEpProgress(e.id).completedAt).length;
        return { s, done, total: all.length, pct: all.length ? Math.round(done / all.length * 100) : 0 };
    }), [prog.progress]);

    const topSub = useMemo(() => (subStats.length > 0 ? subStats.reduce((a, b) => b.done > a.done ? b : a, subStats[0]) : null), [subStats]);

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-16">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tighter">Olá, {user.name}.</h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                <div className="pill bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-4 flex items-center gap-3 glass shrink-0 shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                    <span className="text-sm font-medium tracking-wider uppercase">Foco Máximo Ativo</span>
                </div>
            </header>

            {lastEp && (
                <motion.div layoutId="last-ep" onClick={() => setSelEp(lastEp)} className="glass-strong border-white/10 p-10 rounded-[48px] flex flex-col md:flex-row items-center gap-10 cursor-pointer group shadow-3xl relative overflow-hidden sweep-beam">
                    <div className={`absolute inset-0 bg-gradient-to-br ${lastEp.sub.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    <div className="w-24 h-24 rounded-3xl bg-white/5 glass flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-2xl shrink-0 group-hover:text-violet-400 group-hover:bg-white/10">▶</div>
                    <div className="flex-1 min-w-0 space-y-2 text-center md:text-left">
                        <p className="text-sm font-medium tracking-wider text-violet-400 uppercase">Continuar de onde parou</p>
                        <h3 className="text-3xl font-black text-white truncate uppercase tracking-tight">{lastEp.ep.title}</h3>
                        <p className="text-lg text-gray-400 font-medium">{lastEp.sub.name}</p>
                    </div>
                    <button className="btn-glow px-10 py-5 rounded-3xl font-display font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:scale-110 transition-all uppercase tracking-[0.2em] text-[10px] shadow-2xl">Assistir Agora</button>
                </motion.div>
            )}

            <div className="flex flex-col md:flex-row items-center md:items-end gap-12 bg-white/[0.02] p-10 rounded-[48px] border border-white/5 shadow-inner">
                <div className="text-center md:text-left shrink-0">
                    <p className="text-sm font-medium tracking-wider text-white/30 uppercase mb-4">Progresso Geral</p>
                    <div className="font-display text-[120px] md:text-[160px] font-black bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent leading-[0.75] tracking-tighter drop-shadow-2xl">{pct}%</div>
                </div>
                <div className="flex-1 w-full space-y-4 pb-4">
                    <div className="flex justify-between items-end">
                        <p className="text-lg text-gray-400 font-medium tracking-tight">{prog.totalDone} de {prog.totalEps} episódios concluídos</p>
                        <span className="text-sm font-medium tracking-wider text-violet-400 uppercase">{Math.round((pct / 100) * 1000) / 10} Mastery Points</span>
                    </div>
                    <div className="h-6 bg-white/5 rounded-full overflow-hidden progress-glow p-1 border border-white/5">
                        <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 1.5, ease: 'circOut' }} className="h-full rounded-full bg-gradient-to-r from-violet-600 via-pink-600 to-orange-600 shadow-[0_0_30px_rgba(139,92,246,0.3)]" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div onClick={() => nav('series')} className="glass-card rounded-[40px] p-10 cursor-pointer border-white/5 group hover:border-amber-500/40 transition-all shadow-xl bg-white/[0.01]">
                    <div className="text-5xl mb-8 p-5 glass w-fit rounded-3xl group-hover:scale-110 transition-transform shadow-inner group-hover:bg-amber-500/10">📅</div>
                    <div className="text-6xl font-black text-amber-500 tracking-tighter leading-none mb-3">{prog.reviewsDue.length}</div>
                    <p className="text-sm font-medium tracking-wider text-white/40 uppercase">Revisões Pendentes</p>
                </div>
                <div onClick={() => nav('series')} className="glass-card rounded-[40px] p-10 cursor-pointer border-white/5 group hover:border-emerald-500/40 transition-all shadow-xl bg-white/[0.01]">
                    <div className="text-5xl mb-8 p-5 glass w-fit rounded-3xl group-hover:scale-110 transition-transform shadow-inner group-hover:bg-emerald-500/10">🏆</div>
                    <div className="text-6xl font-black text-emerald-500 tracking-tighter leading-none mb-3">{prog.totalDone}</div>
                    <p className="text-sm font-medium tracking-wider text-white/40 uppercase">Episódios Concluídos</p>
                </div>
                <div onClick={() => nav('trails')} className="glass-card rounded-[40px] p-10 cursor-pointer border-white/5 group hover:border-blue-500/40 transition-all shadow-xl bg-white/[0.01]">
                    <div className="text-5xl mb-8 p-5 glass w-fit rounded-3xl group-hover:scale-110 transition-transform shadow-inner group-hover:bg-sky-500/10">🎯</div>
                    <div className="text-6xl font-black text-sky-500 tracking-tighter leading-none mb-3">{TRAILS.length}</div>
                    <p className="text-sm font-medium tracking-wider text-white/40 uppercase">Trilhas de Foco</p>
                </div>
            </div>

            <div className="space-y-12">
                <div className="flex items-end gap-3 border-b border-white/5 pb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight leading-none">Domínio por Matéria</h3>
                    <span className="text-sm font-medium tracking-wider text-white/20 uppercase ml-auto">Status Visual</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {subStats.map(({ s, done, total, pct: p }) => (
                        <div key={s.id} onClick={() => nav(`subject_${s.id}` as View)} className="flex items-center gap-6 cursor-pointer group hover:bg-white/[0.02] p-4 rounded-3xl transition-all border border-transparent hover:border-white/5 shadow-hover">
                            <div className="text-3xl w-16 h-16 rounded-3xl glass flex items-center justify-center bg-white/5 border-white/5 group-hover:scale-110 transition-transform shadow-lg">{s.icon}</div>
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-end">
                                    <p className="text-base font-bold text-white/90 group-hover:text-white transition-colors uppercase tracking-tight">{s.name}</p>
                                    <span className="font-mono text-sm text-gray-500 font-bold">{p}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px] shadow-inner">
                                    <div className={`h-full rounded-full bg-gradient-to-r ${s.gradient} transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.2)]`} style={{ width: `${p}%` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-strong border-white/5 rounded-[48px] p-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center shadow-3xl relative overflow-hidden bg-white/[0.01]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                <div className="group">
                    <div className="text-5xl md:text-6xl font-black text-amber-500 tracking-tighter leading-none mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">🔥 {Math.min(prog.totalDone, 7)}</div>
                    <p className="text-sm font-medium tracking-wider text-white/30 uppercase">Dias de Ofensiva</p>
                </div>
                <div className="group border-x border-white/5 px-10">
                    <div className="text-5xl md:text-6xl font-black text-violet-400 tracking-tighter leading-none mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">⏱️ {Math.floor(prog.totalDone * 37 / 60)}h</div>
                    <p className="text-sm font-medium tracking-wider text-white/30 uppercase">Foco Acumulado</p>
                </div>
                {topSub && (
                    <div className="group">
                        <div className="text-5xl md:text-6xl font-black text-emerald-400 tracking-tighter leading-none mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">{topSub.s.icon} {topSub.done}</div>
                        <p className="text-sm font-medium tracking-wider text-white/30 uppercase">Líder: {topSub.s.name}</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selEp && <EpisodeModal episode={selEp.ep} subject={selEp.sub} onClose={() => setSelEp(null)} prog={prog} />}
            </AnimatePresence>
        </motion.div>
    );
};

const CatalogView = ({ nav, prog }: { nav: (v: View) => void; prog: ReturnType<typeof useProgress> }) => {
    const [q, setQ] = useState(''); const ql = q.toLowerCase();
    const fs = q ? SUBJECTS.filter(s => s.name.toLowerCase().includes(ql)) : SUBJECTS;
    return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2"><h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">Séries ENEM</h1>
                <p className="text-gray-400 text-lg md:text-xl font-medium">10 matérias estruturadas do zero ao avançado</p></div>
            <div className="relative w-full md:w-96 group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-500 transition-colors">🔍</span>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="O que você quer aprender?" className="w-full pl-14 pr-12 py-4 glass border-white/5 rounded-3xl text-white outline-none focus:border-violet-500/50 placeholder-gray-600 font-light transition-all" />
                {q && <button onClick={() => setQ('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">✕</button>}</div></div>
        {fs.length === 0 ? (<div className="py-24 glass rounded-[40px] text-center border-white/5 shadow-inner">
            <div className="text-6xl mb-4">🔍</div><h3 className="font-display text-2xl font-bold text-white mb-2">Sem resultados</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8 font-light leading-relaxed">Não encontramos nenhuma série para "{q}". Tente uma palavra-chave diferente.</p>
            <button onClick={() => setQ('')} className="pill bg-white/5 hover:bg-white/10 text-violet-400">Limpar busca</button></div>) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-7 px-1">
                {fs.map((s, i) => {
                    const st = prog.getSubjectProgress?.(s.id) || { done: 0, all: 1 }; const p = Math.round((st.done / st.all) * 100);
                    return (<motion.div key={s.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -10, scale: 1.03 }}
                        onClick={() => nav(`subject_${s.id}` as View)} className="cursor-pointer group">
                        <div className={`relative aspect-[2/3] rounded-[40px] overflow-hidden border border-white/10 bg-[#0a0e27] transition-all group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] sweep-beam`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-25 group-hover:opacity-40 transition-opacity duration-500`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/40 to-transparent" />
                            <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8 space-y-4">
                                <div className="w-fit p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg">{s.icon}</div>
                                <div className="space-y-1"><h3 className="font-display font-black text-white text-2xl leading-[0.9] tracking-tighter">{s.name}</h3>
                                    <div className="flex items-center gap-2"><span className="label-caps opacity-60 text-[9px]">{st.all} Episódios</span>
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                        <span className="label-caps opacity-60 text-[9px]">{p}% Concluído</span></div></div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden progress-glow"><motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} className={`h-full rounded-full bg-gradient-to-r ${s.gradient}`} /></div></div></div>
                    </motion.div>)
                })}</div>)}
    </motion.div>)
};

const SubjectView = ({ subject: s, nav, prog }: { subject: Subject; nav: (v: View) => void; prog: ReturnType<typeof useProgress> }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16">
        <header className="relative py-24 px-8 rounded-[48px] glass overflow-hidden border-white/10 group">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-700`} />
            <div className="relative z-10 space-y-6">
                <button onClick={() => nav('series')} className="text-sm font-bold tracking-wider text-violet-400 uppercase flex items-center gap-2 hover:text-white transition-colors"><span>←</span> Voltar ao Catálogo</button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center text-5xl shadow-2xl">{s.icon}</div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">{s.name}</h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">{s.description}</p></div>
                    <div className="glass p-8 rounded-[32px] border-white/10 min-w-[240px] shadow-2xl">
                        <p className="text-sm font-medium tracking-wider text-white/60 uppercase mb-4">Progresso Geral</p>
                        <div className="font-display text-5xl font-black text-white mb-4">{prog.getSubjectProgress(s.id).done}/{prog.getSubjectProgress(s.id).all}</div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5"><motion.div animate={{ width: `${Math.round((prog.getSubjectProgress(s.id).done / prog.getSubjectProgress(s.id).all) * 100)}%` }} className="h-full rounded-full bg-white shadow-[0_0_15px_#fff]" /></div></div></div></div></header>
        <div className="space-y-20">{s.seasons.map((sn, i) => (<div key={sn.id} className="space-y-8">
            <div className="flex items-end gap-4 border-b border-white/5 pb-4"><span className="text-gray-600 font-display text-5xl font-black opacity-40">0{i + 1}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">{sn.title}</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">{sn.episodes.map(e => {
                const ep = prog.getEpProgress(e.id); const done = ep.completedAt;
                return (<motion.div key={e.id} whileHover={{ y: -8 }} onClick={() => nav(`subject_${s.id}` as View)}
                    className="glass-card rounded-[40px] p-8 border-white/5 cursor-pointer relative group flex flex-col justify-between min-h-[220px] transition-all overflow-hidden sweep-beam">
                    <div className="relative z-10"><div className="flex justify-between items-start mb-6"><span className="text-3xl group-hover:scale-125 transition-transform inline-block">{e.icon}</span>
                        {done && <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm shadow-inner">✓</span>}</div>
                        <h3 className="text-xl md:text-2xl font-bold text-white line-clamp-2 leading-tight uppercase tracking-tight">{e.title}</h3></div>
                    <div className="relative z-10 mt-8 flex items-center justify-between"><span className="text-[10px] font-black tracking-widest text-white/30 uppercase group-hover:text-white/60 transition-colors">Ver Episódio →</span>
                        <div className="flex gap-1">{[ep.theory, ep.questions, ep.review].map((c, j) => (<div key={j} className={`w-1.5 h-1.5 rounded-full ${c ? 'bg-violet-500 shadow-[0_0_8px_#8b5cf6]' : 'bg-white/10'}`} />))}</div></div></motion.div>)
            })}</div></div>))}</div></motion.div>);

const FilmsView = () => (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
    <header className="relative py-12 px-8 rounded-[40px] glass overflow-hidden border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
        <div className="z-10 group"><h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3">Repertório Sociocultural</h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl">Obras selecionadas para fundamentar seus argumentos e elevar sua nota na redação.</p></div>
        <div className="pill bg-amber-500/10 text-amber-500 border-amber-500/20 px-6 py-4 flex items-center gap-3 glass shrink-0 shadow-lg">
            <span className="text-2xl">⚠️</span><span className="text-sm font-medium uppercase tracking-wider max-w-[150px]">Use como argumento, não resumo.</span></div></header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{FILMS.map((f, i) => (
        <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -10 }}
            className="glass-card rounded-[40px] p-8 border-white/5 relative group overflow-hidden sweep-beam shadow-xl">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity"><span className="text-5xl">{f.icon}</span></div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-tight leading-none line-clamp-1">{f.title}</h3>
            <p className="text-lg text-gray-400 font-medium leading-relaxed mb-8 h-12 line-clamp-2">{f.desc}</p>
            <div className="space-y-3 mb-8">{f.works.map(w => (<div key={w} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 group-hover:bg-white/10 transition-colors border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" /><span className="text-sm text-white font-bold">{w}</span></div>))}</div>
            <div className="glass p-5 rounded-3xl border-white/5 shadow-inner"><p className="text-sm font-medium tracking-wider text-violet-400 uppercase mb-2 flex items-center gap-2"><span>💡</span>Dica Especial</p>
                <p className="text-gray-400 leading-relaxed italic text-base">"{f.tip}"</p></div></motion.div>))}</div></motion.div>);

const MiniView = () => {
    const [open, setOpen] = useState<string | null>(null);
    return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
        <header className="relative py-12 px-8 rounded-[40px] glass overflow-hidden border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
            <div className="z-10 group"><h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3">Estratégias ENEM</h1>
                <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl">Minisséries focadas em hackear o sistema e otimizar sua nota com inteligência.</p></div>
            <div className="pill bg-violet-500/10 text-violet-400 border-violet-500/20 px-6 py-4 flex items-center gap-3 glass shrink-0 shadow-lg">
                <span className="text-2xl">🎯</span><span className="text-sm font-medium uppercase tracking-wider max-w-[150px]">Foco na eficiência máxima.</span></div></header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{MINISERIES.map((m, i) => (
            <motion.div key={m.id} whileHover={{ y: -6 }} onClick={() => setOpen(open === m.id ? null : m.id)}
                className="glass-card rounded-[40px] p-8 border-white/5 cursor-pointer relative group overflow-hidden shadow-xl">
                <div className="flex items-start gap-6 mb-4"><div className="text-5xl p-4 glass rounded-3xl group-hover:bg-white/10 transition-colors shadow-lg">{m.icon}</div>
                    <div className="flex-1 space-y-1"><h3 className="text-2xl font-bold text-white uppercase tracking-tight leading-none">{m.title}</h3>
                        <span className="text-sm font-medium tracking-wider text-violet-400 uppercase">{m.episodes.length} Episódios</span></div>
                    <motion.span animate={{ rotate: open === m.id ? 180 : 0 }} className="text-gray-500 text-2xl mt-2">▾</motion.span></div>
                <p className="text-lg text-gray-400 font-medium leading-relaxed mb-6 px-1">{m.desc}</p>
                <AnimatePresence>{open === m.id && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-3 px-1">
                    {m.episodes.map((e, j) => (<motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * 0.05 }} key={j} className="glass p-4 rounded-2xl flex items-center gap-4 border-white/5 hover:bg-white/10 transition-all group">
                        <span className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all shadow-inner">{j + 1}</span>
                        <span className="text-base font-bold text-white/80 group-hover:text-white transition-colors">{e}</span></motion.div>))}</motion.div>)}</AnimatePresence>
            </motion.div>))}</div></motion.div>)
};

const TrailsView = ({ nav }: { nav: (v: View) => void }) => {
    const [open, setOpen] = useState<string | null>(null);
    return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
        <header className="relative py-12 px-8 rounded-[40px] glass overflow-hidden border-white/10 shadow-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3">Trilhas de Aprendizado</h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl">Caminhos prontos para quem tem pouco tempo e precisa de foco total no que mais cai.</p></header>
        <div className="space-y-6">{TRAILS.map((tr, i) => (
            <motion.div key={tr.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => setOpen(open === tr.id ? null : tr.id)}
                className="glass-card rounded-[40px] p-8 border-white/5 cursor-pointer relative group flex flex-col items-stretch hover:shadow-[0_0_50px_rgba(139,92,246,0.1)] transition-all">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-4xl shadow-2xl group-hover:scale-110 transition-transform">🗺️</div>
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-3"><h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight leading-none">{tr.title}</h3>
                            {tr.badge && <span className="text-sm font-medium tracking-wider text-purple-400 border border-purple-400/20 px-3 py-1 rounded-full uppercase scale-90">{tr.badge}</span>}</div>
                        <p className="text-lg text-gray-400 font-medium leading-tight">{tr.desc}</p></div>
                    <div className="flex items-center gap-6"><span className="text-sm font-medium tracking-wider text-white/30 uppercase hidden lg:block">{tr.duration}</span>
                        <motion.span animate={{ rotate: open === tr.id ? 180 : 0 }} className="text-gray-500 text-2xl">▾</motion.span></div></div>
                <AnimatePresence>{open === tr.id && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tr.subjects.map(sid => {
                        const s = SUBJECTS.find(x => x.id === sid); if (!s) return null; return (
                            <button key={sid} onClick={(e) => { e.stopPropagation(); nav(`subject_${sid}` as View) }}
                                className="glass p-5 rounded-3xl flex items-center gap-4 border-white/5 hover:bg-white/10 transition-all group/btn text-left">
                                <div className="text-2xl group-hover/btn:scale-110 transition-transform">{s.icon}</div><div className="flex-1"><p className="text-base font-bold text-white leading-tight uppercase tracking-tight">{s.name}</p>
                                    <p className="text-sm font-medium tracking-wider text-violet-400 uppercase mt-0.5">Estudar →</p></div></button>)
                    })}</motion.div>)}</AnimatePresence>
            </motion.div>))}</div></motion.div>)
};

const DiagView = ({ nav, prog, user }: { nav: (v: View) => void; prog: ReturnType<typeof useProgress>; user: any }) => {
    const [step, setStep] = useState(prog.diagnostic?.done ? 8 : 0); const [ans, setAns] = useState<string[]>([]);
    const QS = [{ q: 'Qual é o seu objetivo no ENEM?', o: ['Aprovação em federal', 'Curso concorrido (medicina, direito)', 'PROUNI / FIES', 'Auto-avaliação'] }, { q: 'Em quanto tempo pretende fazer a prova?', o: ['Menos de 1 mês', '1 a 3 meses', '3 a 6 meses', 'Mais de 6 meses'] }, { q: 'Como se sente em Exatas?', o: ['Facilidade', 'Mais ou menos', 'Maior desafio', 'Nunca estudei'] }, { q: 'Como se sente em Humanas?', o: ['Ponto forte', 'Razoável', 'Dificuldade real', 'Nunca estudei'] }, { q: 'Como está sua Redação?', o: ['Já tirei 800+', 'Sei estrutura mas travo', 'Não sei estruturar', 'Nunca treinei'] }, { q: 'Quanto tempo por dia para estudar?', o: ['Menos de 1h', '1 a 2 horas', '3 a 4 horas', 'Mais de 4 horas'] }, { q: 'Maior problema com os estudos?', o: ['Falta de organização', 'Procrastinação', 'Conteúdo extenso', 'Ansiedade'] }];
    const choose = (a: string) => { const next = [...ans, a]; setAns(next); if (step < 7) setStep(step + 1); else { prog.setDiagnostic({ done: true, date: new Date().toISOString(), answers: next }); setStep(8) } };
    const reset = () => { setStep(0); setAns([]) };
    if (step === 0) return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center py-20 px-6">
        <div className="w-24 h-24 rounded-3xl bg-blue-600/20 glass border-blue-500/20 flex items-center justify-center text-5xl mx-auto mb-10 shadow-[0_0_40px_rgba(59,130,246,0.2)] scroll-animation">🧭</div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">GPS da Aprovação</h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium mb-12 leading-relaxed">7 perguntas rápidas para mapear suas fraquezas e traçar sua trilha personalizada rumo ao 900+.</p>
        <button onClick={() => setStep(1)} className="btn-glow px-12 py-5 rounded-3xl font-display font-black text-white bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 hover:scale-[1.1] transition-all shadow-2xl uppercase tracking-[0.2em] text-[10px]">Iniciar Diagnóstico Agora</button></motion.div>);
    if (step >= 1 && step <= 7) {
        const qi = step - 1; return (<motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl mx-auto py-12 px-6">
            <p className="text-sm font-medium tracking-wider text-white/50 uppercase mb-4">Pergunta {step} de 7</p>
            <div className="h-2 bg-white/5 rounded-full mb-12 overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 progress-glow shadow-[0_0_15px_rgba(139,92,246,0.5)]" initial={{ width: 0 }} animate={{ width: `${(step / 7) * 100}%` }} transition={{ type: 'spring', stiffness: 50, damping: 20 }} /></div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-12 leading-[1.1] tracking-tight">{QS[qi].q}</h2>
            <div className="space-y-4">{QS[qi].o.map((o, oi) => (<button key={oi} onClick={() => choose(o)}
                className="w-full text-left p-6 md:p-8 rounded-[32px] border border-white/5 bg-white/[0.03] hover:border-violet-500/40 hover:bg-violet-950/20 hover:text-white transition-all group flex items-center gap-6 shadow-lg">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center shrink-0 group-hover:border-violet-500 transition-colors shadow-inner">
                    <div className="w-3.5 h-3.5 rounded-full bg-violet-500 scale-0 group-hover:scale-100 transition-transform shadow-[0_0_10px_#8b5cf6]" /></div>
                <span className="text-lg font-medium text-gray-400 group-hover:text-white transition-colors leading-snug">{o}</span></button>))}</div></motion.div>)
    }
    const exS = ans[2] === 'Facilidade' ? 85 : ans[2] === 'Mais ou menos' ? 60 : ans[2] === 'Maior desafio' ? 30 : 15;
    const huS = ans[3] === 'Ponto forte' ? 85 : ans[3] === 'Razoável' ? 60 : ans[3] === 'Dificuldade real' ? 30 : 15;
    const reS = ans[4] === 'Já tirei 800+' ? 90 : ans[4] === 'Sei estrutura mas travo' ? 60 : ans[4] === 'Não sei estruturar' ? 30 : 10;
    const bars = [{ l: 'Exatas', s: exS, c: 'from-sky-500 to-blue-600' }, { l: 'Humanas', s: huS, c: 'from-amber-500 to-orange-600' }, { l: 'Redação', s: reS, c: 'from-pink-500 to-rose-600' }, { l: 'Estratégia', s: ans[6] === 'Falta de organização' ? 30 : 60, c: 'from-violet-500 to-purple-600' }];
    return (<motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-12 space-y-12 px-6">
        <div className="text-center"><div className="text-7xl mb-8 group hover:scale-125 transition-transform duration-500 cursor-default inline-block">🚀</div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight">O mapa está pronto, <span className="text-violet-400">{user.name}!</span></h1></div>
        <div className="space-y-8 glass-strong p-8 md:p-12 rounded-[48px] border border-white/10 shadow-3xl">
            {bars.map(b => (<div key={b.l} className="space-y-3">
                <div className="flex justify-between items-center"><span className="text-sm font-medium tracking-wider text-white/40 uppercase">{b.l}</span>
                    <span className="font-mono text-sm text-white font-bold tracking-tighter shadow-sm">{b.s}%</span></div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5 progress-glow">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${b.s}%` }} transition={{ duration: 1.2, delay: 0.5, ease: 'circOut' }} className={`h-full rounded-full bg-gradient-to-r ${b.c} shadow-[0_0_12px_rgba(255,255,255,0.1)]`} /></div></div>))}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[{ n: 1, t: reS < 50 ? 'Dominar Redação' : 'Dominar a TRI', d: reS < 50 ? 'Comece pela Trilha Redação 900+' : 'Aprenda como o INEP te avalia.', btn: 'Explorar Trilhas', v: 'trails' as View }, { n: 2, t: exS < 50 ? 'Reforçar Base Exatas' : 'Aprofundar Humanas', d: exS < 50 ? 'Garanta os pontos fáceis primeiro.' : 'Domine sociologia e filosofia.', btn: 'Explorar Matérias', v: 'series' as View }].map(p => (
            <div key={p.n} className="glass-card rounded-[40px] p-8 border-white/5 hover:border-violet-500/20 transition-all shadow-xl group">
                <span className="text-sm font-medium tracking-wider text-violet-400 uppercase mb-4 block">Prioridade {p.n}</span>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{p.t}</h3><p className="text-base text-gray-400 font-medium leading-relaxed mb-8">{p.d}</p>
                <button onClick={() => nav(p.v)} className="text-sm font-bold text-violet-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"><span>{p.btn}</span><span>→</span></button></div>))}</div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-8">
            <button onClick={reset} className="w-full sm:w-auto px-10 py-5 rounded-3xl glass text-xs font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all border-white/5">Refazer GPS</button>
            <button onClick={() => nav('trails')} className="btn-glow w-full sm:w-auto px-12 py-5 rounded-3xl font-display font-black text-white bg-gradient-to-r from-violet-600 via-pink-600 to-orange-600 hover:scale-[1.1] transition-all uppercase tracking-[0.2em] text-[10px] shadow-2xl">Confirmar Trilhas</button></div>
    </motion.div>)
};

const GuideView = () => (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
    <header className="relative py-12 px-8 rounded-[40px] glass overflow-hidden border-white/10 shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[100px]" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight">Guia de Sobrevivência</h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl text-balance">Estratégias validadas para hackear o ENEM e otimizar seu tempo de estudo ao máximo.</p></header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{[{ i: '📖', t: 'Estudar do Zero', d: 'Construa uma base sólida. O segredo da aprovação está na base, não no avançado.' }, { i: '⏰', t: 'Se tiver 1h por dia', d: 'Foque em Redação e Matemática Básica. São as duas maiores alavancas de pontos.' }, { i: '✅', t: 'O Checklist Mágico', d: 'Use o sistema de 3 passos: Teoria, Questão e Revisão. Nunca pule uma etapa.' }, { i: '🎬', t: 'Poder do Repertório', d: 'Sua bagagem cultural vale ouro. Use filmes e livros para brilhar na sua redação.' }, { i: '🎯', t: 'A Lógica da TRI', d: 'A TRI odeia o acerto ao acaso. Acerte as fáceis e médias com consistência total.' }, { i: '✍️', t: 'Redação Nota 900+', d: 'Estrutura Caveira: O esqueleto infalível para tirar 900+ em qualquer tema.' }].map(g => (
        <motion.div key={g.t} whileHover={{ y: -6 }} className="glass-card rounded-[40px] p-10 border-white/5 shadow-xl group hover:border-violet-500/20 transition-all">
            <div className="text-4xl mb-8 p-5 rounded-3xl bg-white/5 w-fit group-hover:scale-110 group-hover:bg-violet-500/10 transition-all shadow-inner">{g.i}</div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight leading-tight">{g.t}</h3>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">{g.d}</p></motion.div>))}</div>
</motion.div>);

// ═══════════════════════════════════════════
// CRONOGRAMA + PROGRESSO VIEW
// ═══════════════════════════════════════════
const CRONO_SUBJECTS = [
    { id: 'natureza', name: 'Ciências da Natureza', short: 'C. Natureza', color: '#059669', glow: '#05966940', eps: 190, gpsHrs: 10, icon: '🧬' },
    { id: 'matematica', name: 'Matemática', short: 'Matemática', color: '#7C3AED', glow: '#7C3AED40', eps: 68, gpsHrs: 8, icon: '∑' },
    { id: 'humanas', name: 'Ciências Humanas', short: 'C. Humanas', color: '#D97706', glow: '#D9770640', eps: 138, gpsHrs: 8, icon: '🌍' },
    { id: 'linguagens', name: 'Linguagens', short: 'Linguagens', color: '#0284C7', glow: '#0284C740', eps: 26, gpsHrs: 4, icon: '📝' },
    { id: 'redacao', name: 'Redação', short: 'Redação', color: '#DB2777', glow: '#DB277740', eps: 35, gpsHrs: 6, icon: '✍️' },
];
const genDay = () => Array.from({ length: 24 }, (_, i) => ({ label: `${String(i).padStart(2, '0')}h`, eps: i >= 7 && i <= 23 ? Math.max(0, Math.floor(Math.random() * 3 * (i > 8 && i < 22 ? 1 : 0.2))) : 0 }));
const genWeek = () => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d, i) => ({ label: d, eps: i === 0 || i === 6 ? Math.floor(Math.random() * 8 + 4) : Math.floor(Math.random() * 6 + 1), meta: 6 }));
const genMonth = () => Array.from({ length: 30 }, (_, i) => ({ label: `${i + 1}`, eps: Math.floor(Math.random() * 10), meta: 5 }));

const CronoTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (<div className="bg-[#131928] border border-[#2E3F5E] rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-gray-500 text-[11px] mb-1">{label}</p>
        <p className="text-violet-400 text-sm font-bold">{payload[0].value} episódios</p>
        {payload[1] && <p className="text-gray-600 text-[11px] mt-0.5">meta: {payload[1].value}</p>}
    </div>)
};

const CronoPill = ({ value, onChange, options }: { value: any; onChange: (v: any) => void; options: { value: any; label: string }[] }) => (
    <div className="flex bg-[#0E1420] border border-[#1E2A3E] rounded-xl p-0.5 gap-0.5">
        {options.map(o => (<button key={String(o.value)} onClick={() => onChange(o.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${value === o.value ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}>{o.label}</button>))}</div>);

const SubSlider = ({ s, hrs, onChange, disabled, total }: { s: typeof CRONO_SUBJECTS[0]; hrs: number; onChange: (v: number) => void; disabled: boolean; total: number }) => {
    const pct = Math.round((hrs / Math.max(total, 1)) * 100);
    return (<div className={`bg-[#131928] border rounded-2xl p-4 transition-all ${hrs > 0 ? 'border-white/10' : 'border-[#1E2A3E]'} ${disabled ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-3 mb-3">
            <span className="text-lg">{s.icon}</span>
            <div className="flex-1"><p className="text-[13px] font-bold text-white">{s.name}</p>
                <p className="text-[11px] text-gray-600">{s.eps} episódios disponíveis</p></div>
            <div className="text-right"><span className="text-lg font-extrabold" style={{ color: s.color }}>{hrs}h</span>
                <p className="text-[10px] text-gray-600">{pct}% do plano</p></div></div>
        <div className="relative"><div className="h-1.5 bg-[#0E1420] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${(hrs / 20) * 100}%`, background: `linear-gradient(90deg,${s.color}80,${s.color})` }} /></div>
            <input type="range" min={0} max={20} step={0.5} value={hrs} onChange={e => onChange(parseFloat(e.target.value))} disabled={disabled}
                className="absolute -top-2 left-0 w-full h-6 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" />
            <div className="absolute -top-[5px] pointer-events-none transition-all" style={{ left: `calc(${(hrs / 20) * 100}% - 8px)` }}>
                <div className="w-4 h-4 rounded-full border-2 border-[#070B14]" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}80` }} /></div></div></div>)
};

const HeatCal = ({ data }: { data: { label: string; eps: number }[] }) => {
    const mx = Math.max(...data.map(d => d.eps), 1);
    return (<div><div className="flex gap-1 flex-wrap">{data.map((d, i) => (
        <div key={i} title={`Dia ${d.label}: ${d.eps} eps`} className="w-3.5 h-3.5 rounded cursor-pointer hover:scale-125 transition-transform"
            style={{ background: d.eps === 0 ? '#1E2A3E' : `rgba(124,58,237,${0.15 + (d.eps / mx) * 0.85})` }} />))}</div>
        <div className="flex items-center gap-1.5 mt-3"><span className="text-[10px] text-gray-600">Menos</span>
            {[0.1, 0.3, 0.5, 0.7, 1].map((op, i) => (<div key={i} className="w-3 h-3 rounded-sm" style={{ background: `rgba(124,58,237,${op})` }} />))}
            <span className="text-[10px] text-gray-600">Mais</span></div></div>)
};

const CronoStat = ({ label, value, sub, color, icon }: { label: string; value: string | number; sub: string; color: string; icon: string }) => (
    <div className="bg-[#131928] border border-[#1E2A3E] rounded-2xl p-4 flex-1 min-w-[130px]" style={{ borderTop: `3px solid ${color}` }}>
        <div className="flex justify-between items-start"><p className="text-[11px] text-gray-600 font-semibold tracking-wide mb-1">{label}</p>
            <span className="text-base">{icon}</span></div>
        <p className="text-2xl font-extrabold mb-0.5" style={{ color }}>{value}</p>
        <p className="text-[11px] text-gray-600">{sub}</p></div>);

const CronogramaView = ({ prog }: { prog: ReturnType<typeof useProgress> }) => {
    const [tab, setTab] = useState<'cronograma' | 'progresso'>('cronograma');
    const [gps, setGps] = useState(true);
    const [hrs, setHrs] = useState<Record<string, number>>(Object.fromEntries(CRONO_SUBJECTS.map(s => [s.id, s.gpsHrs])));
    const [period, setPeriod] = useState<'dia' | 'semana' | 'mes'>('semana');
    const [cd] = useState({ dia: genDay(), semana: genWeek(), mes: genMonth() });
    const total = Object.values(hrs).reduce((a: number, b: number) => a + b, 0);
    const epsW = Math.round(total * 1.8);
    const handleGps = (v: boolean) => { setGps(v); if (v) setHrs(Object.fromEntries(CRONO_SUBJECTS.map(s => [s.id, s.gpsHrs]))) };
    const donePct = prog.totalEps ? Math.round((prog.totalDone / prog.totalEps) * 100) : 0;
    const cur = cd[period] as { label: string; eps: number; meta?: number }[];
    const curTotal = cur.reduce((a: number, b: any) => a + (b.eps || 0), 0);
    return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-12">
        {/* Header with tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Cronograma & Progresso</h1>
            <div className="flex glass-strong border-white/10 rounded-[20px] p-1.5 gap-1 shadow-2xl">
                {([['cronograma', '📅 Cronograma'], ['progresso', '📈 Progresso']] as const).map(([id, lb]) => (
                    <button key={id} onClick={() => setTab(id)} className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all relative ${tab === id ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
                        {tab === id && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-violet-600 rounded-2xl shadow-[0_0_20px_#8b5cf6] z-0" />}
                        <span className="relative z-10">{lb}</span></button>))}</div></div>

        {tab === 'cronograma' && (<div className="space-y-5">
            {/* GPS toggle */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div><p className="text-sm text-gray-500">{gps ? 'Distribuição calculada pelo GPS' : 'Modo manual — arraste para ajustar'}</p></div>
                <div className="bg-[#131928] border border-[#1E2A3E] rounded-2xl px-4 py-3 flex items-center gap-3">
                    <div><p className="text-xs font-bold text-gray-400">Modo de definição</p>
                        <p className="text-[11px] text-gray-600">{gps ? 'GPS no controle' : 'Você no controle'}</p></div>
                    <CronoPill value={gps} onChange={handleGps} options={[{ value: true, label: '🧭 GPS' }, { value: false, label: '✋ Manual' }]} /></div></div>

            {gps && <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-xl">🧭</span><div><p className="text-sm font-bold text-violet-400">GPS de Diagnóstico ativo</p>
                    <p className="text-xs text-gray-400">Com base nas suas respostas: <strong className="text-white">8h/dia · ENEM em 6 meses · foco em C. Natureza</strong></p></div></div>}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
                {/* Sliders */}
                <div className="space-y-3">{CRONO_SUBJECTS.map(s => (
                    <SubSlider key={s.id} s={s} hrs={hrs[s.id]} onChange={v => setHrs(p => ({ ...p, [s.id]: v }))} disabled={gps} total={total} />))}</div>
                {/* Summary panel */}
                <div className="space-y-4">
                    <div className="bg-[#131928] border border-[#1E2A3E] rounded-2xl p-5" style={{ borderTop: '3px solid #7C3AED' }}>
                        <p className="text-[11px] text-gray-600 font-semibold tracking-wide mb-1">TOTAL SEMANAL</p>
                        <p className="text-3xl font-extrabold text-violet-400 mb-0.5">{total}h</p>
                        <p className="text-xs text-gray-600 mb-4">≈ {epsW} episódios por semana</p>
                        <div className="h-px bg-[#1E2A3E] mb-4" />
                        <p className="text-[11px] font-bold text-gray-600 tracking-wide mb-3">DISTRIBUIÇÃO</p>
                        {CRONO_SUBJECTS.map(s => {
                            const p = total > 0 ? Math.round((hrs[s.id] / total) * 100) : 0; return (
                                <div key={s.id} className="mb-2"><div className="flex justify-between mb-1">
                                    <span className="text-[11px] text-gray-400">{s.short}</span>
                                    <span className="text-[11px] font-bold" style={{ color: s.color }}>{p}%</span></div>
                                    <div className="h-1.5 bg-[#0E1420] rounded-full"><div className="h-full rounded-full transition-all" style={{ width: `${p}%`, background: s.color }} /></div></div>)
                        })}</div>

                    <div className="bg-[#131928] border border-[#1E2A3E] rounded-2xl p-5">
                        <p className="text-[11px] font-bold text-gray-600 tracking-wide mb-3">PROJEÇÃO</p>
                        {([[`Em 4 semanas`, `${epsW * 4} eps`, '#7C3AED'], [`Em 3 meses`, `${epsW * 13} eps`, '#059669'], ['Conclusão', total > 0 ? `${Math.ceil(457 / epsW)} semanas` : '—', '#D97706']] as [string, string, string][]).map(([l, v, c]) => (
                            <div key={l} className="flex justify-between items-center py-2 border-b border-[#1E2A3E]">
                                <span className="text-xs text-gray-400">{l}</span>
                                <span className="text-sm font-bold" style={{ color: c }}>{v}</span></div>))}</div>

                    <button onClick={() => toast.success('Cronograma salvo!')} className="w-full py-3.5 rounded-2xl font-display font-bold text-white bg-gradient-to-r from-violet-600 to-violet-500 hover:brightness-110 hover:scale-[1.01] transition-all shadow-[0_4px_20px_#7C3AED50]">
                        💾 Salvar Cronograma</button>
                    <p className="text-[10px] text-gray-600 text-center -mt-2">Sincroniza com a conta após login</p>
                </div></div></div>)}

        {tab === 'progresso' && (<div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <CronoStat label="EPISÓDIOS TOTAIS" value={prog.totalDone} sub={`de ${prog.totalEps} no currículo`} color="#9B5FF0" icon="🎬" />
                <CronoStat label="CONCLUSÃO" value={`${donePct}%`} sub="do currículo completo" color="#059669" icon="🏆" />
                <CronoStat label="SEQUÊNCIA" value={`${Math.min(prog.totalDone, 7)} dias`} sub="sem interrupção" color="#D97706" icon="🔥" />
                <CronoStat label="MELHOR SEMANA" value={Math.min(prog.totalDone, 34)} sub="episódios em 7 dias" color="#0284C7" icon="⚡" />
            </div>

            {/* Chart */}
            <div className="bg-[#131928] border border-[#1E2A3E] rounded-3xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-5">
                    <div><h2 className="font-display text-lg font-extrabold text-white">Episódios Assistidos</h2>
                        <p className="text-xs text-gray-600">{curTotal} episódio{curTotal !== 1 ? 's' : ''} no período</p></div>
                    <CronoPill value={period} onChange={setPeriod} options={[{ value: 'dia', label: 'Hoje' }, { value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mês' }]} /></div>
                <ResponsiveContainer width="100%" height={240}>
                    {period === 'dia' ? (
                        <BarChart data={cur} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3E" vertical={false} />
                            <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                            <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CronoTooltip />} cursor={{ fill: '#7C3AED22' }} />
                            <Bar dataKey="eps" radius={[4, 4, 0, 0]}>{cur.map((e: any, i: number) => (<Cell key={i} fill={e.eps > 0 ? '#7C3AED' : '#1E2A3E'} />))}</Bar>
                        </BarChart>) : (
                        <AreaChart data={cur} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                            <defs><linearGradient id="cronoGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3E" vertical={false} />
                            <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} interval={period === 'mes' ? 4 : 0} />
                            <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CronoTooltip />} />
                            {period === 'semana' && <Area type="monotone" dataKey="meta" stroke="#2E3F5E" strokeDasharray="4 4" strokeWidth={1} fill="none" />}
                            <Area type="monotone" dataKey="eps" stroke="#7C3AED" strokeWidth={2.5} fill="url(#cronoGrad)" dot={{ fill: '#7C3AED', r: 3 }} activeDot={{ r: 6, fill: '#9B5FF0', stroke: '#070B14', strokeWidth: 2 }} />
                        </AreaChart>)}
                </ResponsiveContainer></div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#131928] border border-[#1E2A3E] rounded-3xl p-5">
                    <h3 className="font-display font-bold text-white mb-1">Atividade — últimos 30 dias</h3>
                    <p className="text-[11px] text-gray-600 mb-3">Cada quadrado = 1 dia. Tom mais escuro = mais episódios.</p>
                    <HeatCal data={cd.mes} /></div>
                <div className="bg-[#131928] border border-[#1E2A3E] rounded-3xl p-5">
                    <h3 className="font-display font-bold text-white mb-4">Progresso por Área</h3>
                    {CRONO_SUBJECTS.map((s, i) => {
                        const dn = Math.floor(Math.random() * s.eps * 0.6); const p = Math.round((dn / s.eps) * 100); return (
                            <div key={s.id} className="mb-3"><div className="flex justify-between mb-1">
                                <div className="flex items-center gap-2"><span className="text-sm">{s.icon}</span><span className="text-xs text-gray-400">{s.short}</span></div>
                                <div className="flex items-center gap-2"><span className="text-[11px] text-gray-600">{dn}/{s.eps}</span>
                                    <span className="text-xs font-bold min-w-[32px] text-right" style={{ color: s.color }}>{p}%</span></div></div>
                                <div className="h-2 bg-[#0E1420] rounded-full"><div className="h-full rounded-full transition-all" style={{ width: `${p}%`, background: `linear-gradient(90deg,${s.color}80,${s.color})`, transitionDelay: `${i * 80}ms` }} /></div></div>)
                    })}</div></div>
        </div>)}
    </motion.div>)
};

// ═══════════════════════════════════════════
// LAYOUT + APP
// ═══════════════════════════════════════════
const NAV: [string, string, View][] = [['🏠', 'Home', 'home'], ['📊', 'Painel', 'dashboard'], ['📅', 'Cronograma', 'cronograma'], ['📚', 'Matérias', 'series'], ['🎯', 'Estratégia', 'miniseries'], ['🎬', 'Repertório', 'films'], ['🗺️', 'Trilhas', 'trails'], ['🧭', 'GPS', 'diagnostic'], ['📖', 'Guia', 'guide']];

function MainApp({ user }: { user: { name: string; avatarColor: string; joinedAt: string } }) {
    const [view, setView] = useState<View>('home'); const [showCmd, setShowCmd] = useState(false); const [hoverSB, setHoverSB] = useState(false);
    const prog = useProgress(); const fileRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowCmd(v => !v) } };
        window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
    }, []);
    const nav = (v: View) => setView(v);
    const sub = view.startsWith('subject_') ? SUBJECTS.find(s => s.id === view.replace('subject_', '')) : null;
    const renderView = () => {
        if (sub) return <SubjectView subject={sub} nav={nav} prog={prog} />;
        switch (view) {
            case 'home': return <HomeView nav={nav} prog={prog} user={user} />; case 'dashboard': return <DashView nav={nav} prog={prog} user={user} />;
            case 'cronograma': return <CronogramaView prog={prog} />;
            case 'series': return <CatalogView nav={nav} prog={prog} />; case 'miniseries': return <MiniView />; case 'films': return <FilmsView />;
            case 'trails': return <TrailsView nav={nav} />; case 'diagnostic': return <DiagView nav={nav} prog={prog} user={user} />; case 'guide': return <GuideView />;
            default: return <HomeView nav={nav} prog={prog} user={user} />
        }
    };
    return (<div className="min-h-screen bg-[#0a0e27] noise-overlay text-gray-400 font-light">
        <AmbientBG /><Toaster richColors position="bottom-right" />
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={prog.importData} />

        {/* SIDEBAR DESKTOP */}
        <div onMouseEnter={() => setHoverSB(true)} onMouseLeave={() => setHoverSB(false)}
            className={`hidden md:flex fixed left-0 top-0 h-screen z-40 flex-col glass-strong transition-all duration-300 ${hoverSB ? 'w-64' : 'w-16'}`}>
            <div className="flex items-center gap-3 p-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center font-display font-black text-white text-xl shadow-[0_0_20px_rgba(139,92,246,0.4)]">D</div>
                {hoverSB && <span className="font-display font-black text-white text-xl tracking-tighter">DESDOBRE.</span>}</div>

            <nav className="flex-1 px-3 space-y-2 overflow-y-auto no-scrollbar">{NAV.map(([ic, lb, v]) => {
                const active = view === v || (v === 'series' && view.startsWith('subject_')); return (
                    <button key={v} onClick={() => nav(v)} className={`w-full flex items-center gap-4 px-3 py-3.5 rounded-2xl transition-all duration-300 relative group ${active ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'hover:bg-white/5 hover:text-white/80'}`}>
                        <span className="text-xl w-6 text-center shrink-0">{ic}</span>
                        {hoverSB && <span className="text-sm font-bold tracking-tight whitespace-nowrap">{lb}</span>}
                        {active && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-violet-500 rounded-r-full shadow-[0_0_10px_#8b5cf6]" />}</button>)
            })}</nav>

            <div className="p-3 bg-white/5 mx-2 rounded-3xl mb-4 space-y-2">{hoverSB && <>
                <button onClick={() => setShowCmd(true)} className="w-full flex items-center justify-between px-3 py-3 rounded-2xl bg-white/5 text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-white transition-colors">
                    <div className="flex items-center gap-2"><span>🔍</span><span>Buscar</span></div><span className="opacity-50">⌘K</span></button>
                <div className="flex gap-2"><button onClick={prog.exportData} className="flex-1 py-2 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Export</button>
                    <button onClick={() => fileRef.current?.click()} className="flex-1 py-2 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Import</button></div></>}
                <div className="flex items-center gap-3 p-1"><div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-base font-black shadow-inner border border-white/10" style={{ background: user.avatarColor }}>{user.name[0].toUpperCase()}</div>
                    {hoverSB && <div className="flex flex-col"><span className="text-sm font-bold text-white truncate w-32">{user.name}</span><span className="text-[10px] text-gray-500 font-bold uppercase">Plano Premium</span></div>}</div></div></div>

        {/* TOPBAR MOBILE */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass-strong z-50 flex items-center justify-between px-6 border-b border-white/5">
            <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center font-display font-black text-white text-sm shadow-lg">D</div>
                <span className="font-display font-black text-white text-lg tracking-tighter">DESDOBRE.</span></div>
            <button onClick={() => setShowCmd(true)} className="p-2 bg-white/5 rounded-xl text-lg">🔍</button></div>

        {/* BOTTOM NAV MOBILE */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass-strong z-50 border-t border-white/5 pb-safe">
            <div className="flex items-center justify-around h-16">{NAV.slice(0, 6).map(([ic, lb, v]) => {
                const active = view === v || (v === 'series' && view.startsWith('subject_')); return (
                    <button key={v} onClick={() => nav(v)} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-violet-400' : 'text-gray-500'}`}>
                        <span className="text-xl">{ic}</span><span className="text-[9px] font-black uppercase tracking-tighter">{lb}</span>
                        {active && <motion.div layoutId="mobile-active" className="w-1 h-1 rounded-full bg-violet-400 mt-0.5 shadow-[0_0_8px_#a78bfa]" />}</button>)
            })}</div></div>

        {/* MAIN CONTENT AREA */}
        <main className={`relative z-10 md:ml-16 lg:ml-20 pt-20 md:pt-10 pb-24 md:pb-10 px-4 md:px-12 py-8 min-h-screen max-w-[1600px] mx-auto`}>
            <AnimatePresence mode="wait">{renderView()}</AnimatePresence></main>
        <AnimatePresence>{showCmd && <CommandPalette onClose={() => setShowCmd(false)} nav={nav} />}</AnimatePresence>
    </div>)
}

export default function App() {
    const [user, setUser] = useState<{ name: string; avatarColor: string; joinedAt: string } | null>(() => sg('desdobre_user', null));
    if (!user) return <OnBoarding onDone={u => { ss('desdobre_user', u); setUser(u) }} />;
    return <MainApp user={user} />
}
