import { auth, signInWithEmailAndPassword, signOut } from "@/firebase";

const state = {
  user: null,
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  clearUser(state) {
    state.user = null;
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      commit("setUser", userCredential.user);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw error;
    }
  },
  async logout({ commit }) {
    try {
      await signOut(auth);
      commit("clearUser");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  },
};

const getters = {
  isAuthenticated: (state) => !!state.user,
  getUser: (state) => state.user,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
