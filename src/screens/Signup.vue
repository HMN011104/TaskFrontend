<template>
  <div class="screen">
    <div class="box">
      <h1 class="title">TASK MANAGER</h1>
      <img src="/logo.png" alt="logo" class="logo" />

      <div class="form">
        <input v-model="name" type="text" placeholder="Username" class="input" />
        <input v-model="email" type="email" placeholder="Email" class="input" />
        <input v-model="password" type="password" placeholder="Password" class="input" />
        <input v-model="passwordConfirm" type="password" placeholder="Xác nhận password" class="input" />

        <button class="btn" @click="signup">Đăng ký</button>
      </div>

      <p class="hint">
        Bạn đã có tài khoản?
        <router-link to="/" class="link">Đăng nhập</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

const signup = async () => {
  if (password.value !== passwordConfirm.value) {
    alert('Mật khẩu không khớp')
    return
  }
  try {
    const res = await api.post('/register', { 
      name: name.value, 
      email: email.value, 
      password: password.value 
    })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/main')
  } catch {
    alert('Đăng ký thất bại')
  }
}
</script>

