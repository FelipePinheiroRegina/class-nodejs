import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
	{ 
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.node },
		rules: {
			indent: ['error', 'tab'],  // Usa tabulação para indentação
			semi: ['error', 'never'],   // Sem ponto e vírgula no final
			quotes: ['error', 'single'] // Usa aspas simples para strings
		}
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
]
