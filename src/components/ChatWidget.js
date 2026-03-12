import { html } from 'htm/react';
import { useState, useRef, useEffect } from 'react';

// ATENÇÃO: Em produção real, isso deve ser feito via Backend (Netlify Functions)
// Para demo local No-Build, o usuário precisará inserir a chave ou usar o Mock.
const GEMINI_API_KEY = localStorage.getItem('DESDOBRE_GEMINI_KEY') || '';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Olá! Sou seu Mentor DESDOBRE. Como posso ajudar nos seus estudos hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState(GEMINI_API_KEY);
    const messagesEndRef = useRef(null);

    // Scroll para o fim
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Lógica de Resposta (Mock ou Real)
        try {
            if (!apiKey) {
                // Modo Mock / Setup
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: 'model',
                        text: 'Para funcionar com inteligência real, preciso de uma API Key do Google Gemini. Configure clicando na engrenagem acima.'
                    }]);
                    setIsLoading(false);
                }, 1000);
            } else {
                // Chamada Real à API (Client-Side - Apenas para Demo Local)
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `
                            Você é o Mentor Educacional do DESDOBRE. 
                            Use Método Socrático. Responda de forma concisa e encorajadora.
                            Aluno perguntou: ${input}
                        ` }]
                        }]
                    })
                });

                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, tive um erro de conexão.";

                setMessages(prev => [...prev, { role: 'model', text: text }]);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: "Erro ao conectar com o Mentor. Tente novamente." }]);
            setIsLoading(false);
        }
    };

    const saveKey = (key) => {
        localStorage.setItem('DESDOBRE_GEMINI_KEY', key);
        setApiKey(key);
        alert('Chave salva! O Mentor agora está ativo.');
    };

    return html`
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            ${isOpen && html`
                <div className="mb-4 w-80 md:w-96 h-[500px] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                    <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center">
                                <span className="text-xs font-bold">IA</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Mentor IA</h3>
                                <p className="text-xs text-green-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick=${() => {
                const key = prompt('Insira sua Google Gemini API Key:');
                if (key) saveKey(key);
            }}
                            className="text-gray-400 hover:text-white p-1"
                            title="Configurar API Key"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        ${messages.map((msg, idx) => html`
                            <div key=${idx} className="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
                                <div className="max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-brand-purple text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}">
                                    ${msg.text}
                                </div>
                            </div>
                        `)}
                        ${isLoading && html`
                            <div className="flex justify-start">
                                <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none flex gap-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        `}
                        <div ref=${messagesEndRef}></div>
                    </div>

                    <div className="p-3 bg-black/20 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value=${input}
                                onInput=${(e) => setInput(e.target.value)}
                                onKeyDown=${(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Digite sua dúvida..."
                                className="flex-1 bg-gray-900 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-purple transition-colors"
                            />
                            <button 
                                onClick=${handleSend}
                                disabled=${!input.trim() || isLoading}
                                className="p-2 bg-brand-purple rounded-full text-white disabled:opacity-50 hover:bg-brand-purple/80 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `}

            <button 
                onClick=${() => setIsOpen(!isOpen)}
                className="group w-14 h-14 bg-gradient-to-tr from-brand-purple to-brand-blue rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
            >
                ${isOpen
            ? html`<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth=${2} d="M6 18L18 6M6 6l12 12" /></svg>`
            : html`<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth=${2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>`
        }
            </button>
        </div>
    `;
}
