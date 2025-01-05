<template>
  <div class="page-header" :class="isSidebarOpen ? '' : 'close_icon'">
    <div class="header-wrapper row m-0">
      <div class="header-logo-wrapper col-auto p-0">
        <div class="logo-wrapper">
          <a href="javascript:void(0)">
            <img
              class="img-fluid main-logo"
              src="@/assets/images/logo/favicon1.png"
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

              <div
                class="spinner-border Typeahead-spinner"
                role="status"
                style="margin-left: 10px"
              >
                <span class="sr-only">Cargando...</span>
              </div>
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
          <li class="onhover-dropdown">
            <div class="notification-box">
              <span class="lnr lnr-alarm"></span>
              <span class="badge rounded-pill badge-theme">{{
                notifications.length
              }}</span>
            </div>
            <ul class="notification-dropdown onhover-show-div">
              <li>
                <span class="lnr lnr-alarm"></span>
                <h6 class="f-18 mb-0">Notificaciones</h6>
              </li>
              <li v-for="(notification, index) in notifications" :key="index">
                <p class="mb-0">{{ notification.text }}</p>
                <span class="small text-muted">{{ notification.time }}</span>
              </li>
            </ul>
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
              <img
                class="user-profile rounded-circle"
                src="@/assets/images/users/4.jpg"
                alt=""
              />
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
import { ref, onValue } from "firebase/database";
import { db } from "@/firebase";

export default {
  data() {
    return {
      fullScreen: false,
      darkMode: false,
      notifications: [], // Array para almacenar las notificaciones
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
        const userRef = ref(
          db,
          `/projects/superkomprasBackoffice/users/${uid}`
        );
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
    logout() {
      const auth = getAuth();
      auth.signOut().then(() => {
        this.$store.dispatch("functionalities/setUser", { user: null });
        this.$router.push("/login");
      });
    },
    setupRealTimeNotifications() {
      const ordersRef = ref(db, "/projects/superkomprasBackoffice/orders");

      onValue(ordersRef, (snapshot) => {
        if (snapshot.exists()) {
          const orders = Object.values(snapshot.val());
          const now = new Date();
          const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          ).getTime();
          const endOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
          ).getTime();

          const newOrders = orders.filter((order) => {
            if (!order.TimeSolicitud) return false;
            const orderTime = parseInt(order.TimeSolicitud);
            return (
              orderTime >= startOfMonth &&
              orderTime <= endOfMonth &&
              order.Status === "Solicitud"
            );
          });

          // Actualizar notificaciones
          this.notifications = newOrders.map((order) => ({
            text: `Pedido solicitado por ${
              order.clientName || "Cliente desconocido"
            }`,
            time: new Date(order.TimeSolicitud).toLocaleString(),
          }));
        }
      });
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

    // Configurar listener en tiempo real para las notificaciones
    this.setupRealTimeNotifications();
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
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 50%;
}
.notification-dropdown {
  max-height: 300px;
  overflow-y: auto;
}
.notification-dropdown li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.notification-dropdown li:last-child {
  border-bottom: none;
}

</style>
