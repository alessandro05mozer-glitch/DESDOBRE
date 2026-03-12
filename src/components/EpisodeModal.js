import { html } from 'htm/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function EpisodeModal({ season, subject, onClose }) {
    if (!season) return null;

    const [activeTab, setActiveTab] = useState('episodes'); // 'episodes' | 'related'

    return html`
        <${AnimatePresence}>
            <${motion.div} 
                className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 md:p-8"
                initial=${{ opacity: 0 }}
                animate=${{ opacity: 1 }}
                exit=${{ opacity: 0 }}
                onClick=${onClose}
            >
                <${motion.div}
                    className="bg-[#181818] w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
                    initial=${{ scale: 0.9, y: 50 }}
                    animate=${{ scale: 1, y: 0 }}
                    exit=${{ scale: 0.9, y: 50 }}
                    onClick=${e => e.stopPropagation()}
                >
                    <button 
                        onClick=${onClose}
                        className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth=${2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="relative aspect-video w-full bg-black group cursor-pointer">
                            <img src=${season.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white fill-current" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-lg">${season.title}</h2>
                                <div className="flex items-center gap-4 text-sm font-bold text-gray-300">
                                    <span className="text-green-400">${season.matchScore}% Relevante</span>
                                    <span>${season.year}</span>
                                    <span className="border border-gray-500 px-1 text-xs rounded">${season.maturityRating}</span>
                                    <span>${season.episodes.length} Episódios</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 grid md:grid-cols-[2fr_1fr] gap-8">
                            <div>
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-white mb-2">Sinopse da Temporada</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                        ${season.synopsis} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Episódios</h3>
                                <div className="space-y-4">
                                    ${season.episodes.map((ep, idx) => html`
                                        <div key=${ep.id} className="flex gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div className="flex items-center justify-center text-2xl font-bold text-gray-500 w-8">
                                                ${idx + 1}
                                            </div>
                                            <div className="relative w-32 aspect-video bg-zinc-800 rounded overflow-hidden flex-none">
                                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-black"></div>
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-base flex justify-between">
                                                    ${ep.title}
                                                    <span className="text-xs font-normal text-gray-400">${ep.est}</span>
                                                </h4>
                                                <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                                                    ${ep.description || "Conteúdo profundo sobre este tópico essencial para sua formação."}
                                                </p>
                                            </div>
                                        </div>
                                    `)}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-gray-500 text-sm block mb-1">Disciplina:</span>
                                    <span className="text-white hover:underline cursor-pointer">${subject.title}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm block mb-1">Tags:</span>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs text-gray-300 bg-white/10 px-2 py-1 rounded">ENEM</span>
                                        <span className="text-xs text-gray-300 bg-white/10 px-2 py-1 rounded">Vestibular</span>
                                        <span className="text-xs text-gray-300 bg-white/10 px-2 py-1 rounded">Intensivo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <//>
            <//>
        <//>
    `;
}
