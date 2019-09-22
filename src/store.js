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
            refreshCookie(state){
                let jheckApiGeneratorData = Cookies.get('jheckApiGeneratorData');
                    return state.requests = typeof jheckApiGeneratorData != 'undefined' && jheckApiGeneratorData != '' ? JSON.parse(jheckApiGeneratorData) : [];
            },
            saveRequest( state, _data ){
                state.requests = _data;
                this.commit('saveCookie');
            },
            importJson( state, _data ){
                this.commit('saveRequest', _data);
                this.commit('refreshCookie');
            },
            saveCookie(state){
                Cookies.set('jheckApiGeneratorData', JSON.stringify(state.requests), { expires: 1 });
            },
            clearWorkspace(state){
                this.commit('saveRequest', []);
                this.commit('refreshCookie');
            }
        },
    })

  window.store = store
  return store
}
