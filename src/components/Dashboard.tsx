import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATALOG } from '../data/catalog';
import EpisodeModalNew from './EpisodeModalNew';

const SUBJECT_COLORS: Record<string, { accent: string; bg: string }> = {
    historia:    { accent: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    matematica:  { accent: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    quimica:     { accent: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    biologia:    { accent: '#84cc16', bg: 'rgba(132,204,22,0.1)' },
    fisica:      { accent: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    geografia:   { accent: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
    redacao:     { accent: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
    socfilo:     { accent: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
};

function StatCard({ value, label, icon, accent }: { value: string | number; label: string; icon: React.ReactNode; accent: string }) {
    return (
        <div className="stat-card">
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${accent}18` }}
            >
                <span style={{ color: accent }}>{icon}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
            <div className="section-label">{label}</div>
        </div>
    );
}

function ProgressRing({ pct }: { pct: number }) {
    const r = 42;
    const circ = 2 * Math.PI * r;
    const dash = circ * (pct / 100);

    return (
        <svg width="108" height="108" viewBox="0 0 108 108">
            <circle cx="54" cy="54" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
                cx="54" cy="54" r={r}
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={circ / 4}
                style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
            />
            <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
            </defs>
            <text x="54" y="50" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
                {pct}%
            </text>
            <text x="54" y="66" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" letterSpacing="1">
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
        setProgress({
            topics: done,
            days: 3,
            percentage: total ? Math.round((done / total) * 100) : 0,
        });
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

    // Activity bar data (mock — 7 days)
    const activityDays = [
        { day: 'Seg', val: 3 }, { day: 'Ter', val: 7 }, { day: 'Qua', val: 5 },
        { day: 'Qui', val: 9 }, { day: 'Sex', val: 4 }, { day: 'Sáb', val: 2 }, { day: 'Dom', val: 6 },
    ];
    const maxVal = Math.max(...activityDays.map(d => d.val));

    return (
        <div className="w-full space-y-6">

            {/* ─── Page Header ─── */}
            <div>
                <p className="section-label mb-1">Painel principal</p>
                <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Olá, Estudante
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Continue de onde parou e acompanhe seu progresso.
                </p>
            </div>

            {/* ─── Stats Row ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                    value={CATALOG.length}
                    label="Matérias"
                    accent="#7c3aed"
                    icon={
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                    }
                />
                <StatCard
                    value={progress.topics}
                    label="Tópicos feitos"
                    accent="#ec4899"
                    icon={
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    }
                />
                <StatCard
                    value={progress.days}
                    label="Dias seguidos"
                    accent="#f59e0b"
                    icon={
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    }
                />
                <StatCard
                    value={`${progress.percentage}%`}
                    label="Progresso geral"
                    accent="#10b981"
                    icon={
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    }
                />
            </div>

            {/* ─── Main Grid ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Progress Card */}
                <div
                    className="surface p-5 flex flex-col items-center justify-center gap-4"
                    style={{ minHeight: 220 }}
                >
                    <ProgressRing pct={progress.percentage} />
                    <div className="w-full">
                        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                            <span>Tópicos concluídos</span>
                            <span style={{ color: 'var(--text-primary)' }}>{progress.topics} / {totalTopics}</span>
                        </div>
                        <div className="progress-bar">
                            <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress.percentage}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Continue Studying */}
                <div className="lg:col-span-2 surface p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                            Continue estudando
                        </h3>
                        <button
                            onClick={() => onNavigate('catalog')}
                            className="text-xs font-medium transition-colors"
                            style={{ color: 'var(--brand-light)' }}
                        >
                            Ver tudo
                        </button>
                    </div>

                    {/* Resume card */}
                    <div
                        className="card-interactive flex items-center gap-4 p-4 mb-3"
                        onClick={() => setSelectedEp(resumeEp)}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--brand-light)' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold mb-0.5" style={{ color: 'var(--text-muted)' }}>
                                CONTINUAR ASSISTINDO
                            </p>
                            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                {resumeEp.ep.titulo}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {CATALOG[0].titulo} · {resumeEp.ep.duracao}
                            </p>
                        </div>
                        <span className="badge badge-brand flex-shrink-0 hidden sm:inline-flex">Retomar</span>
                    </div>

                    {/* Recent episodes */}
                    <div className="space-y-1.5">
                        {recentEps.slice(0, 3).map((item, i) => {
                            const col = SUBJECT_COLORS[item.subjectName] || SUBJECT_COLORS.historia;
                            return (
                                <button
                                    key={item.ep.id}
                                    onClick={() => setSelectedEp(item)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                                    style={{ color: 'var(--text-secondary)' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col.accent }} />
                                    <span className="flex-1 text-sm truncate">{item.ep.titulo}</span>
                                    <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                                        {item.subjectTitle}
                                    </span>
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
                        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                            Atividade semanal
                        </h3>
                        <span className="badge badge-neutral">{recentEps.length} sessões</span>
                    </div>
                    <div className="flex items-end gap-2 h-24">
                        {activityDays.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <motion.div
                                    className="w-full rounded-md"
                                    style={{
                                        background: i === 6 ? 'var(--brand)' : 'var(--bg-elevated)',
                                        border: '1px solid var(--border)',
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.val / maxVal) * 72}px` }}
                                    transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                                />
                                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Reviews */}
                <div className="surface p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                            Revisões pendentes
                        </h3>
                        <span className="badge badge-accent">{recentEps.length} itens</span>
                    </div>
                    <div className="space-y-2">
                        {recentEps.map((rev, i) => {
                            const col = SUBJECT_COLORS[rev.subjectName] || SUBJECT_COLORS.historia;
                            const urgency = i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : 'var(--text-muted)';
                            return (
                                <button
                                    key={rev.ep.id}
                                    onClick={() => setSelectedEp(rev)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left group"
                                    style={{ borderColor: 'var(--border)', background: 'transparent' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'var(--bg-elevated)';
                                        e.currentTarget.style.borderColor = 'var(--border-hover)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                    }}
                                >
                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: urgency }} />
                                    <span className="flex-1 text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                                        {rev.ep.titulo}
                                    </span>
                                    <span
                                        className="text-xs font-semibold flex-shrink-0 transition-colors"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        Revisar
                                        <svg className="inline ml-1" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ─── Quick Actions ─── */}
            <div
                className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 border"
                style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(236,72,153,0.05))',
                    borderColor: 'rgba(124,58,237,0.2)',
                }}
            >
                <div className="flex-1">
                    <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        Faça um diagnóstico
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Descubra seus pontos fortes e lacunas de conhecimento com nosso GPS personalizado.
                    </p>
                </div>
                <button
                    onClick={() => onNavigate('diagnostico')}
                    className="btn-primary flex-shrink-0"
                >
                    Iniciar GPS
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

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
