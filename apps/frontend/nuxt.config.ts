export default defineNuxtConfig({
    app: {
        head: {
            title: 'Le Spawn',
            titleTemplate: '%s | Le Spawn',
            htmlAttrs: {
                lang: 'fr',
            },
        }
    },

    devtools: { enabled: false },
    
    modules: [
        '@nuxtjs/tailwindcss',
        'shadcn-nuxt',
        'nuxt-icon',
        '@pinia/nuxt',
        'nuxt-highcharts',
        '@vite-pwa/nuxt'
    ],

    pinia: {
        storesDirs: ['./stores/**'],
    },

    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Le Spawn',
            short_name: 'Le Spawn',
            description: 'Toute ta collection au même endroit !',
            theme_color: '#f23f3a',
            background_color: '#f23f3a',
            lang: 'fr',
            icons: [
                {
                    src: '/Logo_192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any'
                    
                },
                {
                    src: '/Logo_512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any'
                },
            ],
            scope: '/',
            start_url: '/',
            orientation: 'portrait',
            display: 'fullscreen',
            id: 'le-spawn.fr',
            categories: ['collection', 'jeux vidéo', 'manga', 'figurines', 'cartes'],
        },
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
