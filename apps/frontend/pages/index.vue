<script setup lang='ts'>
definePageMeta({
    middleware: ['get-user-details']
})

const loading = ref(false);
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
