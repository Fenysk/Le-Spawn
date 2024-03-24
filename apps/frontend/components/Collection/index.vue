<script setup lang="ts">
import type { Collection } from '~/services/collectionsService';

defineProps<{
    collection: Collection
}>()
</script>

<template>
    <div class="relative h-32 w-full translate-x-2 rotate-2 rounded-3xl bg-black">
        <NuxtLink :to="`/collections/${collection.id}`"
            class="absolute left-0 top-0 flex h-32 w-full -translate-x-1 -rotate-2 items-center justify-center rounded-3xl bg-secondary">
            <h2 class="text-xl drop-shadow-flatWhite">{{ collection.name }}</h2>
        </NuxtLink>
    </div>
</template>
