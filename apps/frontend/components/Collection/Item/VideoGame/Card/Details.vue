<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import CollectionsService, { type VideoGame } from '~/services/collections.service';

const props = defineProps<{
    videoGame: VideoGame;
}>();

const photosExtra = computed(() => {
    return props.videoGame.extraContents.map((content) => content.photos.map((url) => url)).flat();
});

const loading = ref(false);

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

const displayStateLabel = (state: string) => {
    switch (state) {
        case 'NEW':
            return 'neuf';
        case 'MINT':
            return 'mint';
        case 'GOOD':
            return 'bon';
        case 'BAD':
            return 'mauvais';
        case 'PARTS':
            return 'pour pièces';
        default:
            return '❓';
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

const collectionsService = new CollectionsService();
const handleDeleteVideoGame = async () => {
    const confirm = window.confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?');
    if (!confirm) return;

    try {
        loading.value = true;
        await collectionsService.deleteVideoGame(props.videoGame.id);
        window.location.reload();
    } catch (error) {
        alert('Une erreur est survenue lors de la suppression du jeu.');
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div id="Card" class="flex flex-col gap-4 overflow-hidden py-4">

        <Carousel class="relative w-full cursor-grab" :opts="{ align: 'start' }">
            <CarouselContent>
                <CarouselItem v-for="(url, index) in videoGame.photosGame" :key="index" class="basis-1/2 lg:basis-1/3">
                    <Card class="relative">
                        <CardContent class="flex aspect-square items-center justify-center overflow-hidden rounded p-0">
                            <img :src="url" alt="url" class="h-full w-full object-cover" />
                            <div class="sticker">
                                <Icon name="mingcute:album-line" />
                                <span>Jeu</span>
                            </div>
                        </CardContent>
                    </Card>
                </CarouselItem>
                <CarouselItem v-for="(url, index) in videoGame.photosBox" :key="index" class="basis-1/2 lg:basis-1/3">
                    <Card class="relative">
                        <CardContent class="flex aspect-square items-center justify-center overflow-hidden rounded p-0">
                            <img :src="url" alt="url" class="h-full w-full object-cover" />
                            <div class="sticker">
                                <Icon name="mingcute:box-line" />
                                <span>Boîte</span>
                            </div>
                        </CardContent>
                    </Card>
                </CarouselItem>
                <CarouselItem v-for="(url, index) in photosExtra" :key="index" class="basis-1/2 lg:basis-1/3">
                    <Card class="relative">
                        <CardContent class="flex aspect-square items-center justify-center overflow-hidden rounded p-0">
                            <img :src="url" alt="url" class="h-full w-full object-cover" />
                            <div class="sticker">
                                <Icon name="mingcute:attachment-line" />
                                <span>Extra</span>
                            </div>
                        </CardContent>
                    </Card>
                </CarouselItem>
            </CarouselContent>
        </Carousel>

        <table id="Contents" class="w-full table-fixed whitespace-nowrap text-center text-sm">
            <thead>
                <tr>
                    <td class="border-r">
                        <span class="mr-1">Boîte</span>
                        <Icon name="mingcute:dropbox-fill" />
                    </td>
                    <td class="border-r">
                        <span class="mr-1">Jeu</span>
                        <Icon name="mingcute:album-line" />
                    </td>
                    <!-- <td>
                        <span class="mr-1">Extras</span>
                        <Icon name="mingcute:attachment-2-fill" />
                    </td> -->
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
                    <!-- <td>
                        <span class="font-semibold" v-if="videoGame.extraContents.length">
                            {{ videoGame.extraContents.length }}
                            {{ videoGame.extraContents.length > 1 ? 'objets' : 'objet' }}
                        </span>
                        <span class="font-semibold" v-else>aucun</span>
                    </td> -->
                </tr>
            </tbody>
        </table>

        <div>
            <h3 class="font-acephimere font-semibold">Extras</h3>
            <ul v-if="videoGame.extraContents.length" class="mt-2">
                <li v-for="(content, index) in videoGame.extraContents" :key="index">
                    <span>👉 {{ content.name }} (état {{ displayStateLabel(content.state) }})</span>
                </li>
            </ul>
            <p v-else>Aucun contenu supplémentaire renseigné.</p>
        </div>

        <div class="mt-2 flex flex-col gap-2">
            <Button>
                Modifier
            </Button>
            <Button variant="secondary" @click="handleDeleteVideoGame">
                Supprimer
            </Button>
        </div>

    </div>
</template>

<style scoped>
.sticker {
    @apply absolute bottom-1 left-1 rounded bg-white px-2 py-1 text-primary text-xs font-bold flex items-center gap-1;
}
</style>
