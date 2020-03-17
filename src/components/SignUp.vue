<template>
  <div class="login">
    <h1>Sign up</h1>
  	<form @submit.prevent="signUp" autocomplete="on">
      <div  class="loginorsignup">
        <p>
          <label for="email">Email: &nbsp;</label>
    		  <input type="email" name="email" id="email" v-model="email" size="31" contenteditable="true"
          placeholder="Your email address" autocomplete="email"
          />
        </p>
        <p>
          <label for="password">Password: &nbsp;</label>
    		  <input type="password" name="password" id="password" v-model="password" size="26" contenteditable="true"
          placeholder="Your password" autocomplete="current-password"
          />
    		</p>
        <p v-if="message">
          <span style="color: white">{{ message }}</span>
        </p>
      </div>
      <div class="btnRow">
        <button @click.prevent="reset" class="submitBtn bk-red">Reset</button>
        <button type="submit" class="submitBtn bk-green">Sign Up</button>
      </div>
  	</form>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { store, mutations } from "../store"

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    message () {
      return store.message
    }
  },
  methods: {
    signUp () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function(error) {
        if (error) { 
          let msg =  error.message
          mutations.setMessage(msg)
          return false
        }
      }).then(response => {
        if(response) {
          mutations.setMessage('You can now log in')
          this.$router.replace('login')
        }
      })
    },
    reset () {
      this.email = ''
      this.password = ''
      mutations.setMessage(null)
    }
  }
}
</script>
