<script setup lang="ts">
import type { VideoGame } from '~/services/collections.service';

const loading = ref(false);

const props = defineProps<{
    videoGame: VideoGame;
}>()

const alertGame = () => {
    alert(props.videoGame.id);
}

const bannerImage = computed(() => props.videoGame.mainPhoto || 'https://via.placeholder.com/500x500');

const displayStateBoxLabel = (state: string) => {
    switch (state) {
        case 'NEW':
            return 'Neuve';
        case 'MINT':
            return 'Mint';
        case 'GOOD':
            return 'Bonne';
        case 'BAD':
            return 'Mauvaise';
        case 'PARTS':
            return 'Pour pièces';
        default:
            return '🤔';
    }
};
const displayStateGameLabel = (state: string) => {
    switch (state) {
        case 'NEW':
            return 'Neuf';
        case 'MINT':
            return 'Mint';
        case 'GOOD':
            return 'Bon';
        case 'BAD':
            return 'Mauvais';
        case 'PARTS':
            return 'Pour pièces';
        default:
            return '🤔';
    }
};
const displayStateEmoji = (state: string) => {
    switch (state) {
        case 'NEW':
            return '✨';
        case 'MINT':
            return '🌟';
        case 'GOOD':
            return '👍';
        case 'BAD':
            return '👎';
        case 'PARTS':
            return '💔';
        default:
            return '❓';
    }
};
</script>

<template>
    <article class="flex h-24 w-full cursor-pointer overflow-hidden rounded-md border bg-white shadow" @click="alertGame">

        <img id="Picture" :src="bannerImage" :alt="'Photo de ' + videoGame.title"
            class="aspect-square h-auto object-cover" />

        <div id="Details" class="flex grow flex-col overflow-hidden">
            <span class="block truncate bg-secondary px-2 py-1 font-semibold">{{ videoGame.title }}</span>

            <table id="Contents" class="my-auto w-full table-fixed whitespace-nowrap text-center text-sm">
                <thead>
                    <tr>
                        <td class="border-r">
                            <span class="mr-1">Boîte</span>
                            <Icon name="mingcute:dropbox-fill" />
                        </td>
                        <td class="border-r">
                            <span class="mr-1">Jeu</span>
                            <Icon name="mingcute:radiobox-fill" />
                        </td>
                        <td>
                            <span class="mr-1">Extras</span>
                            <Icon name="mingcute:attachment-2-fill" />
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border-r">
                            <span>
                                {{ displayStateBoxLabel(videoGame.stateBox) }}
                                {{ displayStateEmoji(videoGame.stateBox) }}
                            </span>
                        </td>
                        <td class="border-r">
                            <span>
                                {{ displayStateGameLabel(videoGame.stateGame) }}
                                {{ displayStateEmoji(videoGame.stateGame) }}
                            </span>
                        </td>
                        <td>
                            <span class="font-semibold" v-if="videoGame.extraContents.length">
                                {{ videoGame.extraContents.length }}
                                {{ videoGame.extraContents.length > 1 ? 'objets' : 'objet' }}
                            </span>
                            <span class="font-semibold" v-else>aucun</span>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

    </article>
</template>

<style scoped>
.grobold {
    font-family: 'Grobold', sans-serif;
}
</style>
