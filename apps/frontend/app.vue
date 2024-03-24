<script setup>
useSeoMeta({
    title: 'Le Spawn',
    description: 'Toute ta collection dans un seul endroit !'
})

useHead({
    htmlAttrs: {
        lang: 'fr',
    }
})
</script>

<template>
    <div>
        <div class="z-50 flex h-40 w-full items-center justify-center bg-primary p-4">
            <Logo :style="'contour'" class="h-full" />
        </div>

        <div class="mx-auto flex w-screen max-w-[500px] flex-col gap-20 pt-16">

            <section class="px-4">

                <h1 class="text-balance text-center text-2xl">Toute ta collection dans un seul endroit !</h1>

                <ul class="mx-auto mt-8 flex w-fit -skew-y-2 flex-col gap-4 pr-8 font-semibold">
                    <li class="flex items-center gap-2">
                        <Icon name='mingcute:large-arrow-right-fill' />
                        <span>Prends tes jeux en photo</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <Icon name='mingcute:large-arrow-right-fill' />
                        <span>Ajuste les détails</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <Icon name='mingcute:large-arrow-right-fill' />
                        <span>Admire et partage ta collection</span>
                    </li>
                </ul>

            </section>


            <section class="relative flex h-48 w-full flex-col justify-center bg-secondary p-8 text-black">
                <div id="Triangle" class="absolute -top-12 left-0 h-12 w-full bg-secondary"></div>
                <h2>Accès bêta</h2>

                <p class="mt-2 text-sm">
                    L'application est en cours de développement,<br>
                    inscris-toi pour tester en avant-première !
                </p>

                <Button variant="outline" as-child class="mx-auto mt-4">
                    <a href="https://forms.gle/1AYWPCyix5Q8KSKm8" class="font-semibold">Je veux être
                        bêta-testeur</a>
                </Button>
                <Button variant="link" as-child class="mx-auto mt-1 text-black">
                    <a href="https://patreon.com/LeSpawn?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink"
                        target="_blank">
                        <Icon name="tabler:brand-patreon-filled" class="mr-1" size="16" />
                        Soutenir le projet
                    </a>
                </Button>
            </section>


        </div>

        <footer class="relative w-full bg-secondary pt-52">
            <div class="absolute bottom-0 left-0 h-24 w-full">
                <img src="@/assets/images/Joystick.png" alt="Image de joystick" class="absolute -top-28 right-0 w-52">
                <div class="mt-8 flex gap-1 px-8">
                    <Button variant="ghost" as-child class="hover:bg-black hover:text-white">
                        <a aria-label="Suivre Le Spawn sur X" href="https://x.com/le_spawn_fr" target="_blank">
                            <Icon name="bi:twitter-x" size="28" />
                        </a>
                    </Button>
                    <Button variant="ghost" as-child class="hover:bg-black hover:text-white">
                        <a aria-label="Rejoindre la communauté sur Discord" href="https://discord.gg/NrjHQM6jYP"
                            target="_blank">
                            <Icon name="bi:discord" size="34" />
                        </a>
                    </Button>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
#Triangle {
    clip-path: polygon(-100% 45%, 100% 100%, 0% 100%);
}
</style>
