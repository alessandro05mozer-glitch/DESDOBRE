import React, { useState } from 'react';
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
        id: 'dashboard', label: 'Painel',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
        )
    },
    {
        id: 'trilhas', label: 'Trilhas',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
        )
    },
    {
        id: 'diagnostico', label: 'Diagnóstico',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        )
    },
    {
        id: 'catalog', label: 'Biblioteca',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
        )
    },
];

export default function Layout({ children, currentView, onNavigate }: Props) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [cmdOpen, setCmdOpen] = useState(false);

    React.useEffect(() => {
        const handleCmdK = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setCmdOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleCmdK);
        return () => window.removeEventListener('keydown', handleCmdK);
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
        toast.success('Backup exportado com sucesso!');
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                Object.keys(data).forEach(k => localStorage.setItem(k, data[k]));
                toast.success('Dados importados! A página será recarregada.');
                setTimeout(() => window.location.reload(), 1500);
            } catch { toast.error('Arquivo inválido.'); }
        };
        reader.readAsText(file);
    };

    const isActive = (id: string) =>
        currentView === id ||
        (currentView === 'season' && id === 'catalog') ||
        (currentView.startsWith('subject_') && id === 'catalog');

    return (
        <div className="flex min-h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
            <Toaster
                richColors
                position="bottom-right"
                theme="dark"
                toastOptions={{
                    style: {
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-hover)',
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-lg)',
                    }
                }}
            />

            {/* ─── Desktop Sidebar ─── */}
            <aside
                className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0"
                style={{
                    background: 'var(--bg-surface)',
                    borderRight: '1px solid var(--border)',
                }}
            >
                {/* Logo */}
                <div className="px-4 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="flex items-center gap-2.5 group w-full"
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'var(--brand)' }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-bold text-sm leading-none tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                Desdobre
                            </span>
                            <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                ENEM 2025
                            </span>
                        </div>
                    </button>
                </div>

                {/* Busca */}
                <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setCmdOpen(true)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all"
                        style={{
                            background: 'var(--bg-base)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-muted)',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                        }}
                    >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="flex-1 text-xs">Buscar...</span>
                        <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                        >
                            ⌘K
                        </span>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto hide-scrollbar space-y-0.5">
                    <p className="section-label px-2 mb-3">Navegar</p>
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className="nav-item w-full"
                                style={active ? {
                                    color: 'var(--text-primary)',
                                    background: 'var(--brand-dim)',
                                } : {}}
                            >
                                <span style={{ color: active ? 'var(--brand)' : undefined }}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                                {active && (
                                    <motion.div
                                        layoutId="sidebarIndicator"
                                        className="ml-auto w-1 h-4 rounded-full"
                                        style={{ background: 'var(--brand)' }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Status / Streak */}
                <div className="px-3 pb-3">
                    <div
                        className="rounded-xl p-3 mb-3"
                        style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--accent)' }} />
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Sequência ativa</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>3 dias consecutivos de estudo</p>
                    </div>

                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="nav-item w-full"
                    >
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        <span className="text-sm">Configurações</span>
                    </button>
                </div>
            </aside>

            {/* ─── Main ─── */}
            <main
                className="flex-1 relative overflow-y-auto h-screen hide-scrollbar"
                style={{ paddingBottom: '5.5rem' }}
            >
                {/* Mobile Topbar */}
                <header
                    className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14"
                    style={{
                        background: 'rgba(8,8,12,0.9)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="flex items-center gap-2"
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: 'var(--brand)' }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            Desdobre
                        </span>
                    </button>
                    <button
                        onClick={() => setCmdOpen(true)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                    >
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </header>

                {/* Conteúdo da página */}
                <div className="px-4 py-6 md:px-8 md:py-8 lg:px-10 max-w-[1400px] mx-auto">
                    {children}
                </div>
            </main>

            {/* ─── Mobile Bottom Nav ─── */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
                style={{
                    background: 'rgba(8,8,12,0.95)',
                    backdropFilter: 'blur(24px)',
                    borderTop: '1px solid var(--border)',
                }}
            >
                <div className="flex items-stretch justify-around">
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className="relative flex flex-col items-center justify-center gap-1 py-3 flex-1 transition-all"
                                style={{ color: active ? 'var(--brand)' : 'var(--text-muted)' }}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="mobileNavBg"
                                        className="absolute inset-x-2 inset-y-1 rounded-xl"
                                        style={{ background: 'var(--brand-dim)' }}
                                    />
                                )}
                                <span className="relative z-10" style={{ transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s' }}>
                                    {item.icon}
                                </span>
                                <span className="relative z-10 text-[10px] font-semibold">{item.label}</span>
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="flex flex-col items-center justify-center gap-1 py-3 flex-1"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        <span className="text-[10px] font-semibold">Config.</span>
                    </button>
                </div>
            </nav>

            {/* Command Palette */}
            <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={onNavigate} />

            {/* Settings Modal */}
            <AnimatePresence>
                {settingsOpen && (
                    <div
                        className="fixed inset-0 z-[99999] flex items-center justify-center px-4"
                        onClick={() => setSettingsOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.96 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.96 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-sm rounded-2xl p-6 border shadow-2xl"
                            style={{
                                background: 'var(--bg-elevated)',
                                borderColor: 'var(--border-hover)',
                            }}
                        >
                            <button
                                onClick={() => setSettingsOpen(false)}
                                className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                                style={{ background: 'var(--bg-overlay)', color: 'var(--text-muted)' }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                                style={{ background: 'var(--brand-dim)' }}
                            >
                                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand)' }}>
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                            </div>

                            <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                                Configurações
                            </h2>
                            <p className="text-xs mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                Exporte ou importe seu progresso. Todos os dados ficam salvos localmente no seu navegador.
                            </p>

                            <div className="space-y-2.5">
                                <button
                                    onClick={exportData}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                                    style={{ background: 'var(--brand)' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#6ba0f9')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--brand)')}
                                >
                                    <span>Exportar backup (.json)</span>
                                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>

                                <div className="relative">
                                    <input type="file" accept=".json" onChange={importData} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all border pointer-events-none"
                                        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                                    >
                                        <span>Importar arquivo</span>
                                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
