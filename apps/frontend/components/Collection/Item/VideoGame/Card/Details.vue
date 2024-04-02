<script setup lang="ts">
import type { VideoGame } from '~/services/collections.service';

const loading = ref(false);

defineProps<{
    videoGame: VideoGame;
}>();
</script>

<template>
    <div>
        <pre class="max-h-[70vh] w-full overflow-auto">{{ videoGame }}</pre>
    </div>
</template>
