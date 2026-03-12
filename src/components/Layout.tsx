import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import CommandPalette from './CommandPalette';

interface Props {
    children: React.ReactNode;
    currentView: string;
    onNavigate: (v: string, id?: string) => void;
}

const MENU_ITEMS = [
    { id: 'dashboard', label: 'QG do Aluno', icon: '🏠' },
    { id: 'trilhas', label: 'Jornadas (Trilhas)', icon: '🗺️' },
    { id: 'diagnostico', label: 'GPS (Diagnóstico)', icon: '🧭' },
    { id: 'catalog', label: 'Biblioteca Virtual', icon: '📚' }
];

export default function Layout({ children, currentView, onNavigate }: Props) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [cmdOpen, setCmdOpen] = useState(false);

    // Global keyboard listener for explicitly ctrl+k
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
        toast.success("Backup exportado com sucesso!");
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                Object.keys(data).forEach(k => {
                    localStorage.setItem(k, data[k]);
                });
                toast.success('✅ Dados importados! A página será recarregada.');
                setTimeout(() => window.location.reload(), 1500);
            } catch (err) {
                toast.error('❌ Arquivo inválido.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex bg-[#0d0f1a] min-h-screen text-white font-sans overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at top center, #1a1b32 0%, #0d0f1a 80%)' }}>
            <Toaster richColors position="bottom-right" theme="dark" />

            {/* Desktop Sidebar (hidden on mobile) */}
            <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#05070f]/50 backdrop-blur-3xl shrink-0 h-screen sticky top-0">
                <div className="p-8">
                    <h1 className="text-xl font-black tracking-[-0.05em] uppercase cursor-pointer" onClick={() => onNavigate('dashboard')}>
                        <span className="text-purple-500 italic">D</span>esdobre<span className="text-pink-500">.</span>
                    </h1>
                </div>

                <div className="flex-1 px-4 py-2 space-y-2">
                    <button
                        onClick={() => setCmdOpen(true)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 text-white/50 text-xs font-bold rounded-xl mb-6 hover:bg-white/10 transition-colors group"
                    >
                        <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> Buscar</span>
                        <div className="flex gap-1">
                            <span className="px-1.5 py-0.5 rounded bg-black/50 border border-white/10">Ctrl</span>
                            <span className="px-1.5 py-0.5 rounded bg-black/50 border border-white/10">K</span>
                        </div>
                    </button>

                    {MENU_ITEMS.map(item => {
                        const active = currentView === item.id || (currentView === 'season' && item.id === 'catalog');
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold uppercase tracking-widest ${active
                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-white border-l-2 border-purple-500'
                                    : 'text-white/40 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                                    }`}
                            >
                                <span className={`text-xl ${active ? 'opacity-100' : 'opacity-60'}`}>{item.icon}</span>
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <span className="text-lg">⚙️</span> Definições
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto h-screen pb-24 md:pb-0 pt-16 md:pt-0 hide-scrollbar scroll-smooth">
                {/* Mobile top nav simple search trigger */}
                <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#070910]/95 backdrop-blur-xl border-b border-white/5 h-14 px-4 flex items-center justify-between">
                    <h1 className="text-xl font-black tracking-[-0.05em] uppercase" onClick={() => onNavigate('dashboard')}>
                        <span className="text-purple-500 italic">D</span>esdobre<span className="text-pink-500">.</span>
                    </h1>
                    <button onClick={() => setCmdOpen(true)} className="w-10 h-10 rounded-full bg-transparent flex items-center justify-end text-white/50">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>

                <div className="p-4 md:p-12 lg:p-16 max-w-[1600px] mx-auto min-h-[100vh]">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Bar (App-Style pinned bottom) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080911]/90 backdrop-blur-xl border-t border-white/10 pb-safe pt-2 px-2 flex justify-around items-center h-16">
                {MENU_ITEMS.slice(0, 4).map(item => {
                    const active = currentView === item.id || (currentView === 'season' && item.id === 'catalog');
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 w-1/5 ${active ? 'text-purple-400' : 'text-white/40 hover:text-white'
                                }`}
                        >
                            <span className={`text-xl mb-1 transition-transform ${active ? 'scale-110' : 'scale-90 hover:scale-100'}`}>{item.icon}</span>
                            <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest truncate w-full text-center mt-0.5">{item.label.split(' ')[0]}</span>
                            {active && <motion.div layoutId="navIndicator" className="w-1 h-1 rounded-full bg-purple-500 mt-1 absolute bottom-1" />}
                        </button>
                    );
                })}
                <button
                    onClick={() => setSettingsOpen(true)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 w-1/5 text-white/40 hover:text-white`}
                >
                    <span className="text-xl mb-1 scale-90 hover:scale-100">⚙️</span>
                    <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest truncate w-full text-center mt-0.5">Ajustes</span>
                </button>
            </nav>

            {/* Command Palette */}
            <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={onNavigate} />

            {/* Settings Modal (Offline sync) */}
            <AnimatePresence>
                {settingsOpen && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4" onClick={() => setSettingsOpen(false)}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-b from-[#151a2e] to-[#0b0d18] w-full max-w-sm rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.1)] p-8 relative overflow-hidden"
                        >
                            <button onClick={() => setSettingsOpen(false)} className="absolute top-6 right-6 text-white/30 hover:text-white">✕</button>
                            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Definições</h2>
                            <p className="text-xs text-white/40 mb-8 leading-relaxed">Faça o backup de todo o seu progresso local e retome em outro dispositivo. Todos os seus rastreamentos vivem localmente em seu navegador.</p>

                            <div className="space-y-4">
                                <button onClick={exportData} className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-purple-500/25 transition-all text-left flex justify-between items-center group">
                                    <span>Exportar Backup (.json)</span>
                                    <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                                </button>

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={importData}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-full py-4 px-6 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-white/70 font-bold text-xs uppercase tracking-widest transition-all text-left flex justify-between items-center pointer-events-none group">
                                        <span>Importar Arquivo</span>
                                        <span className="text-xl group-hover:-translate-y-1 transition-transform">↑</span>
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
