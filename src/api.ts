import { CATALOG } from './data/catalog';
import { obterProfessores } from './data/professores';
import { resolverLinkVideo, resolverLinkPlaylist } from './data/videoResolver';

// Mocked API wrapper to maintain compatibility with the UI components while remaining 100% frontend
export const fetchCatalog = async () => {
    return Promise.resolve(CATALOG);
};

export const fetchProfessores = async (materia: string) => {
    return Promise.resolve(obterProfessores(materia));
};

export const resolveVideo = async (materia: string, assunto: string, profIndex: number) => {
    return Promise.resolve(resolverLinkVideo(materia, assunto, profIndex));
};

export const resolvePlaylist = async (materia: string, titulo: string, profIndex: number) => {
    return Promise.resolve(resolverLinkPlaylist(materia, titulo, profIndex));
};
