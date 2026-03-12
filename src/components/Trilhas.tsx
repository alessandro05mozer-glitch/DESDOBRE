import React from 'react';
import { motion } from 'framer-motion';

export default function Trilhas({ onNavigate }: { onNavigate: (v: string, id?: string) => void }) {
    const TRILHAS = [
        {
            id: 'fundamentos',
            titulo: 'Fundamentos',
            desc: 'Base conceitual das disciplinas.',
            tempo: 'Essencial',
            cor: 'from-blue-500 to-indigo-600',
            bg: 'from-[#0a1128]/80 to-[#040914]',
            shadow: 'shadow-[0_0_40px_rgba(59,130,246,0.15)]',
            icon: (
                <div className="w-20 h-20 flex items-center justify-center rounded-[2rem] bg-blue-500/10 mb-8 border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                </div>
            ),
            etapas: ['Matemática Básica', 'Interpretação Crítica', 'História Geral I']
        },
        {
            id: 'estrategias',
            titulo: 'Estratégias',
            desc: 'Métodos para desempenho em provas.',
            tempo: 'Avançado',
            cor: 'from-emerald-400 to-teal-600',
            bg: 'from-[#062118]/80 to-[#020d0a]',
            shadow: 'shadow-[0_0_40px_rgba(16,185,129,0.15)]',
            icon: (
                <div className="w-20 h-20 flex items-center justify-center rounded-[2rem] bg-emerald-500/10 mb-8 border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
            ),
            etapas: ['Análise da Matriz TRI', 'Microestrutura (Redação)', 'Administração de Tempo']
        },
        {
            id: 'repertorio',
            titulo: 'Repertório',
            desc: 'Conteúdo sociocultural aplicado à argumentação.',
            tempo: 'Complementar',
            cor: 'from-pink-500 to-rose-600',
            bg: 'from-[#2e0916]/80 to-[#120308]',
            shadow: 'shadow-[0_0_40px_rgba(236,72,153,0.15)]',
            icon: (
                <div className="w-20 h-20 flex items-center justify-center rounded-[2rem] bg-pink-500/10 mb-8 border border-pink-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-10 h-10 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                </div>
            ),
            etapas: ['Cinema e Sociologia', 'Filosofia Prática', 'Guerra Fria Geopolítica']
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto py-8">
            <div className="mb-16 text-center">
                <div className="inline-flex items-center gap-2 text-white/40 mb-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/70">Jornadas Estruturadas</span>
                </div>
                <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white mb-6">
                    Trilhas de <br /><span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Aprendizado.</span>
                </h1>
                <p className="text-white/50 text-base max-w-xl mx-auto">Navegue pelas rotas projetadas para solidificar seu conhecimento de forma estratégica, sem se perder no universo de informações.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TRILHAS.map((trilha, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15, duration: 0.6, ease: 'easeOut' }}
                        className={`relative rounded-[2.5rem] p-10 h-full flex flex-col bg-gradient-to-b ${trilha.bg} border border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden group ${trilha.shadow}`}
                    >
                        {/* Elegant minimalist bg effect */}
                        <div className={`absolute top-0 right-0 w-[200%] h-[200%] bg-gradient-to-bl ${trilha.cor} opacity-5 rounded-full blur-[100px] group-hover:opacity-15 transition-opacity duration-700 pointer-events-none -translate-y-1/2 translate-x-1/2`} />

                        {trilha.icon}

                        <div className="relative z-10 flex-1 flex flex-col">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-3 leading-none">{trilha.titulo}</h2>
                            <p className="text-sm text-white/50 leading-relaxed mb-8 flex-1">
                                {trilha.desc}
                            </p>

                            <div className="space-y-4 mb-10 mt-auto">
                                {trilha.etapas.map((etapa, eIdx) => (
                                    <div key={eIdx} className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${trilha.cor} shadow-[0_0_10px_currentColor]`} />
                                        <span className="text-xs text-white/70 font-medium tracking-wide uppercase">{etapa}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full relative overflow-hidden py-4 rounded-2xl border border-white/10 text-white font-black text-xs uppercase tracking-widest transition-all group-hover:border-transparent">
                                <span className="relative z-10">Desbloquear Caminho</span>
                                <div className={`absolute inset-0 bg-gradient-to-r ${trilha.cor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
