<template>
  <div class="page-header" :class="isSidebarOpen ? '' : 'close_icon'">
    <div class="header-wrapper row m-0">
      <div class="header-logo-wrapper col-auto p-0">
        <div class="logo-wrapper">
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
            <div class="d-flex align-items-center" style="position: relative">
              <input
                class="demo-input Typeahead-input form-control-plaintext w-100"
                type="text"
                placeholder="Buscar en SuperKompras.."
                name=""
                title=""
                autofocus
              />
              <vueFeather
                type="x"
                class="close-search"
                @click.prevent="toggleSearchbar"
                style="cursor: pointer; margin-left: 5px"
              ></vueFeather>
            </div>
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

          <li>
            <div class="mode" @click.prevent="toggleDarkMode">
              <span class="lnr lnr-moon"></span>
            </div>
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
              <div
                class="user-name-hide media-body"
                v-if="user && user.name && user.rol"
              >
                <span>{{ user.name }}</span>
                <p class="mb-0 font-roboto">
                  {{ user.rol }}<i class="middle fa fa-angle-down"></i>
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
                  @click.prevent="logout"
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";


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
    async fetchUserData(uid) {
  try {
    const userRef = ref(db, `/projects/superkomprasBackoffice/users/${uid}`);
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      this.$store.dispatch("functionalities/setUser", {
        user: {
          uid,
          name: userData.name,
          rol: userData.rol,
        },
      });
    }
  } catch (error) {
    console.error("Error al obtener datos del usuario: ", error);
  }
},
  },
  computed: {
    ...mapState({
      isSidebarOpen: (state) => state.clickEvents.toggleEvents.isSidebarOpen,
      openSearchbar: (state) => state.clickEvents.openSearchbar,
      user: (state) => state.functionalities.user,
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
    this.darkMode = localStorage.getItem("darkModeActive") === "true";
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.fetchUserData(user.uid);
      }
    });
  },
};
</script>

<style>
.form-inline.search-full {
  position: relative;
  width: 50%; /* Ajusta este porcentaje según el diseño deseado */
}

.search-full input {
  width: 100%;
  padding: 10px 15px;
  border-radius: 25px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  position: relative;
}

.Typeahead .lnr-magnifier {
  position: absolute;
  left: 15px;
  top: 50%; /* Posiciona el ícono verticalmente en el centro */
  transform: translateY(-50%); /* Ajusta para centrar el ícono */
  font-size: 18px;
  color: #6c757d;
}

.form-inline.search-full .Typeahead-input {
  padding-left: 40px; /* Deja espacio para el ícono */
}

.form-inline.search-full .Typeahead-input::placeholder {
  color: #b5b5b5;
}
.notification-box {
  position: relative;
  cursor: pointer;
}
.notification-box .badge-theme {
  position: absolute;
  top: -5px;
  right: -10px;
  background: #ff6f61;
  color: transparent;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 50%;
}
.notification-dropdown {
  max-height: 300px;
  overflow-y: auto;
}

.notification-dropdown li:last-child {
  border-bottom: none;
}
</style>
