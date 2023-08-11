/* eslint-disable no-irregular-whitespace */
import Vuex from 'vuex';

//developer platform
import platformData from './platform_modules/platformData';


export default new Vuex.Store({
    namespaced: true,
    state: {

    },
    mutations: {

    },
    actions: {

    },
    getters: {
        // getters are like computed properties used for filtering the data from the state
        // used in modules check modules
    },
    modules: {

        platformData
    }
})