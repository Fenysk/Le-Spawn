<script setup lang='ts'>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '~/components/ui/toast';

definePageMeta({
    middleware: ['auth']
})

const loading = ref(false);

const { currentQuote, generateRandomQuote } = useRandomQuotes();
onMounted(() => {
    generateRandomQuote();
});

const authStore = useAuthStore();
const { toast } = useToast();
const handleProfileSuccess = () => {
    authStore.getUser();
    toast({ title: 'Profile mis à jour', description: 'Votre profile a été mis à jour avec succès' });
}
</script>

<template>
    <Toaster />
    
    <div class="page">
        <header>
            <p class="text-zinc-700">{{ currentQuote }}</p>
            <h1 class="mt-2 text-2xl">Paramètres</h1>
        </header>

        <main>
            <p>C'est ici que vous pouvez modifier vos paramètres</p>

            <Tabs default-value="profile" class="w-full">
                <TabsList>
                    <TabsTrigger value="profile">
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="personalInformations">
                        Informations personnelles
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" class="max-w-[600px]">
                    <Card>
                        <CardHeader>
                            <CardTitle class="font-acephimere">Profile</CardTitle>
                            <CardDescription>
                                Change your profile
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <SettingTabProfile @submitProfileSuccess="handleProfileSuccess" />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="personalInformations" class="max-w-[600px]">
                    <Card>
                        <CardHeader>
                            <CardTitle class="font-acephimere">Informations personnelles</CardTitle>
                            <CardDescription>
                                Change your personal informations
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <SettingTabPersonalInformations />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    </div>
</template>
