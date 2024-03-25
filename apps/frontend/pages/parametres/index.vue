<script setup lang='ts'>
definePageMeta({
    middleware: ['auth']
})

const loading = ref(false);

const { currentQuote, generateRandomQuote } = useRandomQuotes();
onMounted(() => {
    generateRandomQuote();
});
</script>

<template>
    <div class="page">
        <header>
            <p class="text-zinc-700">{{ currentQuote }}</p>
            <h1 class="mt-2 text-2xl">Paramètres</h1>
        </header>
        <main>
            <p>C'est ici que vous pouvez modifier vos paramètres</p>

            <section>
                This is my section
            </section>
        </main>
        <footer>
            This is my footer
        </footer>
    </div>
</template>
