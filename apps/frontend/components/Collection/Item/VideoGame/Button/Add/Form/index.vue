<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-vue-next';
import Button from '~/components/ui/button/Button.vue';
import Label from '~/components/ui/label/Label.vue';
import AnalyzeService from '~/services/analyze.service';
import CollectionsService from '~/services/collections.service';
import PlatformsService, { type Platform } from '~/services/platforms.service';
import UploadService from '~/services/upload.service';

type GameAnalyzedType = {
    title: string,
    edition: string,
    region: string,
    platformName: string,
    mainPhotoId: string,
}

type ExtraContent = {
    name: string,
    type: string,
    state: string,
    photoIds: number[],
}

const step = ref<string>('photos');

const newGameData = ref({
    collectionId: '',
    platformId: '',
    title: '',
    mainPhoto: '',
    edition: '',
    region: '',
    photoBoxIds: [],
    photoGameIds: [],
    extraContents: [],
    stateBox: '',
    stateGame: '',
})

/**
 * Photos
 */
const photoLoading = ref(false);
const photosUrl = ref<string[]>([]);
const photosUploadingCounter = ref(0);
const handleUploadImages = async (event: any) => {
    const photos = event.target.files || event.srcElement.files;

    if (!photos.length) return;

    photosUploadingCounter.value += photos.length;

    loading.value = true;
    photoLoading.value = true;

    const uploadService = new UploadService();
    try {
        for (const photo of photos) {
            const photoUrl = await uploadService.uploadImage(photo);
            photosUrl.value.push(photoUrl);
            photosUploadingCounter.value--;
        }
    } catch (error: any) {
        alert(error.message);
    } finally {
        loading.value = false;
        photoLoading.value = false;
    }
}

/**
 * Sorting
 */
const photoBoxIds = ref<number[]>([]);
const photoGameIds = ref<number[]>([]);
const addPhotoToIdsArray = (type: string, photoUrl: string) => {
    const photoId = photosUrl.value.indexOf(photoUrl);

    if (type === 'box') photoBoxIds.value.push(photoId);
    if (type === 'game') photoGameIds.value.push(photoId);

    extraContents.value.forEach(extraContent => {
        if (extraContent.photoIds.includes(photoId)) {
            extraContent.photoIds = extraContent.photoIds.filter(id => id !== photoId);
        }
    });

    if (!otherPhotosUrl.value.length) nextStep();
}

const isCreatingExtraContent = ref(false);
const extraContents = ref<ExtraContent[]>([]);
const extraContentInputs = ref({
    name: '',
    type: '',
    state: '',
})
const addExtraContent = (photoUrl: string) => {
    if (!extraContentInputs.value.name || !extraContentInputs.value.type) return;
    const photoId = photosUrl.value.indexOf(photoUrl);
    extraContents.value.push({
        name: extraContentInputs.value.name,
        type: extraContentInputs.value.type,
        state: extraContentInputs.value.state,
        photoIds: [photoId]
    });
    extraContentInputs.value = {
        name: '',
        type: '',
        state: '',
    };
    isCreatingExtraContent.value = false;
}

const otherPhotosUrl = computed(() => photosUrl.value.filter((photoUrl, index) => !photoBoxIds.value.includes(index) && !photoGameIds.value.includes(index) && !extraContents.value.some(extraContent => extraContent.photoIds.includes(index))));
const lastSortedPhotoId = computed(() => Math.max(...photoBoxIds.value, ...photoGameIds.value, ...extraContents.value.map(extraContent => extraContent.photoIds).flat()));
const previousPhoto = () => {
    const extraContent = extraContents.value.find(extraContent => extraContent.photoIds.includes(lastSortedPhotoId.value));

    if (extraContent) {
        const isLastPhoto = extraContent.photoIds.length === 1;
        if (isLastPhoto)
            extraContents.value = extraContents.value.filter(extraContent => !extraContent.photoIds.includes(lastSortedPhotoId.value));
        else
            extraContent.photoIds = extraContent.photoIds.filter(id => id !== lastSortedPhotoId.value);
    }

    if (photoBoxIds.value.includes(lastSortedPhotoId.value))
        photoBoxIds.value = photoBoxIds.value.filter(id => id !== lastSortedPhotoId.value);

    if (photoGameIds.value.includes(lastSortedPhotoId.value))
        photoGameIds.value = photoGameIds.value.filter(id => id !== lastSortedPhotoId.value);

    isCreatingExtraContent.value = false;
}

