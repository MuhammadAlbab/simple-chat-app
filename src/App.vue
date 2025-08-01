<script setup>
import { onMounted } from 'vue';
import { useRoomsStore } from '@/stores/rooms';

const roomStore = useRoomsStore()
const { initRooms } = roomStore

onMounted(() => {
  initRooms()
})
</script>

<template>
  <router-view />
</template>