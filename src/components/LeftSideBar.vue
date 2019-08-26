<template>
  <div>
    <div class="buttons">
      <template v-if="showImportButton">
        <button class="button is-success is-fullwidth" @click="importJson()">
          <span class="icon is-small">
            <i class="mdi mdi-cloud-upload"></i>
          </span>
          <span>Import</span>
        </button>
        <input type="file" id="import-json" accept=".json,application/json" style="display: none;">
      </template>

      <template v-if="showExportButton">
        <button class="button is-info is-fullwidth is-outlined" @click="exportJson()">
          <span class="icon is-small">
            <i class="mdi mdi-cloud-download"></i>
          </span>
          <span>Export</span>
        </button>
        <a id="export-json" download="jheck-api-export.json" style="display:none">Preview</a>
        <button class="button is-link is-fullwidth" @click="showPreview()">
          <span class="icon is-small">
            <i class="mdi mdi-leaf"></i>
          </span>
          <span>Preview</span>
        </button>
      </template>
    </div>

    <hr>

    <aside id="group-collection" class="menu">
      <p class="menu-label">Requests</p>
      <ul class="menu-list">
        <li v-for="(request, index) in requests">
          <router-link active-class="is-active" :to="{ name: 'app', params: { id: request.id }}">{{request.information.name }}</router-link>
        </li>
      </ul>
    </aside>
    <router-link :to="{ name: 'app' }" class="button is-secondary is-fullwidth">Create new request</router-link>
    
  </div>
</template>

<script>

export default {
  data() {
    return {
      showImportButton: true,
      showExportButton: false,
    	requests: this.$store.getters.data,
    }
  },
  watch:{
    requests: function( val ){
      this.showImportButton = val.length == 0;
      this.showExportButton = val.length > 0;
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
            
            let json = JSON.parse(e.currentTarget.result);

            vm.$toast.success({
              title: 'Success',
              message: 'JSON imported',
            })

            vm.$store.commit('importCookie', json);
            vm.requests = vm.$store.state.data;
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

    },
    exportJson() {

      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.$store.state.data));
      var dlAnchorElem = document.getElementById('export-json');
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.click();

      this.$toast.success({
        title: 'Success',
        message: 'JSON exported',
      })
    },
    showPreview(){
      window.setCookie('preview_data', JSON.stringify(this.$store.state.data));
      this.$router.push( { name: 'preview' });
    }
  },
  mounted() {
    this.requests = this.$store.state.data;
    this.showImportButton = this.requests.length == 0;
    this.showExportButton = this.requests.length > 0;
  }
}

</script>

<style scoped lang="scss">
	#group-collection{
    margin: 0 auto 30px;

    .router-link-exact-active{
      // color: ;
    }
	}
</style>