/**
 * States
 */

const stateBox = ref<string | undefined>(undefined);
const stateGame = ref<string | undefined>(undefined);

/**
 * Details
 */
const analyzedGame = ref<GameAnalyzedType | null>(null);
const hasAlreadyAnalyzedPhotos = ref(false);
const analyzeService = new AnalyzeService();
const handleAnalyzePhotos = async () => {
    loading.value = true;
    try {
        analyzedGame.value = await analyzeService.analyzeGamePhotosWithAnthropicHaiku(photosUrl.value);
        hasAlreadyAnalyzedPhotos.value = true;
    } catch (error) {
        alert('Une erreur est survenue lors de l\'analyse des photos');
    } finally {
        loading.value = false;
    }
}

const platformsService = new PlatformsService();
const platforms = ref<Platform[]>([]);
const handleFetchPlatforms = async () => {
    try {
        platforms.value = await platformsService.getAllPlatforms();
    } catch (error) {
        alert('Une erreur est survenue lors de la récupération des plateformes');
    } finally {
        loading.value = false;
    }
}

const normalizePlatformName = (name: string) => name.toLowerCase().replace(/\s/g, '');
const findPlatformByIdentifier = (normalizedPlatformName: string, platforms: any[]) => {
    return platforms.find(platform =>
        normalizePlatformName(platform.name) === normalizedPlatformName ||
        normalizePlatformName(platform.shortName) === normalizedPlatformName
    );
};
const getPlatformId = (platformName: string | undefined) => {
    if (!platformName) return null;

    const normalizedPlatformName = normalizePlatformName(platformName);
    const matchingPlatform = findPlatformByIdentifier(normalizedPlatformName, platforms.value);

    return matchingPlatform?.id || null;
};

onMounted(() => {
    handleFetchPlatforms();
})


/**
 * Steps
 */
const nextStep = async () => {
    switch (step.value) {

        case 'photos':
            if (!hasAlreadyAnalyzedPhotos.value)
                await handleAnalyzePhotos();
            newGameData.value.title = analyzedGame.value?.title || '';
            newGameData.value.edition = analyzedGame.value?.edition || '';
            newGameData.value.region = analyzedGame.value?.region || '';
            newGameData.value.platformId = getPlatformId(analyzedGame.value?.platformName);
            newGameData.value.mainPhoto = photosUrl.value[(Number(analyzedGame.value?.mainPhotoId) - 1) || 0];
            newGameData.value.stateBox = 'GOOD';
            newGameData.value.stateGame = 'GOOD';
            step.value = 'details'
            break;

        case 'details':
            await handleRegisterGame();
            break;
    }

}


/**
 * Register
 */
const props = defineProps({
    collectionId: String,
})

/**
 * Register game
 */
