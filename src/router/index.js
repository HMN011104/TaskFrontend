import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../screens/Login.vue'
import Signup from '../screens/Signup.vue'
import Main from '../screens/Main.vue'
import Profile from '../screens/Profile.vue'
import History from '../screens/History.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/signup', component: Signup },
  { path: '/main', component: Main },
  { path: '/profile', component: Profile },
  { path: '/history', component: History }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

