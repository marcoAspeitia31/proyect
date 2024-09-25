<template>
  <!-- Page Sidebar Start-->
  <div class="sidebar-wrapper" :class="isSidebarOpen ? '' : 'close_icon'">
    <div>
      <div class="logo-wrapper logo-wrapper-center">
        <router-link
          to="/"
          href="javascript:void(0)"
          data-bs-original-title=""
          title=""
        >
          <img
            class="img-fluid for-dark"
            src="@/assets/images/logo/logo-white.png"
            alt=""
          />
        </router-link>
        <div class="back-btn" @click.prevent="closeOverlay">
          <i class="fa fa-angle-left"></i>
        </div>
        <div class="toggle-sidebar" @click.prevent="toggleBigScreenSidebar">
          <i
            class="status_toggle middle sidebar-toggle"
            data-feather="grid"
          ></i>
          <vueFeather type="grid"></vueFeather>
        </div>
      </div>
      <div class="logo-icon-wrapper">
        <a href="javascript:void(0)">
          <img
            class="img-fluid main-logo"
            src="@/assets/images/logo/logo.png"
            alt="logo"
          />
        </a>
      </div>
      <nav class="sidebar-main">
        <div class="left-arrow" id="left-arrow">
          <i data-feather="arrow-left"></i>
        </div>
        <div id="sidebar-menu">
          <ul class="sidebar-links" id="simple-bar">
            <li class="back-btn"></li>
            <li
              v-for="(item, index) in sidebarLinks"
              :key="index"
              :class="item.application ? item.mainClasses : 'sidebar-list'"
            >
              <div v-if="item.application">
                <h6 class="lan-1">{{ item.name }}</h6>
                <p class="lan-2">{{ item.subHeading }}</p>
              </div>
              <a
                v-else-if="item.children"
                :class="[
                  item.class ? item.class : 'sidebar-link sidebar-title',
                  item.active ? 'active' : '',
                ]"
                href="javascript:void(0)"
                @click.prevent="toggleSubmenu(item.name)"
              >
                <vueFeather :type="item.icon" v-if="item.icon"></vueFeather>
                <span>{{ item.name }}</span>
                <div class="according-menu" v-if="item.children">
                  <i class="fa fa-angle-down" v-if="item.active"></i>
                  <i class="fa fa-angle-right" v-else></i>
                </div>
              </a>
              <router-link
                v-else
                :class="[
                  item.class
                    ? item.class
                    : 'sidebar-link sidebar-title link-nav',
                  item.active ? 'active' : '',
                ]"
                href="javascript:void(0)"
                :to="item.path"
                @click="currentActiveMenu = item.name"
              >
                <vueFeather :type="item.icon" v-if="item.icon"></vueFeather>
                <span>{{ item.name }}</span>
              </router-link>

              <ul
                class="sidebar-submenu"
                v-if="item.children"
                :class="item.active ? '' : 'hideSubmenu'"
              >
                <li v-for="(link, index) in item.children" :key="'a' + index">
                  <router-link
                    :to="link.path"
                    :class="[{ active: item.active }]"
                    >{{ link.name }}</router-link
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="right-arrow" id="right-arrow">
          <vueFeather type="arrow-right"></vueFeather>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import Menu from "@/data/sidebar.json";
import { mapState } from "vuex";
export default {
  data() {
    return {
      currentActiveMenu: "",
      sidebarLinks: Menu.data,
    };
  },
  computed: {
    ...mapState({
      isSidebarOpen: (state) => state.clickEvents.toggleEvents.isSidebarOpen,
    }),
  },
  methods: {
    closeOverlay() {
      this.$store.dispatch("clickEvents/closeOverlay");
    },
    toggleBigScreenSidebar() {
      this.$store.dispatch("clickEvents/toggleBigScreenSidebar");
    },
    toggleSubmenu(name) {
      this.sidebarLinks.forEach((item) => {
        if (item.name != name) item.active = false;
      });
      this.sidebarLinks.every((item) => {
        if (item.name === name) {
          item.active = !item.active;
          return false;
        } else return true;
      });
    },
  },
};
</script>

<style lang="css">
.hideSubmenu {
  display: none;
}
</style>
