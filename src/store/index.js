import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stations: null,
    searchInput: "",
  },
  mutations: {
    updateStations (state, val){
      state.stations = val;
    }
  },
  actions: {
  },
  modules: {
  }
})
