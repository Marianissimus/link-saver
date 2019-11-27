// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase'

Vue.use(firestorePlugin)

Vue.config.productionTip = false
Vue.prototype.$user = null // use globally 

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDlgmyeOk_r2mL5OOVm_M8-yascspZDAew",
  authDomain: "linksaver-209f4.firebaseapp.com",
  databaseURL: "https://linksaver-209f4.firebaseio.com",
  projectId: "linksaver-209f4",
  storageBucket: "linksaver-209f4.appspot.com",
  messagingSenderId: "137491183275",
  appId: "1:137491183275:web:c18f1c4a33466c860ee9ee"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export const db = firebase.firestore()
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
