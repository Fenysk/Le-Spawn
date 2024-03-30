<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toTypedSchema } from '@vee-validate/zod';
import { Loader2 } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import Button from '~/components/ui/button/Button.vue';
import Label from '~/components/ui/label/Label.vue';
import AnalyzeService from '~/services/analyze.service';
import CollectionsService from '~/services/collections.service';
import PlatformsService, { type Platform } from '~/services/platforms.service';
import UploadService from '~/services/upload.service';

const formSchema = toTypedSchema(z.object({
    title: z.string().min(3).max(255),
    edition: z.string().min(3).max(255),
    region: z.string().min(3).max(20),
    platformId: z.string().length(13),
    collectionId: z.string().length(13),
    stateBox: z.string().min(3).max(255).optional(),
    stateGame: z.string().min(3).max(255).optional(),
    photosBox: z.array(z.string()),
    photosGame: z.array(z.string()),
    mainPhoto: z.string(),
}))

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        edition: 'Standard',
    },
})

const imageLoading = ref(false);
const imagesUrl = ref<string[]>([]);
const handleUploadImages = async (event: any) => {
    const images = event.target.files || event.srcElement.files;

    if (!images.length) return;

    const uploadService = new UploadService();

    loading.value = true;
    imageLoading.value = true;
    try {
        for (const image of images) {
            const imageUrl = await uploadService.uploadImage(image);
            imagesUrl.value.push(imageUrl);
        }
    } catch (error: any) {
        alert(error.message);
    } finally {
        loading.value = false;
        imageLoading.value = false;
    }
}

const loading = ref(false);
const collectionsService = new CollectionsService();
const handleRegisterGame = form.handleSubmit(async () => {
    const gameData = form.values;
    try {
        loading.value = true;
        await collectionsService.addNewVideoGameToCollection(gameData);
        handleAddingNewGameSuccess();
    } catch (error) {
        alert('Une erreur est survenue lors de l\'ajout du jeu');
    } finally {
        loading.value = false;
    }
})

const emit = defineEmits(['addingNewGameSuccess']);
const handleAddingNewGameSuccess = () => {
    emit('addingNewGameSuccess');
}

const step = ref<number>(1);

type GameAnalyzedType = {
    photoOfBoxIds: string[],
    photoOfGameDiskOrCartridgeIds: string[],
    title: string,
    edition: string,
    region: string,
    platformName: string,
    otherContents: {
        name: string,
        type: string,
        photoIds: number[],
    }[],
    mainPhotoId: string,
}

const props = defineProps({
    collectionId: String,
})

const normalizePlatformName = (name: string) => name.toLowerCase().replace(/\s/g, '');
const findPlatformByIdentifier = (normalizedPlatformName: string, platforms: any[]) => {
    return platforms.find(platform =>
        normalizePlatformName(platform.name) === normalizedPlatformName ||
        normalizePlatformName(platform.shortName) === normalizedPlatformName
    );
};
const getPlatformId = (platformName: string) => {
    const normalizedPlatformName = normalizePlatformName(platformName);
    const matchingPlatform = findPlatformByIdentifier(normalizedPlatformName, platforms.value);

    return matchingPlatform?.id || null;
};

const photoBoxIds = ref<string[]>([]);
const photoGameIds = ref<string[]>([]);
const mainPhotoId = ref<number>(-1);

const photosBox = computed(() => photoBoxIds.value.map(id => imagesUrl.value[parseInt(id) - 1]).filter(url => url !== undefined));
const photosGame = computed(() => photoGameIds.value.map(id => imagesUrl.value[parseInt(id) - 1]).filter(url => url !== undefined));
const otherPhotos = computed(() => imagesUrl.value.filter(url => !photosBox.value.includes(url) && !photosGame.value.includes(url) && !extraContents.value.map(content => content.photoIds).flat().includes(parseInt(url))));
const mainPhotoUrl = computed(() => imagesUrl.value[mainPhotoId.value - 1]);

const extraContents = ref<{
    name: string,
    type: string,
    photoIds: number[],
}[]>([]);

const statesItems = ref({
    stateBox: undefined,
    stateGame: undefined,
})

const setAnalyseDataToNewGameData = (data: GameAnalyzedType) => {
    photoBoxIds.value = data.photoOfBoxIds;
    photoGameIds.value = data.photoOfGameDiskOrCartridgeIds;
    extraContents.value = data.otherContents;
    mainPhotoId.value = parseInt(data.mainPhotoId);
    form.setValues({
        title: data.title,
        edition: data.edition,
        region: data.region,
        platformId: getPlatformId(data.platformName),
        photosBox: photosBox.value,
        photosGame: photosGame.value,
        mainPhoto: mainPhotoUrl.value,
    });
}

