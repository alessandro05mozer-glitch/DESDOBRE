import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SUBJECT_META: Record<string, { color: string; label: string; area: string }> = {
    historia:   { color: '#f59e0b', label: 'Ciências Humanas',      area: 'humanas' },
    matematica: { color: '#60a5fa', label: 'Matemática',             area: 'matematica' },
    quimica:    { color: '#34d399', label: 'Ciências da Natureza',   area: 'natureza' },
    biologia:   { color: '#a3e635', label: 'Ciências da Natureza',   area: 'natureza' },
    fisica:     { color: '#38bdf8', label: 'Ciências da Natureza',   area: 'natureza' },
    geografia:  { color: '#2dd4bf', label: 'Ciências Humanas',       area: 'humanas' },
    redacao:    { color: '#f472b6', label: 'Linguagens',              area: 'linguagens' },
    socfilo:    { color: '#a78bfa', label: 'Ciências Humanas',       area: 'humanas' },
};

const AREAS = [
    { id: 'todos',      label: 'Todos' },
    { id: 'humanas',    label: 'Humanas' },
    { id: 'natureza',   label: 'Natureza' },
    { id: 'matematica', label: 'Matemática' },
    { id: 'linguagens', label: 'Linguagens' },
];

interface Props {
    catalog: any[];
    onSelectTemporada: (id: string) => void;
    onOriginal: () => void;
}

