<template>

    <div class="app-page">
        <div class="left-col">
            <aside class="menu">
                <ul class="menu-list">
                    <li>
                        <a @click="createNewRequest()">
                            <span class="icon"><i class="mdi mdi-plus"></i></span>
                            <span>Create new request</span>
                        </a>
                    </li>
                    <li>
                        <a @click="createNewFolder()">
                            <span class="icon"><i class="mdi mdi-folder-plus"></i></span>
                            <span>Create new folder</span>
                        </a>
                    </li>

                    <p class="menu-label">Requests</p>

                    <template v-for="(folder,folderIndex) in requests">
                        <li v-if="folder.isFolder">
                            <div class="request-folder" :class="{'folder-is-open': folder.isFolderOpen}">
                                <span class="icon tooltip is-tooltip-right is-tooltip-success" data-tooltip="Toggle folder" @click="toggleFolder(folderIndex)">
                                    <i class="mdi" :class="{'mdi-folder-open': folder.isFolderOpen, 'mdi-folder': ! folder.isFolderOpen}"></i></span>
                                    <span>
                                        <input
                                            type="text"
                                            v-model="requests[folderIndex].contents.details.name"
                                            @change="checkFolderName(folderIndex)"
                                        >
                                    </span>
                                <button class="button button-remove tooltip is-tooltip-left is-tooltip-danger" data-tooltip="Remove folder" @click="removeFolder(folderIndex)">
                                  <span class="icon">
                                    <i class="mdi mdi-delete" aria-hidden="true"></i>
                                  </span>
                                </button>
                            </div>
                            <ul v-if="folder.isFolderOpen">
                                <template v-for="(request,index) in requests">
                                    <li class="request-item" v-if="! request.isFolder && request.parentId == folder.id">
                                        <router-link active-class="is-active" class="request-button" :to="{ name: 'app', params: { id: request.id }}">
                                            <span class="tag method" :data-method="request.contents.method.toLowerCase()">{{request.contents.method}}</span>
                                            <span class="request-name">{{request.contents.details.name}}</span>
                                        </router-link>
                                        <button class="button button-remove tooltip is-tooltip-right is-tooltip-danger" data-tooltip="Delete request" @click="deleteRequest(index)">
                                          <span class="icon">
                                            <i class="mdi mdi-delete" aria-hidden="true"></i>
                                          </span>
                                        </button>
                                    </li>
                                </template>

                                <li>
                                    <a @click="createNewRequest( folder.id )">
                                        <span class="icon"><i class="mdi mdi-plus"></i></span>
                                        <span>Create new request</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </template>

                    <template v-for="(request,index) in requests">
                        <li class="request-item" v-if="! request.isFolder && request.parentId == ''">
                            <router-link active-class="is-active" class="request-button" :to="{ name: 'app', params: { id: request.id }}">
                                <span class="tag method" :data-method="request.contents.method.toLowerCase()">{{request.contents.method}}</span>
                                <span class="request-name">{{request.contents.details.name}}</span>
                            </router-link>
                            <button class="button button-remove tooltip is-tooltip-left is-tooltip-danger" data-tooltip="Delete request" @click="deleteRequest(index)">
                              <span class="icon">
                                <i class="mdi mdi-delete" aria-hidden="true"></i>
                              </span>
                            </button>
                        </li>
                    </template>
                </ul>
            </aside>
        </div>
        <div class="right-col">

            <div id="api-request-details">

                <template v-if="! showRequestContent">
                    <section class="hero is-medium welcome-message">
                      <div class="hero-body">
                        <div class="container">
                            <h1 class="title">
                                Welcome to jheck api documentator!
                            </h1>
                            <h2 class="subtitle" v-if="requests.length == 0">
                                Create your very first api request <a @click="createNewRequest()">here</a> or you can use our <a>import</a> to continue your work.
                            </h2>
                            <h2 class="subtitle" v-else>
                                Update your api requests by selecting it on the left side menu
                            </h2>
                        </div>
                      </div>
                    </section>
                </template>

                <template v-else>
                    <div class="request-content">
                        <div class="endpoint-field field has-addons">
                            <p class="control">
                                <span class="select select-endpoint">
                                    <select
                                      v-model="contents.method"
                                      @change="saveData()"
                                    >
                                        <option v-for="(type, index) in formOptions.methods">
                                            {{type}}
                                        </option>
                                    </select>
                                </span>
                            </p>
                            <p class="control is-expanded">
                                <input
                                    class="input input-endpoint"
                                    type="text"
                                    placeholder="/users/create"
                                    v-model="contents.endpoint"
                                    @change="saveData()"
                                >
                            </p>
                        </div>

                        <div class="container">

                            <div class="tabs">
                                <ul>
                                    <template v-for="(tab, index) in tabList">
                                        <li @click="tabsToggle(tab)" v-bind:class="{'is-active': tabs[tab]}"><a>{{ capitalizeFirstLetter(tab) }}</a></li>
                                    </template>
                                </ul>
                            </div>

                            <div class="tabs-content">
                                <div id="tab-details" v-if="tabs.details">
                                    <div class="control">
                                        <label>Request Name</label>
                                        <input
                                            class="input"
                                            type="text"
                                            placeholder="Request name"
                                            v-model="contents.details.name"
                                            @change="saveData()"
                                        >
                                    </div>
                                    <div class="control">
                                        <label>Description</label>
                                        <textarea
                                            class="textarea"
                                            placeholder="Description"
                                            v-model="contents.details.description"
                                            @change="saveData()"
                                        ></textarea>
                                    </div>
                                </div>

                                <div id="tab-body" v-if="tabs.body">
                                    <template v-for="(body, index) in contents.body">
                                        <div class="control">
                                            <div class="columns">
                                                <div class="column body-type-select-form">
                                                    <button class="button is-danger button-remove tooltip" data-tooltip="Remove this parameter" @click="removeField('body', index )"><span class="icon"><i class="mdi mdi-delete"></i></span></button>
                                                    <div class="select">
                                                        <select
                                                          v-model="body.type"
                                                          @change="saveData()"
                                                        >
                                                            <option v-for="(type, index) in formOptions.parameterType">
                                                                {{type}}
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="column">
                                                    <input
                                                        class="input"
                                                        type="text"
                                                        placeholder="Name"
                                                        v-model="body.name"
                                                        @change="saveData()"
                                                    >
                                                </div>
                                                <div class="column">
                                                    <input
                                                        class="input"
                                                        placeholder="Description"
                                                        v-model="body.description"
                                                        @change="saveData()"
                                                    ></input>
                                                </div>
                                                <div class="column">
                                                    <input
                                                        class="input"
                                                        placeholder="Enter sample values separated by semicolon"
                                                        v-model="body.sampleValues"
                                                        @change="saveData()"
                                                        ></input>
                                                </div>
                                            </div>
                                        </div>
                                    </template>

                                    <button class="button-add-new-field button is-white" @click="addNewField('body')"><span class="icon"><i class="mdi mdi-plus"></i></span> Add new parameter</button>
                                </div>

                                <div id="tab-headers" v-if="tabs.headers">
                                    <template v-for="(header, index) in contents.headers">
                                        <div class="control">
                                            <div class="columns">
                                                <div class="column header-remove-wrapper">
                                                    <button class="button is-danger button-remove tooltip" data-tooltip="Remove this header" @click="removeField('header', index )"><span class="icon"><i class="mdi mdi-delete"></i></span></button>
                                                </div>
                                                <div class="column">
                                                    <input
                                                        class="input"
                                                        type="text"
                                                        placeholder="Header name"
                                                        v-model="header.name"
                                                        @change="saveData()"
                                                    >
                                                </div>
                                                <div class="column">
                                                    <input
                                                        class="input"
                                                        type="text"
                                                        placeholder="Header value"
                                                        v-model="header.value"
                                                        @change="saveData()"
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <button class="button-add-new-field button is-white" @click="addNewField('header')"><span class="icon"><i class="mdi mdi-plus"></i></span> Add new header</button>
                                </div>

                                <div id="tab-headers" v-if="tabs.response">
                                    <div class="control">
                                        <label>Sample response</label>
                                        <textarea
                                            class="textarea"
                                            v-model="contents.response"
                                            rows="20"
                                            @change="saveData()"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- <div class="request-return">
                    Request return
                </div> -->
            </div>

        </div>
    </div>
