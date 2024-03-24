<script setup lang="ts">
const open = ref(false);
</script>

<template>
    <div class="fixed left-0 top-0 z-[50] w-full bg-primary lg:w-fit">
        <!-- Mobile -->
        <div class="z-50 flex h-16 w-full items-center justify-between p-4 lg:hidden">
            <nuxt-link to="/" class="block h-full">
                <Logo class="h-full" />
            </nuxt-link>
            <Icon class="absolute right-4 top-4 z-50 cursor-pointer" color="white" size="30" name="mingcute:menu-fill"
                @click="open = true" />

            <div class="fixed left-0 top-0 z-[999] h-screen w-full bg-primary transition-all duration-300"
                :class="{ 'translate-y-0': open, '-translate-y-full': !open }">
                <SidebarMenu @closeMenu="open = false" />
                <Icon class="absolute right-4 top-4 z-50 cursor-pointer" color="white" size="30"
                    name="mingcute:close-fill" @click="open = false" />
            </div>
        </div>

        <!-- Desktop -->
        <div class="hidden h-screen w-64 flex-col justify-between border-r shadow lg:flex">
            <SidebarMenu />
            <div>
                UserItem
            </div>
        </div>
    </div>
</template>
