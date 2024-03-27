<script setup lang="ts">
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toTypedSchema } from '@vee-validate/zod';
import { Loader2 } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import Button from '~/components/ui/button/Button.vue';
import Label from '~/components/ui/label/Label.vue';
import UploadService from '~/services/upload.service';
import UsersService from '~/services/users.service';

const formSchema = toTypedSchema(z.object({
    nickName: z.string().min(1).max(30),
    avatarUrl: z.string().url().nullable(),
    biography: z.string().min(1).max(255).nullable(),
    socialLinks: z.array(z.string().url()).nullable(),
}))

const form = useForm({
    validationDataSchema: formSchema,
})

const authStore = useAuthStore();
const user = computed(() => authStore.getUser());

onMounted(() => {
    if (user.value?.Profile) {
        const { nickName, avatarUrl, biography, socialLinks: links } = user.value.Profile;
        form.setValues({ nickName, avatarUrl, biography, socialLinks: links });
        socialLinks.value = links;
    }
})

const avatarFile = ref<File | null>(null);
const handleUploadAvatar = async (event: any) => {
    avatarFile.value = event.srcElement.files[0];

    if (!avatarFile.value) return;

    const uploadService = new UploadService();

    loading.value = true;
    try {
        const avatarUrl = await uploadService.uploadImage(avatarFile.value);
        form.setValues({ avatarUrl });
    } catch (error: any) {
        alert(error.message);
    } finally {
        loading.value = false;
    }
}

const socialLinkInput = ref('');
const socialLinks = ref<string[]>([]);
const addSocialLink = () => {
    if (!socialLinkInput.value) return

    socialLinks.value.push(socialLinkInput.value);
    socialLinkInput.value = '';
    form.setValues({ socialLinks: socialLinks.value })
}
const removeSocialLink = (index: number) => {
    socialLinks.value.splice(index, 1);
    form.setValues({ socialLinks: socialLinks.value })
}

const loading = ref(false);
const usersService = new UsersService();
const handleSubmitProfile = form.handleSubmit(async (newProfileData) => {
    try {
        loading.value = true;
        await usersService.updateMyProfile(newProfileData)
        handleSubmitProfileSuccess();
    } catch (error: any) {
        alert(error.message);
    } finally {
        loading.value = false;
    }
})

const emit = defineEmits(['submitProfileSuccess']);
const handleSubmitProfileSuccess = () => {
    emit('submitProfileSuccess');
}
</script>

<template>
    <form class="w-full space-y-6" @submit="handleSubmitProfile">

        <FormField v-slot="{ componentField }" name="nickName">
            <FormItem v-auto-animate>
                <FormLabel class="font-semibold">Pseudo</FormLabel>
                <FormControl>
                    <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                    Votre pseudo est visible par les autres utilisateurs.
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <div class="flex flex-col gap-2">
            <Label class="font-semibold">Avatar</Label>
            <div class="flex h-10 items-center gap-2">
                <Input id="picture" type="file" @change="handleUploadAvatar" class="cursor-pointer" />
                <div class="flex aspect-square h-full items-center justify-center rounded-md border"
                    v-if="loading || form.values.avatarUrl">
                    <img v-if="form.values.avatarUrl" :src="form.values.avatarUrl"
                        class="aspect-square h-full object-cover" />
                    <Loader2 v-else-if="loading" class="h-full animate-spin text-secondary" />
                </div>
            </div>
        </div>

        <FormField v-slot="{ componentField }" name="biography">
            <FormItem v-auto-animate>
                <FormLabel class="font-semibold">Biographie</FormLabel>
                <FormControl>
                    <Textarea v-bind="componentField" />
                </FormControl>
                <FormDescription>
                    Partagez votre expérience de passionné avec la communauté.
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <div class="flex flex-col gap-2">
            <Label class="font-semibold">Réseaux sociaux</Label>
            <div class="flex flex-col gap-2">
                <div v-for="(socialLink, index) in socialLinks" :key="index"
                    class="flex items-center justify-between gap-2">
                    <Input type="text" v-model="socialLinks[index]" disabled />
                    <Button variant="secondary" type="button" @click="removeSocialLink(index)">
                        <Icon name="mingcute:delete-2-line" class="h-4 w-4" />
                        <span class="ml-2 hidden lg:flex">Supprimer</span>
                    </Button>
                </div>
            </div>
            <div class="flex justify-between gap-2">
                <FormField v-slot="{ componentField }" name="socialLink">
                    <FormControl>
                        <Input type="text" v-model="socialLinkInput" />
                    </FormControl>
                    <FormMessage />
                    <Button type="button" @click="addSocialLink">
                        <Icon name="mingcute:add-fill" class="h-4 w-4" />
                        <span class="hidden lg:flex">Ajouter</span>
                    </Button>
                </FormField>
            </div>
        </div>

        <Button type="submit" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? 'Un peu de patience...' : 'Sauvegarder' }}
        </Button>

    </form>
</template>
