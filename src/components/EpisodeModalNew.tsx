// EpisodeModalNew.tsx — Modal de Episódio Moderno com Checklist, Quiz e Professor
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { resolveVideo, fetchProfessores } from '../api';

const CORES_MATERIA: Record<string, { bg: string; accent: string; light: string }> = {
    historia: { bg: 'from-amber-900/40 to-orange-900/20', accent: '#f59e0b', light: 'bg-amber-500/20 text-amber-300' },
    matematica: { bg: 'from-blue-900/40 to-indigo-900/20', accent: '#3b82f6', light: 'bg-blue-500/20 text-blue-300' },
    quimica: { bg: 'from-emerald-900/40 to-teal-900/20', accent: '#10b981', light: 'bg-emerald-500/20 text-emerald-300' },
    biologia: { bg: 'from-lime-900/40 to-green-900/20', accent: '#84cc16', light: 'bg-lime-500/20 text-lime-300' },
    fisica: { bg: 'from-cyan-900/40 to-blue-900/20', accent: '#06b6d4', light: 'bg-cyan-500/20 text-cyan-300' },
    geografia: { bg: 'from-teal-900/40 to-cyan-900/20', accent: '#14b8a6', light: 'bg-teal-500/20 text-teal-300' },
    redacao: { bg: 'from-pink-900/40 to-rose-900/20', accent: '#ec4899', light: 'bg-pink-500/20 text-pink-300' },
    socfilo: { bg: 'from-purple-900/40 to-violet-900/20', accent: '#a855f7', light: 'bg-purple-500/20 text-purple-300' },
};

interface Quiz { pergunta: string; alternativas: string[]; correta: number; }
interface Episodio {
    id: string; titulo: string; assunto: string; duracao: string;
    topicos: string[]; descricao: string; tags?: string[]; quiz?: Quiz;
}
interface Props { episodio: Episodio; materia: string; tituloTemporada: string; onClose: () => void; }

const STORAGE_PREFIX = 'desdobre_ep_';

