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
        id: 'dashboard', label: 'Painel', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
        )
    },
    {
        id: 'trilhas', label: 'Trilhas', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
        )
    },
    {
        id: 'diagnostico', label: 'Diagnóstico', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        )
    },
    {
        id: 'catalog', label: 'Biblioteca', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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
            if (key && key.startsWith('desdobre_')) {
                data[key] = localStorage.getItem(key) || '';
            }
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
            } catch {
                toast.error('Arquivo inválido.');
            }
        };
        reader.readAsText(file);
    };

    const isActive = (id: string) =>
        currentView === id || (currentView === 'season' && id === 'catalog') || (currentView.startsWith('subject_') && id === 'catalog');

    return (
        <div className="flex min-h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
            <Toaster
                richColors
                position="bottom-right"
                theme="dark"
                toastOptions={{
                    style: {
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                    }
                }}
            />

            {/* ─── Desktop Sidebar ─── */}
            <aside
                className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            >
                {/* Logo */}
                <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="flex items-center gap-2.5 group"
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'var(--brand)' }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span
                            className="font-bold text-sm tracking-tight"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Desdobre
                        </span>
                    </button>
                </div>

                {/* Search */}
                <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <button
                        onClick={() => setCmdOpen(true)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all"
                        style={{
                            background: 'var(--bg-base)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="flex-1 text-xs">Buscar...</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                            ⌘K
                        </span>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto hide-scrollbar">
                    <p className="section-label px-3 mb-2 mt-1">Navegar</p>
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className="nav-item w-full"
                                style={active ? {
                                    color: 'var(--text-primary)',
                                    background: 'rgba(124,58,237,0.1)',
                                    borderLeft: '2px solid var(--brand)',
                                    paddingLeft: 'calc(0.75rem - 2px)',
                                } : {}}
                            >
                                <span style={{ color: active ? 'var(--brand-light)' : 'var(--text-muted)' }}>
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="nav-item w-full"
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                        </svg>
                        <span className="text-sm">Configurações</span>
                    </button>
                </div>
            </aside>

            {/* ─── Main ─── */}
            <main
                className="flex-1 relative overflow-y-auto h-screen hide-scrollbar"
                style={{ paddingBottom: '5rem' }}
            >
                {/* Mobile Topbar */}
                <header
                    className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b"
                    style={{
                        background: 'rgba(10,10,15,0.92)',
                        backdropFilter: 'blur(16px)',
                        borderColor: 'var(--border)',
                    }}
                >
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="flex items-center gap-2"
                    >
                        <div
                            className="w-6 h-6 rounded-md flex items-center justify-center"
                            style={{ background: 'var(--brand)' }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            Desdobre
                        </span>
                    </button>
                    <button
                        onClick={() => setCmdOpen(true)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </header>

                {/* Page content */}
                <div className="px-4 py-6 md:px-8 md:py-8 lg:px-10 max-w-[1400px] mx-auto">
                    {children}
                </div>
            </main>

            {/* ─── Mobile Bottom Nav ─── */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t pb-safe"
                style={{
                    background: 'rgba(10,10,15,0.96)',
                    backdropFilter: 'blur(20px)',
                    borderColor: 'var(--border)',
                }}
            >
                <div className="flex items-center justify-around pt-2 pb-1 px-1">
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className="flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all min-w-[3.5rem]"
                                style={{ color: active ? 'var(--brand-light)' : 'var(--text-muted)' }}
                            >
                                <span style={{ transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s' }}>
                                    {item.icon}
                                </span>
                                <span className="text-[10px] font-semibold truncate max-w-full">
                                    {item.label}
                                </span>
                                {active && (
                                    <motion.div
                                        layoutId="mobileNav"
                                        className="absolute bottom-1 w-4 h-0.5 rounded-full"
                                        style={{ background: 'var(--brand)' }}
                                    />
                                )}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all min-w-[3.5rem]"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: 24, opacity: 0, scale: 0.97 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 24, opacity: 0, scale: 0.97 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-sm rounded-2xl p-6 border shadow-2xl"
                            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-hover)' }}
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

                            <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                                Configurações
                            </h2>
                            <p className="text-xs mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                Exporte ou importe seu progresso. Todos os dados são armazenados localmente no seu navegador.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={exportData}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                                    style={{ background: 'var(--brand)' }}
                                >
                                    <span>Exportar backup (.json)</span>
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={importData}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all border pointer-events-none"
                                        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                                    >
                                        <span>Importar arquivo</span>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
