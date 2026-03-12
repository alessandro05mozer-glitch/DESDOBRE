import { obterProfessor, obterProfessores } from './professores';

export const resolverLinkVideo = (materia: string, assunto: string, professorIndex: number): string => {
    const professor = obterProfessor(materia, professorIndex);
    if (!professor) {
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(assunto + ' ENEM')}`;
    }
    const termo = `${assunto} ${professor.canal}`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(termo)}`;
};

export const resolverLinkPlaylist = (materia: string, tituloTemporada: string, professorIndex: number): string => {
    const professor = obterProfessor(materia, professorIndex);
    if (!professor) {
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(tituloTemporada + ' playlist ENEM')}`;
    }
    const termo = `${tituloTemporada} playlist ${professor.canal}`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(termo)}`;
};

export const resolverComFallback = (materia: string, assunto: string, professorIndex: number): string => {
    const professores = obterProfessores(materia);
    if (professores.length === 0) {
        return resolverLinkVideo(materia, assunto, 0);
    }
    const nextIndex = (professorIndex + 1) % professores.length;
    return resolverLinkVideo(materia, assunto, nextIndex);
};
