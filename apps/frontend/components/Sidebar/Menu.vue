<script setup lang="ts">
import AuthService from '~/services/auth.service';

const authStore = useAuthStore()
const user = computed(() => authStore.getUser())

const items = ref(<Link[]>[])
type Link = {
    title: string
    path: string | null
    icon: string
    order: number
    action: any
}

const authService = new AuthService()
const router = useRouter()
const handleLogout = () => {
    authService.logout()
    router.push('/')
}

const setupLinks = () => {
    const noUserLinks: Link[] = [
        {
            title: 'Accueil',
            path: '/',
            icon: 'mingcute:home-7-line',
            order: 1,
            action: null
        },
        {
            title: 'Mon compte',
            path: '/bienvenue',
            icon: 'mingcute:emoji-line',
            order: 2,
            action: null
        }
    ]

    const basicUserLinks: Link[] = [
        {
            title: 'Ma collection',
            path: `/collections/${user.value?.Collections[0].id}`,
            icon: 'mingcute:book-5-line',
            order: 4,
            action: null
        },
        {
            title: 'Paramètres',
            path: '/parametres',
            icon: 'mingcute:settings-3-line',
            order: 7,
            action: null
        },
                {
            title: 'Réclamations',
            path: '/contact',
            icon: 'mingcute:mail-line',
            order: 8,
            action: null
        },
        {
            title: 'Logout',
            path: null,
            icon: 'mingcute:exit-door-line',
            order: 9,
            action: handleLogout
        },

    ]

    const adminUserLinks: Link[] = [
        {
            title: 'Platformes',
            path: '/platformes',
            icon: 'mingcute:game-2-line',
            order: 5,
            action: null
        },
        {
            title: 'Users',
            path: '/users',
            icon: 'mingcute:user-3-line',
            order: 6,
            action: null
        },
        {
            title: 'Statistiques',
            path: '/statistiques',
            icon: 'mingcute:chart-vertical-line',
            order: 7,
            action: null
        }
    ]

    if (!user.value) items.value = noUserLinks
    else if (!user.value?.roles.includes('ADMIN')) items.value = [...basicUserLinks]
    else items.value = [...basicUserLinks, ...adminUserLinks]
}

onMounted(setupLinks)

watch(user, () => {
    setupLinks()
})

watch(items, () => {
    items.value.sort((a, b) => a.order - b.order)
})

const emit = defineEmits(['closeMenu'])
const handleEmitCloseMenu = (link: Link) => {
    emit('closeMenu')
    if (link.action) link.action()
}
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
                    <NuxtLink :to="item.path ? item.path : ''" @click="handleEmitCloseMenu(item)"
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
