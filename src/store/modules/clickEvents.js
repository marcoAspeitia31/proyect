const state = {
  toggleEvents: {
    isSidebarOpen: true,
  },
  openSearchbar: false,
  overlay: false,
};

// getters
const getters = {};

// mutations
const mutations = {
  toggleSidebar(state) {
    state.toggleEvents.isSidebarOpen = !state.toggleEvents.isSidebarOpen;
    state.overlay = !state.overlay;
  },
  toggleSearchBar(state) {
    state.openSearchbar = !state.openSearchbar;
  },
  closeOverlay(state) {
    Object.keys(state.toggleEvents).forEach((item) => {
      state.toggleEvents[item] = false;
    });
    state.overlay = false;
  },
  showSidebar(state) {
    state.toggleEvents.isSidebarOpen = true;
    state.overlay = false;
  },
  toggleBigScreenSidebar(state) {
    state.toggleEvents.isSidebarOpen = !state.toggleEvents.isSidebarOpen;
  },
};

// actions
const actions = {
  toggleSearchBar({ commit }) {
    commit("toggleSearchBar");
  },
  toggleSidebar({ commit }) {
    commit("toggleSidebar");
  },
  closeOverlay({ commit }) {
    commit("closeOverlay");
  },
  showSidebar({ commit }) {
    commit("showSidebar");
  },
  toggleBigScreenSidebar({ commit }) {
    commit("toggleBigScreenSidebar");
  },
};

export default { namespaced: true, state, getters, actions, mutations };
