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
        '@kevinmarrec/nuxt-pwa'
    ],

    pinia: {
        storesDirs: ['./stores/**'],
    },

    pwa: {
        workbox: {
            enabled: true
        },
        manifest: {
            name: 'Le Spawn',
            short_name: 'le_spawn',
            description: 'Toute ta collection au même endroit !',
            lang: 'fr',
            theme_color: '#f23f3a',
            icons: [
                {
                    src: '/Logo_192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: '/Logo_512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ]
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
