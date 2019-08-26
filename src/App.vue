<template>
  <div id="app">
    <a class="github-ribbon" target="_blank" href="https://github.com/jheckizon/jheck-api-documentator"><img width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149" alt="Fork me on GitHub" data-recalc-dims="1"></a>

    <div id="main-nav">
      <div class="container is-fluid">
        <router-link to="/">Jheck Api Document Generator</router-link>
        <ul id="menu-links" class="right">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/app">App</router-link></li>
          <li><router-link to="/preview">Online Previewer</router-link></li>
          <li><a href="https://github.com/jheckizon/jheck-api-documentator/issues/new" target="_blank">Found a bug?</a></li>
        </ul>
      </div>
    </div>
    <div id="page-main-content">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
  
  $primary-color: #2962ff;
  $secondary-color: #82b1ff;

  #main-nav {
    border-bottom: 1px solid #eee;
    height: 80px;
    position: fixed;
    background: #fff;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    z-index: 10;

    & > .container{
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
    }

    #menu-links{
      display: flex;
      margin-right: 100px;

      a{
        color: #333;
        padding: 10px;

        &.router-link-exact-active{
          color: $primary-color;
        }
      }
    }

    & + #page-main-content{
      padding-top: 80px;
    }
  }

  .form-input{
    margin-bottom: 20px;

    .label{
      margin-bottom: 5px;
    }

    .helper-text{
      margin-top: 5px;
      color: #ccc;
      font-size: .75em;
    }
  }

  a.github-ribbon {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 999;
  }
</style>