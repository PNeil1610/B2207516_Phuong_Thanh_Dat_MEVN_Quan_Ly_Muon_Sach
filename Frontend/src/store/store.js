import { createStore } from 'vuex';

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || { _id: '', role: '' }, 
  },
  mutations: {
    setUser(state, user) {
      //console.log("Cập nhật Vuex user:", user);
      state.user = { ...user };
      localStorage.setItem('user', JSON.stringify(user)); 
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user); 
    },
    logout({ commit }) {
      commit('setUser', { _id: '', role: ''});
      localStorage.removeItem('user');
    },
  },
  getters: {
    getUser: (state) => state.user,
    getUserRole: (state) => state.user.role || '',
    getUserSdt: (state) => state.user._id || '',
  },
});