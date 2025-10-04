export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	ssr: false,
	devtools: { enabled: false },
	modules: [
		"@nuxt/eslint",
		"@nuxt/fonts",
		"@nuxt/icon",
		"@nuxtjs/tailwindcss",
		"@nuxtjs/color-mode",
		"shadcn-nuxt",
		"@pinia/nuxt",
		[
			"pinia-plugin-persistedstate/nuxt",
			{
				storage: "localStorage",
			},
		],
	],
	colorMode: {
		classSuffix: "",
		preference: "dark",
		fallback: "dark",
	},
	app: {
		baseURL: "",
		head: {
			meta: [
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
			],
		},
		pageTransition: { name: "page", mode: "out-in" },
		layoutTransition: { name: "layout", mode: "out-in" },
	},
	runtimeConfig: {
		public: {
			baseURL: process.env.NODE_ENV === "production" ? "../" : "./",
		},
	},
	vite: {
		server: {
			watch: {
				ignored: [
					"**/node_modules/**",
					"**/.git/**",
					"**/public/**",
					"**/.output/**",
					"**/assets/**",
					"**/dist/**",
				],
			},
		},
		base: "",
	},
	shadcn: {
		prefix: "",
		componentDir: "./components/ui",
	},
});
