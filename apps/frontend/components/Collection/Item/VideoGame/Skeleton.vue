<script setup lang="ts">
import { Skeleton } from '~/components/ui/skeleton';

const videoGame = {
    title: 'The Legend of Zelda: Breath of the Wild',
    Box: {
        stateBox: 'mint'
    },
    Game: {
        stateGame: 'mint'
    },
    extraContents: [
        {
            id: 1,
            name: 'Artbook'
        },
        {
            id: 2,
            name: 'Soundtrack'
        }
    ]
};
</script>

<template>
    <div class="flex h-24 w-full gap-2 overflow-hidden rounded-lg p-1">

        <Skeleton class="aspect-square h-auto" />

        <div id="Details" class="flex grow flex-col gap-2 overflow-hidden">
            <Skeleton class="h-6" />

            <div class="flex grow gap-1">
                <Skeleton class="w-full" />
                <Skeleton class="w-full" />
                <Skeleton class="w-full" />
            </div>

        </div>

    </div>
</template>

<style scoped>
.grobold {
    font-family: 'Grobold', sans-serif;
}
</style>
