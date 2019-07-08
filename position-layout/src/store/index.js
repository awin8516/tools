import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

const state = {
  screenOptions: {
    sizeList: {
      iphone4: {
        width: "320px",
        height: "416px",
        media:"@media (min-width: 320px) and (max-height: 416px)"
      },
      iphone5: {
        width: "320px",
        height: "504px",
        media:"@media (min-width: 320px) and (max-height: 504px)"
      },
      iphone6: {
        width: "375px",
        height: "603px",
        media:"@media (min-width: 375px) and (max-height: 603px)"
      },
      iphone6Plus: {
        width: "414px",
        height: "672px",
        media:"@media (min-width: 414px) and (max-height: 672px)"
      },
      iphone7: {
        width: "375px",
        height: "667px",
        media:"@media (min-width: 375px) and (max-height: 667px)"
      },
      iphoneX: {
        width: "375px",
        height: "812px",
        media:"@media (min-width: 375px) and (max-height: 812px)"
      }
    },
    name: "index",
    style: {
      width: "",
      height: "",
      "background-image": "url()",
      "background-color": "#fff",
      "background-repeat": "no-repeat",
      "background-size": "100% auto",
      "background-position": "left top"
    },
    el: null
  },
  elementList: [],
  mediaName: "default",
  positionOptions: ["relative", "absolute", "fixed"],
  ragneList: ["left", "top", "width", "height", "margin-left", "margin-top"]
};

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  strict: true
});

export default store;
