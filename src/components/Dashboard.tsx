import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATALOG } from '../data/catalog';
import EpisodeModalNew from './EpisodeModalNew';

const SUBJECT_COLORS: Record<string, { accent: string; bg: string }> = {
    historia:    { accent: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    matematica:  { accent: '#4f8ef7', bg: 'rgba(79,142,247,0.1)' },
    quimica:     { accent: '#00d4aa', bg: 'rgba(0,212,170,0.1)' },
    biologia:    { accent: '#84cc16', bg: 'rgba(132,204,22,0.1)' },
    fisica:      { accent: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    geografia:   { accent: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
    redacao:     { accent: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
    socfilo:     { accent: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
};

function StatCard({
    value, label, icon, accent, delta
}: {
    value: string | number; label: string; icon: React.ReactNode; accent: string; delta?: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
            className="stat-card"
        >
            <div className="flex items-start justify-between mb-3">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${accent}18` }}
                >
                    <span style={{ color: accent }}>{icon}</span>
                </div>
                {delta && (
                    <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)' }}
                    >
                        {delta}
                    </span>
                )}
            </div>
            <div
                className="text-2xl font-extrabold tracking-tight"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
            >
                {value}
            </div>
            <div className="section-label mt-0.5">{label}</div>
        </motion.div>
    );
}

function ProgressRing({ pct }: { pct: number }) {
    const r = 44;
    const circ = 2 * Math.PI * r;
    const dash = circ * (pct / 100);

    return (
        <svg width="112" height="112" viewBox="0 0 112 112">
            <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
            <circle
                cx="56" cy="56" r={r}
                fill="none"
                stroke="url(#ringGradV3)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={circ / 4}
                style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
            />
            <defs>
                <linearGradient id="ringGradV3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f8ef7" />
                    <stop offset="100%" stopColor="#00d4aa" />
                </linearGradient>
            </defs>
            <text x="56" y="52" textAnchor="middle" fill="var(--text-primary)" fontSize="20" fontWeight="800" letterSpacing="-1">
                {pct}%
            </text>
            <text x="56" y="68" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontWeight="700" letterSpacing="1.5">
                CONCLUÍDO
            </text>
        </svg>
    );
}

export default function Dashboard({ onNavigate }: { onNavigate: (view: string, id?: string) => void }) {
    const [progress, setProgress] = useState({ topics: 0, days: 3, percentage: 0 });

    useEffect(() => {
        let done = 0, total = 0;
        CATALOG.forEach(t => {
            t.episodios.forEach(e => {
                total += e.topicos.length;
                const saved = localStorage.getItem(`desdobre_ep_${e.id}`);
                if (saved) {
                    const arr = JSON.parse(saved);
                    done += arr.filter(Boolean).length;
                }
            });
        });
        setProgress({ topics: done, days: 3, percentage: total ? Math.round((done / total) * 100) : 0 });
    }, []);

    const [selectedEp, setSelectedEp] = useState<{
        ep: any; subjectId: string; subjectTitle: string; subjectName: string;
    } | null>(null);

    const allEpisodes = CATALOG.flatMap(t =>
        t.episodios.map(e => ({ ep: e, subjectId: t.id, subjectTitle: t.titulo, subjectName: t.materia }))
    );
    const recentEps = allEpisodes.slice(0, 4);
    const resumeEp = allEpisodes[1];
    const totalTopics = CATALOG.reduce((a, t) => a + t.episodios.reduce((b, e) => b + e.topicos.length, 0), 0);

    const activityDays = [
        { day: 'S', val: 3 }, { day: 'T', val: 7 }, { day: 'Q', val: 5 },
        { day: 'Q', val: 9 }, { day: 'S', val: 4 }, { day: 'S', val: 2 }, { day: 'D', val: 6 },
    ];
    const maxVal = Math.max(...activityDays.map(d => d.val));

    return (
        <div className="w-full space-y-6 fade-in-up">

            {/* ─── Page Header ─── */}
            <div className="flex items-end justify-between">
                <div>
                    <p className="section-label mb-1.5">Painel principal</p>
                    <h1
                        className="text-3xl md:text-4xl font-extrabold tracking-tight text-balance"
                        style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
                    >
                        Olá, Estudante
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>
                        Continue de onde parou — faltam{' '}
                        <span style={{ color: 'var(--brand)' }}>
                            {totalTopics - progress.topics} tópicos
                        </span>{' '}
                        para concluir tudo.
                    </p>
                </div>
                <button
                    onClick={() => onNavigate('catalog')}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                        background: 'var(--brand-dim)',
                        color: 'var(--brand)',
                        border: '1px solid rgba(79,142,247,0.2)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(79,142,247,0.18)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--brand-dim)')}
                >
                    Ver biblioteca
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* ─── Stats Row ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                    value={CATALOG.length}
                    label="Matérias"
                    accent="#4f8ef7"
                    delta="+2 novas"
                    icon={
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                    }
                />
                <StatCard
                    value={progress.topics}
                    label="Tópicos feitos"
                    accent="#00d4aa"
                    icon={
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    }
                />
                <StatCard
                    value={progress.days}
                    label="Dias seguidos"
                    accent="#f59e0b"
                    icon={
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    }
                />
                <StatCard
                    value={`${progress.percentage}%`}
                    label="Progresso geral"
                    accent="#00d4aa"
                    icon={
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    }
                />
            </div>

            {/* ─── Main Grid ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Progress Card */}
                <div
                    className="surface p-6 flex flex-col items-center justify-center gap-4"
                    style={{ minHeight: 240 }}
                >
                    <ProgressRing pct={progress.percentage} />
                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                            <span>Tópicos concluídos</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                {progress.topics} / {totalTopics}
                            </span>
                        </div>
                        <div className="progress-bar" style={{ height: '3px' }}>
                            <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress.percentage}%` }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                        <p className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>
                            {totalTopics - progress.topics} tópicos restantes
                        </p>
                    </div>
                </div>

                {/* Continue Studying */}
                <div className="lg:col-span-2 surface p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                            Continue estudando
                        </h3>
                        <button
                            onClick={() => onNavigate('catalog')}
                            className="text-xs font-semibold flex items-center gap-1 transition-colors"
                            style={{ color: 'var(--brand)' }}
                        >
                            Ver tudo
                            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Resume card */}
                    <motion.div
                        whileHover={{ x: 3 }}
                        onClick={() => setSelectedEp(resumeEp)}
                        className="flex items-center gap-4 p-4 rounded-xl mb-3 cursor-pointer transition-all"
                        style={{
                            background: 'var(--brand-dim)',
                            border: '1px solid rgba(79,142,247,0.2)',
                        }}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'var(--brand)', boxShadow: '0 4px 16px var(--brand-glow)' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold mb-0.5 tracking-widest" style={{ color: 'var(--brand)' }}>
                                CONTINUAR
                            </p>
                            <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                {resumeEp.ep.titulo}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {CATALOG[0].titulo} · {resumeEp.ep.duracao}
                            </p>
                        </div>
                        <span className="badge badge-brand flex-shrink-0 hidden sm:inline-flex">Retomar</span>
                    </motion.div>

                    {/* Recent episodes */}
                    <div className="space-y-1">
                        {recentEps.slice(0, 3).map((item) => {
                            const col = SUBJECT_COLORS[item.subjectName] || SUBJECT_COLORS.historia;
                            return (
                                <button
                                    key={item.ep.id}
                                    onClick={() => setSelectedEp(item)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group"
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ background: col.accent }}
                                    />
                                    <span className="flex-1 text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                                        {item.ep.titulo}
                                    </span>
                                    <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                                        {item.subjectTitle}
                                    </span>
                                    <svg
                                        width="10" height="10" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" strokeWidth={2.5}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ─── Bottom Grid ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Activity */}
                <div className="surface p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                            Atividade semanal
                        </h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {recentEps.length} sessões
                            </span>
                        </div>
                    </div>
                    <div className="flex items-end gap-1.5 h-20">
                        {activityDays.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                <motion.div
                                    className="w-full rounded-md"
                                    style={{
                                        background: i === 3
                                            ? 'var(--brand)'
                                            : i === 6
                                            ? 'var(--accent)'
                                            : 'var(--bg-elevated)',
                                        border: '1px solid var(--border)',
                                        minHeight: 4,
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.val / maxVal) * 68}px` }}
                                    transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                />
                                <span className="text-[9px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                                    {d.day}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Reviews */}
                <div className="surface p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                            Revisões pendentes
                        </h3>
                        <span className="badge badge-accent">{recentEps.length} itens</span>
                    </div>
                    <div className="space-y-1.5">
                        {recentEps.map((rev, i) => {
                            const col = SUBJECT_COLORS[rev.subjectName] || SUBJECT_COLORS.historia;
                            const urgencyColors = ['#ef4444', '#f59e0b', 'var(--text-muted)', 'var(--text-muted)'];
                            const urgency = urgencyColors[i] || 'var(--text-muted)';
                            return (
                                <button
                                    key={rev.ep.id}
                                    onClick={() => setSelectedEp(rev)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group"
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
                                    <div
                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        style={{ background: urgency }}
                                    />
                                    <span className="flex-1 text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                                        {rev.ep.titulo}
                                    </span>
                                    <span
                                        className="text-xs font-semibold flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                        style={{ color: col.accent }}
                                    >
                                        Revisar
                                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ─── CTA Banner ─── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                }}
            >
                {/* Glow decorativo */}
                <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)',
                        transform: 'translate(30%, -30%)',
                    }}
                />

                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)' }}
                >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                        <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                </div>
                <div className="flex-1 relative z-10">
                    <p
                        className="font-bold text-sm mb-0.5"
                        style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
                    >
                        Faça seu diagnóstico
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Descubra seus pontos fortes e lacunas de conhecimento com o GPS personalizado.
                    </p>
                </div>
                <button
                    onClick={() => onNavigate('diagnostico')}
                    className="btn-accent flex-shrink-0 relative z-10 text-xs"
                >
                    Iniciar GPS
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {selectedEp && (
                    <EpisodeModalNew
                        episodio={selectedEp.ep}
                        materia={selectedEp.subjectName}
                        tituloTemporada={selectedEp.subjectTitle}
                        onClose={() => setSelectedEp(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
