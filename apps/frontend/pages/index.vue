<script setup lang='ts'>
import { StatType } from '~/enums/stat-type.enum';
import StatisticsService from '~/services/statistics.service';

definePageMeta({
    middleware: ['get-user-details']
})

const loading = ref(false);

const authStore = useAuthStore();
const user = computed(() => authStore.getUser());

watch(user, async (newUser) => {
    if (newUser) {
        navigateTo(`/collections/${newUser.Collections[0].id}`);
    }
});

const statisticsService = new StatisticsService();
onMounted(async () => await statisticsService.sendNewStatistic({ type: StatType.HOME_PAGE_VISIT }));
</script>

<template>
    <div class="page">
        <header>
            <h1>Toute ta collection dans un seul endroit !</h1>

            <ul>
                <li>Prends tes jeux en photo</li>
                <li>Ajuste les détails</li>
                <li>Admire et partage ta collection</li>
            </ul>
        </header>

        <main>
            This is my main
            <section>
                This is my section
            </section>
        </main>
        <footer>
            This is my footer
        </footer>
    </div>
</template>
