<script setup>
useSeoMeta({
    description: 'Toute ta collection dans un seul endroit !',
})

const NODE_ENV = useRuntimeConfig().public.NODE_ENV;
</script>

<template>
    <NuxtLayout>
        <div class="fixed -right-14 bottom-1 z-[9999] -rotate-[30deg] border border-black bg-secondary px-16 py-1 font-semibold drop-shadow-flat" >
            {{ NODE_ENV === 'development' ? 'DEV' : 'BETA' }}
        </div>
        <NuxtPage />
    </NuxtLayout>
</template>
