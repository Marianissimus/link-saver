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
        <p v-if="error">
          <span style="color: white">{{ error }}</span>
        </p>
      </div>
      <div class="btnRow">
        <button type="button" @click="reset" class="submitBtn bk-red">Reset</button>
        <button type="submit" class="submitBtn bk-green">Login</button>
      </div>
  	</form>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import Vue from 'vue'
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
    }
  }
}
</script>

<style scoped>
</style>
