import * as types from './mutation-types'

const mutations = {
  [types.SET_USERNAME](state, username) {
    state.username = username
  },
  [types.SET_SIGN_IN_INFO](state, signInInfo) {
    state.signInInfo = signInInfo
  }
}

export default mutations
