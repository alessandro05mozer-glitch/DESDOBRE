import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TRILHAS = [
    {
        id: 'fundamentos',
        titulo: 'Fundamentos',
        tag: 'Essencial',
        desc: 'Base conceitual das principais disciplinas do ENEM. Ideal para revisão dos conceitos centrais.',
        color: '#4f8ef7',
        etapas: [
            { label: 'Matemática Básica', done: true },
            { label: 'Interpretação Crítica', done: true },
            { label: 'História Geral I', done: false },
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
        desc: 'Métodos para maximizar desempenho. Aprenda a usar a TRI a seu favor e gerir o tempo de prova.',
        color: '#00d4aa',
        etapas: [
            { label: 'Análise da Matriz TRI', done: false },
            { label: 'Microestrutura da Redação', done: false },
            { label: 'Gestão de Tempo em Prova', done: false },
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
        desc: 'Conteúdo sociocultural para argumentação dissertativa. Filmes, livros e músicas como repertório qualificado.',
        color: '#f472b6',
        etapas: [
            { label: 'Cinema e Sociologia', done: true },
            { label: 'Filosofia Prática', done: false },
            { label: 'Geopolítica e Guerra Fria', done: false },
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
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="w-full space-y-6 fade-in-up">

            {/* ─── Header ─── */}
            <div>
                <p className="section-label mb-1.5">Aprendizado estruturado</p>
                <h1
                    className="text-3xl md:text-4xl font-extrabold tracking-tight text-balance"
                    style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
                >
                    Trilhas de Aprendizado
                </h1>
                <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>
                    Rotas projetadas para solidificar seu conhecimento de forma estratégica.
                </p>
            </div>

            {/* ─── Cards ─── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TRILHAS.map((trilha, idx) => {
                    const isHovered = hoveredId === trilha.id;
                    return (
                        <motion.div
                            key={trilha.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            onMouseEnter={() => setHoveredId(trilha.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
                            style={{
                                background: 'var(--bg-surface)',
                                border: `1px solid ${isHovered ? trilha.color + '40' : 'var(--border)'}`,
                                boxShadow: isHovered ? `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${trilha.color}20` : 'none',
                                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                            }}
                        >
                            {/* Top accent bar */}
                            <div className="h-0.5 w-full">
                                <motion.div
                                    className="h-full"
                                    style={{ background: trilha.color }}
                                    initial={{ width: `${trilha.progress}%` }}
                                    animate={{ width: isHovered ? '100%' : `${trilha.progress}%` }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                />
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                {/* Icon + Tag */}
                                <div className="flex items-start justify-between mb-5">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
                                        style={{
                                            background: isHovered ? `${trilha.color}20` : `${trilha.color}10`,
                                            border: `1px solid ${trilha.color}30`,
                                            color: trilha.color,
                                        }}
                                    >
                                        {trilha.icon}
                                    </div>
                                    <span
                                        className="text-[9px] font-bold px-2.5 py-1 rounded-lg tracking-widest uppercase"
                                        style={{
                                            background: `${trilha.color}14`,
                                            color: trilha.color,
                                        }}
                                    >
                                        {trilha.tag}
                                    </span>
                                </div>

                                {/* Title + Desc */}
                                <h2
                                    className="font-extrabold text-base mb-2 tracking-tight"
                                    style={{ color: 'var(--text-primary)', letterSpacing: '-0.025em' }}
                                >
                                    {trilha.titulo}
                                </h2>
                                <p
                                    className="text-xs leading-relaxed mb-5 flex-1"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    {trilha.desc}
                                </p>

                                {/* Steps */}
                                <div className="space-y-2 mb-5">
                                    {trilha.etapas.map((etapa, eIdx) => (
                                        <div key={eIdx} className="flex items-center gap-2.5">
                                            <div
                                                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                                                style={{
                                                    background: etapa.done ? `${trilha.color}20` : 'var(--bg-elevated)',
                                                    border: `1.5px solid ${etapa.done ? trilha.color : 'var(--border)'}`,
                                                }}
                                            >
                                                {etapa.done && (
                                                    <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke={trilha.color} strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span
                                                className="text-xs"
                                                style={{
                                                    color: etapa.done ? 'var(--text-secondary)' : 'var(--text-muted)',
                                                }}
                                            >
                                                {etapa.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Progress */}
                                {trilha.progress > 0 && (
                                    <div className="mb-4 space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="section-label">Progresso</span>
                                            <span className="text-xs font-bold" style={{ color: trilha.color }}>
                                                {trilha.progress}%
                                            </span>
                                        </div>
                                        <div className="progress-bar">
                                            <motion.div
                                                style={{ height: '100%', borderRadius: 999, background: trilha.color }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${trilha.progress}%` }}
                                                transition={{ delay: idx * 0.1 + 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
                                    style={trilha.progress > 0 ? {
                                        background: `${trilha.color}18`,
                                        color: trilha.color,
                                        border: `1px solid ${trilha.color}30`,
                                    } : {
                                        background: 'var(--bg-elevated)',
                                        color: 'var(--text-secondary)',
                                        border: '1px solid var(--border)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = trilha.color;
                                        e.currentTarget.style.color = trilha.color === '#4f8ef7' || trilha.color === '#f472b6' ? '#fff' : '#08080c';
                                        e.currentTarget.style.borderColor = trilha.color;
                                        e.currentTarget.style.boxShadow = `0 4px 20px ${trilha.color}40`;
                                    }}
                                    onMouseLeave={e => {
                                        if (trilha.progress > 0) {
                                            e.currentTarget.style.background = `${trilha.color}18`;
                                            e.currentTarget.style.color = trilha.color;
                                            e.currentTarget.style.borderColor = `${trilha.color}30`;
                                        } else {
                                            e.currentTarget.style.background = 'var(--bg-elevated)';
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                            e.currentTarget.style.borderColor = 'var(--border)';
                                        }
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {trilha.progress > 0 ? 'Continuar trilha' : 'Iniciar trilha'}
                                </motion.button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ─── Info Banner ─── */}
            <div
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl"
                style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)' }}
                >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="font-bold text-sm mb-0.5 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        Novas trilhas em breve
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Trilhas especializadas para Redação, Ciências da Natureza e mais estão sendo preparadas.
                    </p>
                </div>
                <button onClick={() => onNavigate('catalog')} className="btn-ghost flex-shrink-0 text-xs py-2">
                    Ver biblioteca
                </button>
            </div>
        </div>
    );
}
