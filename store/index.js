import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    lastBackupTime: ''
  },
  mutations: {
    setLastBackupTime(state, val) {
      state.lastBackupTime = val
    }
  }
})

export default store