</template>

<style>
    .github-ribbon{
        display: none;
    }
</style>

<style lang="scss" scoped>

    $grey: #a9a9a9;
    $border-bottom-color: #3f403d;

    .app-page{
        display: flex;
        min-height: calc(100vh - 50px);

        ::-webkit-input-placeholder { /* Edge */
          color: #666;
        }

        :-ms-input-placeholder { /* Internet Explorer 10-11 */
          color: #666;
        }

        ::placeholder {
          color: #666;
        }

        > div{
            width: 100%;
        }
        .left-col{
            padding: 10px;
            max-width: 300px;
            background: #353532;
            border-right: 1px solid #474845;
        }
        .right-col{
            max-width: calc(100% - 300px);
            background: #282925;
        }

        .menu{

            overflow-y: auto;
            height: 100%;
            position: fixed;
            top: 70px;
            left: 0;
            width: 300px;
            padding: 10px;
            padding-bottom: 50px;

            .button-remove{
                background: transparent;
                border: none;
                box-shadow: none;
                color: #fff;
                width: 27px;
                padding: 0;
                position: absolute;
                top: 0px;
                right: 0;
                height: 24px;
                opacity: 0;
            }

            .request-item,
            .request-folder{
                position: relative;
                width: 100%;
                cursor: pointer;
                font-size: 16px;
                margin-top: 10px;
                color: $grey;

                &:hover,
                &.folder-is-open{
                    color: #fff;
                    input{
                        color: #fff;
                    }
                }

                input{
                    font-size: 16px;
                    color: $grey;
                    background: none;
                    border: none;
                    width: calc(100% - 50px);
                    outline: none;
                    box-shadow: none;
                }

                &.is-active{
                    .dropdown-menu{
                        transform: translate(0px, -6px);
                        transition-delay: 1s;
                    }
                }

                .dropdown-menu{
                    transform: translate(0px, 10px);
                    transition: 0.3s;
                }

                &:hover{
                    .button-remove{
                        opacity: 1
                    }
                }
            }

            .request-item{
                margin-top: 0;

                .button-remove{
                    top: 7px;
                }
            }

            .menu-list{
                color: $grey;
                margin-bottom: 50px;

                li{
                    ul{
                        margin-right: 0;
                    }
                }

                a{
                    color: $grey;
                    align-items: center;

                    &.is-active,
                    &:hover{
                        color: #fff;
                        background: rgba(255, 255, 255, 0.1);
                    }
                }

                .tag{
                    min-width: 60px;
                    margin-right: 10px;
                }

                .request-button{
                    display: flex;
                }

                .request-name{
                    padding-right: 5px;
                }
            }
        }

        #api-request-details{
            height: 100%;
            display: flex;

            > div {
                // padding: 0 20px;
                width: 100%;
            }

            .request-content{

                .container{
                    padding: 10px;
                }

                .endpoint-field{
                    background: #fff;
                    padding: 10px;

                    ::-webkit-input-placeholder { /* Edge */
                      color: #eee;
                    }

                    :-ms-input-placeholder { /* Internet Explorer 10-11 */
                      color: #eee;
                    }

                    ::placeholder {
                      color: #eee;
                    }

                    select,
                    input{
                        background: transparent;
                        border: none;
                        box-shadow: none;
                        border-radius: 0;
                    }

                    .button-save{
                        border-radius: 0;
                        cursor: pointer;
                    }
                }

                .tabs{
                    color: $grey;
                    margin-bottom: 2em;

                    ul{
                        border-bottom-color: $border-bottom-color;
                    }

                    li{
                        a{
                            color: $grey;
                            border-bottom-color: transparent;
                        }

                        &.is-active a,
                        a:hover{
                            border-bottom-color: #fff;
                            color: #fff;
                            background: rgba(255, 255, 255, 0.1);
                        }
                    }
                }

                .tabs-content{
                    .control{
                        margin-bottom: 1.5em;

                        label{
                            display: inline-block;
                            color: #fff;
                            margin-bottom: 10px;
                        }

                        textarea,
                        input{
                            background: transparent;
                            color: #fff;
                            border: none;
                            border-bottom: 1px solid $border-bottom-color;
                            border-radius: 0;
                            box-shadow: none;
                        }

                        .button-remove{
                            margin-right: 10px;
                        }

                        .body-type-select-form{
                            max-width: 195px;
                        }

                        .header-remove-wrapper{
                            max-width: 60px;
                        }
                    }

                    .button-add-new-field{
                        margin-top: 2em;
                    }
                }

            }
            .request-return{
                max-width: calc( 100% / 2 - 200px);
            }
        }

        .welcome-message{
            h1,h2 {
                color: #fff;
            }

            h2{
                margin-top: 2em;
            }
        }
    }
