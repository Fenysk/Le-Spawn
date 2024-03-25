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
    password: zod.string().min(8),
    nickName: zod.string().min(3),
}));

const form = useForm({
    validationDataSchema: formSchema,
})

const loading = ref(false);
const authService = new AuthService();
const handleRegister = form.handleSubmit(async (credentials) => {
    try {
        loading.value = true;
        await authService.register(credentials)
        handleRegisterSuccess();
    } catch (error: any) {
        if (error.statusCode === 409)
            alert('Un compte existe déjà avec cet email');
        else
            alert(error.message);
    } finally {
        loading.value = false;
    }
})

const emit = defineEmits(['changeForm', 'registerSuccess']);
const handleChangeForm = () => {
    emit('changeForm');
}

const handleRegisterSuccess = () => {
    emit('registerSuccess');
}
</script>

<template>
    <form @submit="handleRegister" class="w-full max-w-[400px]">

        <FormField v-slot="{ componentField }" name="nickName">
            <FormItem>
                <FormLabel>Pseudo</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Pseudo" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

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
            {{ loading ? 'On y est presque...' : 'C\'est parti' }}
        </Button>
        <Button type="button" class="mt-2 w-full" variant="secondary" @click="handleChangeForm">
            J'ai déjà un compte
        </Button>
    </form>
</template>