export default function EpisodeModalNew({ episodio, materia, tituloTemporada, onClose }: Props) {
    const cores = CORES_MATERIA[materia] || CORES_MATERIA.historia;
    const [professores, setProfessores] = useState<any[]>([]);

    useEffect(() => {
        fetchProfessores(materia).then(profs => {
            if (profs) setProfessores(profs);
        });
    }, [materia]);

    const [topicosFeitos, setTopicosFeitos] = useState<boolean[]>(() => {
        try {
            const saved = localStorage.getItem(`${STORAGE_PREFIX}${episodio.id}`);
            return saved ? JSON.parse(saved) : new Array(episodio.topicos.length).fill(false);
        } catch { return new Array(episodio.topicos.length).fill(false); }
    });

    const [quizResposta, setQuizResposta] = useState<number | null>(null);
    const [profIdx, setProfIdx] = useState(0);

    const concluidos = topicosFeitos.filter(Boolean).length;
    const total = episodio.topicos.length;
    const pct = total > 0 ? Math.round((concluidos / total) * 100) : 0;
    const tudo100 = pct === 100;

    useEffect(() => {
        localStorage.setItem(`${STORAGE_PREFIX}${episodio.id}`, JSON.stringify(topicosFeitos));
    }, [topicosFeitos, episodio.id]);

    // Fechar com Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const [justCompleted, setJustCompleted] = useState(false);

    const toggleTopico = (i: number) => {
        const next = [...topicosFeitos];
        next[i] = !next[i];

        const newConcluidos = next.filter(Boolean).length;
        if (newConcluidos === total && concluidos < total) {
            toast.success("🎉 Episódio concluído e registrado no seu QG!");
            setJustCompleted(true);
            setTimeout(() => setJustCompleted(false), 3000);
        }

        setTopicosFeitos(next);
    };

    const assistir = async (idx: number) => {
        const url = await resolveVideo(materia, episodio.assunto, idx);
        window.open(url, '_blank');
    };

    const professorAtual = professores.length > 0 ? professores[profIdx] : null;
    const proximoProf = professores.length > 1 ? professores[(profIdx + 1) % professores.length] : null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[500] bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-6"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.97 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full h-[95vh] sm:max-w-2xl sm:h-auto sm:max-h-[88vh] bg-[#0a0a0a] rounded-t-3xl sm:rounded-3xl border border-white/10 overflow-hidden flex flex-col relative"
                >
                    {/* Confetti particles */}
                    <AnimatePresence>
                        {justCompleted && (
                            <div className="absolute inset-x-0 top-0 h-full pointer-events-none z-50 overflow-hidden">
                                {Array.from({ length: 25 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: -20, x: `${Math.random() * 100}%`, opacity: 1, scale: Math.random() + 0.5 }}
                                        animate={{ y: 800, x: `+=${(Math.random() - 0.5) * 200}`, opacity: 0, rotate: Math.random() * 360 }}
                                        transition={{ duration: 1.5 + Math.random() * 1.5, ease: 'easeOut' }}
                                        className="absolute top-0 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                        style={{ background: [cores.accent, '#f472b6', '#34d399', '#fbbf24'][Math.floor(Math.random() * 4)] }}
                                    />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Mobile drag handle */}
                    <div className="w-full flex items-center justify-center pt-3 pb-1 sm:hidden">
                        <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className={`relative p-6 pt-2 sm:pt-6 bg-gradient-to-br ${cores.bg} border-b border-white/5`}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${cores.light}`}>
                                        {tituloTemporada}
                                    </span>
                                    <span className="text-[10px] text-white/40 font-bold">{episodio.duracao}</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-tight line-clamp-2 md:line-clamp-none" id="modal-title">
                                    {episodio.titulo}
                                </h2>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="text-xs text-white/50">{concluidos}/{total} tópicos</span>
                                    {tudo100 && (
                                        <motion.span
                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            className="text-xs font-black text-green-400 flex items-center gap-1"
                                        >
                                            🎉 Concluído!
                                        </motion.span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all flex-none"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Barra de progresso */}
                        <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: cores.accent }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-white/30">Progresso</span>
                            <span className="text-[10px] font-black" style={{ color: cores.accent }}>{pct}%</span>
                        </div>
                    </div>

                    {/* Conteúdo (scroll) */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">

                        {/* Botões de Assistir */}
                        <div className="space-y-3">
                            {professorAtual && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => assistir(profIdx)}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all"
                                    style={{ borderColor: cores.accent + '60', background: cores.accent + '15' }}
                                >
                                    <span className="text-2xl">{professorAtual.avatar}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-white">Assistir com {professorAtual.nome}</span>
                                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-yellow-400 bg-yellow-400/10 border border-yellow-400/20">
                                                ⭐ #{profIdx + 1} prioridade
                                            </span>
                                        </div>
                                        <span className="text-xs text-white/40">{professorAtual.canal} · YouTube</span>
                                    </div>
                                    <svg className="w-5 h-5 text-white/50 flex-none" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </motion.button>
                            )}

                            {proximoProf && profIdx !== (profIdx + 1) % professores.length && (
                                <button
                                    onClick={() => { setProfIdx((profIdx + 1) % professores.length); assistir((profIdx + 1) % professores.length); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/3 hover:bg-white/8 transition-all text-left"
                                >
                                    <span className="text-lg">{proximoProf.avatar}</span>
                                    <span className="text-sm text-white/60 font-bold">Outro professor: {proximoProf.nome}</span>
                                </button>
                            )}
                        </div>

                        {/* Checklist de Tópicos */}
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-3">
                                📋 Tópicos do Episódio
                            </h3>
                            <div className="space-y-2">
                                {episodio.topicos.map((topico, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => toggleTopico(i)}
                                        whileHover={{ x: 4 }}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left group"
                                    >
                                        <div
                                            className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-none transition-all duration-200"
                                            style={{
                                                borderColor: topicosFeitos[i] ? cores.accent : 'rgba(255,255,255,0.2)',
                                                background: topicosFeitos[i] ? cores.accent + '30' : 'transparent',
                                            }}
                                        >
                                            {topicosFeitos[i] && (
                                                <motion.svg
                                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                    className="w-3 h-3" fill="none" stroke={cores.accent} strokeWidth={3} viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </motion.svg>
                                            )}
                                        </div>
                                        <span className={`text-sm transition-all duration-200 ${topicosFeitos[i] ? 'line-through text-white/30' : 'text-white/80'}`}>
                                            {topico}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Descrição */}
                        <div className="p-4 rounded-2xl bg-white/3 border border-white/5">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-2">📖 Sobre este episódio</h3>
                            <p className="text-sm text-white/70 leading-relaxed">{episodio.descricao}</p>
                        </div>

                        {/* Tags */}
                        {episodio.tags && episodio.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {episodio.tags.map((tag, i) => (
                                    <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Quiz */}
                        {episodio.quiz && (
                            <div className="p-5 rounded-2xl bg-white/3 border border-white/10">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-3">🧠 Quiz Rápido</h3>
                                <p className="text-sm font-bold text-white/90 mb-4">{episodio.quiz.pergunta}</p>
                                <div className="space-y-2">
                                    {episodio.quiz.alternativas.map((alt, i) => {
                                        const isCorreta = i === episodio.quiz!.correta;
                                        const isEscolhida = quizResposta === i;
                                        let cls = 'border-white/10 bg-white/3 text-white/60 hover:bg-white/8';
                                        if (quizResposta !== null) {
                                            if (isCorreta) cls = 'border-green-500/60 bg-green-500/15 text-green-400';
                                            else if (isEscolhida) cls = 'border-red-500/60 bg-red-500/15 text-red-400';
                                            else cls = 'border-white/5 bg-white/2 text-white/30';
                                        }
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => { if (quizResposta === null) setQuizResposta(i); }}
                                                disabled={quizResposta !== null}
                                                className={`w-full text-left p-3 rounded-xl border text-sm font-bold transition-all ${cls}`}
                                            >
                                                {alt}
                                            </button>
                                        );
                                    })}
                                </div>
                                {quizResposta !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`mt-3 text-xs font-black text-center py-2 rounded-xl ${quizResposta === episodio.quiz.correta ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}
                                    >
                                        {quizResposta === episodio.quiz.correta ? '✅ Correto! Muito bem!' : `❌ Incorreto. A resposta certa é: ${episodio.quiz.alternativas[episodio.quiz.correta]}`}
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Celebração */}
                        {tudo100 && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-5 rounded-2xl bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-500/20 text-center"
                            >
                                <div className="text-4xl mb-2">🎉</div>
                                <p className="text-sm font-black text-green-400 uppercase tracking-wide">Episódio Concluído!</p>
                                <p className="text-xs text-white/50 mt-1">Você dominou todos os tópicos deste episódio.</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
