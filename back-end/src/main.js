import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import titleMixin from "@/mixins/titleMixin";
import "./assets/scss/app.scss";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "@/assets/css/font-awesome.css";
import "@/assets/css/linearicon.css";
import "@/assets/css/vendors/font-awesome.css";
import vueFeather from "vue-feather";
import CKEditor from "@ckeditor/ckeditor5-vue";
import VueApexCharts from "vue3-apexcharts";
import { VueFire, VueFireAuth } from 'vuefire'; // Importar VueFire y VueFireAuth
import * as VueGoogleMaps from 'vue2-google-maps';
// Crear la aplicación con Vue 3
const app = createApp(App);

// Registrar plugins y componentes
app.use(store);
app.use(CKEditor);
app.use(VueFire, {
  modules: [VueFireAuth],  // Registrar el módulo VueFireAuth si lo necesitas
});
app.component("vueFeather", vueFeather);
app.component("apexchart", VueApexCharts);
app.mixin(titleMixin);
app.use(router);

// Montar la aplicación
app.mount("#app");
