<template>
  <div id="app">
    <nav v-if="isAuthenticated" class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>Admin Dashboard</h1>
        </div>
        <ul class="nav-menu">
          <li>
            <router-link to="/dashboard" :class="{ active: isActive('/dashboard') }">
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/products" :class="{ active: isActive('/products') }">
              Products
            </router-link>
          </li>
          <li>
            <router-link to="/orders" :class="{ active: isActive('/orders') }">
              Orders
            </router-link>
          </li>
          <li>
            <button @click="handleLogout" class="btn-logout">Logout</button>
          </li>
        </ul>
      </div>
    </nav>

    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './store/auth'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const isActive = (path) => {
  return route.path === path
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand h1 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 30px;
  align-items: center;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-menu a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-menu a.active {
  background-color: rgba(255, 255, 255, 0.3);
  border-bottom: 2px solid white;
}

.btn-logout {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
  }

  .nav-menu {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .nav-menu li {
    width: 100%;
  }

  .nav-menu a {
    display: block;
    padding: 10px;
  }
}
</style>
