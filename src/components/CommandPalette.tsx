import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATALOG } from '../data/catalog';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: string, id?: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                // toggle based on current state not easily accessible here without state dispatch, 
                // so the parent will handle the toggle, we just need to listen there.
            }
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const q = query.toLowerCase();
        const found: any[] = [];

        // Search routes
        const routes = [
            { type: 'route', title: 'Dashboard', id: 'dashboard', emoji: '🏠' },
            { type: 'route', title: 'Trilhas', id: 'trilhas', emoji: '🗺️' },
            { type: 'route', title: 'Diagnóstico GPS', id: 'diagnostico', emoji: '🧭' },
            { type: 'route', title: 'Biblioteca', id: 'catalog', emoji: '📚' }
        ];

        routes.forEach(r => {
            if (r.title.toLowerCase().includes(q)) found.push(r);
        });

        // Search catalog seasons
        CATALOG.forEach(t => {
            if (t.titulo.toLowerCase().includes(q) || t.descricao.toLowerCase().includes(q)) {
                found.push({ type: 'season', title: t.titulo, id: t.id, emoji: '📺', subtitle: t.materia });
            }
            // Search episodes
            t.episodios.forEach((ep: any) => {
                if (ep.titulo.toLowerCase().includes(q) || ep.assunto.toLowerCase().includes(q)) {
                    found.push({ type: 'episodio', title: ep.titulo, id: t.id, epId: ep.id, emoji: '▶️', subtitle: `${t.titulo} • ${ep.assunto}` });
                }
            });
        });

        setResults(found.slice(0, 10)); // Limit to 10 results
    }, [query]);

    const handleSelect = (item: any) => {
        if (item.type === 'route') {
            onNavigate(item.id);
        } else if (item.type === 'season' || item.type === 'episodio') {
            onNavigate('season', item.id);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
                {/* Overlay backdrop */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-2xl bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="flex items-center px-4 border-b border-white/5">
                        <svg className="w-5 h-5 text-white/40 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                            autoFocus
                            type="text"
                            className="bg-transparent text-white text-lg py-5 outline-none w-full placeholder-white/20"
                            placeholder="O que você quer aprender hoje?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/40 font-bold tracking-widest uppercase">ESC</div>
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto no-scrollbar pb-2">
                        {query && results.length === 0 && (
                            <div className="p-8 text-center text-white/40">Nenhum resultado encontrado para "{query}"</div>
                        )}
                        {results.length > 0 && (
                            <div className="p-2">
                                {results.map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleSelect(item)}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                                    >
                                        <div className="text-2xl opacity-60 group-hover:opacity-100">{item.emoji}</div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium group-hover:text-red-400 transition-colors">{item.title}</span>
                                            {item.subtitle && <span className="text-[11px] text-white/40">{item.subtitle}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!query && (
                            <div className="p-6">
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Sugestões Rápidas</div>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => setQuery('Redação')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white/70 transition-colors">✍️ Redação</button>
                                    <button onClick={() => setQuery('Matemática')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white/70 transition-colors">🔢 Matemática Básica</button>
                                    <button onClick={() => setQuery('TRI')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white/70 transition-colors">🎯 Estratégia TRI</button>
                                    <button onClick={() => handleSelect({ type: 'route', id: 'trilhas' })} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white/70 transition-colors">🗺️ Trilhas</button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
