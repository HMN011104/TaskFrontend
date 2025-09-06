<template>
  <div class="screen">
    <div class="box">
    <!-- TOPBAR -->
    <div class="topbar">
      <h1 class="title">TASK MANAGER</h1>
      <img src="/logo.png" alt="logo" class="logo-small" />
      <div class="actions">
        <button class="btn-small" @click="goProfile">Profile</button>
        <div class="welcome">
          <p>Chào mừng<br /><b>{{ user?.name }}</b></p>
        </div>
        <button class="btn-small danger" @click="logout">Logout</button>
      </div>
    </div>

    <!-- CONTENT -->      
    <h2 class="subtitle">Đã hoàn thành:</h2>

    <div class="content">
      <div v-if="tasks.length === 0" class="empty">
        Chưa có công việc nào hoàn thành
      </div>

      <div v-for="task in tasks" :key="task.id" class="task-item done">
        <div class="task-info">
          <b>{{ task.title }}</b>
          <p>{{ task.description }}</p>
        </div>
      </div>
    </div>

    <!-- BOTTOMBAR -->
    <div class="bottombar">
        <button class="nav-btn" @click="$router.push('/main')">Home</button>
        <button class="nav-btn" @click="$router.push('/history')">History</button>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter() 
const tasks = ref([])
const user = JSON.parse(localStorage.getItem('user') || '{}')

const fetchTasks = async () => {
  const res = await api.get('/tasks')
  tasks.value = res.data.filter(t => t.status)
}

const logout = () => {
  localStorage.clear()
  router.push('/')
}

const goProfile = () => router.push('/profile')

onMounted(fetchTasks)
</script>
