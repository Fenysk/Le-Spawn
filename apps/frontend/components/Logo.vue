<script setup>
const props = defineProps({
    style: {
        type: String,
        default: 'white-on-black',
        required: false
    }
})
</script>

<template>
    <div class="overflow-hidden">
        <img src="@/assets/images/Le SPAWN W-B.png" alt="logo" class="w-full h-full object-contain" v-if="style === 'white-on-black'">
        <img src="@/assets/images/MAIN CONTOUR.png" alt="logo" class="w-full h-full object-contain" v-if="style === 'contour'">
    </div>
</template>
