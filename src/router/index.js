import { createRouter, createWebHistory } from "vue-router";
import ChatList from "@/views/ChatList.vue";
import ChatRoom from "@/views/ChatRoom.vue";
import NotFound from "@/views/404.vue";

const routes = [
  // default to '/chat/1'
  { path: "/", redirect: "/chat/1" },
  {
    path: "/chat/:id",
    component: ChatList,
    children: [
      {
        path: "",
        component: ChatRoom,
      },
    ],
    beforeEnter: async (to, from, next) => {
      const id = to.params.id;
      // make sure id positive int
      if (!/^\d+$/.test(id) || parseInt(id) <= 0) {
        return next({ name: "NotFound" });
      }
      next();
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
