<template>
  <div class="login">
    <h1>Log in {{ user }} </h1>
  	<form @submit.prevent="login" autocomplete="on">
      <div class="loginorsignup">
        <p>
          <label for="email">Email: &nbsp;</label>
    		  <input type="email" name="email" id="email" v-model="email" size="31" contenteditable="true"
          placeholder="Your email address" autocomplete="email"
          />
        </p>
        <p>
          <label for="password">Password: &nbsp;</label>
    		  <input type="password" name="password" id="password" v-model="password" size="26" contenteditable="true"
          placeholder="Your password" autocomplete="new-password"/>
    		</p>
        <p v-if="error || message">
          <span v-if="error" style="color: white">{{ error }}</span>
          <span v-else style="color: white">{{ message }}</span>
        </p>
      </div>
      <div class="btnRow">
        <button type="button" @click="reset" class="submitBtn bk-red">Reset</button>
        <button type="submit" class="submitBtn bk-green">Log in</button>
        <button type="button" class="submitBtn bk-cyan" @click="demoLogin">Demo</button>
      </div>
  	</form>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import Vue from 'vue'
import { db } from '@/main'
import { store, mutations } from "../store"

export default {
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  computed: {
   user () {
    return store.user
   }, 
   message () {
    return store.message
   }
  },
  methods: {
    login () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(response => {
        mutations.setUser(response.user.email)
        mutations.setIsLoggedIn(true)
        localStorage.setItem('user', response.user.email)
        this.$router.replace('form')
      }).catch(error => {
        this.error = error.message
      })
    },
    reset () {
      this.email = ''
      this.password = ''
      mutations.setMessage(null)
    },
    demoLogin () {
      firebase.auth().signInAnonymously().catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message
        console.log(error)
      }).then(response => {
        mutations.setIsLoggedIn(true)
        localStorage.setItem('user', 'Demo user')
        this.$router.replace('form')
      })
    }
  }
}
</script>

<style scoped>
</style>
