const state = {
  content: [],
  contentToShow: 10,
  user: false,
};

// getters
const getters = {};

// mutations
const mutations = {
  setContentToShow(state, payload) {
    state.content = [];
    state.content = payload.allData.slice(
      payload.currentPage * state.contentToShow - state.contentToShow,
      payload.currentPage * state.contentToShow
    );
  },
  setUser(state, payload) {
    state.user = payload.user;
    localStorage.setItem("user", payload.user);
    console.log("set user", payload, state.user);
  },
  logoutUser(state) {
    state.user = false;
    localStorage.removeItem("user");
  },
};

// actions
const actions = {
  changePage({ commit }, payload) {
    payload.toPage <= payload.totalPages &&
      payload.toPage > 0 &&
      (payload["currentPage"] = payload.toPage);
    payload.toPage <= payload.totalPages
      ? (payload = payload)
      : (payload["toPage"] = payload.currentPage);
    commit("setContentToShow", payload);
    return [...calculatePages(payload)];
  },
  setUser({ commit }, payload) {
    commit("setUser", payload);
  },
  logoutUser({ commit }) {
    commit("logoutUser");
  },
};

function calculatePages(payload) {
  var pages = [];
  let startpage =
    payload.currentPage === 1 ? payload.currentPage : payload.currentPage - 1;
  let endPage =
    payload.currentPage === 1
      ? payload.currentPage + 2
      : payload.currentPage + 1 <= payload.totalPages
      ? payload.currentPage + 1
      : payload.currentPage;
  for (let i = startpage; i <= endPage; i++) {
    i <= payload.totalPages && pages.push(i);
  }
  return pages;
}
export default { namespaced: true, state, getters, actions, mutations };
