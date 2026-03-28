import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TRILHAS = [
    {
        id: 'fundamentos',
        titulo: 'Fundamentos',
        tag: 'Essencial',
        tagClass: 'chip-amber',
        desc: 'Base conceitual das principais disciplinas do ENEM. Ideal para revisão dos conceitos centrais antes de avançar.',
        color: '#f59e0b',
        etapas: [
            { label: 'Matemática Básica',      done: true },
            { label: 'Interpretação Crítica',  done: true },
            { label: 'História Geral I',       done: false },
        ],
        progress: 66,
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
        ),
    },
    {
        id: 'estrategias',
        titulo: 'Estratégias',
        tag: 'Avançado',
        tagClass: 'chip-mint',
        desc: 'Métodos para maximizar desempenho. Aprenda a usar a TRI a seu favor e gerir o tempo de prova.',
        color: '#34d399',
        etapas: [
            { label: 'Análise da Matriz TRI',       done: false },
            { label: 'Microestrutura da Redação',   done: false },
            { label: 'Gestão de Tempo em Prova',    done: false },
        ],
        progress: 0,
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        id: 'repertorio',
        titulo: 'Repertório',
        tag: 'Complementar',
        tagClass: 'chip-sky',
        desc: 'Conteúdo sociocultural para argumentação. Filmes, livros e músicas como repertório qualificado para a redação.',
        color: '#60a5fa',
        etapas: [
            { label: 'Cinema e Sociologia',        done: true },
            { label: 'Filosofia Prática',          done: false },
            { label: 'Geopolítica e Guerra Fria',  done: false },
        ],
        progress: 33,
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
        ),
    },
];

