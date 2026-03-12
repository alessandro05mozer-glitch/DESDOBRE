import { html } from 'htm/react';
import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export default function PhysicsHero() {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const [hasDropped, setHasDropped] = useState(false);

    useEffect(() => {
        if (!sceneRef.current) return;

        // --- Configuração do Matter.js ---
        const Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint,
            Runner = Matter.Runner;

        const engine = Engine.create();
        engineRef.current = engine;

        // Gravidade Zero inicial
        engine.world.gravity.y = 0;
        engine.world.gravity.x = 0;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight * 0.6, // 60vh
                wireframes: false,
                background: 'transparent',
                pixelRatio: window.devicePixelRatio
            }
        });

        // --- Criação dos Orbes (Assuntos) ---
        const subjects = [
            { label: 'História', color: '#f59e0b', radius: 40 },
            { label: 'Geografia', color: '#10b981', radius: 35 },
            { label: 'Física', color: '#0ea5e9', radius: 45 },
            { label: 'Química', color: '#8b5cf6', radius: 38 },
            { label: 'Biologia', color: '#16a34a', radius: 42 },
            { label: 'Matemática', color: '#3b82f6', radius: 50 },
            { label: 'Filosofia', color: '#7c3aed', radius: 36 },
            { label: 'Sociologia', color: '#db2777', radius: 34 }
        ];

        const bodies = subjects.map(subj => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.6);

            return Bodies.circle(x, y, subj.radius, {
                render: {
                    fillStyle: subj.color,
                    strokeStyle: '#ffffff',
                    lineWidth: 2
                },
                restitution: 0.9, // Quicante
                frictionAir: 0.02, // Resistência do ar para movimento suave
                label: subj.label
            });
        });

        // Paredes invisíveis para conter os orbes
        const wallOptions = { isStatic: true, render: { visible: false } };
        const width = window.innerWidth;
        const height = window.innerHeight * 0.6;

        const walls = [
            Bodies.rectangle(width / 2, -50, width, 100, wallOptions), // Teto
            Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions), // Chão
            Bodies.rectangle(-50, height / 2, 100, height, wallOptions), // Esquerda
            Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions) // Direita
        ];

        World.add(engine.world, [...bodies, ...walls]);

        // --- Interação com Mouse ---
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        World.add(engine.world, mouseConstraint);
        render.mouse = mouse; // Sincronizar coordenadas

        // Iniciar Simulação
        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        // --- Loop de Animação Customizado (Flutuação) ---
        // Aplicar pequenas forças aleatórias para simular flutuação em gravidade zero
        const floatInterval = setInterval(() => {
            if (engine.world.gravity.y === 0) { // Só flutua se não tiver gravidade
                bodies.forEach(body => {
                    Matter.Body.applyForce(body, body.position, {
                        x: (Math.random() - 0.5) * 0.002,
                        y: (Math.random() - 0.5) * 0.002
                    });
                });
            }
        }, 100);

        // Cleanup
        return () => {
            clearInterval(floatInterval);
            Render.stop(render);
            Runner.stop(runner);
            if (render.canvas) render.canvas.remove();
            World.clear(engine.world);
            Engine.clear(engine);
        };
    }, []);

    // Função "The Drop"
    const handleDrop = () => {
        if (!engineRef.current) return;

        // Ativar Gravidade
        engineRef.current.world.gravity.y = 1;
        setHasDropped(true);

        // Scroll suave para o conteúdo após breve delay
        setTimeout(() => {
            window.scrollTo({
                top: window.innerHeight * 0.6,
                behavior: 'smooth'
            });
        }, 800);
    };

    return html`
        <div className="relative h-[60vh] w-full border-b border-white/5 mb-8 overflow-hidden bg-gradient-radial from-[#1a1a1a] to-black">
            <div ref=${sceneRef} className="absolute inset-0 z-0"></div>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-center space-y-6 ${hasDropped ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} transition-all duration-700">
                    <h1 className="text-5xl md:text-7xl font-display font-bold drop-shadow-2xl">
                        Descubra o seu <br />
                        <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">Potencial</span>
                    </h1>
                    <p className="text-gray-300 text-lg max-w-xl mx-auto drop-shadow-md">
                        O universo do conhecimento em um só lugar. Toque nos orbes ou inicie a jornada.
                    </p>
                    
                    <button 
                        onClick=${handleDrop}
                        className="pointer-events-auto px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-300"
                    >
                        Iniciar Jornada
                    </button>
                </div>
            </div>
        </div>
    `;
}
