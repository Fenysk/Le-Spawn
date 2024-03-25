export default defineNuxtConfig({
    devtools: { enabled: false },
    
    modules: [
        '@nuxtjs/tailwindcss',
        'shadcn-nuxt',
        'nuxt-icon',
        '@pinia/nuxt'
    ],

    pinia: {
        storesDirs: ['./stores/**'],
    },

    routeRules: {
        '/': { ssr: true },
    },

    runtimeConfig: {
        public: {
            API_URL: process.env.API_URL,
            NODE_ENV: process.env.NODE_ENV,

            googleTagManager: {
                id: process.env.GOOGLE_TAG_MANAGER_ID,
            }
        }
    },

    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: '',

        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: './components/ui'
    },

    ssr: false,
})
