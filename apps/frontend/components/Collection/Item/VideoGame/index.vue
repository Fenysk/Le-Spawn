<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from '@/components/ui/dialog';
import {
Drawer,
DrawerContent,
DrawerHeader,
DrawerTitle,
DrawerTrigger
} from '@/components/ui/drawer';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { ref } from 'vue';
import type { VideoGame } from '~/services/collections.service';

const props = defineProps<{
    videoGame: VideoGame;
}>()

const isDesktop = useMediaQuery('(min-width: 768px)')

const isOpen = ref(false)

const [TriggerTemplate, TriggerContent] = createReusableTemplate()
const [TitleTemplate, TitleContent] = createReusableTemplate()
const [GameTemplate, GameDetails] = createReusableTemplate()
</script>

<template>

    <TitleTemplate>
        <div class="flex items-center justify-between gap-4">
            <h1 class="font-acephimere">{{ videoGame.title }}</h1>
            <img class="platformLogo" :src="videoGame.Platform.squareLogoUrl"
                :alt="`Logo de ${videoGame.Platform.name}`" />
        </div>
    </TitleTemplate>

    <GameTemplate class="flex">
        <CollectionItemVideoGameCardDetails :videoGame="videoGame" />
    </GameTemplate>

    <TriggerTemplate>
        <CollectionItemVideoGameCard :videoGame="videoGame" />
    </TriggerTemplate>

    <Dialog v-if="isDesktop" v-model:open="isOpen">
        <DialogTrigger as-child>
            <TriggerContent />
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>
                    <TitleContent />
                </DialogTitle>
            </DialogHeader>
            <GameDetails />
        </DialogContent>
    </Dialog>

    <Drawer v-else v-model:open="isOpen">
        <DrawerTrigger as-child>
            <TriggerContent />
        </DrawerTrigger>
        <DrawerContent class="max-h-[80vh]">
            <DrawerHeader class="text-left">
                <DrawerTitle>
                    <TitleContent />
                </DrawerTitle>
            </DrawerHeader>
            <GameDetails class="px-4" />
            <DrawerFooter class="pt-2">
                <Button>
                    Modifier
                </Button>
                <Button variant="secondary">
                    Supprimer
                </Button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
</template>

<style scoped>
.platformLogo {
    @apply h-8 overflow-hidden object-cover;
}
</style>
