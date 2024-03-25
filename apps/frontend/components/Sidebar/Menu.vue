<script setup lang="ts">

const items = ref([
    {
        title: 'Dashoard',
        path: '/dashboard',
        icon: 'mingcute:monitor-line',
        order: 1
    },
    {
        title: 'Collections',
        path: '/collections',
        icon: 'mingcute:book-5-line',
        order: 2
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: 'mingcute:settings-3-line',
        order: 5
    }
])

watch(items.value, () => {
    items.value.sort((a, b) => a.order - b.order)
})

const authStore = useAuthStore()
const user = computed(() => authStore.getUser())

if (user.value?.roles.includes('ADMIN'))
    items.value.push(
        {
            title: 'Platformes',
            path: '/platformes',
            icon: 'mingcute:game-2-line',
            order: 3
        },
        {
            title: 'Users',
            path: '/users',
            icon: 'mingcute:user-3-line',
            order: 4
        }
    )

const emit = defineEmits(['closeMenu'])
const handleEmitCloseMenu = () => emit('closeMenu')
</script>

<template>
    <div class="bg-primary">
        <div class="flex items-center gap-2 p-4">
            <nuxt-link to="/" class="block h-full" @click="handleEmitCloseMenu">
                <Logo :style="'contour'" class="h-24" />
            </nuxt-link>
        </div>

        <div class="px-4 py-8 text-white drop-shadow-flat">
            <div class="grid gap-2">

                <div v-for="(item, index) in items" :key="index">
                    <NuxtLink :to="item.path" @click="handleEmitCloseMenu"
                        class="flex cursor-pointer items-center gap-4 rounded px-2 py-1 text-2xl transition hover:bg-neutral-100 hover:bg-primary-foreground hover:text-black lg:gap-2 lg:text-lg">
                        <Icon :name="item.icon" />
                        <span>{{ item.title }}</span>
                    </NuxtLink>
                </div>

            </div>

        </div>

        <footer class="absolute bottom-0 left-0 h-24 w-full bg-secondary">
            <div id="Triangle" class="absolute -top-12 left-0 h-12 w-full bg-secondary"></div>
            <img src="@/assets/images/Joystick.png" alt="Image de joystick" class="absolute -top-36 right-0 w-52">
        </footer>
    </div>
</template>

<style scoped>
img {
    -webkit-filter: drop-shadow(2px 2px 0 #FDCF00) drop-shadow(-2px -2px 0 #FDCF00) drop-shadow(2px -2px 0 #FDCF00) drop-shadow(-2px 2px 0 #FDCF00);
    filter: drop-shadow(2px 2px 0 #FDCF00) drop-shadow(-2px -2px 0 #FDCF00) drop-shadow(2px -2px 0 #FDCF00) drop-shadow(-2px 2px 0 #FDCF00);
}

#Triangle {
    clip-path: polygon(100% 45%, 100% 100%, 0% 100%);
}
</style>
