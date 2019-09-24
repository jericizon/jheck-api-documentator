<template>
    <div id="app">
        <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
            <!-- <a class="github-ribbon" href="https://github.com/jheckizon/jheck-api-documentator"><img width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1"></a> -->
            <div class="container">
                <div class="navbar-brand">
                    <router-link to="/" class="navbar-item"><img src="./assets/logo.png" alt="Jheck Api Documentator Logo"></router-link>
                    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="subMenuToggle" @click="isOpen = !isOpen" :class="{'is-active': isOpen}">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="subMenuToggle" class="navbar-menu" :class="{'is-active': isOpen}">
                    <div class="navbar-start">
                        <router-link to="/" class="navbar-item">Home</router-link>
                        <router-link to="/app" class="navbar-item">App</router-link>
                        <router-link to="/preview" class="navbar-item">Online Previewer</router-link>

                        <div class="navbar-item has-dropdown is-hoverable">
                            <a class="navbar-link">More</a>
                            <div class="navbar-dropdown">
                                <router-link to="/about" class="navbar-item"><span class="icon"><i class="mdi mdi-information"></i></span> <span>About</span></router-link>
                                <hr class="navbar-divider">
                                <a class="navbar-item" href="https://github.com/jheckizon/jheck-api-documentator" target="_blank">
                                    <span class="icon"><i class="mdi mdi-github-circle"></i></span> <span>View on GitHub</span>
                                </a>
                                <a class="navbar-item" href="https://github.com/jheckizon/jheck-api-documentator/issues/new" target="_blank">
                                    <span class="icon"><i class="mdi mdi-bug"></i></span> <span>Report an issue</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div class="buttons">
                                <a class="button is-primary tooltip is-tooltip-bottom" data-tooltip="Upload export .json file" @click="importJson()">
                                    <span class="icon"><i class="mdi mdi-cloud-upload"></i></span> <span>Import File</span>
                                </a>
                                <a class="button is-info tooltip is-tooltip-bottom" data-tooltip="Save into .json format file" @click="exportJson()">
                                    <span class="icon"><i class="mdi mdi-cloud-download"></i></span> <span>Export File</span>
                                </a>
                                <a class="button is-danger tooltip is-tooltip-bottom" data-tooltip="Clear your workspace" @click="clearWorkspace()" v-if="showClearAllRecords">
                                    <span class="icon"><i class="mdi mdi-delete-alert"></i></span> <span>Clear all workspace</span>
                                </a>
                                <a href="https://www.producthunt.com/posts/jheck-api-documentator?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-jheck-api-documentator" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=168639&theme=light" alt="Jheck Api Documentator - Simplify creating of api documentation online | Product Hunt Embed" style="width: 130px; height: 54px; transform: scale(1.3); transform-origin: left center;" target="_blank"/></a>
                                <a id="export-json" style="display:none">Preview</a>
                                <input type="file" id="import-json" accept=".json,application/json" style="display: none;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </nav>

        <router-view/>
    </div>
</template>

<style lang="scss">
    .content-margin{
        margin-top: 2em;
    }
    nav.navbar {
        padding-top: 10px;
        padding-bottom: 10px;
        background: #fafafa;

        .github-ribbon{
            position: fixed;
            top: 0;
            right: 0;
            display: none;
        }

        + div{
            margin-top: 70px;
        }
    }

    .method{
        &[data-method="get"]{
            background-color: #00d1b2;
            color: #fff;
        }
        &[data-method="post"]{
            background-color: #ffdd57;
            color: rgba(0, 0, 0, 0.7);
        }
        &[data-method="put"],
        &[data-method="patch"]{
            background-color: #209cee;
            color: #fff;
        }
        &[data-method="delete"]{
            background-color: #ff3860;
            color: #fff;
        }
        &[data-method="options"]{
            background: #fff;
        }
    }
</style>

<script>

    export default {
        data: function() {
            return {
                isOpen: false
            }
        },
        mounted(){
            if ( window.innerWidth <= 900 ) {
                let message = 'Hello, this app doesn\'t support mobile. For better experience you can try it on desktop. :)';
                let options = {
                    animation : 'bounce',
                    // cancelText: 'Okay',
                };
                this.$dialog.confirm(message, options);
            }
        },
        computed: {
            showClearAllRecords(){
                let requests = store.getters.requests != '' ? store.getters.requests : [];
                return requests.length;
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

                    if ( vm.isJsonString( e.currentTarget.result ) ) {
                        let json = JSON.parse(e.currentTarget.result);
                        try {

                            if ( json.data.length ) {
                                vm.$toast.success({
                                    title: 'Success',
                                    message: 'File imported',
                                })

                                console.log( json.data );
                                store.commit('importJson', json.data);

                                let currentRouteName = vm.$router.currentRoute.name;

                                if ( currentRouteName != 'app' && currentRouteName != 'preview' ) {
                                    vm.$router.push( { name: 'app' });
                                }
                            }

                        } catch (ex) {
                            alert('ex when trying to parse json = ' + ex);
                            vm.$toast.error({
                                title: 'Error',
                                message: 'Sorry we cannot read this file',
                            })
                        }
                    }
                    else{
                        vm.$toast.error({
                            title: 'Error',
                            message: 'Sorry we cannot read this file',
                        })
                    }

                }
                })(file);

                reader.readAsText(file);
                document.getElementById('import-json').value = '';

            },
            exportJson() {

                let requests = this.$store.state.requests;

                if ( requests.length == 0 ) {
                    this.$toast.warning({
                        title: 'Warning',
                        message: 'No record to export',
                    })
                }
                else{

                    let exportData = {
                        _export_date: new Date(),
                        _version: 'v1.0.0',
                        _source: "Jheck Api Documentator",
                        data : requests,
                    }

                    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
                    var dlAnchorElem = document.getElementById('export-json');
                        dlAnchorElem.setAttribute("href", dataStr);
                        dlAnchorElem.setAttribute("download", `jheck-api-documentator-${this.getTimestamp()}.json`);
                        dlAnchorElem.click();
                    this.$toast.success({
                        title: 'Success',
                        message: 'JSON exported',
                    })
                }

            },
            getTimestamp() {
                var d = new Date(),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear(),
                    hours = d.getHours(),
                    minutes = d.getMinutes(),
                    seconds = d.getMinutes();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                 return [year, month, day].join('-') + hours + minutes + seconds;
            },
            isJsonString(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            },
            clearWorkspace(){

                let message = 'Are you sure you want to clear your workspace?';
                let options = {
                    animation : 'fade',
                    okText: 'Yes remove it',
                    cancelText: 'Cancel',
                };

                let vm = this;

                this.$dialog.confirm(message, options)
                    .then((dialog) => {
                        this.$toast.success({
                            title: 'Success',
                            message: 'Workspace now cleared',
                        })
                        store.commit('clearWorkspace');

                        if ( currentRouteName != 'app' && currentRouteName != 'preview' ) {
                            vm.$router.push( { name: 'app' });
                        }
                   })
            }
        }
    }
</script>
