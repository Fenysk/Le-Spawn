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
DrawerClose,
DrawerContent,
DrawerHeader,
DrawerTitle,
DrawerTrigger,
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
        <span class="font-acephimere">{{ videoGame.title }}</span>
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
        <DialogContent class="sm:max-w-[425px]">
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
        <DrawerContent>
            <DrawerHeader class="text-left">
                <DrawerTitle>
                    <TitleContent />
                </DrawerTitle>
            </DrawerHeader>
            <GameDetails />
            <DrawerFooter class="pt-2">
                <DrawerClose as-child>
                    <Button variant="outline">
                        Fermer
                    </Button>
                </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
</template>
