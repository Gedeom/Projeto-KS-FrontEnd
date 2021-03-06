import Vue from 'vue'
import Vuex from 'vuex'
import UsersModule from './modules/users-module'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions:{},
    modules:{
        UsersModule
    }
})