// SubjectDetailsNew.tsx — Página de Temporada com Grid de Episódios Estilo Poster
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resolvePlaylist, fetchProfessores } from '../api';
import EpisodeModalNew from './EpisodeModalNew';

const CORES: Record<string, { grad: string; accent: string; orb1: string; orb2: string }> = {
    historia: { grad: 'from-amber-600 via-orange-600 to-red-700', accent: '#f59e0b', orb1: '#92400e', orb2: '#7c2d12' },
    matematica: { grad: 'from-blue-600 via-indigo-600 to-purple-700', accent: '#3b82f6', orb1: '#1e3a8a', orb2: '#4c1d95' },
    quimica: { grad: 'from-green-600 via-emerald-600 to-teal-700', accent: '#10b981', orb1: '#064e3b', orb2: '#134e4a' },
    biologia: { grad: 'from-lime-600 via-green-600 to-emerald-700', accent: '#84cc16', orb1: '#365314', orb2: '#14532d' },
    fisica: { grad: 'from-cyan-500 via-blue-600 to-indigo-700', accent: '#06b6d4', orb1: '#164e63', orb2: '#1e3a8a' },
    geografia: { grad: 'from-teal-500 via-cyan-600 to-blue-700', accent: '#14b8a6', orb1: '#134e4a', orb2: '#164e63' },
    redacao: { grad: 'from-pink-500 via-rose-600 to-red-700', accent: '#ec4899', orb1: '#831843', orb2: '#7c2d12' },
    socfilo: { grad: 'from-purple-600 via-violet-600 to-fuchsia-700', accent: '#a855f7', orb1: '#4c1d95', orb2: '#701a75' },
};

const EPISODIO_GRADS = [
    'from-amber-800 to-orange-900', 'from-blue-800 to-indigo-900', 'from-emerald-800 to-teal-900',
    'from-purple-800 to-violet-900', 'from-cyan-800 to-blue-900', 'from-rose-800 to-pink-900',
    'from-lime-800 to-green-900', 'from-fuchsia-800 to-purple-900',
];

interface Episodio {
    id: string; titulo: string; assunto: string; duracao: string;
    topicos: string[]; descricao: string; tags?: string[]; quiz?: any;
}
interface Temporada { id: string; titulo: string; materia: string; descricao: string; episodios: Episodio[]; }
interface Props { temporada: Temporada; onBack: () => void; }

