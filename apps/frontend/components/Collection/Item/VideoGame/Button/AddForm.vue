<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import {
Select
} from '@/components/ui/select';
import { Loader2 } from 'lucide-vue-next';
import Label from '~/components/ui/label/Label.vue';
import CollectionsService from '~/services/collectionsService';
import PlatformsService, { type Platform } from '~/services/platformsService';
import UploadService from '~/services/uploadService';

const step = ref<number>(1);

const props = defineProps({
    collectionId: String,
})

const platforms = ref<Platform[]>([]);
const platformsLoading = ref(false);
const platformsService = new PlatformsService();
const fetchPlatforms = async () => {
    platformsLoading.value = true;
    try {
        platforms.value = await platformsService.getAllPlatforms();
    } catch (error) {
        alert('Une erreur est survenue lors de la récupération des plateformes');
    } finally {
        platformsLoading.value = false;
    }
}
onMounted(fetchPlatforms);

const imagesFiles = ref({
    photoFrontBox: {
        file: null,
        loading: false,
    },
    photoBackBox: {
        file: null,
        loading: false,
    },
    photoSideBox: {
        file: null,
        loading: false,
    },
    photoInsideBox: {
        file: null,
        loading: false,
    },
    photoFrontGame: {
        file: null,
        loading: false,
    },
    photoBackGame: {
        file: null,
        loading: false,
    },
});
const uploadLoading = computed(() => imagesFiles.value.photoFrontBox.loading || imagesFiles.value.photoBackBox.loading || imagesFiles.value.photoSideBox.loading || imagesFiles.value.photoInsideBox.loading || imagesFiles.value.photoFrontGame.loading || imagesFiles.value.photoBackGame.loading);

const uploadService = new UploadService();
const handleFileChange = async (key: string, event: Event | null) => {
    if (!event) {
        (newGameData.value as any)[key] = null;
        return (imagesFiles.value as any)[key].file = null
    };

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    (imagesFiles.value as any)[key].file = file;

    try {
        (imagesFiles.value as any)[key].loading = true;
        const url = await uploadService.uploadImage(file);
        return (newGameData.value as any)[key] = url;
    } catch (error) {
        console.error(error);
    } finally {
        (imagesFiles.value as any)[key].loading = false;
    }
}

const nextStep = () => ++step.value

const newGameData = ref({
    title: null,
    platformId: null,
    collectionId: props.collectionId,
    stateBox: null,
    stateGame: null,
    photoFrontBox: null,
    photoBackBox: null,
    photoSideBox: null,
    photoInsideBox: null,
    photoFrontGame: null,
    photoBackGame: null,
});

const hasBoxImages = computed(() => imagesFiles.value.photoFrontBox.file || imagesFiles.value.photoBackBox.file || imagesFiles.value.photoSideBox.file || imagesFiles.value.photoInsideBox.file);
const hasGameImages = computed(() => imagesFiles.value.photoFrontGame.file || imagesFiles.value.photoBackGame.file);

const gameStates = [
    { value: 'NEW', img: null, label: 'Neuf' },
    { value: 'MINT', img: null, label: 'Mint' },
    { value: 'GOOD', img: null, label: 'Bon' },
    { value: 'BAD', img: null, label: 'Mauvais' },
    { value: 'PARTS', img: null, label: 'Pour pièces' },
];

const boxStates = [
    { value: 'NEW', img: null, label: 'Neuve' },
    { value: 'MINT', img: null, label: 'Mint' },
    { value: 'GOOD', img: null, label: 'Bonne' },
    { value: 'BAD', img: null, label: 'Mauvaise' },
    { value: 'PARTS', img: null, label: 'Pour pièces' },
];

const loading = ref(false);
const collectionsService = new CollectionsService();
const handleRegisterGame = async () => {
    try {
        loading.value = true;
        await collectionsService.addNewVideoGameToCollection(newGameData.value)
        handleAddingNewGameSuccess();
    } catch (error) {
        alert('Une erreur est survenue lors de l\'ajout du jeu');
    } finally {
        loading.value = false;
    }
}

const emit = defineEmits(['addingNewGameSuccess']);
const handleAddingNewGameSuccess = () => {
    emit('addingNewGameSuccess');
}
</script>

