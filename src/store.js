import Vue from "vue";

export const store = Vue.observable({
  isLoggedIn: false,
  user: null,
  message: null
})

export const mutations = {
  setMessage(message) {
    store.message = message
  },
  setUser(user) {
    store.user = user
  },
  setIsLoggedIn(isLoggedIn) {
    store.isLoggedIn = isLoggedIn
  }
}