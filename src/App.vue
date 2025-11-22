<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Bar -->
    <nav v-if="isAuthenticated" class="bg-gradient-to-r from-primary to-secondary shadow-lg sticky top-0 z-50 dark:from-indigo-700 dark:to-purple-700">
      <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div class="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          <!-- Logo/Brand -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <div class="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-lg flex items-center justify-center">
              <svg class="w-5 sm:w-6 h-5 sm:h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.243a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.757 15.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM2 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.757 5.757a1 1 0 000-1.414L5.05 3.636a1 1 0 00-1.414 1.414l.707.707z"></path>
              </svg>
            </div>
            <h1 class="text-lg sm:text-2xl font-bold text-white hidden sm:block">Admin</h1>
          </div>

          <!-- Navigation Links -->
          <div class="flex items-center gap-1 sm:gap-2">
            <nav-link
              to="/dashboard"
              :is-active="isActive('/dashboard')"
            >
              <span class="text-xs sm:text-base">Dashboard</span>
            </nav-link>
            <nav-link
              to="/products"
              :is-active="isActive('/products')"
            >
              <span class="text-xs sm:text-base">Products</span>
            </nav-link>
            <nav-link
              to="/orders"
              :is-active="isActive('/orders')"
            >
              <span class="text-xs sm:text-base">Orders</span>
            </nav-link>
          </div>

          <!-- Spacer -->
          <div class="flex-1"></div>

          
   

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="px-2 sm:px-4 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-base rounded-lg font-medium transition-all duration-200 flex-shrink-0 whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './store/auth'
import { useThemeStore } from './store/theme'
import { computed, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const isActive = (path) => {
  return route.path === path
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  themeStore.initializeTheme()
  themeStore.watchSystemPreference()
})
</script>

<script>
import { h } from 'vue'
import { RouterLink } from 'vue-router'

const NavLink = {
  name: 'NavLink',
  props: ['to', 'isActive'],
  render() {
    return h(
      RouterLink,
      {
        to: this.to,
        class: [
          'px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200',
          this.isActive
            ? 'bg-white/30 text-white'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        ]
      },
      () => this.$slots.default?.()
    )
  }
}

export default {
  components: { NavLink }
}
</script>