export default function Trilhas({ onNavigate }: { onNavigate: (v: string, id?: string) => void }) {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="anim-fade-up">

            {/* ── Header ── */}
            <div>
                <p className="label mb-2">Aprendizado estruturado</p>
                <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: '0.3rem' }}>
                    Trilhas de{' '}
                    <span style={{
                        background: 'linear-gradient(120deg, var(--amber), var(--mint))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Aprendizado
                    </span>
                </h1>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', maxWidth: 480 }}>
                    Rotas projetadas para solidificar seu conhecimento de forma estratégica e progressiva.
                </p>
            </div>

            {/* ── Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {TRILHAS.map((trilha, idx) => {
                    const isOpen = expanded === trilha.id;

                    return (
                        <motion.div
                            key={trilha.id}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                background: 'var(--bg-2)',
                                borderRadius: '1.375rem',
                                border: `1px solid var(--line)`,
                                overflow: 'hidden',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                position: 'relative',
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget;
                                el.style.borderColor = `${trilha.color}40`;
                                el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${trilha.color}20`;
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget;
                                el.style.borderColor = 'var(--line)';
                                el.style.boxShadow = 'none';
                            }}
                        >
                            {/* Animated top bar */}
                            <div style={{ height: 3, background: 'var(--bg-4)', position: 'relative', overflow: 'hidden' }}>
                                <motion.div
                                    style={{
                                        position: 'absolute', left: 0, top: 0, bottom: 0,
                                        background: `linear-gradient(90deg, ${trilha.color}, ${trilha.color}80)`,
                                        borderRadius: 3,
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${trilha.progress || 4}%` }}
                                    transition={{ delay: idx * 0.1 + 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </div>

                            <div style={{ padding: '1.25rem' }}>
                                {/* Icon + Tag */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: '0.875rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: `${trilha.color}12`,
                                        border: `1px solid ${trilha.color}25`,
                                        color: trilha.color,
                                    }}>
                                        {trilha.icon}
                                    </div>
                                    <span className={`chip ${trilha.tagClass}`}>{trilha.tag}</span>
                                </div>

                                {/* Title + Desc */}
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                                    {trilha.titulo}
                                </h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.55, marginBottom: '1rem' }}>
                                    {trilha.desc}
                                </p>

                                {/* Progress */}
                                {trilha.progress > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                            <p className="label">Progresso</p>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: trilha.color }}>{trilha.progress}%</span>
                                        </div>
                                        <div className="progress-track">
                                            <motion.div
                                                style={{ height: '100%', borderRadius: 999, background: trilha.color }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${trilha.progress}%` }}
                                                transition={{ delay: idx * 0.1 + 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Steps — toggleable */}
                                <button
                                    onClick={() => setExpanded(isOpen ? null : trilha.id)}
                                    style={{
                                        width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '0.5rem 0', marginBottom: '0.5rem',
                                        borderTop: '1px solid var(--line)',
                                        color: 'var(--text-3)',
                                        fontSize: '0.72rem', fontWeight: 600,
                                    }}
                                >
                                    <span>{trilha.etapas.filter(e => e.done).length}/{trilha.etapas.length} etapas</span>
                                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
                                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </motion.span>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingBottom: '0.75rem' }}>
                                                {trilha.etapas.map((etapa, eIdx) => (
                                                    <motion.div
                                                        key={eIdx}
                                                        initial={{ opacity: 0, x: -8 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: eIdx * 0.06, duration: 0.25 }}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}
                                                    >
                                                        <div style={{
                                                            width: 17, height: 17, borderRadius: '0.35rem', flexShrink: 0,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            background: etapa.done ? `${trilha.color}18` : 'var(--bg-4)',
                                                            border: `1.5px solid ${etapa.done ? trilha.color : 'var(--line)'}`,
                                                        }}>
                                                            {etapa.done && (
                                                                <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke={trilha.color} strokeWidth={3} strokeLinecap="round">
                                                                    <path d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            color: etapa.done ? 'var(--text-2)' : 'var(--text-3)',
                                                            textDecoration: etapa.done ? 'line-through' : 'none',
                                                        }}>
                                                            {etapa.label}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* CTA */}
                                <button
                                    className="btn w-full"
                                    style={{
                                        justifyContent: 'center',
                                        borderRadius: '0.875rem',
                                        background: trilha.progress > 0 ? `${trilha.color}14` : 'var(--bg-3)',
                                        color: trilha.progress > 0 ? trilha.color : 'var(--text-2)',
                                        border: `1px solid ${trilha.progress > 0 ? `${trilha.color}28` : 'var(--line)'}`,
                                        marginTop: '0.25rem',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = trilha.color;
                                        e.currentTarget.style.color = trilha.color === '#34d399' || trilha.color === '#60a5fa' ? '#0c0c0c' : '#fff';
                                        e.currentTarget.style.borderColor = trilha.color;
                                        e.currentTarget.style.boxShadow = `0 4px 20px ${trilha.color}40`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = trilha.progress > 0 ? `${trilha.color}14` : 'var(--bg-3)';
                                        e.currentTarget.style.color = trilha.progress > 0 ? trilha.color : 'var(--text-2)';
                                        e.currentTarget.style.borderColor = trilha.progress > 0 ? `${trilha.color}28` : 'var(--line)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {trilha.progress > 0 ? 'Continuar trilha' : 'Iniciar trilha'}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Banner ── */}
            <div style={{
                display: 'flex', flexDirection: 'column', gap: '1rem',
                padding: '1.25rem',
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                borderRadius: '1.375rem',
            }}
                className="sm:flex-row sm:items-center"
            >
                <div style={{
                    width: 40, height: 40, borderRadius: '0.75rem', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--mint-soft)',
                    border: '1px solid rgba(52,211,153,0.2)',
                }}>
                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--mint)' }}>
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                    </svg>
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-1)', marginBottom: '0.2rem' }}>
                        Novas trilhas em breve
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
                        Trilhas de Redação, Ciências da Natureza e mais estão sendo preparadas para o ENEM 2025.
                    </p>
                </div>
                <button
                    onClick={() => onNavigate('catalog')}
                    className="btn btn-outline"
                    style={{ flexShrink: 0, borderRadius: '0.75rem', fontSize: '0.8rem' }}
                >
                    Ver biblioteca
                </button>
            </div>
        </div>
    );
}
