export default defineNuxtConfig({
    devtools: { enabled: false },
    
    modules: [
        '@nuxtjs/tailwindcss',
        'shadcn-nuxt',
        'nuxt-icon',
    ],

    routeRules: {
        '/': {static: true},
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
    }
})
