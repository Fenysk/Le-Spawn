<script setup lang='ts'>

definePageMeta({
    middleware: ['auth']
})

const loading = ref(false);

const authStore = useAuthStore();
const user = computed(() => authStore.getUser());
</script>

<template>
    <div class="page">
        <header>
            <p class="text-zinc-700">Salut {{ user?.Profile.nickName || 'PNJ' }} !</p>
            <h1 class="mt-2 text-2xl">Dashboard</h1>
        </header>
        
        <main>
            <div>
                tabs : Today, This week, This month
            </div>
            <section>
                Chart
            </section>
        </main>
        <footer>
            I'll have 3 differents cards
        </footer>
    </div>
</template>
