<template>
  <div class="home">
  	<section class="hero is-medium is-primary is-bold">
  	  <div class="hero-body">
  	    <div class="container">
  	      <h1 class="title">Jheck Api Document Generator</h1>
  	      <h2 class="subtitle">Simplify creating of api documentation online</h2>
  	    </div>
  	  </div>
  	</section>

  	<div id="home-content" class="container">
  		<section class="home-description">
    		<p>Hello! I'm just a lazy developer browsing for available online api document generator, but none of them fits on my taste. Most are not that easy to use or some requires you to register before use ($_$). I created this app to simplify the job by filling up the form fields and without even installing any complicated softwares to your local. Just export/import the file and you are ready to go! =)</p>
  		</section>

  		<div class="get-started">
				<router-link to="/app" class=" button is-primary is-large">Get Started</router-link>
  		</div>

  		<h4 class="title is-4">How to use it?</h4>
  		<p>This app is free for use but you have to make sure your javascript and browser cookies are enabled. Just open <router-link to="/app">App page</router-link> then fill up all fields there.</p>
			<br>

  		<h4 class="title is-4">How to save it?</h4>
  		<p>Data are stored using <a href="https://en.wikipedia.org/wiki/HTTP_cookie" target="_blank">browser cookie</a> for 1 day. There is also an export button to save it into .json file that you will be able to import if you need it to.</p>
			<br>

  		<h4 class="title is-4">How i can preview the document?</h4>
  		<p>Currently the option is to export your file into .json and upload to <router-link to="/preview">Online Previewer</router-link>.</p>
		
			<br>
  		<h4 class="title is-4">Experiencing errors?</h4>
  		<p>Try to your browser in incognito mode or clear your browser cookies, as this app uses cookie to save the data. If error still happen you can issue a ticket <a href="https://github.com/jheck102209/jheck-api-document-generator/issues/new" target="_blank">here</a>.</p>

  	</div>
  </div>
</template>

<script>
// @ is an alias to /src
import MainContent from '@/components/MainContent.vue'

export default {
  name: 'home',
  components: {
    MainContent
  }
}
</script>

<style lang="scss" scoped>
	#home-content{
		padding-top: 80px;
		padding-bottom: 80px;

		.home-description{
			font-size: 18px;
			line-height: 32px;
		}
	}
	.get-started{
		padding: 50px;
		text-align:center;
	}
</style>