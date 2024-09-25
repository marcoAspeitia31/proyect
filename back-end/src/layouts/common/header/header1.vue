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
                placeholder="Search Voxo .."
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
                <span class="sr-only">Loading...</span>
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
              <span class="badge rounded-pill badge-theme">4</span>
            </div>
            <ul class="notification-dropdown onhover-show-div">
              <li>
                <span class="lnr lnr-alarm"></span>
                <h6 class="f-18 mb-0">Notitications</h6>
              </li>
              <li>
                <p>
                  <i class="fa fa-circle me-3 font-primary"></i>Delivery
                  processing <span class="pull-right">10 min.</span>
                </p>
              </li>
              <li>
                <p>
                  <i class="fa fa-circle me-3 font-success"></i>Order
                  Complete<span class="pull-right">1 hr</span>
                </p>
              </li>
              <li>
                <p>
                  <i class="fa fa-circle me-3 font-info"></i>Tickets
                  Generated<span class="pull-right">3 hr</span>
                </p>
              </li>
              <li>
                <p>
                  <i class="fa fa-circle me-3 font-danger"></i>Delivery
                  Complete<span class="pull-right">6 hr</span>
                </p>
              </li>
              <li>
                <a class="btn btn-primary" href="javascript:void(0)"
                  >Check all notification</a
                >
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
                <h6 class="f-18 mb-0">Message Box</h6>
              </li>
              <li>
                <div class="media">
                  <img
                    class="img-fluid rounded-circle me-3"
                    src="@/assets/images/user/1.jpg"
                    alt="user1"
                  />
                  <div class="status-circle online"></div>
                  <div class="media-body">
                    <span>Erica Hughes</span>
                    <p>Lorem Ipsum is simply dummy...</p>
                  </div>
                  <p class="f-12 font-success">58 mins ago</p>
                </div>
              </li>
              <li>
                <div class="media">
                  <img
                    class="img-fluid rounded-circle me-3"
                    src="@/assets/images/user/2.png"
                    alt="user2"
                  />
                  <div class="status-circle online"></div>
                  <div class="media-body">
                    <span>Kori Thomas</span>
                    <p>Lorem Ipsum is simply dummy...</p>
                  </div>
                  <p class="f-12 font-success">1 hr ago</p>
                </div>
              </li>
              <li>
                <div class="media">
                  <img
                    class="img-fluid rounded-circle me-3"
                    src="@/assets/images/user/3.png"
                    alt="user3"
                  />
                  <div class="status-circle offline"></div>
                  <div class="media-body">
                    <span>Ain Chavez</span>
                    <p>Lorem Ipsum is simply dummy...</p>
                  </div>
                  <p class="f-12 font-danger">32 mins ago</p>
                </div>
              </li>
              <li class="text-center">
                <a class="btn btn-primary" href="javascript:void(0)"
                  >View All</a
                >
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
                <span>Emay Walter</span>
                <p class="mb-0 font-roboto">
                  Admin<i class="middle fa fa-angle-down"></i>
                </p>
              </div>
            </div>
            <ul class="profile-dropdown onhover-show-div">
              <li>
                <router-link to="/all_users" href="javascript:void(0)">
                  <vueFeather type="users"></vueFeather>
                  <span>Users</span>
                </router-link>
              </li>
              <li>
                <router-link to="/order_list" href="javascript:void(0)">
                  <vueFeather type="archive"></vueFeather>
                  <span>Orders</span>
                </router-link>
              </li>
              <li>
                <router-link to="/support_ticket" href="javascript:void(0)">
                  <vueFeather type="phone"></vueFeather>
                  <span>Spports Tickets</span>
                </router-link>
              </li>
              <li>
                <router-link to="/profile_setting" href="javascript:void(0)">
                  <vueFeather type="settings"></vueFeather>
                  <span>Settings</span>
                </router-link>
              </li>
              <li>
                <a
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  href="javascript:void(0)"
                >
                  <vueFeather type="log-out"></vueFeather>
                  <span>Log out</span>
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