const setStates = () => {
    form.setValues({
        stateBox: statesItems.value.stateBox,
        stateGame: statesItems.value.stateGame,
    })
    step.value = 3;
}

const hasAlreadyAnalyzedPhotos = ref(false);
const analyzeService = new AnalyzeService();
const handleAnalyzePhotos = async () => {
    loading.value = true;
    try {
        if (hasAlreadyAnalyzedPhotos.value)
            return step.value = 2;

        if (!imagesUrl.value.length)
            return alert('Veuillez ajouter des images pour analyser');

        form.setValues({ collectionId: props.collectionId });
        const gameAnalyzedData = await analyzeService.analyzeGamePhotosWithAnthropicHaiku(imagesUrl.value);
        setAnalyseDataToNewGameData(gameAnalyzedData);
        step.value = 2;
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

onMounted(() => {
    handleFetchPlatforms();
})

const extraName = computed(() => [...extraContents.value.map(content => content.name)]);

const removePhoto = (type: string, photo: string) => {
    // remove id from photoBoxIds or photoGameIds with url
    if (type === 'box') {
        const index = photoBoxIds.value.indexOf((imagesUrl.value.indexOf(photo) + 1).toString());
        photoBoxIds.value.splice(index, 1);
    } else if (type === 'game') {
        const index = photoGameIds.value.indexOf((imagesUrl.value.indexOf(photo) + 1).toString());
        photoGameIds.value.splice(index, 1);
    } else {
        const content = extraContents.value.find(content => content.name === type);
        if (!content) return;
        const index = content.photoIds.indexOf(imagesUrl.value.indexOf(photo));
        if (!Array.isArray(content.photoIds)) {
            content.photoIds = [];
        }
        content.photoIds.splice(index, 1);
    }
}

const setUrlToPhotoIds = (type: string, url: string) => {
    if (type === 'box') {
        photoBoxIds.value.push((imagesUrl.value.indexOf(url) + 1).toString());
    } else if (type === 'game') {
        photoGameIds.value.push((imagesUrl.value.indexOf(url) + 1).toString());
    } else {
        const content = extraContents.value.find(content => content.name === type);
        if (!content) return;
        content.photoIds.push(imagesUrl.value.indexOf(url));
    }
}
</script>

<template>
    <div class="w-full">

        <section id="Photos" class="space-y-6" v-if="step === 1">

            <div class="flex flex-col gap-2">
                <Label class="font-semibold">Images</Label>
                <p class="text-gray-500">
                    Ajoutez une photo de chaque élément du jeu<br>
                    (boîte, cartouche, notice, ...)
                </p>
                <div class="flex flex-col gap-1">
                    <Input multiple id="picture" type="file" @change="handleUploadImages" class="cursor-pointer"
                        :disabled="loading" />
                    <div class="flex flex-row flex-wrap gap-2 overflow-hidden rounded"
                        v-if="loading || imagesUrl.length">
                        <img v-for="image in imagesUrl" :key="image" :src="image"
                            class="aspect-square h-24 w-24 rounded object-cover shadow-md" />
                        <Loader2 v-if="imageLoading" class="block aspect-square size-24 animate-spin text-accent" />
                    </div>
                </div>
            </div>

            <Button :disabled="loading || !imagesUrl.length" @click="handleAnalyzePhotos" class="float-right">
                <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                {{ loading ? 'Envoi des photos en cours...' : 'J`ai pris en photo chaque élément' }}
            </Button>

        </section>

        <form id="States" class="max-h-[70vh] space-y-6 overflow-auto" v-if="step === 2" @submit.prevent="setStates" >

            <p>Vérifiez la correspondance des photos :</p>

            <div id="Box" class="flex flex-col gap-2" v-if="photosBox.length">
                <Label class="flex items-center gap-1 font-semibold">
                    <Icon name="mingcute:box-line" size="16" />
                    <span>Boîte</span>
                </Label>
                <div class="grid grid-cols-2 gap-2">
                    <div v-for="photo in photosBox" :key="photo" class="relative flex flex-col">
                        <img :src="photo" class="aspect-square object-cover" />
                        <div class="absolute right-1 top-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary text-white"
                            @click="removePhoto('box', photo)">
                            <Icon name="mingcute:close-fill" />
                        </div>
                    </div>
                    <p v-if="!photosBox.length" class="text-gray-500">Aucune photo de la boîte</p>
                </div>
                <div id="StateBox" v-if="photosBox.length" class="flex flex-col gap-2">
                    <Label class="font-semibold">État de la boîte</Label>
                    <select required v-model="statesItems.stateBox" class="w-full rounded border border-gray-300 p-2">
                        <option value="NEW">Neuf</option>
                        <option value="MINT">Très bon état</option>
                        <option value="GOOD">Bon état</option>
                        <option value="BAD">Mauvais état</option>
                        <option value="PARTS">Pour pièces</option>
                    </select>
                </div>
            </div>

            <div id="Game" class="flex flex-col gap-2" v-if="photosGame.length">
                <Label class="flex items-center gap-1 font-semibold">
                    <Icon name="mingcute:album-line" size="16" />
                    <span>Jeu</span>
                </Label>
                <div class="grid grid-cols-2 gap-2">
                    <div v-for="photo in photosGame" :key="photo" class="relative flex flex-col">
                        <img :src="photo" class="aspect-square object-cover" />
                        <div class="absolute right-1 top-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary text-white"
                            @click="removePhoto('game', photo)">
                            <Icon name="mingcute:close-fill" />
                        </div>
                    </div>
                    <p v-if="!photosGame.length" class="text-gray-500">Aucune photo du jeu</p>
                </div>
                <div id="StateGame" v-if="photosGame.length" class="flex flex-col gap-2">
                    <Label class="font-semibold">État du jeu</Label>
                    <select required v-model="statesItems.stateGame" class="w-full rounded border border-gray-300 p-2">
                        <option value="NEW">Neuf</option>
                        <option value="MINT">Très bon état</option>
                        <option value="GOOD">Bon état</option>
                        <option value="BAD">Mauvais état</option>
                        <option value="PARTS">Pour pièces</option>
                    </select>
                </div>
            </div>

            <div id="ExtraContents" class="flex flex-col gap-2" v-if="extraContents.length">
                <Label class="flex items-center gap-1 font-semibold">
                    <span>Contenus supplémentaires</span>
                    <Icon name="mingcute:attachment-2-line" size="16" />
                </Label>
                <div class="grid grid-cols-2 gap-2">
                    <div v-for="content in extraContents" :key="content.name" class="flex flex-col">
                        <Label class="font-semibold">{{ content.name }}</Label>
                        <div class="grid grid-cols-2 gap-2">
                            <div v-for="photo in content.photoIds" :key="photo" class="relative flex flex-col">
                                <img :src="imagesUrl[photo]" class="aspect-square object-cover" />
                                <div class="absolute right-1 top-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary text-white"
                                    @click="removePhoto(content.name, imagesUrl[photo])">
                                    <Icon name="mingcute:close-fill" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="OtherPhotos" class="flex flex-col gap-2" v-if="otherPhotos.length">
                <Label class="font-semibold">Autres photos</Label>
                <p>Veuillez attribuer ces photos à un élément.</p>
                <div class="flex flex-wrap justify-between gap-4 px-4">
                    <div v-for="url in otherPhotos">
                        <img :key="url" :src="url" class="h-24 w-full object-cover" />
                        <div class="flex flex-col">
                            <div class="flex gap-1">
                                <Button variant="secondary" @click.prevent="setUrlToPhotoIds('box', url)"
                                    class="mt-2">Boîte</Button>
                                <Button variant="secondary" @click.prevent="setUrlToPhotoIds('game', url)"
                                    class="mt-2">Jeu</Button>
                                <Button v-for="content in extraName" variant="secondary"
                                    @click.prevent="setUrlToPhotoIds(content, url)" class="mt-2">{{ content
                                    }}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Button :disabled="loading" type="submit" class="float-right">
                    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                    {{ loading ? 'Un peu de patience...' : 'Étape suivante' }}
                </Button>
            </div>
        </form>

        <form id="Details" class="space-y-6" v-if="step === 3" @submit.prevent="handleRegisterGame">

            <FormField v-slot="{ componentField }" name="platformId">
                <FormItem>
                    <FormLabel class="font-semibold">Plateforme</FormLabel>
                    <Select v-bind="componentField">
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a platform" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem v-for="platform in platforms" :key="platform.id" :value="platform.id">
                                    {{ platform.name }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="title">
                <FormItem>
                    <FormLabel class="font-semibold">Nom du jeu</FormLabel>
                    <FormControl>
                        <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="edition">
                <FormItem>
                    <FormLabel class="font-semibold">Edition</FormLabel>
                    <FormControl>
                        <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="region">
                <FormItem>
                    <FormLabel class="font-semibold">Région</FormLabel>
                    <FormControl>
                        <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <div>
                <Button type="submit" :disabled="loading" class="float-right">
                    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                    {{ loading ? 'Un peu de patience...' : 'Ajouter à la collection' }}
                </Button>
            </div>

        </form>

    </div>
</template>
