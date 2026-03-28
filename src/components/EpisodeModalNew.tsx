// EpisodeModalNew.tsx — Modal de Episódio v3
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { resolveVideo, fetchProfessores } from '../api';

const CORES_MATERIA: Record<string, { accent: string; bg: string; light: string }> = {
    historia:   { accent: '#f59e0b', bg: 'rgba(245,158,11,0.06)',  light: 'rgba(245,158,11,0.14)' },
    matematica: { accent: '#4f8ef7', bg: 'rgba(79,142,247,0.06)',  light: 'rgba(79,142,247,0.14)' },
    quimica:    { accent: '#00d4aa', bg: 'rgba(0,212,170,0.06)',   light: 'rgba(0,212,170,0.14)'  },
    biologia:   { accent: '#84cc16', bg: 'rgba(132,204,22,0.06)',  light: 'rgba(132,204,22,0.14)' },
    fisica:     { accent: '#06b6d4', bg: 'rgba(6,182,212,0.06)',   light: 'rgba(6,182,212,0.14)'  },
    geografia:  { accent: '#14b8a6', bg: 'rgba(20,184,166,0.06)',  light: 'rgba(20,184,166,0.14)' },
    redacao:    { accent: '#f472b6', bg: 'rgba(244,114,182,0.06)', light: 'rgba(244,114,182,0.14)' },
    socfilo:    { accent: '#a78bfa', bg: 'rgba(167,139,250,0.06)', light: 'rgba(167,139,250,0.14)' },
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
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4"
                style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)' }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 48, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 48, opacity: 0 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 380 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full h-[92vh] sm:max-w-lg sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl"
                    style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-hover)',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
                    }}
                >
                    {/* Confetti */}
                    <AnimatePresence>
                        {justCompleted && (
                            <div className="absolute inset-x-0 top-0 h-full pointer-events-none z-50 overflow-hidden rounded-t-3xl sm:rounded-2xl">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: -10, x: `${Math.random() * 100}%`, opacity: 1, scale: 1 }}
                                        animate={{ y: 620, opacity: 0, rotate: Math.random() * 540, scale: 0.5 }}
                                        transition={{ duration: 1.8 + Math.random() * 0.8, ease: 'easeOut' }}
                                        className="absolute top-0 w-2 h-2 rounded"
                                        style={{ background: [cores.accent, '#4f8ef7', '#00d4aa', '#f59e0b', '#f472b6'][i % 5] }}
                                    />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Drag handle (mobile) */}
                    <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
                        <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
                    </div>

                    {/* Header */}
                    <div
                        className="flex-shrink-0 px-5 pt-4 pb-4 border-b"
                        style={{ borderColor: 'var(--border)' }}
                    >
                        {/* Accent line */}
                        <div
                            className="h-px w-16 rounded-full mb-3"
                            style={{ background: cores.accent }}
                        />

                        <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                    <span
                                        className="text-[9px] font-bold px-2 py-0.5 rounded-md tracking-widest uppercase"
                                        style={{ background: cores.light, color: cores.accent }}
                                    >
                                        {tituloTemporada}
                                    </span>
                                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                        {episodio.duracao}
                                    </span>
                                </div>
                                <h2
                                    className="font-extrabold text-base leading-tight line-clamp-2 tracking-tight"
                                    style={{ color: 'var(--text-primary)', letterSpacing: '-0.025em' }}
                                >
                                    {episodio.titulo}
                                </h2>
                                <p className="text-xs mt-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                                    <span
                                        className="font-bold"
                                        style={{ color: tudo100 ? 'var(--accent)' : cores.accent }}
                                    >
                                        {concluidos}/{total}
                                    </span>
                                    tópicos
                                    {tudo100 && (
                                        <span className="font-bold" style={{ color: 'var(--accent)' }}>
                                            · Concluido!
                                        </span>
                                    )}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                                style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'var(--bg-overlay)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'var(--bg-elevated)';
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                }}
                            >
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3.5 progress-bar" style={{ height: '3px' }}>
                            <motion.div
                                style={{ height: '100%', borderRadius: 999, background: tudo100 ? 'var(--accent)' : cores.accent }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
                                        borderColor: `${cores.accent}35`,
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${cores.accent}60`)}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = `${cores.accent}35`)}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                        style={{ background: cores.light }}
                                    >
                                        {professorAtual.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                            {professorAtual.nome}
                                        </p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            {professorAtual.canal} · YouTube
                                        </p>
                                    </div>
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: cores.accent, color: '#08080c' }}
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
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left"
                                    style={{ border: '1px solid var(--border)' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'var(--bg-elevated)';
                                        e.currentTarget.style.borderColor = 'var(--border-hover)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                    }}
                                >
                                    <span className="text-base flex-shrink-0">{proximoProf.avatar}</span>
                                    <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>
                                        {proximoProf.nome}
                                    </span>
                                    <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                                        Alternativo
                                    </span>
                                </button>
                            )}
                        </div>

                        <div className="border-t" style={{ borderColor: 'var(--border)' }} />

                        {/* Checklist */}
                        <div>
                            <p className="section-label mb-3">Tópicos do episódio</p>
                            <div className="space-y-1">
                                {episodio.topicos.map((topico, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => toggleTopico(i)}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                                        whileHover={{ x: 2 }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <div
                                            className="check-box flex-shrink-0"
                                            style={topicosFeitos[i] ? {
                                                borderColor: cores.accent,
                                                background: `${cores.accent}18`,
                                            } : {}}
                                        >
                                            {topicosFeitos[i] && (
                                                <motion.svg
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', damping: 20, stiffness: 400 }}
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
                                            className="text-sm transition-all leading-relaxed"
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
                            className="p-4 rounded-xl"
                            style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
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
                                className="p-4 rounded-xl"
                                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div
                                        className="w-1 h-4 rounded-full"
                                        style={{ background: 'var(--brand)' }}
                                    />
                                    <p className="section-label">Quiz rápido</p>
                                </div>
                                <p className="text-sm font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
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
                                            if (isCorreta) { bg = 'rgba(0,212,170,0.08)'; border = 'var(--accent)'; color = 'var(--accent)'; }
                                            else if (isEscolhida) { bg = 'rgba(239,68,68,0.08)'; border = '#ef4444'; color = '#ef4444'; }
                                            else { color = 'var(--text-muted)'; }
                                        }
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => { if (quizResposta === null) setQuizResposta(i); }}
                                                disabled={quizResposta !== null}
                                                className="w-full text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all"
                                                style={{ background: bg, borderColor: border, color }}
                                                onMouseEnter={e => { if (quizResposta === null) e.currentTarget.style.background = 'var(--bg-overlay)'; }}
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
                                        className="mt-3 text-xs font-bold text-center py-2.5 rounded-xl"
                                        style={quizResposta === episodio.quiz.correta
                                            ? { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-glow)' }
                                            : { background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }
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
                                transition={{ type: 'spring', damping: 20 }}
                                className="p-4 rounded-xl text-center"
                                style={{
                                    background: 'var(--accent-dim)',
                                    border: '1px solid var(--accent-glow)',
                                }}
                            >
                                <p className="font-extrabold text-sm mb-0.5 tracking-tight" style={{ color: 'var(--accent)' }}>
                                    Episódio concluido!
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    Todos os tópicos deste episódio foram marcados.
                                </p>
                            </motion.div>
                        )}

                        <div className="h-4" />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