</style>

<script>

    export default {
        data: function() {
            return {
                // requests: [],
                currentPageId: '',
                tabList: ['details', 'body', 'headers', 'response'],
                tabs: {
                    details: true,
                    body: false,
                    headers: false,
                    response: false,
                },
                showRequestContent: false,
                contents: {
                    method: 'GET',
                    endpoint: '/',
                    details: {
                        name: '',
                        description : '',
                    },
                    body: [],
                    headers: [],
                    response: '',
                },
                formOptions: {
                    methods:[
                        'GET','POST', 'PUT', 'PATCH', 'DELETE', 'OPTION'
                    ],
                    parameterType:[
                        'MIXED', 'STRING', 'NUMERIC',
                    ]
                },
            }
        },
        mounted() {
            console.log('Mounted');
            // console.log( store.state.auth );
            this.refreshCookie();
            this.populateData();
        },
        watch:{
            $route (to, from){
                this.populateData();
            }
        },
        computed: {
            requests(){
                return store.getters.requests != '' ? store.getters.requests : [];
            },
            itemCount(){

                let folderCount = 1,
                    requestCount = 1;

                this.requests.forEach( function(ele, index ){
                    if ( ele.isFolder ) {
                        folderCount++;
                    }
                    else{
                        requestCount++;
                    }
                })

                return {
                    folder: folderCount,
                    request: requestCount,
                };
            },
            folderCount(){

                let folderCount = 1;
                this.requests.forEach( function(ele, index ){
                    if ( ele.isFolder ) {
                        folderCount++;
                    }
                })
                return folderCount;
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
            capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
            refreshCookie(){;
                store.commit('refreshCookie');
                // this.requests = store.getters.requests != '' ? store.getters.requests : [];
            },
            saveData(){
                store.commit('saveRequest', this.requests);
                // this.refreshCookie();
            },
            populateData(){

                let paramId = this.$route.params.id,
                    _requests = this.requests,
                    data = '';

                if ( typeof paramId != 'undefined' && paramId != '' && _requests.length ) {
                    _requests.forEach( function(ele, index ){
                        if ( ele.id === paramId ) {
                            data = _requests[index];
                        }
                    })
                }

                this.showRequestContent = data;

                if ( data != '' ) {
                    this.contents = data.contents;
                    this.currentPageId = paramId;
                }
                else{
                    if ( typeof paramId != 'undefined' && paramId != '' ) {
                        this.$router.push( { name: 'app' });
                        this.errorAlert(`ID: ${paramId} Not found`)
                    }
                }

            },
            tabsToggle( type = 'details' ){
                this.tabs = {
                    details: false,
                    body: false,
                    headers: false,
                    response: false,
                };
                this.tabs[type] = true;
            },
            toggleFolder( index ){
                this.requests[index].isFolderOpen = ! this.requests[index].isFolderOpen
                this.saveData();
            },
            createNewFolder( parentId = '' ){
                let randomId = this.randomId();
                this.requests.push({
                    id: randomId,
                    isFolder: true,
                    isFolderOpen: true,
                    parentId: parentId,
                    contents: {
                        details :{
                            name: `New folder (${this.itemCount.folder})`,
                        }
                    }
                })

                this.successAlert('New folder created');
                this.saveData();
            },
            createNewRequest( parentId = '' ){
                let randomId = this.randomId();
                this.requests.push({
                    id: randomId,
                    isFolder: false,
                    parentId: parentId,
                    contents: {
                        method: 'GET',
                        details :{
                            name: `New request (${this.itemCount.request})`,
                        },
                        body: [],
                        headers: [],
                        response: '',
                    }
                })
                this.successAlert('New request created');
                this.saveData();

            },
            removeFolder(index){

                let message = 'Are you sure you want to remove this folder? Any request under this folder will be moved to uncategorized section';
                let options = {
                    animation : 'fade',
                    okText: 'Yes remove it',
                    cancelText: 'Cancel',
                };

                let vm = this;

                this.$dialog.confirm(message, options)
                    .then((dialog) => {

                        let parentId = vm.requests[index].id,
                            folderName = vm.requests[index].contents.details.name;

                        this.successAlert(`Folder ${folderName} removed`);

                        vm.requests.forEach( function(ele, index ){
                            if ( ele.parentId === parentId ) {
                                vm.requests[index].parentId = '';
                            }
                        })

                        vm.requests.splice(index, 1)
                        this.saveData();
                   })
            },
            deleteRequest(index){
                let paramId = this.requests[index].id,
                    requestName = this.requests[index].contents.details.name;

                this.successAlert(`${requestName} removed`);
                this.requests.splice(index, 1)

                if (paramId == this.currentPageId ) {
                    this.$router.push( { name: 'app' });
                }

                this.saveData();
            },
            addNewField( type = 'body' ){
                if ( type == 'header' ) {
                    this.contents.headers.push({
                        name : '',
                        value: '',
                    });
                }
                else{
                    // default - parameter
                    this.contents.body.push({
                        type : 'MIXED',
                        name: '',
                        description: '',
                        sampleValues: '',
                    });
                }
                this.saveData();
            },
            removeField( type = 'body', index ){
                if ( type == 'header' ) {
                    this.contents.headers.splice(index, 1);
                }
                else{
                    // default - parameter
                    this.contents.body.splice(index, 1);
                }
                this.saveData();
            },
            checkFolderName( index ){

                let request = this.requests[index],
                    contentName = request.contents.details.name;

                if (contentName == '') {
                    request.contents.details.name = 'New Folder';
                }
                this.saveData();
            },
            randomId(){
                return '_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            }
        }
    }
</script>
