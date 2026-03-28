// EpisodeModalNew.tsx — Modal de Episódio v2
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { resolveVideo, fetchProfessores } from '../api';

const CORES_MATERIA: Record<string, { accent: string; bg: string; light: string }> = {
    historia:   { accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  light: 'rgba(245,158,11,0.15)' },
    matematica: { accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  light: 'rgba(59,130,246,0.15)' },
    quimica:    { accent: '#10b981', bg: 'rgba(16,185,129,0.08)',  light: 'rgba(16,185,129,0.15)' },
    biologia:   { accent: '#84cc16', bg: 'rgba(132,204,22,0.08)',  light: 'rgba(132,204,22,0.15)' },
    fisica:     { accent: '#06b6d4', bg: 'rgba(6,182,212,0.08)',   light: 'rgba(6,182,212,0.15)'  },
    geografia:  { accent: '#14b8a6', bg: 'rgba(20,184,166,0.08)',  light: 'rgba(20,184,166,0.15)' },
    redacao:    { accent: '#ec4899', bg: 'rgba(236,72,153,0.08)',  light: 'rgba(236,72,153,0.15)' },
    socfilo:    { accent: '#a855f7', bg: 'rgba(168,85,247,0.08)',  light: 'rgba(168,85,247,0.15)' },
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
    const [profIdx, setProfIdx] = useState(0);
    const [quizResposta, setQuizResposta] = useState<number | null>(null);
    const [justCompleted, setJustCompleted] = useState(false);

    const [topicosFeitos, setTopicosFeitos] = useState<boolean[]>(() => {
        try {
            const saved = localStorage.getItem(`${STORAGE_PREFIX}${episodio.id}`);
            return saved ? JSON.parse(saved) : new Array(episodio.topicos.length).fill(false);
        } catch {
            return new Array(episodio.topicos.length).fill(false);
        }
    });

    const concluidos = topicosFeitos.filter(Boolean).length;
    const total = episodio.topicos.length;
    const pct = total > 0 ? Math.round((concluidos / total) * 100) : 0;
    const tudo100 = pct === 100;

    useEffect(() => {
        fetchProfessores(materia).then(profs => { if (profs) setProfessores(profs); });
    }, [materia]);

    useEffect(() => {
        localStorage.setItem(`${STORAGE_PREFIX}${episodio.id}`, JSON.stringify(topicosFeitos));
    }, [topicosFeitos, episodio.id]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const toggleTopico = (i: number) => {
        const next = [...topicosFeitos];
        next[i] = !next[i];
        const newConcluidos = next.filter(Boolean).length;
        if (newConcluidos === total && concluidos < total) {
            toast.success('Episódio concluído! Bom trabalho!');
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
                className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4"
                style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 60, opacity: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full h-[92vh] sm:max-w-lg sm:h-auto sm:max-h-[86vh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl border"
                    style={{
                        background: 'var(--bg-surface)',
                        borderColor: 'var(--border-hover)',
                    }}
                >
                    {/* Confetti */}
                    <AnimatePresence>
                        {justCompleted && (
                            <div className="absolute inset-x-0 top-0 h-full pointer-events-none z-50 overflow-hidden rounded-t-3xl sm:rounded-2xl">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: -10, x: `${Math.random() * 100}%`, opacity: 1 }}
                                        animate={{ y: 600, opacity: 0, rotate: Math.random() * 360 }}
                                        transition={{ duration: 1.5 + Math.random(), ease: 'easeOut' }}
                                        className="absolute top-0 w-2 h-2 rounded-full"
                                        style={{ background: [cores.accent, '#ec4899', '#10b981', '#f59e0b'][i % 4] }}
                                    />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Drag handle (mobile) */}
                    <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
                        <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-hover)' }} />
                    </div>

                    {/* Header */}
                    <div
                        className="flex-shrink-0 px-5 py-4 border-b"
                        style={{
                            background: cores.bg,
                            borderColor: 'var(--border)',
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                    <span
                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                        style={{ background: cores.light, color: cores.accent }}
                                    >
                                        {tituloTemporada}
                                    </span>
                                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                        {episodio.duracao}
                                    </span>
                                </div>
                                <h2
                                    className="font-bold text-base leading-tight line-clamp-2"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    {episodio.titulo}
                                </h2>
                                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                    {concluidos}/{total} tópicos
                                    {tudo100 && (
                                        <span className="ml-2 font-semibold" style={{ color: '#10b981' }}>
                                            · Concluido!
                                        </span>
                                    )}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                                style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                            >
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 progress-bar">
                            <motion.div
                                className="progress-bar-fill"
                                style={{ background: cores.accent }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto hide-scrollbar p-5 space-y-5">

                        {/* Watch buttons */}
                        <div className="space-y-2">
                            {professorAtual && (
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => assistir(profIdx)}
                                    className="w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left"
                                    style={{
                                        background: cores.bg,
                                        borderColor: `${cores.accent}40`,
                                    }}
                                >
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                                        style={{ background: cores.light }}
                                    >
                                        {professorAtual.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                            {professorAtual.nome}
                                        </p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            {professorAtual.canal} · YouTube
                                        </p>
                                    </div>
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: cores.accent, color: 'white' }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </motion.button>
                            )}

                            {proximoProf && (
                                <button
                                    onClick={() => { setProfIdx((profIdx + 1) % professores.length); assistir((profIdx + 1) % professores.length); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-left"
                                    style={{ borderColor: 'var(--border)', background: 'transparent' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <span className="text-base flex-shrink-0">{proximoProf.avatar}</span>
                                    <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>
                                        {proximoProf.nome}
                                    </span>
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Alt.</span>
                                </button>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t" style={{ borderColor: 'var(--border)' }} />

                        {/* Checklist */}
                        <div>
                            <p className="section-label mb-3">Tópicos do episódio</p>
                            <div className="space-y-1.5">
                                {episodio.topicos.map((topico, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => toggleTopico(i)}
                                        whileHover={{ x: 2 }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <div
                                            className="check-box flex-shrink-0"
                                            style={topicosFeitos[i] ? {
                                                borderColor: cores.accent,
                                                background: `${cores.accent}20`,
                                            } : {}}
                                        >
                                            {topicosFeitos[i] && (
                                                <motion.svg
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    width="9" height="9"
                                                    fill="none"
                                                    stroke={cores.accent}
                                                    strokeWidth={3}
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </motion.svg>
                                            )}
                                        </div>
                                        <span
                                            className="text-sm transition-all"
                                            style={{
                                                color: topicosFeitos[i] ? 'var(--text-muted)' : 'var(--text-secondary)',
                                                textDecoration: topicosFeitos[i] ? 'line-through' : 'none',
                                            }}
                                        >
                                            {topico}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div
                            className="p-4 rounded-xl border"
                            style={{ background: 'var(--bg-base)', borderColor: 'var(--border)' }}
                        >
                            <p className="section-label mb-2">Sobre este episódio</p>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {episodio.descricao}
                            </p>
                        </div>

                        {/* Tags */}
                        {episodio.tags && episodio.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {episodio.tags.map((tag, i) => (
                                    <span key={i} className="badge badge-neutral">{tag}</span>
                                ))}
                            </div>
                        )}

                        {/* Quiz */}
                        {episodio.quiz && (
                            <div
                                className="p-4 rounded-xl border"
                                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                            >
                                <p className="section-label mb-3">Quiz rápido</p>
                                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                                    {episodio.quiz.pergunta}
                                </p>
                                <div className="space-y-2">
                                    {episodio.quiz.alternativas.map((alt, i) => {
                                        const isCorreta = i === episodio.quiz!.correta;
                                        const isEscolhida = quizResposta === i;
                                        let bg = 'var(--bg-surface)';
                                        let border = 'var(--border)';
                                        let color = 'var(--text-secondary)';
                                        if (quizResposta !== null) {
                                            if (isCorreta) { bg = 'rgba(16,185,129,0.1)'; border = '#10b981'; color = '#10b981'; }
                                            else if (isEscolhida) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; color = '#ef4444'; }
                                            else { color = 'var(--text-muted)'; }
                                        }
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => { if (quizResposta === null) setQuizResposta(i); }}
                                                disabled={quizResposta !== null}
                                                className="w-full text-left px-3 py-2.5 rounded-lg border text-sm font-medium transition-all"
                                                style={{ background: bg, borderColor: border, color }}
                                                onMouseEnter={e => { if (quizResposta === null) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                                                onMouseLeave={e => { if (quizResposta === null) e.currentTarget.style.background = bg; }}
                                            >
                                                {alt}
                                            </button>
                                        );
                                    })}
                                </div>
                                {quizResposta !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-3 text-xs font-semibold text-center py-2 rounded-lg"
                                        style={quizResposta === episodio.quiz.correta
                                            ? { background: 'rgba(16,185,129,0.1)', color: '#10b981' }
                                            : { background: 'rgba(239,68,68,0.1)', color: '#ef4444' }
                                        }
                                    >
                                        {quizResposta === episodio.quiz.correta
                                            ? 'Correto! Muito bem!'
                                            : `Incorreto. Resposta certa: ${episodio.quiz.alternativas[episodio.quiz.correta]}`
                                        }
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Completion banner */}
                        {tudo100 && (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-4 rounded-xl text-center border"
                                style={{
                                    background: 'rgba(16,185,129,0.08)',
                                    borderColor: 'rgba(16,185,129,0.25)',
                                }}
                            >
                                <p className="font-bold text-sm mb-0.5" style={{ color: '#10b981' }}>
                                    Episódio concluído!
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    Você completou todos os tópicos deste episódio.
                                </p>
                            </motion.div>
                        )}

                        {/* Bottom spacing for mobile */}
                        <div className="h-4" />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
