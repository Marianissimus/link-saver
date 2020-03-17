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
  methods: {
    signUp () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorMessage) console.log(errorMessage)

      }).then (()=> {
        mutations.setMessage('You can now log in')
        this.$router.replace('login')
      })
    },
    reset () {
      this.email = ''
      this.password = ''
    }
  }
}
</script>
