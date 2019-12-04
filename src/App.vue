<template>
  <div id="app">
    <header>
      <nav>
        <span class="deco-font logoTitle">Little Link Saver</span>
        <span v-if="user">for {{ user }}</span>
        <router-link to="login" v-if="!user && this.$route.path !=='/login' ">Log in</router-link>
        <router-link to="SignUp" v-if="!user &&  this.$route.path !=='/SignUp'">Sign in</router-link>
        <span v-if="user" @click="logOut" style="margin-left: 1em;">Log Out</span>
      </nav>
    </header>
    <main>
      <router-view :user="user"></router-view>
    </main>
  </div>
</template>

<script>
import * as firebase from 'firebase'

export default {
  name: 'app',
  data () {
    return {
      user: null
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user.email
        this.$router.replace('form')
      } else {
        console.log('not logged in')
      }
    })
  },
  methods: {
    logOut () {
      firebase.auth().signOut().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        if (errorMessage) console.log(`Error code: ${errorCode} with message: ${errorMessage}`)
      }).then (()=> {
        this.user = null
        this.$router.replace('login')
      })
    }
  }
}
</script>
