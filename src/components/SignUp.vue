<template>
  <div id="container">
  	<form @submit.prevent="signUp" autocomplete="on">
      <div id="loginInputs">
        <p>
          <label for="email">Email: &nbsp;</label>
    		  <input type="email" name="email" id="email" v-model="email" size="26" contenteditable="true" 
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
        <button @click.prevent="reset" class="resetBtn">Reset</button>
        <button type="submit" class="submitBtn">Sign Up</button>
      </div>
  	</form>
  </div>
</template>

<script>
import * as firebase from 'firebase'

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
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorMessage) console.log(errorMessage)

      }).then (()=> {
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

<style scoped>
</style>