export default function SubjectDetailsNew({ temporada, onBack }: Props) {
    const [episodioSelecionado, setEpisodioSelecionado] = useState<Episodio | null>(null);
    const cores = CORES[temporada.materia] || CORES.historia;
    const [profPrincipal, setProfPrincipal] = useState<any>(null);

    useEffect(() => {
        fetchProfessores(temporada.materia).then(profs => {
            if (profs && profs.length > 0) setProfPrincipal(profs[0]);
        });
    }, [temporada.materia]);

    const abrirPlaylist = async () => {
        const url = await resolvePlaylist(temporada.materia, temporada.titulo, 0);
        window.open(url, '_blank');
    };

    // Ler progresso de cada episódio
    const getEpPct = (ep: Episodio) => {
        try {
            const saved = localStorage.getItem(`desdobre_ep_${ep.id}`);
            if (!saved) return 0;
            const arr: boolean[] = JSON.parse(saved);
            const done = arr.filter(Boolean).length;
            return ep.topicos.length > 0 ? Math.round((done / ep.topicos.length) * 100) : 0;
        } catch { return 0; }
    };

    return (
        <div className="min-h-screen bg-[#0d0f1a] text-white">
            {/* Hero Banner */}
            <div className="relative w-full overflow-hidden" style={{ minHeight: '420px', backgroundImage: 'radial-gradient(circle at top center, #1a1b32 0%, #0d0f1a 60%)' }}>
                {/* Animated orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-[600px] h-[600px] rounded-full blur-[180px] opacity-30 animate-pulse" style={{ background: cores.orb1, top: '-200px', left: '-100px' }} />
                    <div className="absolute w-[400px] h-[400px] rounded-full blur-[140px] opacity-20 animate-pulse" style={{ background: cores.orb2, bottom: '-100px', right: '0' }} />
                    {/* Particles */}
                    {Array.from({ length: 18 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full opacity-40"
                            style={{ background: cores.accent, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                            animate={{ y: [0, -20, 0], opacity: [0.2, 0.7, 0.2] }}
                            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
                        />
                    ))}
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0f1a]/60 to-[#0d0f1a]" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-12">
                    {/* Back button */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-xs font-black uppercase tracking-widest">Voltar ao Catálogo</span>
                    </button>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <span className={`inline-block text-[10px] font-black uppercase tracking-[0.4em] mb-4 px-3 py-1 rounded-full bg-gradient-to-r ${cores.grad} bg-clip-text`}
                            style={{ color: cores.accent }}>
                            Temporada Completa
                        </span>
                        <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none mb-4">{temporada.titulo}</h1>
                        <p className="text-white/60 text-base max-w-xl leading-relaxed mb-8">{temporada.descricao}</p>

                        <div className="flex flex-wrap items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={abrirPlaylist}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-wider text-sm text-white shadow-2xl bg-gradient-to-r ${cores.grad}`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                {profPrincipal ? `Playlist com ${profPrincipal.nome}` : 'Playlist Completa'}
                            </motion.button>
                            <div className="text-xs text-white/40 font-bold">
                                {temporada.episodios.length} episódios
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Grade de Episódios */}
            <div className="max-w-5xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {temporada.episodios.map((ep, idx) => {
                        const pct = getEpPct(ep);
                        const gradIdx = idx % EPISODIO_GRADS.length;
                        return (
                            <motion.div
                                key={ep.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onClick={() => setEpisodioSelecionado(ep)}
                                className="cursor-pointer group"
                            >
                                {/* Poster 2:3 */}
                                <div className={`relative aspect-[2/3] rounded-2xl overflow-hidden bg-gradient-to-br ${EPISODIO_GRADS[gradIdx]} ring-1 ring-white/10 group-hover:ring-white/30 shadow-xl transition-all duration-500`}>
                                    {/* Número decorativo */}
                                    <span className="absolute top-3 left-4 text-5xl font-black text-white/10 select-none leading-none">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    {/* Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    {/* Progresso barra */}
                                    {pct > 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                                            <div className="h-full bg-green-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                                        </div>
                                    )}
                                    {/* Badges */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-1">
                                        <span className="text-[9px] font-black bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-white/70 text-right">
                                            {ep.topicos.length} tópicos
                                        </span>
                                        {ep.quiz && (
                                            <span className="text-[9px] font-black bg-yellow-500/30 border border-yellow-500/40 px-1.5 py-0.5 rounded-md text-yellow-300 text-right">
                                                Quiz
                                            </span>
                                        )}
                                        {pct === 100 && (
                                            <span className="text-[9px] font-black bg-green-500/30 border border-green-500/40 px-1.5 py-0.5 rounded-md text-green-300 text-right">
                                                ✓ Feito
                                            </span>
                                        )}
                                    </div>
                                    {/* Play button */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                    </div>
                                    {/* Bottom info */}
                                    <div className="absolute bottom-2 left-0 right-0 px-3">
                                        {pct === 0 && <div className="h-1 bg-transparent" />}
                                    </div>
                                </div>

                                {/* Título abaixo do poster */}
                                <div className="mt-3 px-1">
                                    <p className="text-xs font-black text-white/80 leading-tight uppercase tracking-tight line-clamp-2 group-hover:text-white transition-colors">
                                        {ep.titulo}
                                    </p>
                                    <p className="text-[10px] text-white/30 mt-1">{ep.duracao}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Modal de Episódio */}
            <AnimatePresence>
                {episodioSelecionado && (
                    <EpisodeModalNew
                        episodio={episodioSelecionado}
                        materia={temporada.materia}
                        tituloTemporada={temporada.titulo}
                        onClose={() => setEpisodioSelecionado(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
