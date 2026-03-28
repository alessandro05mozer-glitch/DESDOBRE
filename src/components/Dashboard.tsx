import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { CATALOG } from '../data/catalog';
import EpisodeModalNew from './EpisodeModalNew';

const SUBJECT_COLORS: Record<string, string> = {
    historia:   '#f59e0b',
    matematica: '#60a5fa',
    quimica:    '#34d399',
    biologia:   '#a3e635',
    fisica:     '#38bdf8',
    geografia:  '#2dd4bf',
    redacao:    '#f472b6',
    socfilo:    '#a78bfa',
};

/* ── Animated counter ── */
function Counter({ to, duration = 1.2 }: { to: number; duration?: number }) {
    const [val, setVal] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = to / (duration * 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= to) { setVal(to); clearInterval(timer); }
            else setVal(Math.floor(start));
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [inView, to, duration]);

    return <span ref={ref}>{val}</span>;
}

/* ── Radial progress ── */
function RadialProgress({ pct }: { pct: number }) {
    const size = 120;
    const stroke = 7;
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r}
                    fill="none" stroke="var(--bg-4)" strokeWidth={stroke} />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none"
                    stroke="url(#amberMint)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                />
                <defs>
                    <linearGradient id="amberMint" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                </defs>
            </svg>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
            }}>
                <span style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '1.375rem',
                    fontWeight: 800,
                    color: 'var(--text-1)',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                }}>
                    {pct}%
                </span>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-3)', textTransform: 'uppercase', marginTop: 2 }}>
                    Concluído
                </span>
            </div>
        </div>
    );
}

/* ── Mini bar chart ── */
function WeekChart({ days }: { days: { d: string; v: number }[] }) {
    const max = Math.max(...days.map(x => x.v), 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 52 }}>
            {days.map((day, i) => {
                const h = Math.max((day.v / max) * 44, 4);
                const isToday = i === days.length - 1;
                return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: h }}
                            transition={{ delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                width: '100%',
                                borderRadius: 4,
                                background: isToday ? 'var(--amber)' : 'var(--bg-4)',
                                border: `1px solid ${isToday ? 'rgba(245,158,11,0.4)' : 'var(--line)'}`,
                            }}
                        />
                        <span style={{ fontSize: '0.55rem', fontWeight: 700, color: isToday ? 'var(--amber)' : 'var(--text-3)', textTransform: 'uppercase' }}>
                            {day.d}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

/* ── Subject dot list ── */
function SubjectRow({ name, color, pct }: { name: string; color: string; pct: number }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: color, flexShrink: 0,
                boxShadow: `0 0 6px ${color}60`,
            }} />
            <span style={{ flex: 1, fontSize: '0.75rem', color: 'var(--text-2)', textTransform: 'capitalize' }}>{name}</span>
            <div style={{ width: 60, height: 3, background: 'var(--bg-4)', borderRadius: 99, overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', background: color, borderRadius: 99 }}
                />
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-3)', minWidth: 24, textAlign: 'right' }}>{pct}%</span>
        </div>
    );
}

