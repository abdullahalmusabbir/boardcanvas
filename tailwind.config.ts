import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
        fontFamily: {
            sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        },
        colors: {
            primary: '#0a0a0f',
            secondary: '#111118',
            card: '#16161f',
        },
        },
    },
    plugins: [],
};

export default config;