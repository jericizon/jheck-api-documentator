<template>
	<div>
  	<div id="preview-page">
	  	<aside id="left-sidebar">
	  		
	  		<button class="button is-success is-fullwidth" @click="importJson()">
	  		  <span class="icon is-small">
	  		    <i class="mdi mdi-cloud-upload"></i>
	  		  </span>
	  		  <span>Import</span>
	  		</button>
	  		<input type="file" id="import-json" accept=".json,application/json" style="display: none;">
				
				<hr>

	  		<aside id="group-collection" class="menu">
	  		  <p class="menu-label">Requests</p>
	  		  <ul class="menu-list" v-scroll-spy-active v-scroll-spy-link>
	          <li v-for="(request, index) in requests">
	          	<a>{{request.information.name }}</a>
	          </li>
	        </ul>
	  		</aside>
	  	</aside>
	  	<main id="main-content">
        <div class="container">
        	
        	<div v-if="requests.length == 0">
        		<p>Import your .json file</p>
        	</div>
        	<div id="request-content-api" v-else v-scroll-spy>
        		<div v-for="(request, index) in requests">
        			
        			<div class="break-line" :id="request.id"></div>
  			      <h1 class="title is-3">{{ request.information.name }}</h1>
  			      <h2 class="subtitle">{{ request.information.description }}</h2>

  			      <br>
      			  <h3 class="title is-5">Endpoint</h3>
      			  <div class="notification" :class="'method-' + request.details.method.toLowerCase()">
      			    <span class="tag is-light">{{ request.details.method }}</span> - {{ request.details.endpoint }}
      			  </div>

      			  <template v-if="request.request_headers.length">
      			  	
      			  	<br>
      			  	<h3 class="title is-5">Headers</h3>
      			  	<div class="table-container">
                  <table class="table is-bordered is-striped is-hoverable is-fullwidth">
                  	<thead>
                  		<tr>
                  			<th>Header name</th>
                  			<th>Header value</th>
                  		</tr>
                  	</thead>
                  	<tbody>
                  		<tr v-for="(header, index) in request.request_headers">
                  			<td>
                  				{{ header.name }}
                  			</td>
                  			<td>
                  				{{ header.value }}
                  			</td>
                  		</tr>
                  	</tbody>
                  </table>
                </div>
                <br>
      			  </template>

      			  <template v-if="request.parameters.length">
      			  	
      			  	<br>
	  				  	<h3 class="title is-5">Parameters</h3>
	  				  	<div class="table-container">
	  	            <table class="table is-bordered is-striped is-hoverable is-fullwidth">
	  	            	<thead>
	  	            		<tr>
	  	            			<th>Type</th>
	  	            			<th>Name</th>
	  	            			<th>Values</th>
	  	            			<th>Default values</th>
	  	            			<th style="max-width: 120px">Description</th>
	  	            		</tr>
	  	            	</thead>
	  	            	<tbody>
	  	            		<tr v-for="(parameter, index) in request.parameters">
	  	            			<td>
	  	            				{{ parameter.type }}
	  	            			</td>
	  	            			<td>
	  	            				{{ parameter.name }}
	  	            			</td>
	  	            			<td>
	  	            				{{ parameter.values || '-' }}
	  	            			</td>
	  	            			<td>
	  	            				{{ parameter.default_value || '-' }}
	  	            			</td>
	  	            			<td>
	  	            				{{ parameter.description || '-' }}
	  	            			</td>
	  	            		</tr>
	  	            	</tbody>
	  	            </table>
	  	          </div>
	  	          <br>
      			  </template>
        		</div>
        	</div>
        </div>
      </main>
    </div>
	</div>
</template>

<script>
	export default {
		data() {
		  return {
		  	activeId: '',
		    showImportButton: true,
		    requests: [],
		  }
		},
		watch:{
		  requests: function( val ){
		    this.showImportButton = val.length == 0;
		  }
		},
		methods: {
		  importJson(){
		    document.getElementById('import-json').addEventListener('change', this.readJson , false);
		    document.getElementById('import-json').click();
		  },
		  readJson( evt ){

		    var file = evt.target.files[0]; // FileList object
		    var reader = new FileReader();

		    let vm = this;

		    reader.onload = (function (theFile) {
		      return function (e) {
		        try {
		          let json = e.currentTarget.result;
		          vm.$toast.success({
		            title: 'Success',
		            message: 'JSON imported',
		          })

		          window.setCookie('preview_data', json);
		          vm.requests = JSON.parse(json);
		          vm.showImportButton = false; 

		        } catch (ex) {
		          // alert('ex when trying to parse json = ' + ex);
		          vm.$toast.error({
		            title: 'Error',
		            message: 'Sorry we cannot read this json file',
		          })
		        }
		      }
		    })(file);

		    reader.readAsText(file);

		  }
		},
		mounted() {
			this.requests = window.getCookie('preview_data') != '' ? JSON.parse(window.getCookie('preview_data')) : [];
		}
	}
</script>

<style lang="scss" scoped>
	#preview-page{
		display: flex;
		min-height: 100vh;
	}

	#left-sidebar{
		width: 200px;
    border-right: 1px solid #eee;
    padding: 20px 10px;
    position: fixed;
    top: 80px;
    left: 0;
    height: calc( 100vh - 80px );
    overflow-y: auto;
	}
	#main-content{
		padding-top: 20px;
		width: calc(100% - 200px);
		padding: 20px;
    margin-bottom: 50px;
    margin-left: 200px;
	}
	.break-line{
		height: 100px;
		display: block;
		border-top: 1px solid #ccc;
		margin-top: 100px;
	}

	#request-content-api{
		div {
			&:first-child{
				.break-line{
					margin-top: 0;
					border-top: none;
				}
			}
		}
	} 

	.menu-list{
		li.active{
			a{
				background-color: #3273dc;
				color: #fff;
			}
		}
	}

	.notification{
		&.method-get{
	    background-color: #00d1b2;
	    color: #fff;
		}

		&.method-post{
			background-color: #ffdd57;
			color: rgba(0,0,0,.7);
		}
		&.method-put{
			background-color: #23d160;
	    color: #fff;
		}
		&.method-patch{
			background-color: #209cee;
			color: #fff;
		}
		&.method-delete{
			background-color: #ff3860;
			color: #fff;
		}
		&.method-option{}
	}
</style>