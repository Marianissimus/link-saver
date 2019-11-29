<template>
  <div id="app">
    <header>
      <nav>
        <span>
          <span class="deco-font">Vue Link Saver</span>
          <span v-if="user">for {{ user }}</span>
          <router-link to="login" v-if="!user && this.$route.path !=='/login' ">Log in</router-link>  
          <router-link to="SignUp" v-if="!user &&  this.$route.path !=='/SignUp'">Sign in</router-link>
          <span v-if="user" @click="logOut" style="margin-left: 1em;">Log Out</span>
        </span>
      </nav>
    </header>
    <main>
      <router-view></router-view> 
    </main>
  </div>
</template>

<script>
import AppForm from './components/AppForm'
import * as firebase from 'firebase'

export default {
  name: 'app',
  data () {
    return {
      user: null
    }
  },
  components: {
    AppForm
  },
  mounted() {
    if (localStorage.getItem('user') && localStorage.getItem('user') !== 'null') this.user = localStorage.getItem('user')
  },
  methods: {
    logOut () {
      firebase.auth().signOut().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        if (errorMessage) console.log(`Error code: ${errorCode} with message: ${errorMessage}`)
      }).then (()=> {
        localStorage.setItem('user', null)
        this.user = null
        this.$router.replace('login')
      })
    }
  }
}
</script>

<style>
body {
  margin: 0;
  background-image: radial-gradient( circle farthest-corner at 20% 25.1%,  rgba(128,102,255,1) 0%, rgba(83,112,243,1) 100.2% );
  color: white;
}

header {
  text-align: center;
}

main {
  text-align: center;
  margin-top: 40px;
  color: white;
}

nav {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-around;
  border: 1px dotted white;
  border-radius: 10px;
  margin: 1em;
}
</style>
