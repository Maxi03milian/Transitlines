import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stations: null,
    connections: null,
    searchInput: "",
    fromStations: {},
    toStations: {},
    routeOptions: {
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      time: new Date().toLocaleTimeString('de-CH', { hour12: false }),
      isArrivalTime: true,
      bike: false,
    }
  },
  mutations: {
    updateStations (state, val){
      state.stations = val;
    },
    updateConnections (state, val){
      state.connections = val;
    },
    updateFromStations (state, val){
      state.fromStations = val;
    },
    updateToStations (state, val){
      state.toStations = val;
    }
  },
  actions: {
  },
  modules: {
  }
})
