import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
	userInfo: null, //用户信息
	menuInfo: null, //用户权限

	// TODO: sentry infos

	// TODO: sentry status
	
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
})