import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import CommandPalette from './CommandPalette';

interface Props {
    children: React.ReactNode;
    currentView: string;
    onNavigate: (v: string, id?: string) => void;
}

const NAV_ITEMS = [
    {
        id: 'dashboard',
        label: 'Painel',
        icon: (active: boolean) => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.75} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
        ),
    },
    {
        id: 'trilhas',
        label: 'Trilhas',
        icon: (active: boolean) => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.75} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 17h4l2-4 4 8 2-5 2 3h4" />
            </svg>
        ),
    },
    {
        id: 'diagnostico',
        label: 'Diagnóstico',
        icon: (active: boolean) => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.75} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
    },
    {
        id: 'catalog',
        label: 'Biblioteca',
        icon: (active: boolean) => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.75} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
        ),
    },
];

function DesdoLogo({ size = 28 }: { size?: number }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '0.5rem',
                background: 'var(--amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* D letter */}
            <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 14 14" fill="none">
                <path d="M2 2h4.5C9.537 2 12 4.239 12 7s-2.463 5-5.5 5H2V2z"
                    fill="var(--text-inv)" fillOpacity="0.9" />
            </svg>
        </div>
    );
}

export default function Layout({ children, currentView, onNavigate }: Props) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [cmdOpen, setCmdOpen] = useState(false);
    const [sideExpanded, setSideExpanded] = useState(true);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setCmdOpen(p => !p);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const exportData = () => {
        const data: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('desdobre_')) data[key] = localStorage.getItem(key) || '';
        }
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `desdobre_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        toast.success('Backup exportado!');
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                Object.keys(data).forEach(k => localStorage.setItem(k, data[k]));
                toast.success('Importado! Recarregando...');
                setTimeout(() => window.location.reload(), 1500);
            } catch { toast.error('Arquivo inválido.'); }
        };
        reader.readAsText(file);
    };

    const isActive = (id: string) =>
        currentView === id ||
        (currentView === 'season' && id === 'catalog') ||
        (currentView.startsWith('subject_') && id === 'catalog');

    const sideW = sideExpanded ? 220 : 60;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
            <Toaster
                position="bottom-right"
                theme="dark"
                toastOptions={{
                    style: {
                        background: 'var(--bg-3)',
                        border: '1px solid var(--line-2)',
                        color: 'var(--text-1)',
                        borderRadius: '0.875rem',
                        fontFamily: "'Inter', sans-serif",
                    }
                }}
            />

            {/* ═══ Desktop Sidebar ═══ */}
            <motion.aside
                animate={{ width: sideW }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="hidden md:flex flex-col h-screen sticky top-0 overflow-hidden"
                style={{
                    background: 'var(--bg-2)',
                    borderRight: '1px solid var(--line)',
                    flexShrink: 0,
                }}
            >
                {/* Top: Logo + Toggle */}
                <div
                    className="flex items-center justify-between px-3 py-4"
                    style={{ borderBottom: '1px solid var(--line)', height: 60 }}
                >
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="flex items-center gap-2.5 min-w-0"
                    >
                        <DesdoLogo size={28} />
                        <AnimatePresence>
                            {sideExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.18 }}
                                    className="min-w-0 overflow-hidden"
                                >
                                    <p
                                        className="font-bold text-sm leading-none whitespace-nowrap"
                                        style={{ color: 'var(--text-1)', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}
                                    >
                                        Desdobre
                                    </p>
                                    <p className="label mt-0.5 whitespace-nowrap">ENEM 2025</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                    <button
                        onClick={() => setSideExpanded(p => !p)}
                        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ color: 'var(--text-3)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
                    >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                            {sideExpanded
                                ? <><path d="M15 18l-6-6 6-6"/></>
                                : <><path d="M9 18l6-6-6-6"/></>
                            }
                        </svg>
                    </button>
                </div>

                {/* Search */}
                {sideExpanded && (
                    <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--line)' }}>
                        <button
                            onClick={() => setCmdOpen(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors"
                            style={{
                                background: 'var(--bg-3)',
                                border: '1px solid var(--line)',
                                color: 'var(--text-3)',
                                fontSize: '0.75rem',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--line-2)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                        >
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="flex-1">Buscar...</span>
                            <kbd
                                className="mono text-[9px] px-1 py-0.5 rounded"
                                style={{ background: 'var(--bg-4)', color: 'var(--text-3)' }}
                            >
                                ⌘K
                            </kbd>
                        </button>
                    </div>
                )}
                {!sideExpanded && (
                    <div className="px-2.5 py-2.5" style={{ borderBottom: '1px solid var(--line)' }}>
                        <button
                            onClick={() => setCmdOpen(true)}
                            className="w-full flex items-center justify-center h-9 rounded-lg transition-colors"
                            style={{ background: 'var(--bg-3)', border: '1px solid var(--line)', color: 'var(--text-3)' }}
                        >
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Nav Items */}
                <nav className="flex-1 px-2.5 py-3 overflow-y-auto no-scroll space-y-0.5">
                    {sideExpanded && <p className="label px-2 mb-2">Menu</p>}
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className="relative w-full flex items-center rounded-lg transition-all group"
                                style={{
                                    gap: sideExpanded ? '0.65rem' : 0,
                                    padding: sideExpanded ? '0.5rem 0.65rem' : '0.55rem 0',
                                    justifyContent: sideExpanded ? 'flex-start' : 'center',
                                    color: active ? 'var(--amber)' : 'var(--text-3)',
                                    background: active ? 'var(--amber-soft)' : 'transparent',
                                    border: active ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                                }}
                                onMouseEnter={e => {
                                    if (!active) {
                                        e.currentTarget.style.color = 'var(--text-1)';
                                        e.currentTarget.style.background = 'var(--bg-3)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!active) {
                                        e.currentTarget.style.color = 'var(--text-3)';
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 rounded-lg"
                                        style={{ background: 'var(--amber-soft)', zIndex: 0 }}
                                        transition={{ type: 'spring', bounce: 0.18, duration: 0.35 }}
                                    />
                                )}
                                <span className="relative z-10">{item.icon(active)}</span>
                                {sideExpanded && (
                                    <span className="relative z-10 text-sm font-medium whitespace-nowrap">{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="px-2.5 pb-4" style={{ borderTop: '1px solid var(--line)', paddingTop: '0.75rem' }}>
                    {sideExpanded && (
                        <div
                            className="rounded-xl p-3 mb-2.5"
                            style={{ background: 'var(--bg-3)', border: '1px solid var(--line)' }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className="w-2 h-2 rounded-full anim-pulse-amber"
                                    style={{ background: 'var(--amber)', display: 'block' }}
                                />
                                <span className="text-xs font-semibold" style={{ color: 'var(--text-1)' }}>
                                    3 dias seguidos
                                </span>
                            </div>
                            <div className="progress-track" style={{ marginTop: '0.5rem' }}>
                                <div className="progress-fill" style={{ width: '43%' }} />
                            </div>
                            <p className="label mt-1.5">Sequência ativa</p>
                        </div>
                    )}

                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="w-full flex items-center rounded-lg transition-colors"
                        style={{
                            gap: sideExpanded ? '0.65rem' : 0,
                            padding: sideExpanded ? '0.5rem 0.65rem' : '0.55rem 0',
                            justifyContent: sideExpanded ? 'flex-start' : 'center',
                            color: 'var(--text-3)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.borderRadius = '0.5rem'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        {sideExpanded && <span className="text-sm font-medium">Configurações</span>}
                    </button>
                </div>
            </motion.aside>

            {/* ═══ Main Content ═══ */}
            <main
                className="flex-1 h-screen overflow-y-auto no-scroll relative"
                style={{ paddingBottom: '5rem' }}
            >
                {/* Mobile Top Bar */}
                <header
                    className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4"
                    style={{
                        height: 56,
                        background: 'rgba(12,12,12,0.92)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid var(--line)',
                    }}
                >
                    <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2.5">
                        <DesdoLogo size={26} />
                        <span
                            className="font-bold text-sm tracking-tight"
                            style={{ color: 'var(--text-1)', fontFamily: "'Syne', sans-serif" }}
                        >
                            Desdobre
                        </span>
                    </button>
                    <button
                        onClick={() => setCmdOpen(true)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--bg-3)', border: '1px solid var(--line)', color: 'var(--text-3)' }}
                    >
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </header>

                {/* Page content */}
                <div className="px-4 py-5 md:px-7 md:py-7 lg:px-10 max-w-[1440px] mx-auto">
                    {children}
                </div>
            </main>

            {/* ═══ Mobile Bottom Nav ═══ */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
                style={{
                    background: 'rgba(12,12,12,0.96)',
                    backdropFilter: 'blur(24px)',
                    borderTop: '1px solid var(--line)',
                }}
            >
                <div className="flex items-stretch justify-around">
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className="relative flex flex-col items-center justify-center gap-1 py-2.5 flex-1 transition-all"
                                style={{ color: active ? 'var(--amber)' : 'var(--text-3)' }}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="mobile-active"
                                        className="absolute inset-x-2 inset-y-1 rounded-xl"
                                        style={{ background: 'var(--amber-soft)' }}
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                                    />
                                )}
                                <span
                                    className="relative z-10 transition-transform"
                                    style={{ transform: active ? 'scale(1.12)' : 'scale(1)' }}
                                >
                                    {item.icon(active)}
                                </span>
                                <span className="relative z-10 text-[9px] font-bold tracking-wide uppercase">{item.label}</span>
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="flex flex-col items-center justify-center gap-1 py-2.5 flex-1 transition-colors"
                        style={{ color: 'var(--text-3)' }}
                    >
                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        <span className="text-[9px] font-bold tracking-wide uppercase">Config.</span>
                    </button>
                </div>
            </nav>

            {/* Command Palette */}
            <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={onNavigate} />

            {/* Settings Modal */}
            <AnimatePresence>
                {settingsOpen && (
                    <div
                        className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center sm:px-4"
                        onClick={() => setSettingsOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 380 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6"
                            style={{
                                background: 'var(--bg-2)',
                                border: '1px solid var(--line-2)',
                                boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
                            }}
                        >
                            {/* Handle (mobile) */}
                            <div className="sm:hidden w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--line-2)' }} />

                            <button
                                onClick={() => setSettingsOpen(false)}
                                className="absolute top-5 right-5 w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background: 'var(--bg-4)', color: 'var(--text-3)' }}
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                style={{ background: 'var(--amber-soft)', border: '1px solid rgba(245,158,11,0.2)' }}
                            >
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--amber)' }}>
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                            </div>

                            <h2 className="font-bold text-base mb-1" style={{ color: 'var(--text-1)' }}>Configurações</h2>
                            <p className="text-xs mb-5" style={{ color: 'var(--text-3)' }}>
                                Gerencie seus dados e preferências.
                            </p>

                            <div className="space-y-2.5">
                                <button
                                    onClick={exportData}
                                    className="btn btn-outline w-full justify-start gap-3"
                                    style={{ borderRadius: '0.875rem' }}
                                >
                                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--mint)' }}>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Exportar progresso
                                </button>
                                <label className="btn btn-outline w-full justify-start gap-3 cursor-pointer" style={{ borderRadius: '0.875rem' }}>
                                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--sky)' }}>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    Importar backup
                                    <input type="file" accept=".json" className="hidden" onChange={importData} />
                                </label>
                            </div>

                            <div className="divider my-5" />

                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: 'var(--amber-soft)' }}
                                >
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--amber)' }}>
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold" style={{ color: 'var(--text-1)' }}>Desdobre v4.0</p>
                                    <p className="label">Plataforma de Estudos ENEM</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
