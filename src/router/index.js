import Vue from 'vue'
import Router from 'vue-router'
import * as firebase from 'firebase'
import Form from '../components/AppForm'
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import Error from '../components/Error'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/form',
      name: 'Form',
      component: Form,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      name: 'Error',
      component: Error
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (firebase.auth().currentUser !== null) {
    this.$user = firebase.auth().currentUser.email
  }
  next()
})

export default router
