<script setup lang="ts">
import type { Collection } from '~/services/collectionsService';
import CollectionsService from '~/services/collectionsService';

definePageMeta({
    middleware: ['auth'],
});

const authStore = useAuthStore();
const user = computed(() => authStore.getUser());

const collectionId = String(useRoute().params.id);

const loading = ref(false);

const collection = ref<Collection | null>(null);
const collectionsService = new CollectionsService();
const fetchCollection = async () => {
    loading.value = true;
    try {
        collection.value = await collectionsService.getCollectionById(collectionId);
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchCollection);

const hasVideoGames = computed(() => collection.value?.VideoGames.length ?? 0);

const handleRefreshCollection = () => {
    collection.value = null;
    fetchCollection();
};
</script>

<template>
    <div class="page" v-if="!loading">
        <header>
            <p class="text-zinc-700">Salut {{ user?.Profile.nickName || 'PNJ' }} !</p>
            <h1 class="mt-2 text-2xl">{{ collection?.name }}</h1>
        </header>

        <section id="VideGames">
            <div class="flex justify-between">
                <h2 class="text-xl">Jeux-vidéo</h2>
                <CollectionItemVideoGameButtonAdd :collectionId @refreshCollection="handleRefreshCollection" />
            </div>

            <ul class="mt-4 flex flex-col gap-2">
                <li v-for="(videoGame, index) in collection?.VideoGames" :key="index">
                    <CollectionItemVideoGame :videoGame />
                </li>
                <li v-if="hasVideoGames === 0">
                    <CollectionItemVideoGameEmpty />
                </li>
            </ul>
        </section>

    </div>

    <div class="page" v-else>
        <header class="flex flex-col gap-1">
            <Skeleton class="h-6 w-1/3 bg-zinc-500" />
            <Skeleton class="h-8 w-2/3 bg-zinc-500" />
        </header>

        <section>
            <div class="flex flex-col gap-4">
                <CollectionItemSkeleton />
                <CollectionItemSkeleton />
            </div>
        </section>
    </div>
</template>
