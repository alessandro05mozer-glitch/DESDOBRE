import { html } from 'htm/react';
import { motion } from 'framer-motion';

export default function SeasonCard({ season, subjectColor, onClick }) {
    const isLocked = season.isLocked;

    return html`
        <${motion.div} 
            className="relative flex-none w-[280px] md:w-[320px] aspect-video bg-[#202020] rounded-md overflow-hidden cursor-pointer group mr-2"
            whileHover=${!isLocked ? { scale: 1.05, zIndex: 10, transition: { duration: 0.2 } } : {}}
            transition=${{ duration: 0.2 }}
            onClick=${!isLocked ? onClick : undefined}
            layoutId=${season.id}
        >
            <!-- Imagem de Fundo -->
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style=${{ backgroundImage: !isLocked ? `url(${season.thumbnail})` : 'none', opacity: isLocked ? 0.3 : 0.9 }}
            ></div>

            <!-- Gradiente de Leitura -->
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            ${isLocked && html`
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-[1px]">
                   <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold border border-gray-600 px-2 py-1 rounded">Em Breve</span>
                </div>
            `}

            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end h-full">
                <h3 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-2">
                    ${season.title}
                </h3>
                
                ${!isLocked && html`
                    <div className="flex items-center gap-3 text-[11px] font-medium text-gray-300 mt-2 opacity-100 transition-all duration-300">
                        <span className="text-green-500 font-bold">${season.matchScore}% Relevante</span>
                        <span className="border border-white/30 px-1 py-0.5 rounded text-[9px] text-white/80">HD</span>
                        <span>${season.episodes.length} Episódios</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto">
                       <span className="text-[10px] text-gray-400">Teoria</span>
                       <span className="text-[10px] text-gray-500">•</span>
                       <span className="text-[10px] text-gray-400">Prática</span>
                    </div>
                `}
            </div>
        <//>
    `;
}
