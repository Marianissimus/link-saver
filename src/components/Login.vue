<template>
  <div id="container">
    <h1>Log in</h1>
  	<form @submit.prevent="login" autocomplete="on">
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
          placeholder="Your password" autocomplete="new-password"/>
    		</p>
        <p v-if="error">
          <span style="color: red">{{ error }}</span>
        </p>
      </div>
      <div class="btnRow">
        <button type="button" @click="reset" class="resetBtn">Reset</button>
        <button type="submit" class="submitBtn">Login</button>
      </div>
  	</form>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import Vue from 'vue'

export default {
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    login () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        localStorage.setItem('user', this.email)
      }).
      then(() => {
        this.$router.replace('form')
      })
      .catch(err => {
        this.error = err.message
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
.submitBtn {
background-color: green;
}

.resetBtn {
  background-color: #555;
}
</style>
