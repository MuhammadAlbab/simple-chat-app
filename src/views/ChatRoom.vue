<script setup>
import { ref, computed, watch } from 'vue';
import { useRoomsStore } from '@/stores/rooms';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const roomStore = useRoomsStore()
const { setDetailRoom, setDetailRoomIdx } = roomStore
const { allRooms, detailRoom } = storeToRefs(roomStore)

const message = ref('')
const messageBoxRefs = ref(null)
const messageArr = ref('')

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const formattedTimestamp = (payload) =>
  new Date(payload).toLocaleString('en-GB', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(/,/, '')

const extractImageUrl = (payload) => payload.match(/\[file\](.*?)\[\/file\]/)?.[1]
const isImageMessage = (payload) => /\[file\].*\[\/file\]/.test(payload);
const avatarFallback = (e) => {
  e.target.src = 'https://eu.ui-avatars.com/api/?name=?&size=250'
}

const handleSendMsg = () => {
  if (message.value.trim()) {
    messageArr.value = [...messageArr.value, {
      id: generateId(),
      sender_type: 'customer',
      message_text: message.value,
      timestamp: new Date().toISOString()
    }]
    messageArr.value.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    message.value = ''
  }
};

const handleEnter = (event) => {
  if (!event.shiftKey) {
    event.preventDefault();
    if (!message.value.trim()) return
    handleSendMsg();
  }
};

const roomId = computed(() => route.params.id || 1)
watch(roomId, (id) => {
  let parsedId = parseInt(id || 0) || null
  if (parsedId && typeof parsedId === 'number') {
    if (parsedId < 1 || parsedId > 50) return
    parsedId = parsedId - 1
    setDetailRoomIdx(parsedId)
    setDetailRoom(allRooms.value[parsedId]);
    const tempMessageArr = []
    if (detailRoom?.value.last_comment_sender_type === 'system' || detailRoom?.value.last_comment_sender_type === 'admin') {
      tempMessageArr.push({
        id: generateId(),
        sender_type: detailRoom?.value.last_comment_sender_type,
        message_text: detailRoom?.value.last_comment_text,
        timestamp: detailRoom?.value.last_comment_timestamp
      })
      if (detailRoom?.value.last_customer_comment_text) {
        tempMessageArr.push({
          id: generateId(),
          sender_type: 'customer',
          message_text: detailRoom?.value.last_customer_comment_text,
          timestamp: detailRoom?.value.last_customer_timestamp
        })
      }
    } else {
      if (detailRoom?.value.last_customer_comment_text) {
        tempMessageArr.push({
          id: generateId(),
          sender_type: 'customer',
          message_text: detailRoom?.value.last_customer_comment_text,
          timestamp: detailRoom?.value.last_customer_timestamp
        })
      }
    }
    tempMessageArr.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    messageArr.value = tempMessageArr
  }
}, { immediate: true });

</script>

<template>
  <div v-if="detailRoom" class="room-detail">
    <div class="room-header">
      <div class="avatar-container">
        <img v-if="detailRoom.user_avatar_url" :src="detailRoom.user_avatar_url" alt="" class="avatar-img"
          @error="avatarFallback" />
      </div>
      <div class="ml-6">
        <p class="mb-2 text-9">{{ detailRoom.name }}</p>
        <p class="text-muted text-6">
          {{ detailRoom.user_id }}
        </p>
      </div>
      <div style="margin-left: auto;" class="flex items-center">
        <div class="mr-6">Room ID: {{ roomId }}</div>
        <div v-if="(detailRoom.is_waiting)" style="width: 20px; height: 20px; border-radius: 50%; background: orange;">
        </div>
        <div v-else style="width: 20px; height: 20px; border-radius: 50%; background: green;"></div>
      </div>
    </div>
    <div class="room-space shadow">
      <div class="w-fit">
        <div v-for="(messageItem) in messageArr" :key="messageItem.id" class=""
          :class="['message-container', messageItem.sender_type === 'customer' ? 'sent' : 'received']">
          <div v-if="isImageMessage(messageItem.message_text)" class="message image-message">
            <img :src="extractImageUrl(messageItem.message_text)" alt="chat image" />
          </div>
          <div v-else class="message">
            <p>{{ messageItem.message_text }}</p>
          </div>
          <div class="timestamp">{{ messageItem.timestamp ? formattedTimestamp(messageItem.timestamp) : '-' }}</div>
        </div>
      </div>
    </div>
    <div class="room-action shadow">
      <form class="input-form" @submit.prevent="handleSendMsg">
        <textarea ref="messageBoxRefs" autofocus v-model="message" placeholder="Write a message..."
          class="w-fit mr-4 p-2" :rows="5" @keydown.enter="handleEnter"></textarea>
        <div>
          <button class="send-button" type="submit" :disabled="!message.trim()"></button>
        </div>
      </form>
    </div>
  </div>
  <div v-else class="w-fit h-fit flex">
    <h2 style="margin: auto">404 Room not found!</h2>
  </div>
</template>