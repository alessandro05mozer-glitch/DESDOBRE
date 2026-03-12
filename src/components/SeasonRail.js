import { html } from 'htm/react';
import SeasonCard from './SeasonCard.js';

export default function SeasonRail({ subject, title }) {
    return html`
        <div className="mb-12 pl-4 md:pl-16 relative z-30">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3 drop-shadow-md hover:text-gray-200 transition-colors cursor-pointer group/title">
                ${title}
                <span className="text-xs text-blue-400 opacity-0 group-hover/title:opacity-100 transition-opacity transform translate-x-[-10px] group-hover/title:translate-x-0 duration-300">Explorar tudo ></span>
            </h2>
            
            <div className="relative group/rail">
                <div className="flex gap-4 overflow-x-auto pb-10 pt-4 px-4 -mx-4 hide-scrollbar scroll-smooth snap-x">
                    ${subject.seasons && subject.seasons.map(season => html`
                        <div key=${season.id} className="snap-start pointer-events-auto">
                            <${SeasonCard} 
                                season=${season} 
                                subjectColor=${subject.color} 
                                onClick=${() => window.dispatchEvent(new CustomEvent('open-episode-modal', { detail: { season, subject } }))} 
                            />
                        </div>
                    `)}
                </div>

                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-30"></div>
            </div>
        </div>
    `;
}
