<script setup lang="ts">
const loading = ref(false);
</script>

<template>
    <div
        class="relative flex min-h-24 w-full items-center gap-2 overflow-hidden text-balance rounded-lg border px-8 pr-40 text-zinc-500 lg:justify-center">
        <span>Cette collection est bien vide...</span>
        <div class="absolute right-4 top-8 flex items-center text-zinc-500">
            <span>Ajoute un jeu ici</span>
            <Icon name="fluent:arrow-reply-32-regular" class="ml-2 rotate-90" size="16" />
        </div>
    </div>
</template>
