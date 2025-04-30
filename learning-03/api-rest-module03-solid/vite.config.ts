import { defineConfig } from 'vitest/config'
import tsconfigsPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [tsconfigsPaths()],
	test: {
		dir: 'src',
		workspace: [
			{
				extends: true,
				test: {
					name: 'unit',
					dir: 'src/use-case'
				}
			},
			{
				extends: true,
				test: {
					name: 'e2e',
					dir: 'src/http/controllers',
					environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
				}
			}
		]
	}
})