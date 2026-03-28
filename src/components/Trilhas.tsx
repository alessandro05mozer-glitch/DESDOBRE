import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TRILHAS = [
    {
        id: 'fundamentos',
        titulo: 'Fundamentos',
        tag: 'Essencial',
        desc: 'Base conceitual das principais disciplinas do ENEM. Ideal para quem está começando ou precisa revisar os conceitos centrais.',
        color: '#3b82f6',
        border: 'rgba(59,130,246,0.2)',
        bg: 'rgba(59,130,246,0.06)',
        etapas: [
            { label: 'Matemática Básica', done: true },
            { label: 'Interpretação Crítica', done: true },
            { label: 'História Geral I', done: false },
        ],
        progress: 66,
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
        ),
    },
    {
        id: 'estrategias',
        titulo: 'Estratégias',
        tag: 'Avançado',
        desc: 'Métodos e técnicas para maximizar seu desempenho nas provas. Aprenda a usar a TRI a seu favor.',
        color: '#10b981',
        border: 'rgba(16,185,129,0.2)',
        bg: 'rgba(16,185,129,0.06)',
        etapas: [
            { label: 'Análise da Matriz TRI', done: false },
            { label: 'Microestrutura da Redação', done: false },
            { label: 'Gestão de Tempo em Prova', done: false },
        ],
        progress: 0,
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        id: 'repertorio',
        titulo: 'Repertório',
        tag: 'Complementar',
        desc: 'Conteúdo sociocultural aplicado à argumentação dissertativa. Filmes, livros e músicas como repertório qualificado.',
        color: '#ec4899',
        border: 'rgba(236,72,153,0.2)',
        bg: 'rgba(236,72,153,0.06)',
        etapas: [
            { label: 'Cinema e Sociologia', done: true },
            { label: 'Filosofia Prática', done: false },
            { label: 'Geopolítica e Guerra Fria', done: false },
        ],
        progress: 33,
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
        ),
    },
];

function TagBadge({ label, color }: { label: string; color: string }) {
    return (
        <span
            className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide"
            style={{ background: `${color}18`, color }}
        >
            {label}
        </span>
    );
}

export default function Trilhas({ onNavigate }: { onNavigate: (v: string, id?: string) => void }) {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <div className="w-full space-y-6">

            {/* ─── Header ─── */}
            <div>
                <p className="section-label mb-1">Aprendizado estruturado</p>
                <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Trilhas de Aprendizado
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Rotas projetadas para solidificar seu conhecimento de forma estratégica.
                </p>
            </div>

            {/* ─── Trilhas Grid ─── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TRILHAS.map((trilha, idx) => (
                    <motion.div
                        key={trilha.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                        onMouseEnter={() => setHovered(trilha.id)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative flex flex-col rounded-2xl border transition-all duration-300"
                        style={{
                            background: hovered === trilha.id
                                ? `${trilha.bg}`
                                : 'var(--bg-surface)',
                            borderColor: hovered === trilha.id ? trilha.border : 'var(--border)',
                            boxShadow: hovered === trilha.id ? `0 8px 32px rgba(0,0,0,0.3)` : 'none',
                        }}
                    >
                        {/* Progress indicator top */}
                        {trilha.progress > 0 && (
                            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${trilha.progress}%` }}
                                    transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                                    className="h-full"
                                    style={{ background: trilha.color }}
                                />
                            </div>
                        )}

                        <div className="p-5 flex flex-col flex-1">
                            {/* Icon + Tag */}
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                                    style={{ background: `${trilha.color}14`, border: `1px solid ${trilha.border}`, color: trilha.color }}
                                >
                                    {trilha.icon}
                                </div>
                                <TagBadge label={trilha.tag} color={trilha.color} />
                            </div>

                            {/* Title + Desc */}
                            <h2 className="font-bold text-base mb-1.5" style={{ color: 'var(--text-primary)' }}>
                                {trilha.titulo}
                            </h2>
                            <p className="text-xs leading-relaxed mb-5 flex-1" style={{ color: 'var(--text-muted)' }}>
                                {trilha.desc}
                            </p>

                            {/* Steps */}
                            <div className="space-y-2 mb-5">
                                {trilha.etapas.map((etapa, eIdx) => (
                                    <div key={eIdx} className="flex items-center gap-2.5">
                                        <div
                                            className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                                            style={{
                                                background: etapa.done ? `${trilha.color}20` : 'var(--bg-elevated)',
                                                border: `1px solid ${etapa.done ? trilha.color : 'var(--border)'}`,
                                            }}
                                        >
                                            {etapa.done && (
                                                <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke={trilha.color} strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span
                                            className="text-xs"
                                            style={{
                                                color: etapa.done ? 'var(--text-secondary)' : 'var(--text-muted)',
                                                textDecoration: etapa.done ? 'none' : 'none',
                                            }}
                                        >
                                            {etapa.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Progress */}
                            {trilha.progress > 0 && (
                                <div className="mb-4">
                                    <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                                        <span>Progresso</span>
                                        <span style={{ color: trilha.color }}>{trilha.progress}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <motion.div
                                            className="progress-bar-fill"
                                            style={{ background: trilha.color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${trilha.progress}%` }}
                                            transition={{ delay: idx * 0.1 + 0.5, duration: 0.7 }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <button
                                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                                style={trilha.progress > 0 ? {
                                    background: `${trilha.color}18`,
                                    color: trilha.color,
                                    border: `1px solid ${trilha.border}`,
                                } : {
                                    background: 'var(--bg-elevated)',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid var(--border)',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = trilha.color;
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.borderColor = trilha.color;
                                }}
                                onMouseLeave={e => {
                                    if (trilha.progress > 0) {
                                        e.currentTarget.style.background = `${trilha.color}18`;
                                        e.currentTarget.style.color = trilha.color;
                                        e.currentTarget.style.borderColor = trilha.border;
                                    } else {
                                        e.currentTarget.style.background = 'var(--bg-elevated)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                    }
                                }}
                            >
                                {trilha.progress > 0 ? 'Continuar trilha' : 'Iniciar trilha'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ─── Info Banner ─── */}
            <div
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border"
                style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(236,72,153,0.04))',
                    borderColor: 'rgba(124,58,237,0.18)',
                }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(124,58,237,0.15)' }}
                >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9d5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        Novas trilhas em breve
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Estamos preparando trilhas temáticas especializadas para Redação, Ciências da Natureza e muito mais.
                    </p>
                </div>
                <button
                    onClick={() => onNavigate('catalog')}
                    className="btn-ghost flex-shrink-0 text-xs py-2"
                >
                    Ver biblioteca
                </button>
            </div>
        </div>
    );
}
