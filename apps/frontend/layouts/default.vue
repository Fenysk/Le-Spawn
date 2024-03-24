<script setup>
</script>

<template>
    <div class="grid items-start lg:flex lg:pl-64">
        <header>
            <Sidebar />
        </header>
        <div class="grow">
            <slot />
        </div>
    </div>
</template>
