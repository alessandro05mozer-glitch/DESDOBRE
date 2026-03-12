export interface Professor {
    nome: string;
    canal: string;
    prioridade: number;
    avatar: string;
}

export const PROFESSORES: Record<string, Professor[]> = {
    historia: [
        { nome: "Parabólica", canal: "Parabólica", prioridade: 1, avatar: "🎯" },
        { nome: "Débora Aladim", canal: "Débora Aladim", prioridade: 2, avatar: "📚" },
        { nome: "João Alfredo", canal: "João Alfredo História", prioridade: 3, avatar: "🏛️" },
    ],
    matematica: [
        { nome: "Ferreto", canal: "Ferreto Matemática", prioridade: 1, avatar: "🔢" },
        { nome: "Gis com Giz", canal: "Gis com Giz", prioridade: 2, avatar: "📐" },
        { nome: "Matemática Rio", canal: "Matemática Rio", prioridade: 3, avatar: "🧮" },
    ],
    quimica: [
        { nome: "Parabólica", canal: "Parabólica Química", prioridade: 1, avatar: "⚗️" },
        { nome: "Prof Paulo Valim", canal: "Prof Paulo Valim", prioridade: 2, avatar: "🧪" },
        { nome: "Kennedy Ramos", canal: "Kennedy Ramos", prioridade: 3, avatar: "🔬" },
    ],
    biologia: [
        { nome: "Parabólica", canal: "Parabólica Biologia", prioridade: 1, avatar: "🌿" },
        { nome: "Prof Guilherme", canal: "Prof Guilherme Goulart", prioridade: 2, avatar: "🧬" },
        { nome: "Samuel Cunha", canal: "Samuel Cunha", prioridade: 3, avatar: "🦋" },
    ],
    fisica: [
        { nome: "Física Fábris", canal: "Física Fábris", prioridade: 1, avatar: "⚡" },
        { nome: "Física Total", canal: "Física Total", prioridade: 2, avatar: "🔭" },
        { nome: "Física 2.0", canal: "Física 2.0", prioridade: 3, avatar: "⚛️" },
    ],
    geografia: [
        { nome: "Prof Thaís", canal: "Professora Thaís Formagio", prioridade: 1, avatar: "🌍" },
        { nome: "Parabólica", canal: "Parabólica Geografia", prioridade: 2, avatar: "🗺️" },
        { nome: "Prof Raphael", canal: "Prof Raphael Carrieri", prioridade: 3, avatar: "🌐" },
    ],
    redacao: [
        { nome: "Parabólica", canal: "Parabólica Redação", prioridade: 1, avatar: "✍️" },
        { nome: "Português Play", canal: "Português Play", prioridade: 2, avatar: "📝" },
        { nome: "Prof Noslen", canal: "Prof Noslen", prioridade: 3, avatar: "🖋️" },
    ],
    socfilo: [
        { nome: "Parabólica", canal: "Parabólica Sociologia Filosofia", prioridade: 1, avatar: "🧠" },
        { nome: "Pedro Chaim", canal: "Pedro Chaim", prioridade: 2, avatar: "🏛️" },
        { nome: "Descomplica", canal: "Descomplica Humanas", prioridade: 3, avatar: "💡" },
    ]
};

export const obterProfessores = (materia: string): Professor[] => {
    return PROFESSORES[materia] || [];
};

export const obterProfessor = (materia: string, index: number): Professor | null => {
    const lista = obterProfessores(materia);
    if (!lista.length) return null;
    if (index >= 0 && index < lista.length) return lista[index];
    return lista[0];
};
