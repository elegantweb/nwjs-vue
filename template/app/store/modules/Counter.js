var state = {
  main: 0
}

var mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

var actions = {
}

export default {
  state,
  mutations,
  actions
}
