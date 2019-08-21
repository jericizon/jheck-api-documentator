<template>
  <div>
  	<div id="create-page">
	  	<aside id="left-sidebar">
	  		<LeftSideBar />
	  	</aside>
	  	<main id="main-content">
        <div class="container">
          <div id="form-wrapper">
            <div class="columns">
              <div class="column">
                <h3 class="subtitle">Request information</h3>
                <div class="form-input">
                  <label class="label" for="request_name">Request Name</label>
                  <input 
                    id="request_name" 
                    class="input"
                    type="text"
                    v-model="information.name"
                  >
                  <span class="helper-text">Label your request action</span>
                </div>

                <div class="form-input">
                  <label class="label" for="request_description">Description</label>
                  <textarea
                    id="request_description" 
                    class="input"
                    v-model="information.description"
                    ></textarea>
                </div>
                
                <hr>
                <h3 class="subtitle">Request details</h3>

                <div class="form-input">
                  <label class="label" for="request_endpoint">Endpoint</label>
                  <div class="columns">
                    <div class="column is-one-quarter">
                      <div class="select parameters-type">
                        <select
                          v-model="details.method"
                        >
                          <option v-for="(method, index) in form_options.methods">
                            {{method}}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="column">
                      <input 
                        id="request_endpoint" 
                        class="input"
                        type="text"
                        v-model="details.endpoint"
                      >
                      <span class="helper-text">Sample: /user/create</span>
                    </div>
                  </div>
                </div>

                <hr>
                <div class="buttons">
                  <button class="button is-primary is-medium" @click="saveRequest()">
                    <span class="icon">
                      <i class="mdi mdi-content-save"></i>
                    </span>
                    <span>Save</span>
                  </button>

                  <button class="button is-danger is-medium" @click="deleteRequest()" v-if="showDelete">
                    <span class="icon">
                      <i class="mdi mdi-delete"></i>
                    </span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
              <div class="column">
                <h3 class="subtitle">Headers</h3>

                <div class="form-input">

                  <div class="table-container" v-if="request_headers.length">
                    <table class="table is-bordered is-striped is-hoverable is-fullwidth">
                      <thead>
                        <tr>
                          <th style="width: 50px"></th>
                          <th>Header name</th>
                          <th>Value</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr v-for="(header, index) in request_headers">
                          <td>
                            <button class="button is-small is-danger btn-delete" @click="removeHeader(index)"><span class="icon"><i class="mdi mdi-delete"></i></span></button>
                          </td>
                          <td>
                            <input 
                              class="input"
                              type="text"
                              placeholder="New header" 
                              v-model="request_headers[index].name"
                            >
                          </td>
                          <td>
                            <input 
                              class="input"
                              type="text"
                              placeholder="Value" 
                              v-model="request_headers[index].value"
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button class="button is-small" @click="addHeader()">Add header</button>
                </div>

                <hr>
                <h3 class="subtitle">Parameters</h3>

                <div class="form-input">
                  <div class="table-container" v-if="parameters.length">

                    <table v-for="(parameter, index) in parameters" class="table is-bordered is-striped is-hoverable is-fullwidth">
                      <tbody>
                        <tr>
                          <td>Type</td>
                          <td>
                            <div class="select parameters-type">
                              <select
                                v-model="parameters[index].type"
                              >
                                <option v-for="(type, index) in form_options.parameter.type">
                                  {{type}}
                                </option>
                              </select>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Name</td>
                          <td>
                            <input 
                              class="input"
                              type="text"
                              placeholder="Input field" 
                              v-model="parameters[index].name"
                            >
                          </td>
                        </tr>
                        <tr>
                          <td>Values <small>(Optional)</small></td>
                          <td>
                            <input 
                              class="input"
                              type="text"
                              placeholder="Enter available values in parameter" 
                              v-model="parameters[index].values"
                            >
                          </td>
                        </tr>
                        <tr>
                          <td>Default value <small>(Optional)</small></td>
                          <td>
                            <input 
                              class="input"
                              type="text"
                              placeholder="Enter default value if this field is empty" 
                              v-model="parameters[index].default_value"
                            >
                          </td>
                        </tr>
                        <tr>
                          <td>Description <small>(Optional)</small></td>
                          <td>
                            <input 
                              class="input"
                              type="text"
                              placeholder="Description" 
                              v-model="parameters[index].description"
                            >
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">
                            <button class="button is-danger btn-delete" @click="removeParameter(index)"><i class="mdi mdi-delete"></i> Delete</button>        
                          </td>
                        </tr>
                
                      </tbody>
                    </table>

                  </div>
                  <button class="button is-small" @click="addParameter()">Add parameter</button>
                </div>
              </div>
            </div>
          </div>
        </div>
	  	</main>
  	</div>
  </div>
</template>

<script>
// @ is an alias to /src
import MainContent from '@/components/MainContent.vue'
import LeftSideBar from '@/components/LeftSideBar.vue'

