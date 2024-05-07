<script setup lang='ts'>
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-vue-next';
import Button from '~/components/ui/button/Button.vue';
import Input from '~/components/ui/input/Input.vue';
import ReportsService from '~/services/reports.service';
import UploadService from '~/services/upload.service';

definePageMeta({
    middleware: ['auth'],
});

const loading = ref(false);

const authStore = useAuthStore();
const user = computed(() => authStore.getUser());

const newMessage = ref<{
    subject: string;
    message: string;
    photosUrl: string[];
}>({
    subject: '',
    message: '',
    photosUrl: [],
});

/**
 * Photos
 */
const photoLoading = ref(false);
const photosUploadingCounter = ref(0);
const handleUploadImages = async (event: any) => {
    const photos = event.target.files || event.srcElement.files;

    if (!photos.length) return;

    photosUploadingCounter.value += photos.length;

    photoLoading.value = true;
    const uploadService = new UploadService();
    try {
        for (const photo of photos) {
            const photoUrl = await uploadService.uploadImage(photo);
            newMessage.value.photosUrl.push(photoUrl);
            photosUploadingCounter.value--;
        }
    } catch (error: any) {
        alert(error.message);
    } finally {
        photoLoading.value = false;
    }
}

const reportsService = new ReportsService();
const isSended = ref(false);
const handleSubmit = async () => {
    try {
        loading.value = true;
        await reportsService.generateNewReport(newMessage.value);
        newMessage.value = {
            subject: '',
            message: '',
            photosUrl: [],
        };
        isSended.value = true;
    } catch (error: any) {
        alert(error.message);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class='page'>
        <header>
            <h1>Un petit mot pour nous ?</h1>
        </header>
        <main>
            Si tu as des questions, des suggestions ou des réclamations, n'hésite pas à nous contacter en remplissant le
            formulaire ci-dessous.
            <section>

                <form id="Contact"
                    class="mt-8 max-w-screen-sm space-y-6 rounded-xl border bg-slate-100 p-4"
                    @submit.prevent="handleSubmit" v-if="!isSended">

                    <div class="flex flex-col gap-2">
                        <Label class="font-semibold">Objet</Label>
                        <Select v-model="newMessage.subject" required>
                            <SelectTrigger>
                                <SelectValue placeholder="De quoi veux-tu nous parler ?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup label="Sélectionner un objet">
                                    <SelectItem value="question">J'ai une question</SelectItem>
                                    <SelectItem value="suggestion">J'ai une suggestion</SelectItem>
                                    <SelectItem value="reclamation">J'ai un problème</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex flex-col gap-2">
                        <Label class="font-semibold">Images</Label>
                        <p class="text-gray-500">
                            Ajoutez des screenshots ou des photos pour illustrer votre message. (facultatif)
                        </p>
                        <div class="flex flex-col gap-1">
                            <Input multiple id="picture" type="file" @change="handleUploadImages" accept="image/png, image/jpg, image/gif, image/webp"
                                class="cursor-pointer" />
                            <div class="flex flex-row flex-wrap gap-2 overflow-hidden rounded"
                                v-if="newMessage.photosUrl.length || photoLoading">
                                <img v-for="image in newMessage.photosUrl" :key="image" :src="image"
                                    class="aspect-square h-24 w-24 rounded object-cover shadow-md" />
                                <div v-for="index in photosUploadingCounter" :key="index"
                                    class="flex aspect-square size-24 items-center justify-center rounded border shadow-md">
                                    <Loader2 class="animate-spin text-accent" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <Label class="font-semibold">Message</Label>
                        <Textarea v-model="newMessage.message" required placeholder="Ton message" />
                    </div>

                    <Button :disabled="loading || photoLoading" type="submit" class="mt-4">Envoyer</Button>
                </form>
                
                <div v-else>
                    <div class="mt-8 max-w-screen-sm space-y-8 rounded-xl border bg-slate-100 p-8">
                        <h2 class="text-center text-2xl">Message envoyé !</h2>
                        <p>Merci pour ton retour précieux, nous allons le traiter dans les plus brefs délais.</p>
                    </div>
                    <Button @click="isSended = false" class="mt-4">Envoyer un autre message</Button>
                </div>

            </section>
        </main>
    </div>
</template>
