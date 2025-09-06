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
        <h2 class="subtitle">Danh sách công việc</h2>
        <div class="content">
        <div v-if="tasks.length === 0" class="empty">
            Chưa có công việc nào
        </div>

       <div v-for="task in tasks" :key="task.id":class="['task-item', isOverdue(task.deadline) ? 'overdue' : '']">
        <div class="task-info">
          <b>{{ task.title }}</b>
          <p>{{ task.description }}</p>
          <p >Hạn: {{ task.deadline }}</p>
        </div>
        <div class="task-actions">
          <button class="btn-small success" @click="markDone(task)">Xong</button>
          <button class="btn-small danger" style="background: orange;" @click="editTask(task)">Sửa</button>
          <button class="btn-small danger" @click="remove(task.id)">Xóa</button>
        </div>
       </div> 
      </div>
        <button class="btn add-btn" @click="addTask">+ Thêm công việc</button>
        

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
  tasks.value = res.data.filter(t => !t.status)
}



const addTask = async () => {
  // Tạo modal
  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); display: flex; justify-content: center;
    align-items: center; z-index: 1000;
  `
  
  const form = document.createElement('div')
  form.style.cssText = `
    background: white; padding: 20px; border-radius: 8px;
    width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  `
  
  form.innerHTML = `
    <h3 style="margin: 0 0 15px 0; text-align: center;">Thêm Task Mới</h3>
    <input type="text" id="taskTitle" placeholder="Tên task" 
           style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
    <textarea id="taskDesc" placeholder="Mô tả" rows="3"
              style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; resize: none;">
    </textarea>
    <input type="datetime-local" id="taskDeadline" 
           style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
    <div style="display: flex; gap: 10px; margin-top: 15px;">
      <button id="saveBtn" style="flex: 1; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Lưu</button>
      <button id="cancelBtn" style="flex: 1; padding: 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Hủy</button>
    </div>
  `
  
  modal.appendChild(form)
  document.body.appendChild(modal)
  
  // Focus vào input đầu tiên
  setTimeout(() => form.querySelector('#taskTitle').focus(), 100)
  
  // Xử lý sự kiện
  form.querySelector('#saveBtn').onclick = async () => {
    const title = form.querySelector('#taskTitle').value.trim()
    const description = form.querySelector('#taskDesc').value.trim()
    const deadline = form.querySelector('#taskDeadline').value
    
    if (!title) {
      alert('Vui lòng nhập tên task')
      return
    }
    
    try {
      await api.post('/tasks', { title, description, deadline })
      document.body.removeChild(modal)
      fetchTasks()
    } catch (error) {
      alert('Lỗi khi thêm task: ' + error.message)
    }
  }
  
  form.querySelector('#cancelBtn').onclick = () => {
    document.body.removeChild(modal)
  }
  
  // Đóng khi click outside
  modal.onclick = (e) => {
    if (e.target === modal) document.body.removeChild(modal)
  }
}



const markDone = async (task) => {
  await api.put(`/tasks/${task.id}`, { status: true })
  fetchTasks()
}

const remove = async (id) => {
  await api.delete(`/tasks/${id}`)
  fetchTasks()
}

const editTask = (task) => {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); display: flex; justify-content: center;
    align-items: center; z-index: 1000;
  `
  
  const form = document.createElement('div')
  form.style.cssText = `
    background: white; padding: 20px; border-radius: 8px;
    width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  `
  
  form.innerHTML = `
    <h3 style="margin: 0 0 15px 0; text-align: center;">Chỉnh sửa Task</h3>
    <input type="text" id="taskTitle" placeholder="Tên task" 
           value="${task.title}" 
           style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
    <textarea id="taskDesc" placeholder="Mô tả" rows="3"
              style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; resize: none;">${task.description || ''}</textarea>
    <input type="datetime-local" id="taskDeadline" 
           value="${task.deadline ? new Date(task.deadline).toISOString().slice(0,16) : ''}" 
           style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
    <div style="display: flex; gap: 10px; margin-top: 15px;">
      <button id="saveBtn" style="flex: 1; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Cập nhật</button>
      <button id="cancelBtn" style="flex: 1; padding: 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Hủy</button>
    </div>
  `
  
  modal.appendChild(form)
  document.body.appendChild(modal)
  
  // Focus input
  setTimeout(() => form.querySelector('#taskTitle').focus(), 100)

  // Sự kiện nút lưu
  form.querySelector('#saveBtn').onclick = async () => {
    const title = form.querySelector('#taskTitle').value.trim()
    const description = form.querySelector('#taskDesc').value.trim()
    const deadline = form.querySelector('#taskDeadline').value
    
    if (!title) {
      alert('Tên task không được để trống')
      return
    }

    try {
      await api.put(`/tasks/${task.id}`, { title, description, deadline })
      document.body.removeChild(modal)
      fetchTasks()
    } catch (error) {
      alert('Lỗi khi cập nhật task: ' + error.message)
    }
  }

  // Hủy modal
  form.querySelector('#cancelBtn').onclick = () => {
    document.body.removeChild(modal)
  }

  // Click outside đóng modal
  modal.onclick = (e) => {
    if (e.target === modal) document.body.removeChild(modal)
  }
}

// Kiểm tra task quá hạn (deadline < hiện tại)
const isOverdue = (deadline) => {
  if (!deadline) return false
  const now = new Date()
  const taskDate = new Date(deadline)
  return taskDate < now
}

const logout = () => {
  localStorage.clear()
  router.push('/')
}

const goProfile = () => router.push('/profile')

onMounted(fetchTasks)
</script>
