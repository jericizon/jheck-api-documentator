import Vue from 'vue'
import Vuex from 'vuex'

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
      data: [],
    },
    getters: {
      data: state => {
        return state.data = window.getCookie('data') != '' ? JSON.parse( window.getCookie('data') ) : [];
      }
    },
    mutations: {
      createRequest( state, _data ){
        _data.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        state.data.push(_data);
        this.commit("saveCookie");
      },
      deleteRequest( state, idx ){
        if ( typeof state.data[idx] != 'undefined' ) {
          state.data.splice(idx, 1);
          this.commit("saveCookie");
        }
      },
      updateData( state, _data ){

        let idx = _data.idx;
        if ( typeof state.data != 'undefined' && typeof _data != 'undefined' ) {
          state.data[idx] = _data;
          this.commit("saveCookie");
        }
      },
      saveCookie( state ){
        window.setCookie('data', JSON.stringify( state.data ), 1 );
      },
      importCookie( state, data ){
        state.data = data;
        this.commit('saveCookie');
      }
    },
    actions: {
      
    }
  })

  window.store = store
  return store
}