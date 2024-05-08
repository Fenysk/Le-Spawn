<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';

definePageMeta({
    layout: 'simple'
})
const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();

const redirectUrl = route.query.redirect;
const login = route.query.login || 'true'

if (redirectUrl) {
    const urlToNavigate = Array.isArray(redirectUrl) ? redirectUrl[0] : redirectUrl;
    if (urlToNavigate) {
        router.push(decodeURIComponent(urlToNavigate));
    }
}

const isRegisterForm = ref(login === 'true' ? false : true);
const changeForm = () => {
    isRegisterForm.value = !isRegisterForm.value
}

const isRegisterSuccess = ref(false);
const registerSuccess = () => {
    isRegisterSuccess.value = true;
}
</script>

<template>
    <div class="flex h-screen w-full max-lg:flex-col">

        <section
            class="flex h-32 grow flex-col items-center justify-center bg-primary p-4 max-lg:order-first max-lg:w-full lg:h-full">
            <Logo :style="'contour'" class="w-1/2" />
            <!-- <Button @click="isRegisterSuccess = !isRegisterSuccess" class="mt-4">Toggle success</Button> -->
            <div :class="isRegisterSuccess ? 'opacity-100 mt-8 mb-24 lg:mt-12 lg:mb-32 h-32 ' : 'opacity-0 my-0 h-0 overflow-hidden'"
                class="px-8 text-white transition-all duration-500">
                <h2 class="text-2xl drop-shadow-flat">Encore une étape...</h2>
                <p class="mt-2 text-balance">
                    Un email de confirmation a été envoyé à l'adresse que vous avez renseignée. <br>
                    Veuillez cliquer sur le lien contenu dans ce mail pour valider votre compte.
                </p>
                <Button @click="isRegisterSuccess = false; isRegisterForm = false" class="mt-4 w-full"
                    variant="secondary">J'ai validé mon email</Button>
            </div>

            <Loader2 class="mt-8 h-16 w-16 animate-spin text-white" v-if="authStore.loading" />
        </section>

        <div v-if="!authStore.loading" class="flex flex-col overflow-hidden transition-all duration-500"
            :class="isRegisterSuccess ? 'lg:w-0 max-lg:h-0 opacity-0' : 'max-lg:h-4/5 lg:w-1/2 opacity-100'">

            <section
                class="flex flex-col items-center justify-center gap-4 overflow-hidden bg-white transition-all duration-500"
                :class="isRegisterForm ? 'px-4 h-full' : 'h-0 opacity-0'">
                <h1 class="text-2xl">
                    Bienvenue
                </h1>
                <p class="text-balance text-center">
                    Partage ta collection avec la communauté et découvre celle des autres !
                </p>

                <FormRegister class="mt-4 lg:mt-8" @changeForm="changeForm" @registerSuccess="registerSuccess" />
            </section>

            <section
                class="flex flex-col items-center justify-center gap-4 overflow-hidden bg-white transition-all duration-500"
                :class="isRegisterForm ? 'h-0 opacity-0' : 'px-4 h-full'">
                <h1 class="text-2xl">
                    Retour au spawn
                </h1>
                <p class="text-balance text-center">
                    Ajoute des jeux à ta collection et partage-la avec la communauté !
                </p>

                <FormLogin class="mt-4 lg:mt-8" @changeForm="changeForm" />
            </section>

        </div>


    </div>
</template>

<style scoped></style>
