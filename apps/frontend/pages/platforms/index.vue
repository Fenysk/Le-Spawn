<script setup lang='ts'>
definePageMeta({
    middleware: ['auth', 'admin'],
});

import PlatformsService, { type Platform } from '~/services/platformsService';

const loading = ref(false);

const platforms = ref(<Platform[]>[]);
const platformsService = new PlatformsService();
const fetchPlatforms = async () => {
    try {
        loading.value = true;
        platforms.value = await platformsService.getAllPlatforms();
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;        
    }
};

onMounted(() => fetchPlatforms());

const authStore = useAuthStore();
const user = computed(() => authStore.getUser());
</script>

<template>
    <div class="page">
        <header>
            <p class="text-zinc-700">Salut {{ user?.Profile.nickName || 'PNJ' }} !</p>
            <h1 class="mt-2 text-2xl">Platformes</h1>
        </header>
        <main>
            <PlatformButtonAdd @refreshPlatforms="fetchPlatforms" />

            <section class="mt-2">               
                <ul v-if="platforms.length">
                    <li v-for="platform in platforms" :key="platform.id">
                        {{ platform.name }}
                    </li>
                </ul>
                <p v-else-if="loading">Loading...</p>
                <p v-else>No platforms found</p>

            </section>
        </main>
    </div>
</template>
