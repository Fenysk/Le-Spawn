<script setup lang="ts">
import Skeleton from '~/components/ui/skeleton/Skeleton.vue';

const loading = ref(false);
</script>

<template>
    <Skeleton class="h-32 w-full grow rounded-3xl bg-zinc-500" />
</template>