export default function Dashboard({ onNavigate }: { onNavigate: (view: string, id?: string) => void }) {
    const [stats, setStats] = useState({ topics: 0, pct: 0, total: 0 });
    const [selectedEp, setSelectedEp] = useState<{ ep: any; subjectId: string; subjectTitle: string; subjectName: string } | null>(null);

    useEffect(() => {
        let done = 0, total = 0;
        CATALOG.forEach(t => t.episodios.forEach(e => {
            total += e.topicos.length;
            const s = localStorage.getItem(`desdobre_ep_${e.id}`);
            if (s) done += JSON.parse(s).filter(Boolean).length;
        }));
        setStats({ topics: done, total, pct: total ? Math.round((done / total) * 100) : 0 });
    }, []);

    const allEps = CATALOG.flatMap(t =>
        t.episodios.map(e => ({ ep: e, subjectId: t.id, subjectTitle: t.titulo, subjectName: t.materia }))
    );
    const totalEps = CATALOG.reduce((a, t) => a + t.episodios.length, 0);
    const resumeEp = allEps[1];
    const recentEps = allEps.slice(0, 5);

    const weekDays = [
        { d: 'S', v: 4 }, { d: 'T', v: 7 }, { d: 'Q', v: 3 },
        { d: 'Q', v: 9 }, { d: 'S', v: 5 }, { d: 'S', v: 1 }, { d: 'D', v: 6 },
    ];

    const subjectPcts = CATALOG.slice(0, 5).map(t => {
        let done = 0, total = 0;
        t.episodios.forEach(e => {
            total += e.topicos.length;
            const s = localStorage.getItem(`desdobre_ep_${e.id}`);
            if (s) done += JSON.parse(s).filter(Boolean).length;
        });
        return { name: t.materia, color: SUBJECT_COLORS[t.materia] || '#f59e0b', pct: total ? Math.round((done / total) * 100) : 0 };
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="anim-fade-up">

            {/* ══════ HERO HEADER ══════ */}
            <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                    background: 'var(--bg-2)',
                    border: '1px solid var(--line)',
                    padding: '1.75rem 1.75rem 1.5rem',
                }}
            >
                {/* Background decoration */}
                <div
                    style={{
                        position: 'absolute',
                        top: -40, right: -40,
                        width: 200, height: 200,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: -30, right: 80,
                        width: 120, height: 120,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                        <p className="label mb-2">Painel Principal</p>
                        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '0.4rem' }}>
                            Bom estudo,{' '}
                            <span style={{
                                background: 'linear-gradient(120deg, var(--amber), var(--mint))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                Estudante
                            </span>
                        </h1>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', maxWidth: 380 }}>
                            Você concluiu{' '}
                            <strong style={{ color: 'var(--amber)' }}>{stats.topics} tópicos</strong>{' '}
                            — faltam{' '}
                            <strong style={{ color: 'var(--text-2)' }}>{stats.total - stats.topics}</strong>{' '}
                            para fechar tudo.
                        </p>
                    </div>
                    <button
                        onClick={() => onNavigate('catalog')}
                        className="btn btn-amber hidden sm:inline-flex"
                        style={{ flexShrink: 0, borderRadius: '0.75rem' }}
                    >
                        Biblioteca
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ══════ STATS ROW ══════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}
                className="sm:grid-cols-4">
                {[
                    {
                        label: 'Matérias',
                        value: CATALOG.length,
                        chip: '+2 novas',
                        chipClass: 'chip-mint',
                        color: 'var(--mint)',
                        icon: (
                            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                        ),
                    },
                    {
                        label: 'Episódios',
                        value: totalEps,
                        chip: null,
                        chipClass: '',
                        color: 'var(--sky)',
                        icon: (
                            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                        ),
                    },
                    {
                        label: 'Tópicos feitos',
                        value: stats.topics,
                        chip: null,
                        chipClass: '',
                        color: 'var(--amber)',
                        icon: (
                            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ),
                    },
                    {
                        label: 'Dias seguidos',
                        value: 3,
                        chip: 'Ativo',
                        chipClass: 'chip-amber',
                        color: 'var(--coral)',
                        icon: (
                            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                        ),
                    },
                ].map((s, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -3 }}
                        style={{
                            background: 'var(--bg-2)',
                            border: '1px solid var(--line)',
                            borderRadius: '1.25rem',
                            padding: '1.125rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            transition: 'box-shadow 0.2s',
                        }}
                        onHoverStart={e => { (e.target as HTMLElement).closest?.('.stat')?.setAttribute('style', 'box-shadow:0 12px 40px rgba(0,0,0,0.5)') }}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '0.625rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: `${s.color}15`, color: s.color,
                            }}>
                                {s.icon}
                            </div>
                            {s.chip && <span className={`chip ${s.chipClass}`}>{s.chip}</span>}
                        </div>
                        <div style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: '1.625rem',
                            fontWeight: 800,
                            color: 'var(--text-1)',
                            letterSpacing: '-0.04em',
                            lineHeight: 1,
                        }}>
                            <Counter to={typeof s.value === 'number' ? s.value : 0} />
                        </div>
                        <p className="label">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* ══════ MAIN BENTO ══════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}
                className="lg:grid-cols-3">

                {/* Progress card */}
                <div
                    className="relative overflow-hidden"
                    style={{
                        background: 'var(--bg-2)',
                        border: '1px solid var(--line)',
                        borderRadius: '1.375rem',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.25rem',
                    }}
                >
                    {/* Glow behind ring */}
                    <div style={{
                        position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                        width: 130, height: 130, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <RadialProgress pct={stats.pct} />

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'var(--text-3)' }}>Tópicos</span>
                            <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{stats.topics} / {stats.total}</span>
                        </div>
                        <div className="progress-track">
                            <motion.div
                                className="progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.pct}%` }}
                                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => onNavigate('catalog')}
                        className="btn btn-amber w-full"
                        style={{ borderRadius: '0.875rem', justifyContent: 'center' }}
                    >
                        Ver todo conteúdo
                    </button>
                </div>

                {/* Continue studying */}
                <div
                    style={{
                        background: 'var(--bg-2)',
                        border: '1px solid var(--line)',
                        borderRadius: '1.375rem',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    className="lg:col-span-2"
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-1)' }}>Continue estudando</h3>
                        <button
                            onClick={() => onNavigate('catalog')}
                            style={{ fontSize: '0.75rem', color: 'var(--amber)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                        >
                            Ver tudo
                            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Featured resume card */}
                    <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => setSelectedEp(resumeEp)}
                        className="w-full text-left rounded-xl flex items-center gap-3.5 mb-3"
                        style={{
                            background: 'var(--amber-soft)',
                            border: '1px solid rgba(245,158,11,0.2)',
                            padding: '0.875rem 1rem',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{
                            width: 40, height: 40, borderRadius: '0.75rem', flexShrink: 0,
                            background: 'var(--amber)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 16px var(--amber-glow)',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-inv)">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: 2 }}>
                                Continuar agora
                            </p>
                            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {resumeEp.ep.titulo}
                            </p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 1 }}>
                                {CATALOG[0].titulo} · {resumeEp.ep.duracao}
                            </p>
                        </div>
                        <span className="chip chip-amber hidden sm:inline-flex">Retomar</span>
                    </motion.button>

                    {/* List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {recentEps.slice(0, 4).map((item) => {
                            const color = SUBJECT_COLORS[item.subjectName] || '#f59e0b';
                            return (
                                <button
                                    key={item.ep.id}
                                    onClick={() => setSelectedEp(item)}
                                    className="w-full text-left group"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.5rem 0.625rem',
                                        borderRadius: '0.625rem',
                                        transition: 'background 0.14s',
                                        background: 'transparent',
                                        border: 'none', cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-3)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 5px ${color}60` }} />
                                    <span style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.ep.titulo}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', flexShrink: 0 }}>
                                        {item.subjectTitle}
                                    </span>
                                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                        style={{ color: 'var(--text-3)', opacity: 0, transition: 'opacity 0.14s', flexShrink: 0 }}
                                        className="group-hover:opacity-100"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ══════ BOTTOM BENTO ══════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}
                className="lg:grid-cols-3">

                {/* Activity chart */}
                <div style={{
                    background: 'var(--bg-2)',
                    border: '1px solid var(--line)',
                    borderRadius: '1.375rem',
                    padding: '1.25rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-1)' }}>Esta semana</h3>
                        <span className="chip chip-mint">Ativo</span>
                    </div>
                    <WeekChart days={weekDays} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--line)' }}>
                        <div>
                            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em' }}>35</p>
                            <p className="label">Tópicos na semana</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: 'var(--mint)', letterSpacing: '-0.03em' }}>+12%</p>
                            <p className="label">vs semana anterior</p>
                        </div>
                    </div>
                </div>

                {/* Subject breakdown */}
                <div style={{
                    background: 'var(--bg-2)',
                    border: '1px solid var(--line)',
                    borderRadius: '1.375rem',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-1)' }}>Por matéria</h3>
                        <button
                            onClick={() => onNavigate('catalog')}
                            style={{ fontSize: '0.7rem', color: 'var(--amber)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            Ver todas
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                        {subjectPcts.map((s) => (
                            <SubjectRow key={s.name} {...s} />
                        ))}
                    </div>
                </div>

                {/* Pending reviews */}
                <div style={{
                    background: 'var(--bg-2)',
                    border: '1px solid var(--line)',
                    borderRadius: '1.375rem',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-1)' }}>Revisões pendentes</h3>
                        <span className="chip chip-coral">{recentEps.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
                        {recentEps.map((rev, i) => {
                            const color = SUBJECT_COLORS[rev.subjectName] || '#f59e0b';
                            const urgency = i < 2 ? 'var(--coral)' : 'var(--text-3)';
                            return (
                                <motion.button
                                    key={rev.ep.id}
                                    whileHover={{ x: 3 }}
                                    onClick={() => setSelectedEp(rev)}
                                    className="w-full text-left"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                                        padding: '0.5rem 0.625rem',
                                        borderRadius: '0.625rem',
                                        border: '1px solid var(--line)',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.14s',
                                    }}
                                    onHoverStart={e => {
                                        const el = e.target as HTMLElement;
                                        const btn = el.closest('button');
                                        if (btn) { btn.style.background = 'var(--bg-3)'; btn.style.borderColor = 'var(--line-2)'; }
                                    }}
                                    onHoverEnd={e => {
                                        const el = e.target as HTMLElement;
                                        const btn = el.closest('button');
                                        if (btn) { btn.style.background = 'transparent'; btn.style.borderColor = 'var(--line)'; }
                                    }}
                                >
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                    <span style={{ flex: 1, fontSize: '0.75rem', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {rev.ep.titulo}
                                    </span>
                                    <span style={{ fontSize: '0.625rem', fontWeight: 700, color: urgency, flexShrink: 0 }}>
                                        {i < 2 ? 'Urgente' : 'Hoje'}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedEp && (
                    <EpisodeModalNew
                        ep={selectedEp.ep}
                        subjectId={selectedEp.subjectId}
                        subjectTitle={selectedEp.subjectTitle}
                        subjectName={selectedEp.subjectName}
                        onClose={() => setSelectedEp(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
