// Mocks globais para silenciar erros do IDE quando o node_modules está ausente
declare module 'react' {
    export const useState: <T>(initial: T | (() => T)) => [T, (val: T | ((prev: T) => T)) => void];
    export const useEffect: (effect: () => void | (() => void), deps?: any[]) => void;
    export const useRef: <T>(initial?: T) => { current: T };
    export const useMemo: <T>(factory: () => T, deps?: any[]) => T;
    export const useCallback: <T extends (...args: any[]) => any>(callback: T, deps?: any[]) => T;
    export const createContext: (initial: any) => any;
    export const StrictMode: any;
    const React: any;
    export default React;
}

declare module 'react-dom/client' {
    export const createRoot: (container: HTMLElement | null) => { render: (element: any) => void };
}

declare module 'react/jsx-runtime' {
    export const jsx: any;
    export const jsxs: any;
    export const Fragment: any;
}

declare module 'framer-motion' {
    export const motion: any;
    export const AnimatePresence: any;
}

declare module 'vite' {
    export const defineConfig: (config: any) => any;
}

declare module '@vitejs/plugin-react' {
    const react: any;
    export default react;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elem: string]: any;
        }
        interface Element { any: any; }
    }
}
