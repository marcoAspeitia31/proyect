// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"],

  supabase: {
    redirect: true,
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL ?? "http://localhost:3000",
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-09-20",
});