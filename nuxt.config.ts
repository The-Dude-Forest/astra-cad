export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@pinia/nuxt",
    [
      "pinia-plugin-persistedstate/nuxt",
      {
        storage: "localStorage",
      },
    ],
  ],
  app: {
    baseURL: "",
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
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
