// Banco de Imagens (URLs Diretas e Confiáveis do Unsplash)
const THEMES = {
    // Geografia: Mapa / Terra
    geo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1080&auto=format&fit=crop",
    // História: Coliseu / Antigo
    hist: "https://images.unsplash.com/photo-1552432552-06c0bce77492?q=80&w=1080&auto=format&fit=crop",
    // Sociologia: Multidão / Protesto
    socio: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1080&auto=format&fit=crop",
    // Filosofia: Estátua Pensador / Abstrato
    filo: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1080&auto=format&fit=crop",
    // Química: Tubos de Ensaio
    qui: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=1080&auto=format&fit=crop",
    // Biologia: Célula / Planta
    bio: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1080&auto=format&fit=crop",
    // Física: Espaço / Partículas
    fis: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1080&auto=format&fit=crop",
    // Matemática: Geometria / Cálculos
    mat: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1080&auto=format&fit=crop", // Reusing physics vibe for math abstract
    // Português: Livros / Escrita
    port: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1080&auto=format&fit=crop",
    // Literatura: Biblioteca Antiga
    lit: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1080&auto=format&fit=crop",
    // Redação: Papel e Caneta / Minimalista
    red: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1080&auto=format&fit=crop"
};

// Fallback para episódios específicos
const EPISODE_IMAGES = [
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop"
];

// Gerador de Sinopses Fictícias
function generateSynopsis(title) {
    return `Em "${title}", desvendamos os mistérios essenciais deste tema. Acompanhe uma jornada visual e teórica que conecta conceitos abstratos à realidade prática, preparando você para dominar o conteúdo com profundidade e clareza crítica.`;
}

// Função Principal
export function enrichSyllabus(syllabusData) {
    return syllabusData.map(subject => {
        // Garantir fallback
        const themeImage = THEMES[subject.id] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1080&auto=format&fit=crop";

        return {
            ...subject,
            seasons: subject.seasons.map((season, index) => ({
                ...season,
                thumbnail: themeImage,
                year: 2024,
                maturityRating: "Livre",
                matchScore: Math.floor(Math.random() * (99 - 85) + 85),
                synopsis: generateSynopsis(season.title),

                episodes: season.episodes.map((ep, epIndex) => ({
                    ...ep,
                    // Imagem aleatória determinística baseada no índice para consistência
                    thumbnail: EPISODE_IMAGES[epIndex % EPISODE_IMAGES.length],
                    description: `Análise profunda: ${ep.title}. Entenda os fundamentos e suas aplicações.`
                }))
            }))
        };
    });
}
