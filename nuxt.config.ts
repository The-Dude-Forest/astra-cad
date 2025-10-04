export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	modules: [
		'@nuxt/eslint',
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxtjs/tailwindcss',
		'@nuxtjs/color-mode',
		'shadcn-nuxt',
	],
	colorMode: {
		classSuffix: '',
		preference: 'dark',
		fallback: 'dark',
	},
	app: {
		baseURL: '',
		pageTransition: { name: 'page', mode: 'out-in' },
		layoutTransition: { name: 'layout', mode: 'out-in' },
	},
	vite: {
		server: {
			watch: {
				ignored: [
					'**/node_modules/**',
					'**/.git/**',
					'**/public/**',
					'**/.output/**',
					'**/assets/**',
					'**/dist/**',
				],
			},
		},
		base: '',
	},
	shadcn: {
		prefix: '',
		componentDir: './components/ui',
	},
});
