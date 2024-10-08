<template>
  <div class="page-header" :class="isSidebarOpen ? '' : 'close_icon'">
    <div class="header-wrapper row m-0">
      <div class="header-logo-wrapper col-auto p-0">
        <div class="logo-wrapper">
          <a href="javascript:void(0)">
            <img
              class="img-fluid main-logo"
              src="@/assets/images/logo/logo.png"
              alt="logo"
            />
            <img
              class="img-fluid white-logo"
              src="@/assets/images/logo/logo-white.png"
              alt="logo"
            />
          </a>
        </div>
        <div class="toggle-sidebar" @click.prevent="toggleSidebar">
          <vueFeather
            type="align-center"
            class="status_toggle middle sidebar-toggle"
          ></vueFeather>
        </div>
      </div>

      <form
        class="form-inline search-full col"
        :class="openSearchbar ? 'open' : ''"
        action="javascript:void(0)"
        method="get"
      >
        <div class="form-group w-100">
          <div class="Typeahead Typeahead--twitterUsers">
            <div class="u-posRelative">
              <input
                class="demo-input Typeahead-input form-control-plaintext w-100"
                type="text"
                placeholder="Buscar en SuperKompras.."
                name="q"
                title=""
                autofocus
              />
              <vueFeather
                type="x"
                class="close-search"
                @click.prevent="toggleSearchbar"
              ></vueFeather>

              <div class="spinner-border Typeahead-spinner" role="status">
                <span class="sr-only">Cargando...</span>
              </div>
            </div>
            <div class="Typeahead-menu"></div>
          </div>
        </div>
      </form>
      <div class="nav-right col-4 pull-right right-header p-0">
        <ul class="nav-menus">
          <li>
            <span class="header-search" @click.prevent="toggleSearchbar">
              <span class="lnr lnr-magnifier"></span>
            </span>
          </li>
          <li class="onhover-dropdown">
            <div class="notification-box">
              <span class="lnr lnr-alarm"></span>
              <span class="badge rounded-pill badge-theme"></span>
            </div>
            <ul class="notification-dropdown onhover-show-div">
              <li>
                <span class="lnr lnr-alarm"></span>
                <h6 class="f-18 mb-0">Notificaciones</h6>
              </li>
            </ul>
          </li>

          <li>
            <div class="mode" @click.prevent="toggleDarkMode">
              <span class="lnr lnr-moon"></span>
            </div>
          </li>

          <li class="onhover-dropdown">
            <span class="lnr lnr-bubble"></span>
            <ul class="chat-dropdown onhover-show-div">
              <li>
                <span class="lnr lnr-bubble"></span>
                <h6 class="f-18 mb-0">Cuadro de mensaje</h6>
              </li>
            </ul>
          </li>

          <li class="maximize">
            <a
              class="text-dark"
              href="javascript:void(0)!"
              @click.prevent="toggleFullScreen"
            >
              <span class="lnr lnr-frame-expand"></span>
            </a>
          </li>
          <li class="profile-nav onhover-dropdown pe-0 me-0">
            <div class="media profile-media">
              <img
                class="user-profile rounded-circle"
                src="@/assets/images/users/4.jpg"
                alt=""
              />
              <div class="user-name-hide media-body">
                <span>Alexander Byron</span>
                <p class="mb-0 font-roboto">
                  Admin<i class="middle fa fa-angle-down"></i>
                </p>
              </div>
            </div>
            <ul class="profile-dropdown onhover-show-div">
              <li>
                <router-link to="/all_users" href="javascript:void(0)">
                  <vueFeather type="users"></vueFeather>
                  <span>Usuarios</span>
                </router-link>
              </li>
              <li>
                <router-link to="/profile_setting" href="javascript:void(0)">
                  <vueFeather type="settings"></vueFeather>
                  <span>Configuracion</span>
                </router-link>
              </li>
              <li>
                <a
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  href="javascript:void(0)"
                >
                  <vueFeather type="log-out"></vueFeather>
                  <span>Cerrar Sesion</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      fullScreen: false,
      darkMode: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("clickEvents/toggleSidebar");
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    toggleSearchbar() {
      this.$store.dispatch("clickEvents/toggleSearchBar");
    },
    toggleFullScreen() {
      if (this.fullScreen) {
        this.fullScreen = false;
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
        this.fullScreen = true;
      }
    },
  },
  computed: {
    ...mapState({
      isSidebarOpen: (state) => state.clickEvents.toggleEvents.isSidebarOpen,
      openSearchbar: (state) => state.clickEvents.openSearchbar,
    }),
  },
  watch: {
    darkMode: function () {
      if (this.darkMode) {
        document.body.classList.add("dark-only");
        localStorage.setItem("darkModeActive", true);
      } else {
        document.body.classList.remove("dark-only");
        localStorage.setItem("darkModeActive", false);
      }
    },
  },
  mounted() {
    this.darkMode = localStorage.getItem("darkModeActive") || false;
  },
};
</script>

<style></style>
