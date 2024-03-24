<script setup lang="ts">
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { Loader2 } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import * as zod from 'zod';
import AuthService from '~/services/authService';

const formSchema = toTypedSchema(zod.object({
    email: zod.string().email(),
    password: zod.string().min(8)
}));

const form = useForm({
    validationDataSchema: formSchema,
})

const loading = ref(false);
const authService = new AuthService();
const handleLogin = form.handleSubmit(async(credentials) => {
    try {
        loading.value = true;
        await authService.login(credentials)
        navigateTo('/');
    } catch (error) {
        alert('Erreur lors de la connexion');
    } finally {
        loading.value = false;
    }
})

const emit = defineEmits(['changeForm']);
const handleChangeForm = () => {
    emit('changeForm');
}
</script>

<template>
    <form @submit="handleLogin" class="w-2/3">
        <FormField v-slot="{ componentField }" name="email">
            <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="satoru@iwata.jp" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
            <FormItem class="mt-2">
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="********" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <Button type="submit" class="mt-2 w-full font-semibold" :disabled="loading">
            <Loader2 class="mr-2 h-4 w-4 animate-spin" v-if="loading" />
            {{ loading ? 'On y est presque...' : 'Accéder à mon espace' }}
        </Button>
        <Button type="button" class="mt-2 w-full" variant="secondary" @click="handleChangeForm">
            Je suis nouveau
        </Button>
    </form>
</template>
