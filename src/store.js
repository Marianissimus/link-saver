import Vue from "vue";

export const store = Vue.observable({
	isLoggedIn: false,
  user: null,
})

export const mutations = {
  setUser(user) {
    store.user = user;
  },
  setIsLoggedIn(isLoggedIn) {
  	store.isLoggedIn = isLoggedIn
  }
};