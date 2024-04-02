<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from '@/components/ui/dialog';
import {
Sheet,
SheetContent,
SheetHeader,
SheetTitle,
SheetTrigger
} from '@/components/ui/sheet';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { ref } from 'vue';

const isDesktop = useMediaQuery('(min-width: 768px)')

const isOpen = ref(false)

const [TriggerTemplate, TriggerContent] = createReusableTemplate()
const [TitleTemplate, TitleContent] = createReusableTemplate()
const [NewGameTemplate, GameForm] = createReusableTemplate()

defineProps({
    collectionId: String,
})

const emit = defineEmits(['refreshCollection']);
const handleAddingNewGameSuccess = () => {
    isOpen.value = false
    emit('refreshCollection')
}
</script>

<template>

    <TitleTemplate>
        <span class="font-acephimere">Ajouter un jeu</span>
    </TitleTemplate>

    <NewGameTemplate class="flex">
        <CollectionItemVideoGameButtonAddForm :collectionId @addingNewGameSuccess="handleAddingNewGameSuccess" />
    </NewGameTemplate>

    <TriggerTemplate>
        <Button class="h-fit w-fit p-2">
            <Icon name="mingcute:add-fill" size="16" />
            <span class="ml-2 hidden lg:block">Ajouter un jeu</span>
        </Button>
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
            <GameForm />
        </DialogContent>
    </Dialog>

    <Sheet v-else v-model:open="isOpen">
        <SheetTrigger as-child>
            <TriggerContent />
        </SheetTrigger>
        <SheetContent side="bottom">
            <SheetHeader class="text-left">
                <SheetTitle>
                    <TitleContent />
                </SheetTitle>
            </SheetHeader>
            <GameForm />
        </SheetContent>
    </Sheet>
</template>
