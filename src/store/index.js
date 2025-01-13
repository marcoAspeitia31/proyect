import { createStore } from "vuex";
import functionalities from "@/store/modules/functionalities";
import translation from "@/store/modules/translation";
import clickEvents from "@/store/modules/clickEvents";

export default createStore({
  modules: {
    functionalities,
    translation,
    clickEvents,
  },
});
