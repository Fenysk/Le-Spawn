<script setup lang='ts'>
definePageMeta({
    layout: 'simple',
})

const loading = ref(false);
</script>

<template>
    <div>
        <header>
            This is my header
        </header>
        <main>
            This is my main
            <section>
                <p>This is my section</p>
                <Button as-child>
                    <NuxtLink to="/dashboard?login=true">Dashboard</NuxtLink>
                </Button>
            </section>
        </main>
        <footer>
            This is my footer
        </footer>
    </div>
</template>
