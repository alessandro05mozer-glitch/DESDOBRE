import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATALOG } from '../data/catalog';
import EpisodeModalNew from './EpisodeModalNew';

export default function Dashboard({ onNavigate }: { onNavigate: (view: string, id?: string) => void }) {
    const [progress, setProgress] = useState({ topics: 0, days: 3, percentage: 0 });

    useEffect(() => {
        let docs = 0;
        let total = 0;

        CATALOG.forEach(t => {
            t.episodios.forEach(e => {
                const epKey = `desdobre_ep_${e.id}`;
                const saved = localStorage.getItem(epKey);
                total += e.topicos.length;
                if (saved) {
                    const arr = JSON.parse(saved);
                    docs += arr.filter(Boolean).length;
                }
            });
        });

        setProgress({
            topics: docs,
            days: 3, // mock days
            percentage: total ? Math.round((docs / total) * 100) : 0
        });
    }, []);

    const [selectedEp, setSelectedEp] = useState<{ ep: any, subjectId: string, subjectTitle: string, subjectName: string } | null>(null);

    // Get 3 mock pending revisions from the beginning of the catalog
    const mockRevisions = CATALOG.flatMap(t => t.episodios.map(e => ({ ep: e, subjectId: t.id, subjectTitle: t.titulo, subjectName: t.materia }))).slice(0, 3);
    const mockResume = CATALOG[0].episodios[1]; // just a fixed element to resume

    return (
        <div className="w-full">
            {/* Header Area */}
            <div className="flex flex-col mb-12">
                <div className="flex items-center gap-2 text-white/40 mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#a855f7]">Painel de Controle</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-2">
                    Olá, <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Estudante</span>
                </h1>
                <p className="text-white/50 text-sm">Você é um <strong className="text-white/80">Novo Estudante</strong>. Sua jornada começa agora.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Stat Cards */}
                <div className="col-span-1 lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[#121526] rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3"><span className="text-xl">📚</span></div>
                        <div className="text-2xl font-black text-white">{CATALOG.length}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Matérias</div>
                    </div>
                    <div className="bg-[#121526] rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-3"><span className="text-xl">🎯</span></div>
                        <div className="text-2xl font-black text-white">{progress.topics}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Tópicos</div>
                    </div>
                    <div className="bg-[#121526] rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-3"><span className="text-xl">🔥</span></div>
                        <div className="text-2xl font-black text-white">{progress.days}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Dias Seg.</div>
                    </div>
                    <div className="bg-[#121526] rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3"><span className="text-xl">📈</span></div>
                        <div className="text-2xl font-black text-white">{progress.percentage}%</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Taxa</div>
                    </div>
                </div>

                {/* Main Progress Panel */}
                <div className="col-span-1 bg-gradient-to-br from-[#121526] to-[#0a0c16] rounded-3xl p-8 border border-white/5 relative overflow-hidden flex flex-col justify-center">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Progresso Total</div>
                    <div className="flex items-end justify-between mb-4">
                        <div className="text-6xl font-black text-white">{progress.percentage}<span className="text-3xl text-purple-500">%</span></div>
                        <div className="text-right">
                            <div className="text-[10px] text-white/40 font-bold uppercase">Itens Completos</div>
                            <div className="text-xl font-medium text-white/80">{progress.topics} <span className="text-sm">/ {CATALOG.reduce((a, t) => a + t.episodios.reduce((b, e) => b + e.topicos.length, 0), 0)}</span></div>
                        </div>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${progress.percentage}%` }} />
                    </div>
                    <p className="text-xs text-white/40 text-center">Continue estudando para desbloquear novas conquistas!</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Continue de Onde Parou / Missão do Dia */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Sua Jornada</h3>
                        <button onClick={() => onNavigate('diagnostico')} className="text-xs text-purple-400 hover:text-purple-300 font-bold">Ver GPS</button>
                    </div>
                    <div className="bg-[#121526] border border-white/5 rounded-2xl p-6 flex items-start gap-4 hover:border-white/20 transition-all cursor-pointer group" onClick={() => setSelectedEp({ ep: mockResume, subjectId: CATALOG[0].id, subjectTitle: CATALOG[0].titulo, subjectName: CATALOG[0].materia })}>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">▶</div>
                        <div className="flex-1">
                            <span className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-1 block">Continue Assistindo</span>
                            <h4 className="font-bold text-white mb-1 leading-tight">{mockResume.titulo}</h4>
                            <p className="text-xs text-white/40 mb-3">{CATALOG[0].titulo} • {mockResume.duracao}</p>
                            <button className="text-[10px] py-1.5 px-3 bg-white/5 hover:bg-white/10 transition-colors uppercase font-black tracking-widest rounded text-white flex items-center gap-2">
                                Abrir Episódio <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Revisões Pendentes */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Revisões (Flashcards)</h3>
                        <span className="text-xs text-rose-400 font-bold">{mockRevisions.length} Pendentes</span>
                    </div>
                    <div className="space-y-3">
                        {mockRevisions.map((rev, i) => (
                            <div key={rev.ep.id} onClick={() => setSelectedEp(rev)} className="group flex items-center justify-between bg-[#121526] border border-white/5 hover:border-white/20 p-4 rounded-xl cursor-pointer transition-all">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`}></div>
                                    <span className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors truncate max-w-[150px] sm:max-w-xs">{rev.ep.titulo}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="hidden sm:inline-block text-[10px] text-white/30 uppercase font-black uppercase tracking-widest">{rev.subjectTitle}</span>
                                    <button className="text-[10px] text-white/80 bg-white/5 group-hover:bg-white/10 px-3 py-1.5 rounded-md font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
                                        Revisar <span className="hidden sm:inline">→</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal Integrado */}
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
