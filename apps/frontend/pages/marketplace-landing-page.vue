<script setup lang="ts">
const loading = ref(false)
</script>

<template>
    <div class="lg:px-20 p-4">

        <section class="lg:flex gap-16 lg:mt-20">

            <div class="mt-16 lg:mt-0 px-12 lg:px-0">
                <h1 class="text-2xl text-center lg:text-left">
                    Ton repère pour trouver le meilleur stuff,<br>
                    sans mauvaise surprise
                </h1>

                <div class="mt-8">
                    <span class="font-semibold text-xl">Achète 🕹️</span>
                    <p class="ml-6">
                        Boîte, notice, état du CD... Complète ta collection sereinement, au détails.
                    </p>
                </div>

                <div class="mt-12">
                    <span class="font-semibold text-xl">Vends 💰</span>
                    <p class="ml-6">
                        Fais de la place et publie tes jeux à partir de simples photos, on se charge du reste !
                    </p>
                </div>
            </div>

            <div
                class="flex flex-col gap-2 bg-red-500 shadow-lg mx-auto mt-8 lg:mt-0 px-16 pt-12 pb-8 border rounded-xl rounded-tl-none w-fit lg:w-2/5 lg:min-w-72">
                <div class="flex justify-end">
                    <span class="text-right pr-4 font-semibold whitespace-nowrap">Je cherche</span>
                    <input type="text" class="border w-2/3">
                </div>
                <div class="flex justify-end">
                    <span class="text-right pr-4 font-semibold whitespace-nowrap">pour</span>
                    <input type="text" class="border w-2/3">
                </div>
                <div class="flex justify-end">
                    <span class="text-right pr-4 font-semibold whitespace-nowrap">en état</span>
                    <input type="text" class="border w-2/3">
                </div>

                <div class="flex flex-col mt-8">
                    <Button as-child>
                        <nuxt-link to="/" class="flex items-center">
                            <Icon name="mingcute:search-3-line" size="20" class="mr-2" />
                            <span>Voir les annonces</span>
                        </nuxt-link>
                    </Button>

                    <Button variant="link">
                        J'ai des jeux à vendre
                    </Button>
                </div>
            </div>

        </section>

    </div>
</template>
