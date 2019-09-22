<template>

    <div class="app-page">
        <div class="left-col">
            <aside class="menu">
                <ul class="menu-list">
                    <p class="menu-label">Requests</p>
                    <template v-for="(folder,folderIndex) in requests">
                        <li v-if="folder.isFolder">
                            <div class="request-folder" :class="{'folder-is-open': folder.isFolderOpen}" @click="toggleFolder(folderIndex)">
                                <span class="icon">
                                    <i class="mdi" :class="{'mdi-folder-open': folder.isFolderOpen, 'mdi-folder': ! folder.isFolderOpen}"></i></span>
                                    <span>
                                        {{requests[folderIndex].contents.details.name}}
                                    </span>
                                <button class="button button-toggle">
                                  <span class="icon">
                                    <i class="mdi" :class="{'mdi-minus': folder.isFolderOpen, 'mdi-chevron-down': ! folder.isFolderOpen}" aria-hidden="true"></i>
                                  </span>
                                </button>
                            </div>
                            <ul v-if="folder.isFolderOpen">
                                <template v-for="(request,index) in requests">
                                    <li class="request-item request-item-nav" v-if="! request.isFolder && request.parentId == folder.id">
                                        <router-link active-class="is-active" class="request-button" :to="{ name: 'preview', params: { id: request.id }}">
                                            <span class="request-name">{{request.contents.details.name}}</span>
                                        </router-link>
                                    </li>
                                </template>
                            </ul>
                        </li>
                    </template>

                    <template v-for="(request,index) in requests">
                        <li class="request-item request-item-nav" v-if="! request.isFolder && request.parentId == ''">
                            <router-link active-class="is-active" class="request-button" :to="{ name: 'preview', params: { id: request.id }}">
                                <span class="request-name">{{request.contents.details.name}}</span>
                            </router-link>
                        </li>
                    </template>
                </ul>
            </aside>
        </div>
        <div class="right-col">

            <div id="api-request-details">

                <div class="request-content">

                    <div class="container">
                        <template v-for="(request,index) in requests">

                            <div class="request-item-section request-item-content" :id="request.id" v-if="!request.isFolder">
                                <h1 class="title is-3">
                                    <router-link :to="{ name: 'preview', params: { id: request.id }}">
                                        <span class="request-name">{{request.contents.details.name}} </span>
                                    </router-link>
                                </h1>
                                <h2 class="subtitle">{{ request.contents.details.description }}</h2>

                                <br>
                                <h3 class="title is-5">Endpoint</h3>
                                <div class="notification">
                                  <span class="tag method" :data-method="request.contents.method.toLowerCase()">
                                  {{ request.contents.method }}</span> - {{ request.contents.endpoint }}
                                </div>

                                <template v-if="request.contents.headers.length">
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
                                                <tr v-for="(header, headerIndex) in request.contents.headers">
                                                    <td>
                                                        {{ header.name || '-' }}
                                                    </td>
                                                    <td>
                                                        {{ header.value || '-' }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </template>

                                <template v-if="request.contents.body.length">
                                    <br>
                                    <h3 class="title is-5">Body</h3>
                                    <div class="table-container">
                                        <table class="table is-bordered is-striped is-hoverable is-fullwidth">
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>Name</th>
                                                    <th style="max-width: 120px">Description</th>
                                                    <th style="max-width: 120px">Sample values</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(body, bodyIndex) in request.contents.body">
                                                    <td>
                                                        {{ body.type || '-' }}
                                                    </td>
                                                    <td>
                                                        {{ body.name || '-' }}
                                                    </td>
                                                    <td>
                                                        {{ body.description || '-' }}
                                                    </td>
                                                    <td>
                                                        {{ body.sampleValues || '-' }}
                                                    </td>

                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </template>

                                <template v-if="request.contents.response != ''">
                                    <br>
                                    <h3 class="title is-5">Response</h3>
                                    <code class="contents-response">{{ request.contents.response }}</code>
                                </template>

                            </div>
                        </template>
                    </div>
                </div>
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
            // background: #282925;
        }

        .menu{

            overflow-y: auto;
            height: 100%;
            position: fixed;
            top: 70px;
            left: 0;
            width: 300px;
            padding: 10px;

            .button-toggle{
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
                margin-top: 10px;
            }

            .request-item-content{
                padding: 10px;
                padding-bottom: 80px;
                margin-bottom: 50px;
                border-bottom: 1px solid #333;
                min-height: 100vh;
            }

            .contents-response{
                display: block;
                white-space: pre;
                word-break: break-word;
                overflow-x: scroll;
            }
        }
    }
</style>

<script>

    export default {
        data: function() {
            return {
                // requests: [],
            }
        },
        mounted() {
            console.log('Mounted');
            // console.log( store.state.auth );
            this.refreshCookie();
            this.scrollToPage();
        },
        watch:{
            $route (to, from){
                this.scrollToPage();
            }
        },
        computed: {
            requests(){
                return store.getters.requests != '' ? store.getters.requests : [];
            }
        },
        methods: {
            refreshCookie(){;
                store.commit('refreshCookie');
                // this.requests = store.getters.requests != '' ? store.getters.requests : [];
            },
            scrollToPage(){

                let paramId = this.$route.params.id,
                    element = document.getElementById( paramId );

                if ( typeof paramId != 'undefined' && paramId != '' && typeof element != 'undefined') {
                    let topBuff = 0,
                        position = element.offsetTop > topBuff ? element.offsetTop - topBuff : 0;
                    window.scrollTo(0, position);
                }
            },
            toggleFolder( index ){
                this.requests[index].isFolderOpen = ! this.requests[index].isFolderOpen
            },
        }
    }
</script>
