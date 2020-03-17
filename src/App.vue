<template>
  <div id="app">
    <header>
      <nav>
        <span class="deco-font logoTitle">Link Saver</span>
        <span v-if="user">for {{ user }}</span>
        <router-link to="login" v-if="!user && this.$route.path !=='/login' ">Log in</router-link>
        <router-link to="SignUp" v-if="!user &&  this.$route.path !=='/SignUp'">Sign up</router-link>
        <span v-if="user" @click="logOut" style="margin-left: 1em;   cursor: pointer;">Log Out</span>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { store, mutations } from "./store"
import { db } from '@/main'
import { allowedusers } from './allowedusers'

export default {
  name: 'app',
  computed: {
   user () {
    return store.user
   }
  },
  methods: {
    logOut () {
      if(!allowedusers.includes(this.user)){
          let currentUser = this.user
          db.collection('users').doc(currentUser).delete() // delete collection (user data)
          firebase.auth().currentUser.delete() // delete user
          mutations.setMessage('Demo user has been deleted')
          this.$router.replace('login').then(mutations.setUser(null))
        }
        else {
          firebase.auth().signOut().catch(function(error) {
          var errorCode = error.code
          var errorMessage = error.message
          if (errorMessage) console.log(`Error code: ${errorCode} with message: ${errorMessage}`)
        })
          .then (()=> {
          this.$router.replace('login')
          if (user) mutations.setUser(null)
        })
      }
    }
  }
}
</script>
