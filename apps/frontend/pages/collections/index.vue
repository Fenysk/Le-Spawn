<script setup lang="ts">
import CollectionsService, { type Collection } from '~/services/collections.service';

definePageMeta({
    middleware: ['auth'],
});

const loading = ref(false);
const collections = ref<Collection[]>([]);
const collectionsService = new CollectionsService();
const fetchUsersCollections = async () => {
    loading.value = true;
    try {
        collections.value = await collectionsService.getMyCollections()
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchUsersCollections);

const authStore = useAuthStore();
const user = computed(() => authStore.getUser());

const { currentQuote, generateRandomQuote } = useRandomQuotes();
onMounted(() => {
    generateRandomQuote();
});
</script>

<template>
    <div class="page">
        <header>
            <p class="text-zinc-700">{{ currentQuote }}</p>
            <h1 class="mt-2 text-2xl">Collections</h1>
        </header>

        <main>
            <section>
                <ul class="mt-4 flex flex-col gap-4 lg:gap-8">
                    <li v-for="(collection, index) in collections" :key="index" class="grow">
                        <Collection :collection />
                    </li>
                    <li v-for="index in 2" :key="index" v-if="loading" class="grow">
                        <CollectionSkeleton />
                    </li>
                </ul>

                <Button v-if="!loading" class="mt-8">
                    <Icon name="mingcute:add-fill" class="mr-2" size="16" />
                    <span>Créer une collection</span>
                </Button>
            </section>
        </main>
    </div>
</template>
