<script setup lang='ts'>
definePageMeta({
    layout: 'simple',
})

const loading = ref(false);
</script>

<template>
    <div class="page">
        <header>
            <Logo :style="'contour'" class="mx-auto max-w-96" />
        </header>
        <main class="mx-auto mt-8 max-w-lg">
            <h1 class="text-2xl">
                Merci d'avoir rejoint le Spawn
            </h1>
            <p class="mt-4">
                Vous êtes sur le point de découvrir une nouvelle manière de collectionner.<br>
            </p>

            <section class="float-right mt-4">
                <Button as-child variant="secondary">
                    <NuxtLink to="/dashboard?login=true" class="font-semibold">
                        Accéder à ma collection
                        <Icon name="heroicons-solid:arrow-right" class="ml-2 font-semibold" />
                    </NuxtLink>
                </Button>
            </section>
        </main>
    </div>
</template>