const loading = ref(false);
const collectionsService = new CollectionsService();
const checkDataValidity = () => {
    newGameData.value.collectionId = props.collectionId ?? '';
    return true;
}
const handleRegisterGame = async () => {
    if (!checkDataValidity()) return;

    try {
        loading.value = true;
        await collectionsService.addNewVideoGameToCollection(newGameData.value);
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
    <div class="w-full">

        <div class="my-4 mb-6 max-h-48 max-w-80 overflow-auto" v-show="true">
            <pre>photoBoxIds: {{ photoBoxIds }}</pre>
            <pre>photoGameIds: {{ photoGameIds }}</pre>
            <pre>extraContents: {{ extraContents }}</pre>
            <pre>analyzedGame: {{ analyzedGame }}</pre>
            <pre>newGameData: {{ newGameData }}</pre>
        </div>

        <form id="Photos" class="space-y-6" v-if="step === 'photos'" @submit.prevent="nextStep">

            <div class="flex flex-col gap-2">
                <Label class="font-semibold">Images</Label>
                <p class="text-gray-500">
                    Ajoutez une photo de chaque élément du jeu<br>
                    (boîte, cartouche, notice, ...)
                </p>
                <div class="flex flex-col gap-1">
                    <Input multiple required id="picture" type="file" @change="handleUploadImages"
                        class="cursor-pointer" />
                    <div class="flex flex-row flex-wrap gap-2 overflow-hidden rounded"
                        v-if="photosUrl.length || photoLoading">
                        <img v-for="image in photosUrl" :key="image" :src="image"
                            class="aspect-square h-24 w-24 rounded object-cover shadow-md" />
                        <div v-for="index in photosUploadingCounter" :key="index"
                            class="flex aspect-square size-24 items-center justify-center rounded border shadow-md">
                            <Loader2 class="animate-spin text-accent" />
                        </div>
                    </div>
                </div>
            </div>

            <Button :disabled="loading || photosUploadingCounter" type="submit" class="float-right">
                <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                {{ loading ? 'Envoi des photos en cours...' : 'J`ai pris en photo chaque élément' }}
            </Button>

        </form>

        <!-- <form id="Sorting" class="max-h-[70vh] space-y-6 overflow-auto" v-if="step === 'sorting'"
            @submit.prevent="nextStep">

            <div v-if="otherPhotosUrl.length">
                <p>A quoi correspond cet objet ?</p>
                <div class="mt-2 flex flex-row gap-4">
                    <img :src="otherPhotosUrl[0]" class="aspect-square w-48 object-cover" />
                    <div class="flex flex-col gap-2" v-if="!isCreatingExtraContent">

                        <Button variant="secondary" @click.prevent="addPhotoToIdsArray('box', otherPhotosUrl[0])">
                            <Icon name="mingcute:box-line" class="mr-1" />
                            <span>Boîte</span>
                        </Button>

                        <Button variant="secondary" @click.prevent="addPhotoToIdsArray('game', otherPhotosUrl[0])">
                            <Icon name="mingcute:album-line" class="mr-1" />
                            <span>Jeu</span>
                        </Button>

                        <Button v-for="(extraContent, index) in extraContents" :key="index" variant="secondary"
                            @click.prevent="addPhotoToIdsArray(extraContent.name, otherPhotosUrl[0])">
                            <Icon name="mingcute:attachment-line" class="mr-1" />
                            <span>{{ extraContent.name }}</span>
                        </Button>

                        <Button variant="secondary" @click.prevent="isCreatingExtraContent = true">
                            <Icon name="mingcute:add-line" class="mr-1" />
                            <span>Autre</span>
                        </Button>

                    </div>

                </div>

                <div v-if="isCreatingExtraContent" class="mt-2 flex flex-col space-y-4">
                    <div class="flex flex-col gap-2">
                        <Label class="font-semibold">Nom</Label>
                        <Input required type="text" v-model="extraContentInputs.name" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <Label class="font-semibold">Type</Label>
                        <select required v-model="extraContentInputs.type" class="h-10 rounded border border-gray-300">
                            <option value="Documentation">Documentation</option>
                            <option value="Accessoire">Accessoire</option>
                            <option value="Figurine">Figurine</option>
                            <option value="DLC">DLC</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>

                    <div class="flex flex-col gap-2">
                        <Label class="font-semibold">État</Label>
                        <select required v-model="extraContentInputs.state" class="h-10 rounded border border-gray-300">
                            <option value="NEW">Neuf</option>
                            <option value="MINT">Comme neuf</option>
                            <option value="GOOD">Bon état</option>
                            <option value="BAD">Mauvais état</option>
                            <option value="PARTS">Pour pièces</option>
                        </select>
                    </div>

                    <Button variant="secondary" @click.prevent="addExtraContent(otherPhotosUrl[0])">
                        <Icon name="heroicons-solid:plus" class="mr-1" />
                        <span>Ajouter</span>
                    </Button>
                </div>

            </div>

            <div>
                <Button @click.prevent="previousPhoto" class="float-left" v-if="lastSortedPhotoId >= 0">
                    <Icon name="heroicons-solid:arrow-left" class="mr-2" />
                    <span>Photo précédente</span>
                </Button>

                <Button :disabled="loading" type="submit" class="float-right"
                    v-if="!otherPhotosUrl.length && !isCreatingExtraContent">
                    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                    {{ loading ? 'Un peu de patience...' : 'Étape suivante' }}
                </Button>
            </div>
        </form> -->

        <!-- <form id="States" class="space-y-6" v-if="step === 'states'" @submit.prevent="nextStep">

            <div class="flex flex-col gap-2" v-if="photoBoxIds.length">
                <Label class="font-semibold">État de la boîte</Label>
                <select :disabled="loading" required v-model="stateBox" class="h-10 rounded border border-gray-300">
                    <option value="NEW">Neuf</option>
                    <option value="MINT">Comme neuf</option>
                    <option value="GOOD">Bon état</option>
                    <option value="BAD">Mauvais état</option>
                    <option value="PARTS">Pour pièces</option>
                </select>
            </div>

            <div class="flex flex-col gap-2" v-if="photoGameIds.length">
                <Label class="font-semibold">État du jeu</Label>
                <select :disabled="loading" required v-model="stateGame" class="h-10 rounded border border-gray-300">
                    <option value="NEW">Neuf</option>
                    <option value="MINT">Comme neuf</option>
                    <option value="GOOD">Bon état</option>
                    <option value="BAD">Mauvais état</option>
                    <option value="PARTS">Pour pièces</option>
                </select>
            </div>

            <div>
                <Button @click.prevent="step = 'sorting'" class="float-left" :disabled="loading">
                    <Icon name="heroicons-solid:arrow-left" class="mr-2" />
                    <span>Étape précédente</span>
                </Button>

                <Button :disabled="loading" type="submit" class="float-right">
                    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                    {{ loading ? 'Un peu de patience...' : 'Étape suivante' }}
                </Button>
            </div>

        </form> -->

        <form id="Details" class="space-y-6" v-if="step === 'details'" @submit.prevent="nextStep">

            <div class="flex flex-col gap-2">
                <Label class="font-semibold">Plateforme</Label>
                <Select v-model="newGameData.platformId" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une plateforme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem v-for="platform in platforms" :key="platform.id" :value="platform.id">
                                {{ platform.name }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div class="flex flex-col gap-2">
                <Label class="font-semibold">Nom du jeu</Label>
                <Input required type="text" v-model="newGameData.title" />
            </div>

            <div class="flex flex-col gap-2">
                <Label class="font-semibold">Edition</Label>
                <Input type="text" v-model="newGameData.edition" />
            </div>

            <div class="flex flex-col gap-2">
                <Label class="font-semibold">Région</Label>
                <Input type="text" v-model="newGameData.region" />
            </div>

            <div>
                <Button @click.prevent="step = 'photos'" class="float-left" :disabled="loading">
                    <Icon name="heroicons-solid:arrow-left" class="mr-2" />
                    <span>Étape précédente</span>
                </Button>

                <Button type="submit" :disabled="loading" class="float-right">
                    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                    {{ loading ? 'Un peu de patience...' : 'Ajouter à la collection' }}
                </Button>
            </div>

        </form>

    </div>
</template>