export default function CatalogHome({ catalog, onSelectTemporada, onOriginal }: Props) {
    const [search, setSearch] = useState('');
    const [area, setArea] = useState('todos');

    const totalEps = catalog.reduce((a, t) => a + t.episodios.length, 0);

    const filtered = useMemo(() => catalog.filter(t => {
        const meta = SUBJECT_META[t.materia];
        const matchArea = area === 'todos' || meta?.area === area;
        const q = search.toLowerCase();
        const matchSearch = !q ||
            t.titulo.toLowerCase().includes(q) ||
            t.descricao?.toLowerCase().includes(q) ||
            t.materia.toLowerCase().includes(q);
        return matchArea && matchSearch;
    }), [catalog, search, area]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="anim-fade-up">

            {/* ── Header ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <p className="label mb-2">Conteúdo</p>
                <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: '0.3rem' }}>
                    Biblioteca{' '}
                    <span style={{
                        background: 'linear-gradient(120deg, var(--amber), var(--mint))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Virtual
                    </span>
                </h1>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                    <strong style={{ color: 'var(--text-2)' }}>{catalog.length}</strong> matérias
                    {'  ·  '}
                    <strong style={{ color: 'var(--text-2)' }}>{totalEps}</strong> episódios disponíveis
                </p>
            </div>

            {/* ── Search + Filter Row ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <svg
                        width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar matéria ou assunto..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input"
                        style={{ paddingLeft: '2.375rem', paddingRight: search ? '2.5rem' : '1rem', height: 42 }}
                    />
                    <AnimatePresence>
                        {search && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                onClick={() => setSearch('')}
                                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}
                            >
                                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Area tabs */}
                <div style={{ display: 'flex', gap: '0.375rem', overflowX: 'auto' }} className="no-scroll">
                    {AREAS.map(tab => {
                        const active = area === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setArea(tab.id)}
                                style={{
                                    position: 'relative',
                                    flexShrink: 0,
                                    padding: '0.4rem 0.875rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.16s',
                                    background: active ? 'var(--amber)' : 'var(--bg-3)',
                                    color: active ? 'var(--text-inv)' : 'var(--text-3)',
                                    boxShadow: active ? '0 4px 14px var(--amber-glow)' : 'none',
                                }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Grid or Empty ── */}
            <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            padding: '3rem 1rem',
                            textAlign: 'center',
                            background: 'var(--bg-2)',
                            border: '1px solid var(--line)',
                            borderRadius: '1.375rem',
                        }}
                    >
                        <div style={{
                            width: 48, height: 48, borderRadius: '0.875rem', margin: '0 auto 1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--bg-3)',
                        }}>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--text-3)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p style={{ fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.25rem' }}>Nenhum resultado</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginBottom: '1rem' }}>
                            {search ? `Nada encontrado para "${search}"` : 'Nenhuma matéria nessa área.'}
                        </p>
                        <button
                            onClick={() => { setSearch(''); setArea('todos'); }}
                            className="btn btn-outline"
                            style={{ borderRadius: '0.75rem', fontSize: '0.8rem' }}
                        >
                            Limpar filtros
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}
                    >
                        {filtered.map((t, idx) => {
                            const meta = SUBJECT_META[t.materia] || SUBJECT_META.historia;
                            return (
                                <motion.article
                                    key={t.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.035, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={() => onSelectTemporada(t.id)}
                                    className="card-lift"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && onSelectTemporada(t.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* Top color bar */}
                                    <div style={{ height: 3, background: `linear-gradient(90deg, ${meta.color}, transparent)`, borderRadius: '1.375rem 1.375rem 0 0' }} />

                                    <div style={{ padding: '1rem 1rem 1rem' }}>
                                        {/* Icon row */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: '0.75rem',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: `${meta.color}14`,
                                                border: `1px solid ${meta.color}22`,
                                                color: meta.color,
                                                fontFamily: "'Syne', sans-serif",
                                                fontWeight: 800,
                                                fontSize: '1.1rem',
                                            }}>
                                                {t.titulo.charAt(0)}
                                            </div>
                                            <span style={{
                                                padding: '0.175rem 0.5rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.6rem',
                                                fontWeight: 700,
                                                background: 'var(--bg-4)',
                                                color: 'var(--text-3)',
                                                letterSpacing: '0.03em',
                                            }}>
                                                {t.episodios.length} ep.
                                            </span>
                                        </div>

                                        {/* Area label */}
                                        <p style={{
                                            fontSize: '0.575rem',
                                            fontWeight: 800,
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            color: meta.color,
                                            marginBottom: '0.3rem',
                                        }}>
                                            {meta.label}
                                        </p>

                                        {/* Title */}
                                        <h3 style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 700,
                                            color: 'var(--text-1)',
                                            lineHeight: 1.3,
                                            letterSpacing: '-0.02em',
                                            marginBottom: '0.375rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical' as const,
                                            overflow: 'hidden',
                                        }}>
                                            {t.titulo}
                                        </h3>

                                        {t.descricao && (
                                            <p style={{
                                                fontSize: '0.72rem',
                                                color: 'var(--text-3)',
                                                lineHeight: 1.5,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical' as const,
                                                overflow: 'hidden',
                                                marginBottom: '0.875rem',
                                            }}>
                                                {t.descricao}
                                            </p>
                                        )}

                                        {/* Footer */}
                                        <div style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            paddingTop: '0.75rem',
                                            borderTop: '1px solid var(--line)',
                                            marginTop: t.descricao ? 0 : '0.875rem',
                                        }}>
                                            <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)' }}>
                                                {t.materia}
                                            </span>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: meta.color, display: 'flex', alignItems: 'center', gap: 3 }}>
                                                Abrir
                                                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Stats footer ── */}
            {filtered.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1px',
                    background: 'var(--line)',
                    border: '1px solid var(--line)',
                    borderRadius: '1.375rem',
                    overflow: 'hidden',
                }}
                    className="sm:grid-cols-4"
                >
                    {[
                        { label: 'Matérias',    value: catalog.length },
                        { label: 'Episódios',   value: totalEps },
                        { label: 'Professores', value: '24+' },
                        { label: 'Quizzes',     value: catalog.reduce((a: number, t: any) => a + t.episodios.filter((e: any) => e.quiz).length, 0) },
                    ].map((s, i) => (
                        <div key={i} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '1.25rem 0.75rem', gap: '0.25rem',
                            background: 'var(--bg-2)',
                        }}>
                            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                                {s.value}
                            </span>
                            <p className="label">{s.label}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
