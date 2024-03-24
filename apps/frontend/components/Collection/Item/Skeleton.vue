<script setup lang="ts">
import { Skeleton } from '~/components/ui/skeleton';
</script>

<template>
    <div class="mt-2 w-full">

        <div class="flex justify-between gap-2">
            <Skeleton class="h-8 w-1/2 bg-zinc-500" />
            <Skeleton class="h-8 w-8 bg-zinc-500" />
        </div>

        <div class="mt-4 flex flex-col gap-2">

            <Skeleton class="h-20 w-full bg-zinc-500" />
            <Skeleton class="h-20 w-full bg-zinc-500" />
            <Skeleton class="h-20 w-full bg-zinc-500" />

        </div>

    </div>
</template>

<style scoped>
.grobold {
    font-family: 'Grobold', sans-serif;
}
</style>
