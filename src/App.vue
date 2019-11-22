<template>
  <div id="app">
    <header>
      <nav>
        <span>Vue Link Saver</span>
        <router-link to="login">Log in</router-link>  
        <router-link to="SignUp">Sign in</router-link>
        <span @click="logOut">Log Out</span>
        <span v-if="$user" style="color: green">{{ $user }}</span>
      </nav>
    </header>
    <main>
      <router-view></router-view> 
    </main>
  </div>
</template>

<script>
import Hello from './components/Hello'
import AppForm from './components/AppForm'
import * as firebase from 'firebase'

export default {
  name: 'app',
  components: {
    Hello, AppForm
  },
  updated () {
    console.log(this.$user)
  },
  methods: {
    logOut () {
      firebase.auth().signOut().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        if (errorMessage) console.log(`Error code: ${errorCode} with message: ${errorMessage}`)

      }).then (()=> {
        this.$router.replace('login')
      })
    }
  }
}
</script>

<style>
body {
  margin: 0;
  background-color: #2c3e50;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
  color: white;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
  width: 100%;
}

header span {
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding: 1em;
}

a {
  text-decoration: none;
  color: white;
}
</style>
