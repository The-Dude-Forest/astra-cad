export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "shadcn-nuxt",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
});

