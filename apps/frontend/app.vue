<script setup>
useSeoMeta({
    title: 'Le Spawn',
    description: 'Toute ta collection dans un seul endroit !'
})

useHead({
    htmlAttrs: {
        lang: 'fr',
    }
})

const NODE_ENV = useRuntimeConfig().public.NODE_ENV;
const BETA_MODE = useRuntimeConfig().public.BETA_MODE;

const displayApp = NODE_ENV === 'development' || BETA_MODE === 'true';
</script>

<template>
    <NuxtLayout v-if="displayApp">
        <div class="fixed -right-14 bottom-1 z-[9999] -rotate-[30deg] bg-secondary px-16 py-1 font-semibold drop-shadow-flat">
            BETA
        </div>
        <NuxtPage />
    </NuxtLayout>

    <div v-else>
        <BetaLandingPage />
    </div>
</template>
