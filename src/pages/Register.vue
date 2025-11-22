<template>
  <div class="min-h-screen bg-gradient-auth dark:bg-gray-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">Create Account</h1>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="John Doe"
              class="input-field"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              class="input-field"
              required
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="input-field"
              required
            />
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
            <input
              id="confirm-password"
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              class="input-field"
              required
            />
          </div>

          <Transition name="fade">
            <div v-if="form.password && form.confirmPassword && !passwordsMatch" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-sm font-medium text-red-800 dark:text-red-400">Passwords do not match.</p>
            </div>
          </Transition>

          <button
            type="submit"
            :disabled="loading || !passwordsMatch"
            class="btn-primary w-full flex items-center justify-center"
          >
            <span v-if="!loading">Create Account</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          </button>
        </form>

        <Transition name="fade">
          <div v-if="error && error !== 'Passwords do not match.'" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm font-medium text-red-800 dark:text-red-400">{{ error }}</p>
          </div>
        </Transition>

        <Transition name="fade">
          <div v-if="success" class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p class="text-sm font-medium text-green-800 dark:text-green-400">{{ success }}</p>
          </div>
        </Transition>

        <p class="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
          Already have an account?
          <router-link to="/login" class="font-semibold text-primary hover:text-secondary transition-colors dark:hover:text-secondary">
            Login here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../api/axios'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref(null)
const success = ref(null)

const passwordsMatch = computed(() => {
  return form.value.password && form.value.password === form.value.confirmPassword
})

const handleRegister = async () => {
  if (!passwordsMatch.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  error.value = null
  success.value = null

  try {
    const data = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.confirmPassword
    }

    await axios.post('/auth/register', data)

    success.value = 'Account created successfully! Redirecting to login...'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    let errorMsg = 'Registration failed. Please try again.'

    if (err.response?.data?.message) {
      errorMsg = err.response.data.message
    } else if (err.response?.data?.errors) {
      const errors = err.response.data.errors
      const errorLines = Object.entries(errors).map(([field, msgs]) => {
        return `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
      })
      errorMsg = errorLines.join('\n')
    } else if (err.message) {
      errorMsg = err.message
    }

    error.value = errorMsg
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
