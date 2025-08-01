import staticRooms from "@/static/list_rooms.json";
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useRoomsStore = defineStore("rooms-store", () => {
  const allRooms = ref([]);
  const detailRoom = ref(null);
  const detailRoomIdx = ref(null);
  const roomTotal = computed(() => allRooms.value.length);

  function initRooms() {
    allRooms.value = staticRooms?.data?.customer_rooms || [];
  }

  function setDetailRoomIdx(payload) {
    if (allRooms.value.length <= 0) return;
    detailRoomIdx.value = payload;
  }

  function setDetailRoom(payload) {
    if (allRooms.value.length <= 0) return;
    detailRoom.value = payload;
  }

  function cleanupRooms() {
    allRooms.value = [];
    detailRoom.value = null;
    detailRoomIdx.value = null;
  }

  return {
    allRooms,
    detailRoom,
    roomTotal,
    initRooms,
    cleanupRooms,
    setDetailRoom,
    setDetailRoomIdx,
  };
});