export default {
  components: {
    MainContent,
    LeftSideBar
  },
  data() {
    return {
      form_options: {
        methods:[
          'GET','POST', 'PUT', 'PATCH', 'DELETE', 'OPTION'
        ],
        parameter:{
          type: [
            'MIXED', 'STRING', 'NUMERIC',
          ]
        }
      },
      showDelete: false,
      information: {
        name: '',
        description: '',
      },
      details: {
        endpoint: '',
        method: 'GET',
      },
      request_headers: [],
      parameters: [],
    }
  },
  methods: {
    successAlert( $msg = 'Success' ){
      this.$toast.success({
        title: 'Success',
        message: $msg
      })
    },
    errorAlert( $msg = 'Error' ){
      this.$toast.error({
        title: 'Error',
        message: $msg
      })
    },
    clearForm(){

      this.information = {
          name: '',
          description: '',
        };

      this.details = {
        endpoint: '',
        method: 'GET',
      };

      this.request_headers = [];
      this.parameters = [];
    },
    saveRequest(){

      let param_id = this.$route.params.id;

      if ( typeof param_id != 'undefined' && param_id != '' ) {
        this.updateData();
      }
      else{

        store.commit('createRequest', {
          information: this.information,
          details: this.details,
          request_headers: this.request_headers,
          parameters: this.parameters,
        });

        this.$router.push( { name: 'app' });
        this.clearForm();
        this.successAlert( 'New request created' );
      }
    },
    deleteRequest(){
      let data_cookie = window.getCookie( 'data' ) != '' ? JSON.parse( window.getCookie( 'data' ) ) : [],
          param_id = this.$route.params.id,
          idx = '',
          data = '';

      if( typeof param_id != 'undefined' && param_id != '' && data_cookie.length ){
        data_cookie.forEach( function( ele, index ){
          if ( ele.id === param_id ) {
            idx = index;
            data = data_cookie[index];
          }
        })
      }
      
      if ( data != '' ) {

        store.commit('deleteRequest', idx);
        this.$router.push( { name: 'app' });
        this.clearForm();
        this.successAlert( 'Request deleted' );
      }
    },
    updateData(){
      
      let data_cookie = window.getCookie( 'data' ) != '' ? JSON.parse( window.getCookie( 'data' ) ) : [],
          param_id = this.$route.params.id,
          idx = '',
          data = '';

      if( typeof param_id != 'undefined' && param_id != '' && data_cookie.length ){
        data_cookie.forEach( function( ele, index ){
          if ( ele.id === param_id ) {
            idx = index;
            data = data_cookie[index];
          }
        })
      }

      if ( data != '' ) {
        store.commit('updateData', {
          idx: idx,
          id: data.id,
          information: this.information,
          details: this.details,
          request_headers: this.request_headers,
          parameters: this.parameters,
        });
        this.successAlert( 'Data saved' );
      }

    },
    populateData(){

      let data_cookie = window.getCookie( 'data' ) != '' ? JSON.parse( window.getCookie( 'data' ) ) : [],
          param_id = this.$route.params.id,
          data = '';

      if( typeof param_id != 'undefined' && param_id != '' && data_cookie.length ){
        data_cookie.forEach( function( ele, index ){
          if ( ele.id === param_id ) {
            data = data_cookie[index];
          }
        })
      }

      if ( data != '' ) {
        // console.log( data.id )
        // console.log( data.information );
        this.information = data.information;
        this.details = data.details;
        this.request_headers = data.request_headers;
        this.parameters = data.parameters;
        this.showDelete = true;
      }
      else{
        if ( typeof param_id != 'undefined' && param_id != '' ) {
          this.$router.push( { name: 'app' });
          this.errorAlert(`ID: ${param_id} Not found`)
        }
        else{
          this.clearForm();
          this.showDelete = false;
        }
      }

    },
    addHeader(){
      if ( this.request_headers.length == 0 ) {
        this.request_headers.push({name: 'Content-Type', value: 'application/x-www-form-urlencoded'})
      }
      else{
        this.request_headers.push({name: '', value: ''})
      }
    },
    addParameter(){
      this.parameters.push({name: '', type: 'MIXED', description: ''})
    },
    removeHeader(index){
      this.request_headers.splice(index, 1);
    },
    removeParameter(index){
      this.parameters.splice(index, 1);
    },
  },
  watch:{
    $route (to, from){
      this.populateData();
    }
  },
  mounted() {
    console.log( 'mounted' );
    this.populateData();
    // store.getters.populateData();
  },
}
</script>

<style lang="scss" scoped>
	#create-page{
		display: flex;
		min-height: 100vh;
	}

	#left-sidebar{
		width: 200px;
		border-right: 1px solid #eee;
    padding: 20px 10px;
	}
	#main-content{
		padding-top: 20px;
		width: calc(100% - 200px);
		padding: 20px;
    margin-bottom: 50px;

    #form-wrapper{
      width: 100%;
    }
	}
  #request_description{
    min-height: 80px;
  }
  .parameters-type{
    width: 100%;
    select{
      width: 100%;
    }
  }
  .btn-delete{
    margin-top: 10px;
  }
</style>