<template>
  <div class="screen">
    <div class="box">
      <h1 class="title">TASK MANAGER</h1>
      <img src="/logo.png" alt="logo" class="logo" />

      <div class="form">
        <input v-model="email" type="email" placeholder="Email" class="input" />
        <input v-model="password" type="password" placeholder="Password" class="input" />

        <button class="btn" @click="login">Đăng nhập</button>
      </div>

      <p class="hint">
        Bạn chưa có tài khoản?
        <router-link to="/signup" class="link">Đăng ký</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

const login = async () => {
  try {
    const res = await api.post('/login', { email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/main')
  } catch {
    alert('Sai thông tin đăng nhập')
  }
}
</script>
