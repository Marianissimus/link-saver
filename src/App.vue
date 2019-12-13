<template>
  <div id="app">
    <header>
      <nav>
        <span class="deco-font logoTitle">Link Saver</span>
        <span v-if="user">for {{ user }}</span>
        <router-link to="login" v-if="!user && this.$route.path !=='/login' ">Log in</router-link>
        <router-link to="SignUp" v-if="!user &&  this.$route.path !=='/SignUp'">Sign in</router-link>
        <span v-if="user" @click="logOut" style="margin-left: 1em;   cursor: pointer;">Log Out</span>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import { store, mutations } from "./store"

export default {
  name: 'app',
  computed: {
   user () {
    return store.user
   }
  },
  methods: {
    logOut () {
      firebase.auth().signOut().catch(function(error) {
        var errorCode = error.code
        var errorMessage = error.message
        if (errorMessage) console.log(`Error code: ${errorCode} with message: ${errorMessage}`)
      }).then (()=> {
        this.$router.replace('login')
        mutations.setUser(null)
      })
    }
  }
}
</script>
