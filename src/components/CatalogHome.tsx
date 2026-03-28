// CatalogHome.tsx — Biblioteca Virtual v3
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SUBJECT_META: Record<string, { color: string; label: string; area: string }> = {
    historia:   { color: '#f59e0b', label: 'Ciências Humanas', area: 'humanas' },
    matematica: { color: '#4f8ef7', label: 'Matemática',       area: 'matematica' },
    quimica:    { color: '#00d4aa', label: 'Ciências da Natureza', area: 'natureza' },
    biologia:   { color: '#84cc16', label: 'Ciências da Natureza', area: 'natureza' },
    fisica:     { color: '#06b6d4', label: 'Ciências da Natureza', area: 'natureza' },
    geografia:  { color: '#14b8a6', label: 'Ciências Humanas', area: 'humanas' },
    redacao:    { color: '#f472b6', label: 'Linguagens',        area: 'linguagens' },
    socfilo:    { color: '#a78bfa', label: 'Ciências Humanas', area: 'humanas' },
};

const FILTER_TABS = [
    { id: 'todos', label: 'Todos' },
    { id: 'humanas', label: 'Humanas' },
    { id: 'natureza', label: 'Natureza' },
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
    const [activeArea, setActiveArea] = useState('todos');

    const totalEps = catalog.reduce((acc, t) => acc + t.episodios.length, 0);

    const filtered = useMemo(() => {
        return catalog.filter(t => {
            const meta = SUBJECT_META[t.materia];
            const matchArea = activeArea === 'todos' || (meta && meta.area === activeArea);
            const q = search.toLowerCase();
            const matchSearch = !q ||
                t.titulo.toLowerCase().includes(q) ||
                t.descricao?.toLowerCase().includes(q) ||
                t.materia.toLowerCase().includes(q);
            return matchArea && matchSearch;
        });
    }, [catalog, search, activeArea]);

    return (
        <div className="w-full space-y-6 fade-in-up">

            {/* ─── Header ─── */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <div className="flex-1">
                    <p className="section-label mb-1.5">Conteúdo</p>
                    <h1
                        className="text-3xl md:text-4xl font-extrabold tracking-tight text-balance"
                        style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
                    >
                        Biblioteca Virtual
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{catalog.length}</span> matérias
                        {' '}&nbsp;·&nbsp;{' '}
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{totalEps}</span> episódios disponíveis
                    </p>
                </div>
            </div>

            {/* ─── Busca ─── */}
            <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--text-muted)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Buscar matéria ou assunto..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-field pl-10 pr-10"
                    style={{ height: '44px' }}
                />
                <AnimatePresence>
                    {search && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setSearch('')}
                            className="absolute inset-y-0 right-3 flex items-center"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* ─── Filter Tabs ─── */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {FILTER_TABS.map(tab => {
                    const active = activeArea === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveArea(tab.id)}
                            className="relative flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={active ? {
                                background: 'var(--brand)',
                                color: '#fff',
                                boxShadow: '0 4px 16px var(--brand-glow)',
                            } : {
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-muted)',
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ─── Grid ─── */}
            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center rounded-2xl border"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                >
                    <div
                        className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                        style={{ background: 'var(--bg-elevated)' }}
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--text-muted)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                        Nenhum resultado
                    </p>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                        {search ? `Nada encontrado para "${search}"` : 'Nenhuma matéria nessa área.'}
                    </p>
                    <button onClick={() => { setSearch(''); setActiveArea('todos'); }} className="btn-ghost text-xs">
                        Limpar filtros
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filtered.map((temporada, idx) => {
                        const meta = SUBJECT_META[temporada.materia] || SUBJECT_META.historia;
                        return (
                            <motion.div
                                key={temporada.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                onClick={() => onSelectTemporada(temporada.id)}
                                className="card-interactive group"
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => e.key === 'Enter' && onSelectTemporada(temporada.id)}
                            >
                                <div className="p-4">
                                    {/* Color bar top */}
                                    <div
                                        className="h-px w-full rounded mb-4"
                                        style={{ background: `linear-gradient(90deg, ${meta.color}60, transparent)` }}
                                    />

                                    {/* Top row */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold"
                                            style={{
                                                background: `${meta.color}12`,
                                                border: `1px solid ${meta.color}28`,
                                                color: meta.color,
                                            }}
                                        >
                                            {temporada.titulo.charAt(0)}
                                        </div>
                                        <span
                                            className="text-[10px] font-bold px-2 py-1 rounded-lg"
                                            style={{
                                                background: 'var(--bg-overlay)',
                                                color: 'var(--text-muted)',
                                            }}
                                        >
                                            {temporada.episodios.length} ep.
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="mb-4">
                                        <div
                                            className="text-[9px] font-bold mb-1.5 tracking-widest"
                                            style={{ color: meta.color }}
                                        >
                                            {meta.label.toUpperCase()}
                                        </div>
                                        <h3
                                            className="font-bold text-sm leading-tight line-clamp-2 tracking-tight"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {temporada.titulo}
                                        </h3>
                                        {temporada.descricao && (
                                            <p
                                                className="text-xs mt-1.5 line-clamp-2 leading-relaxed"
                                                style={{ color: 'var(--text-muted)' }}
                                            >
                                                {temporada.descricao}
                                            </p>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div
                                        className="flex items-center justify-between pt-3"
                                        style={{ borderTop: '1px solid var(--border)' }}
                                    >
                                        <span
                                            className="text-[10px] font-semibold uppercase tracking-wider"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            {temporada.materia}
                                        </span>
                                        <motion.span
                                            initial={{ opacity: 0, x: -4 }}
                                            whileInView={{ opacity: 1 }}
                                            className="text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"
                                            style={{ color: meta.color }}
                                        >
                                            Abrir
                                            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* ─── Stats Footer ─── */}
            {filtered.length > 0 && (
                <div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden"
                    style={{ background: 'var(--border)', border: '1px solid var(--border)' }}
                >
                    {[
                        { label: 'Matérias', value: catalog.length },
                        { label: 'Episódios', value: totalEps },
                        { label: 'Professores', value: '24+' },
                        { label: 'Quizzes', value: catalog.reduce((a: number, t: any) => a + t.episodios.filter((e: any) => e.quiz).length, 0) },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center justify-center py-5 gap-1"
                            style={{ background: 'var(--bg-surface)' }}
                        >
                            <div
                                className="text-2xl font-extrabold tracking-tight"
                                style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
                            >
                                {s.value}
                            </div>
                            <div className="section-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
