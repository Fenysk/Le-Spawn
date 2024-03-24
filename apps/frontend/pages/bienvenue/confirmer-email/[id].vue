<script setup lang='ts'>
import { Loader2 } from 'lucide-vue-next';
import AuthService from '~/services/authService';

definePageMeta({
    layout: 'simple',
})

const loading = ref(true);

const confirmationId = useRoute().params.id as string;

const errorMessage = ref<string | null>(null);
if (!confirmationId) {
    errorMessage.value = 'Aucun identifiant de confirmation n\'a été fourni.';
}

const authService = new AuthService();
const handleConfirmAccount = async () => {
    loading.value = true;
    try {
        await authService.confirmAccount(confirmationId);
        navigateTo('/bienvenue/avant-propos');
    } catch (error) {
        errorMessage.value = 'Une erreur est survenue lors de la confirmation de votre compte. Si le problème persiste, veuillez contacter le support.';
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    handleConfirmAccount();
});
</script>

<template>
    <div class="page h-screen !bg-primary text-white">
        <header class="flex justify-center">
            <Logo :style="'contour'" class="h-32" />
        </header>
        <main class="flex w-full grow items-center justify-center">
            <section>
                <Loader2 class="h-16 w-16 animate-spin" v-if="loading" />
                <p v-else-if="errorMessage">{{ errorMessage }}</p>
                <p v-else>Confirmation en cours...</p>
            </section>
        </main>
        <footer>
            This is my footer
        </footer>
    </div>
</template>
