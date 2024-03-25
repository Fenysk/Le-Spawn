<script setup lang='ts'>
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

definePageMeta({
    middleware: ['auth']
})

const loading = ref(false);

const { currentQuote, generateRandomQuote } = useRandomQuotes();
onMounted(() => {
    generateRandomQuote();
});
</script>

<template>
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

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle class="font-acephimere">Profile</CardTitle>
                            <CardDescription>
                                Change your profile
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <SettingTabProfile />
                        </CardContent>
                        <CardFooter>
                            <Button>Save profile</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="personalInformations">
                    <Card>
                        <CardHeader>
                            <CardTitle class="font-acephimere">Informations personnelles</CardTitle>
                            <CardDescription>
                                Change your personal informations
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <SettingTabPersonalInformations/>
                        </CardContent>
                        <CardFooter>
                            <Button>Save personal informations</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>

        <footer>
            This is my footer
        </footer>
    </div>
</template>
