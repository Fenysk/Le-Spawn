<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
FormControl,
FormField,
FormItem,
FormLabel,
FormMessage
} from '@/components/ui/form';
import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectTrigger,
SelectValue
} from '@/components/ui/select';
import { toTypedSchema } from '@vee-validate/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import * as zod from 'zod';
import { cn } from '~/lib/utils';
import PlatformsService from '~/services/platformsService';

const formSchema = toTypedSchema(zod.object({
    name: zod.string().min(1),
    shortName: zod.string().min(1),
    gameSupportType: zod.string().min(1),
    generation: zod.number().min(1),
    manufacturer: zod.string().min(1),
    releaseDate: zod.date({
        required_error: 'La date de sortie est requise',
    }),
    squareLogoUrl: zod.string().url(),
    rectangleLogoUrl: zod.string().url(),
    pictureUrl: zod.string().url(),
}));

const form = useForm({
    validationDataSchema: formSchema,
})

const platformsService = new PlatformsService();
const handleAddNewPlatform = form.handleSubmit(async (platform) => {
    try {
        loading.value = true;
        await platformsService.addNewPlatform(platform);
        handleAddNewPlatformSuccess();
    } catch (error) {
        alert('Erreur lors de l\'ajout de la plateforme');
    } finally {
        loading.value = false;
    }
})

const emit = defineEmits(['addNewPlatformSuccess']);
const handleAddNewPlatformSuccess = () => {
    emit('addNewPlatformSuccess');
}

const loading = ref(false);
</script>

<template>

    <form @submit="handleAddNewPlatform" class="flex max-h-[70vh] flex-col gap-2 overflow-auto px-4 lg:px-0">

        <FormField v-slot="{ componentField }" name="name">
            <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                    <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="shortName">
            <FormItem>
                <FormLabel>Nom court</FormLabel>
                <FormControl>
                    <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="gameSupportType">
            <FormItem>
                <FormLabel>Type de support</FormLabel>
                <FormControl>
                    <Select v-bind="componentField">
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un type de support" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="CD">
                                    Disque
                                </SelectItem>
                                <SelectItem value="CARTRIDGE">
                                    Cartouche
                                </SelectItem>
                                <SelectItem value="DIGITAL">
                                    Dématérialisé
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="generation">
            <FormItem>
                <FormLabel>Génération</FormLabel>
                <FormControl>
                    <Input type="number" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="manufacturer">
            <FormItem>
                <FormLabel>Fabricant</FormLabel>
                <FormControl>
                    <Select v-bind="componentField">
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un fabricant" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="SONY">
                                    Sony
                                </SelectItem>
                                <SelectItem value="NINTENDO">
                                    Nintendo
                                </SelectItem>
                                <SelectItem value="MICROSOFT">
                                    Microsoft
                                </SelectItem>
                                <SelectItem value="SEGA">
                                    Sega
                                </SelectItem>
                                <SelectItem value="ATARI">
                                    Atari
                                </SelectItem>
                                <SelectItem value="OTHER">
                                    Autre
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, value }" name="releaseDate">
            <FormItem class="mt-2 flex flex-col justify-between">
                <FormLabel>Date de sortie</FormLabel>
                <Popover>
                    <PopoverTrigger as-child>
                        <FormControl>
                            <Button variant="outline"
                                :class="cn('w-full ps-3 text-start font-normal', value && 'text-muted-foreground')">
                                <span>{{ value ? format(value, "PPP") : "Pick a date" }}</span>
                                <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent class="p-0">
                        <Calendar v-bind="componentField" />
                    </PopoverContent>
                </Popover>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="squareLogoUrl">
            <FormItem>
                <FormLabel>URL du logo carré</FormLabel>
                <FormControl>
                    <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="rectangleLogoUrl">
            <FormItem>
                <FormLabel>URL du logo rectangulaire</FormLabel>
                <FormControl>
                    <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="pictureUrl">
            <FormItem>
                <FormLabel>URL de l'image</FormLabel>
                <FormControl>
                    <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <Button type="submit" class="mt-2 w-full font-semibold" :disabled="loading">
            <Loader2 class="mr-2 h-4 w-4 animate-spin" v-if="loading" />
            Ajouter
        </Button>
    </form>

</template>
