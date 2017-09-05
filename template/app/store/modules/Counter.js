const state = {
  main: 0
}

const getters = {
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
}

export default {
  state,
  getters,
  mutations,
  actions
}
