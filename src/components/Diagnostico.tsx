import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Diagnostico({ onNavigate }: { onNavigate: (v: string, id?: string) => void }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const questions = [
        {
            q: "Como você se sente em relação à sua base em Matemática?",
            opts: [
                { id: 'a', text: 'Sólida, só preciso focar na TRI (Estatística, Geometria).', val: 'tri_natureza' },
                { id: 'b', text: 'Tenho buracos grandes em Frações, Porcentagem e Básica.', val: 'base' },
                { id: 'c', text: 'Na média, erro por falta de atenção.', val: 'redacao900' }
            ]
        },
        {
            q: "Qual sua principal trava na Redação do ENEM?",
            opts: [
                { id: 'a', text: 'Falta de Repertório Sociocultural forte.', val: 'redacao900' },
                { id: 'b', text: 'Estruturação dos parágrafos D1 e D2.', val: 'redacao900' },
                { id: 'c', text: 'Tiro sempre 900+, quero gabaritar.', val: 'tri_natureza' }
            ]
        },
        {
            q: "Sobre Ciências da Natureza...",
            opts: [
                { id: 'a', text: 'Meu calcanhar de aquiles. Química e Física me derrubam.', val: 'base' },
                { id: 'b', text: 'Biologia me salva, mas caio em Exatas.', val: 'tri_natureza' }
            ]
        }
    ];

    const handleSubmit = (finalAnswer: string) => {
        const finalAnswers = { ...answers, [step]: finalAnswer };
        setAnswers(finalAnswers);

        const cnt: Record<string, number> = {};
        Object.values(finalAnswers).forEach((v: string) => { cnt[v] = (cnt[v] || 0) + 1; });
        const res = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0] || 'base';

        localStorage.setItem('desdobre_diagnostic', JSON.stringify({
            done: true,
            date: new Date().toISOString(),
            answers: finalAnswers,
            result: res
        }));

        toast.success('GPS atualizado!');
        setStep(4); // result step
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-6">
            <div className="flex flex-col items-center justify-center text-center mb-16">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#06b6d4] mb-4 bg-cyan-900/30 px-4 py-1.5 rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    Calibração GPS
                </div>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-6">
                    Mapeamento <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic">Intel.</span>
                </h1>
                <p className="text-white/50 text-sm max-w-lg mb-8">Baseado em telemetria reversa. Responda com honestidade para que o DESDOBRE recalcule a Rota Ótima da sua aprovação.</p>

                {/* Progress bar */}
                <div className="w-full max-w-md bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                        style={{ width: `${Math.min(((step) / questions.length) * 100, 100)}%` }}
                    />
                </div>
            </div>

            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    {step < questions.length ? (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4 }}
                            className="bg-[#121526] rounded-3xl p-8 sm:p-12 border border-white/5 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full" />
                            <h2 className="text-2xl font-bold text-white mb-10 leading-tight">
                                {questions[step].q}
                            </h2>
                            <div className="space-y-4 relative z-10">
                                {questions[step].opts.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => {
                                            if (step === questions.length - 1) {
                                                handleSubmit(opt.val);
                                            } else {
                                                setAnswers(prev => ({ ...prev, [step]: opt.val }));
                                                setStep(s => s + 1);
                                            }
                                        }}
                                        className="w-full text-left p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-cyan-500/50 bg-[#0d0f1a] hover:bg-cyan-900/10 text-white/70 hover:text-white transition-all group flex items-start gap-4"
                                    >
                                        <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-cyan-400 group-hover:bg-cyan-400/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="font-medium text-sm leading-relaxed">{opt.text}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-[#0c1626] to-[#120516] rounded-3xl p-8 sm:p-12 border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.05)] text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
                            <div className="text-6xl mb-6 mt-4">🎯</div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2 relative z-10">
                                Rota Recalibrada.
                            </h2>
                            <p className="text-white/50 mb-10 text-sm max-w-sm mx-auto relative z-10">O motor do DESDOBRE analisou suas fragilidades e determinou suas prioridades absolutas.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 relative z-10">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                                    <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest mb-3">Prioridade 1</span>
                                    <span className="text-lg font-bold text-white text-center">Trilha Base</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                                    <span className="text-[10px] font-black uppercase text-rose-400 tracking-widest mb-3">Prioridade 2</span>
                                    <span className="text-lg font-bold text-white text-center">Redação 900+</span>
                                </div>
                            </div>

                            <button
                                onClick={() => onNavigate('trilhas')}
                                className="px-8 py-4 bg-white hover:bg-gray-200 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 relative z-10"
                            >
                                Iniciar Trilhas Específicas
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
