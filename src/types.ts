export interface Episode {
    id: string;
    title: string;
    est: string;
    topics: string[];
}

export interface Season {
    id: string;
    title: string;
    episodes: Episode[];
}

export interface SyllabusItem {
    id: string;
    title: string;
    desc: string;
    format: 'serie' | 'minisserie' | 'filme';
    seasons: Season[];
}

export interface MentorMessage {
    role: 'ai' | 'user';
    text: string;
}
