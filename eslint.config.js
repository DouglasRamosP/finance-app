import js from '@eslint/js'
import globals from 'globals'

export default [
    // 1) Ignora pastas que não queremos lintear
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'coverage/**',
            'src/generated/prisma/**', // 🔥 Prisma Client gerado
        ],
    },

    // 2) Config recomendada do ESLint
    js.configs.recommended,

    // 3) Regras pro seu código
    {
        files: ['src/**/*.js', 'tests/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
    },
]
