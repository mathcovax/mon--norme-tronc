import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { i18n } from "./lib/i18n";

import { useUserStore } from "@/stores/user";
import "@/stores/cart";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

useUserStore();

app.mount("#app");
