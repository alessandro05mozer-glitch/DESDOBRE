// CatalogHome.tsx — Biblioteca Virtual
import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Catalog DB is now injected as prop from Go backend in App.tsx

const CORES: Record<string, { grad: string; bg: string; emoji: string }> = {
    historia: { grad: 'from-orange-400 to-red-600', bg: 'from-[#0b1c2c] to-[#06101a]', emoji: '📜' },
    matematica: { grad: 'from-blue-400 to-indigo-600', bg: 'from-[#0f172a] to-[#040914]', emoji: '🔢' },
    quimica: { grad: 'from-emerald-400 to-teal-600', bg: 'from-[#062118] to-[#020d0a]', emoji: '⚗️' },
    biologia: { grad: 'from-lime-400 to-green-600', bg: 'from-[#11220b] to-[#070f04]', emoji: '🧬' },
    fisica: { grad: 'from-cyan-400 to-blue-600', bg: 'from-[#081e28] to-[#030d12]', emoji: '⚡' },
    geografia: { grad: 'from-teal-400 to-cyan-600', bg: 'from-[#062424] to-[#020e0e]', emoji: '🌍' },
    redacao: { grad: 'from-pink-400 to-rose-600', bg: 'from-[#2e0916] to-[#120308]', emoji: '✍️' },
    socfilo: { grad: 'from-purple-400 to-fuchsia-600', bg: 'from-[#1e0a2d] to-[#0d0314]', emoji: '🧠' },
};

interface Props { catalog: any[]; onSelectTemporada: (id: string) => void; onOriginal: () => void; }

export default function CatalogHome({ catalog, onSelectTemporada, onOriginal }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const totalEpisodios = catalog.reduce((acc, t) => acc + t.episodios.length, 0);

    const filteredCatalog = catalog.filter(t =>
        t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.materia.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full">
            {/* Hero / Header */}
            <header className="mb-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-white/40 mb-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ec4899]">Acesso Global</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-2">
                            Biblioteca <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent italic">Virtual.</span>
                        </h1>
                        <p className="text-white/50 text-sm max-w-lg">Todo o diretório de dados desbloqueado para você. Pesquise rapidamente ou explore as áreas do conhecimento.</p>
                    </div>
                </div>

                {/* Busca Global Incorporada */}
                <div className="relative max-w-2xl w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por matérias, assuntos ou professores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#121526] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/30 outline-none focus:border-pink-500/50 focus:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all"
                    />
                    {searchTerm.length > 0 && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-2">
                            ✕
                        </button>
                    )}
                </div>
            </header>

            {/* Grid de Temporadas */}
            <main className="pb-24">
                {filteredCatalog.length === 0 && (
                    <div className="py-20 text-center border border-white/5 rounded-3xl bg-[#121526]/50">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-white mb-2">Nada encontrado</h3>
                        <p className="text-gray-500 text-sm">Nenhuma matéria encontrada para "{searchTerm}"</p>
                        <button onClick={() => setSearchTerm('')} className="mt-4 text-purple-400 text-sm hover:underline">
                            Limpar busca
                        </button>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredCatalog.map((temporada, idx) => {
                        const cores = CORES[temporada.materia] || CORES.historia;
                        return (
                            <motion.div
                                key={temporada.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.07, duration: 0.5 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                onClick={() => onSelectTemporada(temporada.id)}
                                className="cursor-pointer group"
                            >
                                <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[120px] sm:h-[340px] flex flex-row sm:flex-col bg-gradient-to-br ${cores.bg} border border-white/5 group-hover:border-white/20 shadow-xl transition-all duration-500`}>
                                    {/* Gradient overlay on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-tr ${cores.grad} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    {/* Icon */}
                                    <div className={`shrink-0 ml-4 sm:ml-0 self-center sm:self-auto sm:absolute sm:top-6 sm:left-6 w-16 h-16 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-3xl sm:text-3xl bg-gradient-to-br ${cores.grad} shadow-lg z-10`}>
                                        {cores.emoji}
                                    </div>

                                    {/* Content Wrapper for mobile vs desktop */}
                                    <div className="flex flex-col justify-center sm:justify-end flex-1 p-4 sm:p-6 sm:pb-8 sm:absolute sm:inset-0 text-left sm:text-center z-10">
                                        <span className="hidden sm:block text-[9px] px-3 py-1.5 rounded-full border border-white/10 text-white/40 uppercase tracking-widest font-black absolute top-8 right-6">
                                            {temporada.episodios.length} episódios
                                        </span>
                                        <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tighter text-white sm:mb-2">{temporada.titulo}</h3>
                                        <p className="text-[10px] sm:text-sm font-bold text-white/50 uppercase tracking-widest truncate">{temporada.materia}</p>

                                        {/* Mobile episode count */}
                                        <span className="sm:hidden text-[9px] mt-1 text-white/40 uppercase tracking-widest font-black">
                                            {temporada.episodios.length} episódios
                                        </span>
                                    </div>

                                    {/* Play indicator line */}
                                    <div className="absolute top-0 right-0 sm:bottom-0 sm:left-0 sm:top-auto w-1 h-full sm:w-full sm:h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </main>

            {/* Stats Footer */}
            <footer className="border-t border-white/5 py-12 mb-10">
                <div className="flex flex-wrap gap-8 justify-center mb-8">
                    {[
                        { label: 'Pastas', value: catalog.length, emoji: '📚' },
                        { label: 'Episódios', value: totalEpisodios, emoji: '🎬' },
                        { label: 'Professores Top', value: '24+', emoji: '👨‍🏫' },
                        { label: 'Quizzes', value: catalog.reduce((a, t) => a + t.episodios.filter((e: any) => e.quiz).length, 0), emoji: '🧠' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl mb-1 opacity-70">{stat.emoji}</div>
                            <div className="text-2xl font-black text-white">{stat.value}</div>
                            <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </footer >
        </div >
    );
}
