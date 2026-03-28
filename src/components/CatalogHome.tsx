// CatalogHome.tsx — Biblioteca Virtual v2
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const SUBJECT_META: Record<string, { color: string; border: string; label: string }> = {
    historia:   { color: '#f59e0b', border: 'rgba(245,158,11,0.2)',  label: 'Ciências Humanas' },
    matematica: { color: '#3b82f6', border: 'rgba(59,130,246,0.2)',  label: 'Matemática' },
    quimica:    { color: '#10b981', border: 'rgba(16,185,129,0.2)',  label: 'Ciências da Natureza' },
    biologia:   { color: '#84cc16', border: 'rgba(132,204,22,0.2)',  label: 'Ciências da Natureza' },
    fisica:     { color: '#06b6d4', border: 'rgba(6,182,212,0.2)',   label: 'Ciências da Natureza' },
    geografia:  { color: '#14b8a6', border: 'rgba(20,184,166,0.2)',  label: 'Ciências Humanas' },
    redacao:    { color: '#ec4899', border: 'rgba(236,72,153,0.2)',  label: 'Linguagens' },
    socfilo:    { color: '#a855f7', border: 'rgba(168,85,247,0.2)',  label: 'Ciências Humanas' },
};

const SUBJECT_ICONS: Record<string, string> = {
    historia: '📜', matematica: '∑', quimica: '⚗️', biologia: '🧬',
    fisica: '⚡', geografia: '🌍', redacao: '✍️', socfilo: '🧠',
};

const FILTER_AREAS = ['Todos', 'Ciências Humanas', 'Ciências da Natureza', 'Matemática', 'Linguagens'];

interface Props {
    catalog: any[];
    onSelectTemporada: (id: string) => void;
    onOriginal: () => void;
}

export default function CatalogHome({ catalog, onSelectTemporada, onOriginal }: Props) {
    const [search, setSearch] = useState('');
    const [activeArea, setActiveArea] = useState('Todos');

    const totalEps = catalog.reduce((acc, t) => acc + t.episodios.length, 0);

    const filtered = useMemo(() => {
        return catalog.filter(t => {
            const meta = SUBJECT_META[t.materia];
            const matchArea = activeArea === 'Todos' || (meta && meta.label === activeArea);
            const q = search.toLowerCase();
            const matchSearch = !q ||
                t.titulo.toLowerCase().includes(q) ||
                t.descricao.toLowerCase().includes(q) ||
                t.materia.toLowerCase().includes(q);
            return matchArea && matchSearch;
        });
    }, [catalog, search, activeArea]);

    return (
        <div className="w-full space-y-6">

            {/* ─── Header ─── */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-1">
                    <p className="section-label mb-1">Conteúdo</p>
                    <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Biblioteca Virtual
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        {catalog.length} matérias · {totalEps} episódios disponíveis
                    </p>
                </div>
            </div>

            {/* ─── Search + Filters ─── */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--text-muted)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar matéria, assunto..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field pl-9 pr-8"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute inset-y-0 right-3 flex items-center"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Area filters - scrollable on mobile */}
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                    {FILTER_AREAS.map(area => (
                        <button
                            key={area}
                            onClick={() => setActiveArea(area)}
                            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={activeArea === area ? {
                                background: 'var(--brand)',
                                color: 'white',
                            } : {
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-muted)',
                            }}
                        >
                            {area}
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── Grid ─── */}
            {filtered.length === 0 ? (
                <div
                    className="py-16 text-center rounded-2xl border"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                >
                    <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--bg-elevated)' }}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--text-muted)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                        Nenhum resultado
                    </p>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                        {search ? `Nada encontrado para "${search}"` : 'Nenhuma matéria nessa área.'}
                    </p>
                    <button
                        onClick={() => { setSearch(''); setActiveArea('Todos'); }}
                        className="btn-ghost text-xs py-1.5 px-4"
                    >
                        Limpar filtros
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filtered.map((temporada, idx) => {
                        const meta = SUBJECT_META[temporada.materia] || SUBJECT_META.historia;
                        const icon = SUBJECT_ICONS[temporada.materia] || '📚';
                        return (
                            <motion.div
                                key={temporada.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04, duration: 0.35 }}
                                onClick={() => onSelectTemporada(temporada.id)}
                                className="card-interactive group"
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => e.key === 'Enter' && onSelectTemporada(temporada.id)}
                            >
                                <div className="p-4">
                                    {/* Top row */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                            style={{
                                                background: `${meta.color}14`,
                                                border: `1px solid ${meta.border}`,
                                            }}
                                        >
                                            {icon}
                                        </div>
                                        <span
                                            className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                                            style={{
                                                background: 'var(--bg-elevated)',
                                                color: 'var(--text-muted)',
                                            }}
                                        >
                                            {temporada.episodios.length} eps.
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="mb-3">
                                        <div
                                            className="text-[10px] font-semibold mb-1"
                                            style={{ color: meta.color }}
                                        >
                                            {meta.label.toUpperCase()}
                                        </div>
                                        <h3
                                            className="font-bold text-sm leading-tight line-clamp-2"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {temporada.titulo}
                                        </h3>
                                        {temporada.descricao && (
                                            <p
                                                className="text-xs mt-1 line-clamp-2 leading-relaxed"
                                                style={{ color: 'var(--text-muted)' }}
                                            >
                                                {temporada.descricao}
                                            </p>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                                        <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                            {temporada.materia.charAt(0).toUpperCase() + temporada.materia.slice(1)}
                                        </span>
                                        <span
                                            className="text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ color: 'var(--brand-light)' }}
                                        >
                                            Abrir
                                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>

                                {/* Accent bar at the bottom */}
                                <div
                                    className="h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-b-lg"
                                    style={{ background: `linear-gradient(90deg, ${meta.color}, transparent)` }}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* ─── Stats Footer ─── */}
            {filtered.length > 0 && (
                <div
                    className="flex flex-wrap gap-6 justify-center py-6 border-t mt-2"
                    style={{ borderColor: 'var(--border)' }}
                >
                    {[
                        { label: 'Matérias', value: catalog.length },
                        { label: 'Episódios', value: totalEps },
                        { label: 'Professores', value: '24+' },
                        { label: 'Quizzes', value: catalog.reduce((a: number, t: any) => a + t.episodios.filter((e: any) => e.quiz).length, 0) },
                    ].map((s, i) => (
                        <div key={i} className="text-center">
                            <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
                            <div className="section-label mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
