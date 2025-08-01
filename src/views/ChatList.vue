<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRoomsStore } from '@/stores/rooms';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter()
const roomStore = useRoomsStore()
const { allRooms, detailRoom } = storeToRefs(roomStore)

const isImageMessage = (payload) => /\[file\].*\[\/file\]/.test(payload);
const avatarFallback = (e) => {
  e.target.src = 'https://eu.ui-avatars.com/api/?name=?&size=250'
}
</script>

<template>
  <div class="container w-fit h-fit">
    <div class="room-list">
      <div v-for="(item, idx) in allRooms" :key="item.id" class="room-list-item w-fit p-6 shadow"
        :class="[detailRoom?.room_id === item.room_id ? 'rl-active' : '']"
        @click="() => router.push(`/chat/${idx + 1}`)">
        <div class="flex items-center pointer">
          <div class="avatar-container">
            <img v-if="item.user_avatar_url" :src="item.user_avatar_url" alt="" class="avatar-img"
              @error="avatarFallback" />
          </div>
          <div class="ml-6">
            <p class="mb-2 text-9">{{ item.name }}</p>
            <p v-if="isImageMessage(item.last_comment_text)" class="text-muted text-8">
              <i>- File attached -</i>
            </p>
            <p v-else="(item.last_comment_text)" class="text-muted text-8">
              {{ item.last_comment_text }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>