<template>
    <div v-show="!platformsLoading" class="lg:px-0">

        <!-- <pre>{{ newGameData }}</pre> -->

        <form @submit.prevent="nextStep" v-show="step === 1" class="mt-4 flex flex-col gap-8">

            <div id="Box" class="flex flex-col gap-2">
                <Label class="flex items-center gap-1 px-4 font-semibold">Boîte
                    <Icon name="mingcute:dropbox-fill" size="20" />
                </Label>
                <Carousel class="w-full">
                    <CarouselContent class="px-8">

                        <CarouselItem class="basis-1/3 p-1">
                            <Card class="aspect-square overflow-hidden">
                                <CardContent class="relative h-full w-full p-0">
                                    <img v-if="newGameData.photoFrontBox" :src="newGameData.photoFrontBox"
                                        alt="Photo de la boîte (face avant)" class="h-full w-full object-cover"
                                        @click="handleFileChange('photoFrontBox', null)" />
                                    <div class="relative aspect-square overflow-hidden" v-else>
                                        <input type="file" id="photoFrontBox"
                                            class="absolute left-0 top-0 z-50 block h-full w-full object-cover opacity-0"
                                            accept="image/jpeg, image/png, image/gif, image/webp"
                                            @change="handleFileChange('photoFrontBox', $event)"
                                            :disabled="imagesFiles.photoFrontBox.loading" />
                                        <div class="absolute left-0 top-0 z-40 flex h-full w-full flex-col items-center justify-center bg-secondary"
                                            :class="imagesFiles.photoFrontBox.loading ? 'opacity-50' : ''">
                                            <Icon name=mingcute:camera-2-line size=24 class="mb-2 mt-1"
                                                v-if="!imagesFiles.photoFrontBox.loading" />
                                            <Loader2 class="h-24 animate-spin" v-else />
                                            <span class="text-sm font-bold">face avant</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>

                        <CarouselItem class="basis-1/3 p-1" v-if="hasBoxImages">
                            <Card class="aspect-square overflow-hidden">
                                <CardContent class="relative h-full w-full p-0">
                                    <img v-if="newGameData.photoBackBox" :src="newGameData.photoBackBox"
                                        alt="Photo de la boîte (face arrière)" class="h-full w-full object-cover"
                                        @click="handleFileChange('photoBackBox', null)" />
                                    <div class="relative aspect-square overflow-hidden" v-else>
                                        <input type="file" id="photoBackBox"
                                            class="absolute left-0 top-0 z-50 block h-full w-full object-cover opacity-0"
                                            accept="image/jpeg, image/png, image/gif, image/webp"
                                            @change="handleFileChange('photoBackBox', $event)"
                                            :disabled="imagesFiles.photoBackBox.loading" />
                                        <div class="absolute left-0 top-0 z-40 flex h-full w-full flex-col items-center justify-center bg-secondary text-xs"
                                            :class="imagesFiles.photoBackBox.loading ? 'opacity-50' : ''">
                                            <Icon name=mingcute:camera-2-line size=24 class="mb-2 mt-1"
                                                v-if="!imagesFiles.photoBackBox.loading" />
                                            <Loader2 class="h-24 animate-spin" v-else />
                                            <span class="font-bold">face arrière</span>
                                            <span class="text-[10px] opacity-70">(facultatif)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>

                        <CarouselItem class="basis-1/3 p-1" v-if="hasBoxImages">
                            <Card class="aspect-square overflow-hidden">
                                <CardContent class="relative h-full w-full p-0">
                                    <img v-if="newGameData.photoSideBox" :src="newGameData.photoSideBox"
                                        alt="Photo de la boîte (côté)" class="h-full w-full object-cover"
                                        @click="handleFileChange('photoSideBox', null)" />
                                    <div class="relative aspect-square overflow-hidden" v-else>
                                        <input type="file" id="photoSideBox"
                                            class="absolute left-0 top-0 z-50 block h-full w-full object-cover opacity-0"
                                            accept="image/jpeg, image/png, image/gif, image/webp"
                                            @change="handleFileChange('photoSideBox', $event)"
                                            :disabled="imagesFiles.photoSideBox.loading" />
                                        <div class="absolute left-0 top-0 z-40 flex h-full w-full flex-col items-center justify-center bg-secondary text-xs"
                                            :class="imagesFiles.photoSideBox.loading ? 'opacity-50' : ''">
                                            <Icon name=mingcute:camera-2-line size=24 class="mb-2 mt-1"
                                                v-if="!imagesFiles.photoSideBox.loading" />
                                            <Loader2 class="h-24 animate-spin" v-else />
                                            <span class="font-bold">côté / tranche</span>
                                            <span class="text-[10px] opacity-70">(facultatif)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>

                        <CarouselItem class="basis-1/3 p-1" v-if="hasBoxImages && newGameData.stateBox !== 'NEW'">
                            <Card class="aspect-square overflow-hidden">
                                <CardContent class="relative h-full w-full p-0">
                                    <img v-if="newGameData.photoInsideBox" :src="newGameData.photoInsideBox"
                                        alt="Photo de la boîte (intérieur)" class="h-full w-full object-cover"
                                        @click="handleFileChange('photoInsideBox', null)" />
                                    <div class="relative aspect-square overflow-hidden" v-else>
                                        <input type="file" id="photoInsideBox"
                                            class="absolute left-0 top-0 z-50 block h-full w-full object-cover opacity-0"
                                            accept="image/jpeg, image/png, image/gif, image/webp"
                                            @change="handleFileChange('photoInsideBox', $event)"
                                            :disabled="imagesFiles.photoInsideBox.loading" />
                                        <div class="absolute left-0 top-0 z-40 flex h-full w-full flex-col items-center justify-center bg-secondary text-xs"
                                            :class="imagesFiles.photoInsideBox.loading ? 'opacity-50' : ''">
                                            <Icon name=mingcute:camera-2-line size=24 class="mb-2 mt-1"
                                                v-if="!imagesFiles.photoInsideBox.loading" />
                                            <Loader2 class="h-24 animate-spin" v-else />
                                            <span class="font-bold">intérieur</span>
                                            <span class="text-[10px] opacity-70">(facultatif)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>

                <div class="flex-col gap-2 px-4" v-if="hasBoxImages">
                    <div class="flex w-full gap-1">
                        <div v-for="option in boxStates" :key="option.value"
                            class="relative flex aspect-square flex-1 flex-col items-center overflow-hidden rounded-lg bg-zinc-300">

                            <input type="radio" v-model="newGameData.stateBox" :value="option.value"
                                :id="`box-${option.value}`" class="peer sr-only" name="stateBox" required />

                            <label :for="`box-${option.value}`"
                                class="flex aspect-square h-full w-full cursor-pointer items-center justify-center rounded-lg border-2 border-transparent peer-checked:border-primary">
                                <img :src="option.img" class="max-h-full max-w-full" v-if="option.img" />
                                <span class="text-center text-xs" v-else>
                                    {{ option.label }}
                                </span>
                            </label>

                        </div>
                    </div>
                </div>

            </div>



            <div id="Game" class="flex flex-col gap-2" v-if="newGameData.stateBox !== 'NEW'">
                <Label class="flex items-center gap-1 px-4 font-semibold">Jeu
                    <Icon name="mingcute:radiobox-fill" size="20" />
                </Label>
                <Carousel class="w-full">
                    <CarouselContent class="px-8">

                        <CarouselItem class="basis-1/3 p-1">
                            <Card class="aspect-square overflow-hidden">
                                <CardContent class="relative h-full w-full p-0">
                                    <img v-if="newGameData.photoFrontGame" :src="newGameData.photoFrontGame"
                                        alt="Photo du jeu (face avant)" class="h-full w-full object-cover"
                                        @click="handleFileChange('photoFrontGame', null)" />
                                    <div class="relative aspect-square overflow-hidden" v-else>
                                        <input type="file" id="photoFrontGame"
                                            class="absolute left-0 top-0 z-50 block h-full w-full object-cover opacity-0"
                                            accept="image/jpeg, image/png, image/gif, image/webp"
                                            @change="handleFileChange('photoFrontGame', $event)"
                                            :disabled="imagesFiles.photoFrontGame.loading" />
                                        <div class="absolute left-0 top-0 z-40 flex h-full w-full flex-col items-center justify-center bg-secondary text-xs"
                                            :class="imagesFiles.photoFrontGame.loading ? 'opacity-50' : ''">
                                            <Icon name=mingcute:camera-2-line size=24 class="mb-2 mt-1"
                                                v-if="!imagesFiles.photoFrontGame.loading" />
                                            <Loader2 class="h-24 animate-spin" v-else />
                                            <span class="font-bold">face avant</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>

                        <CarouselItem class="basis-1/3 p-1" v-if="hasGameImages">
                            <Card class="aspect-square overflow-hidden">
                                <CardContent class="relative h-full w-full p-0">
                                    <img v-if="newGameData.photoBackGame" :src="newGameData.photoBackGame"
                                        alt="Photo du jeu (face arrière)" class="h-full w-full object-cover"
                                        @click="handleFileChange('photoBackGame', null)" />
                                    <div class="relative aspect-square overflow-hidden" v-else>
                                        <input type="file" id="photoBackGame"
                                            class="absolute left-0 top-0 z-50 block h-full w-full object-cover opacity-0"
                                            accept="image/jpeg, image/png, image/gif, image/webp"
                                            @change="handleFileChange('photoBackGame', $event)"
                                            :disabled="imagesFiles.photoBackGame.loading" />
                                        <div class="absolute left-0 top-0 z-40 flex h-full w-full flex-col items-center justify-center bg-secondary text-xs"
                                            :class="imagesFiles.photoBackGame.loading ? 'opacity-50' : ''">
                                            <Icon name=mingcute:camera-2-line size=24 class="mb-2 mt-1"
                                                v-if="!imagesFiles.photoBackGame.loading" />
                                            <Loader2 class="h-24 animate-spin" v-else />
                                            <span class="font-bold">face arrière</span>
                                            <span class="text-[10px] opacity-70">(facultatif)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>

                <div class="flex-col gap-2 px-4" v-if="hasGameImages">
                    <div class="flex w-full gap-1">
                        <div v-for="option in gameStates" :key="option.value"
                            class="relative flex aspect-square flex-1 flex-col items-center overflow-hidden rounded-lg bg-zinc-300">

                            <input type="radio" v-model="newGameData.stateGame" :value="option.value"
                                :id="`game-${option.value}`" class="peer sr-only" name="stateGame" required />

                            <label :for="`game-${option.value}`"
                                class="flex aspect-square h-full w-full cursor-pointer items-center justify-center rounded-lg border-2 border-transparent peer-checked:border-primary">
                                <img :src="option.img" class="max-h-full max-w-full" v-if="option.img" />
                                <span class="text-center text-xs" v-else>
                                    {{ option.label }}
                                </span>
                            </label>

                        </div>
                    </div>
                </div>

            </div>


            <div class="flex flex-col px-4">

                <Button type="submit" :disabled="uploadLoading" v-if="!hasBoxImages && !hasGameImages">
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" v-if="uploadLoading" />
                    {{ uploadLoading ? "Merci de patientez..." : "Mon objet n'est ni une boîte, ni un jeu" }}
                </Button>

                <Button type="submit" :disabled="uploadLoading" v-else-if="hasBoxImages && !hasGameImages">
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" v-if="uploadLoading" />
                    {{ uploadLoading ? "Merci de patientez..." : "Continuer sans le jeu" }}
                </Button>

                <Button type="submit" :disabled="uploadLoading" v-else-if="!hasBoxImages && hasGameImages">
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" v-if="uploadLoading" />
                    {{ uploadLoading ? "Merci de patientez..." : "Continuer sans la boîte" }}
                </Button>

                <Button type="submit" :disabled="uploadLoading" v-else>
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" v-if="uploadLoading" />
                    {{ uploadLoading ? "Merci de patientez..." : "Étape suivante" }}
                </Button>
            </div>
        </form>

        <form @submit.prevent="handleRegisterGame" v-show="step === 2" class="flex flex-col gap-4 px-4">

            <div class="flex flex-col gap-2">
                <Label for="title" class="font-semibold">Nom du jeu</Label>
                <input type="text" v-model="newGameData.title"
                    class="rounded border p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    required />
            </div>

            <div class="flex flex-col gap-2">
                <Label for="platformId" class="font-semibold">Plateforme</Label>
                <select id="platformId" v-model="newGameData.platformId" required
                    class="rounded border p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
                    <option v-for="platform in platforms" :key="platform.id" :value="platform.id">
                        {{ platform.name }}
                    </option>
                </select>
            </div>

            <Button type="submit" class="mt-2 w-full font-semibold" :disabled="loading">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" v-if="loading" />
                {{ loading ? 'Ajout en cours...' : 'Ajouter à la collection' }}
            </Button>
        </form>

    </div>

    <Loader2 class="mx-auto my-2 animate-spin" v-if="platformsLoading" />
</template>
