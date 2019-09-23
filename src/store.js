import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from "js-cookie";

Vue.use(Vuex)

// export default new Vuex.Store({
//   state: {

//   },
//   mutations: {

//   },
//   actions: {

//   }
// })

export default function (/* { ssrContext } */) {
    const store = new Vuex.Store({
        state: {
            requests: [],
        },
        getters: {
            requests: state => {
                return state.requests;
            }
        },
        mutations: {
            refreshStorage(state){
                let jheckApiGeneratorData = localStorage.jheckApiGeneratorData;
                    return state.requests = typeof jheckApiGeneratorData != 'undefined' && jheckApiGeneratorData != '' ? JSON.parse(jheckApiGeneratorData) : [];
            },
            saveRequest( state, _data ){
                state.requests = _data;
                localStorage.jheckApiGeneratorData = JSON.stringify(_data);
            },
            importJson( state, _data ){
                this.commit('saveRequest', _data);
                this.commit('refreshStorage');
            },
            clearWorkspace(state){
                this.commit('saveRequest', []);
                this.commit('refreshStorage');
            }
        },
    })

  window.store = store
  return store
}
