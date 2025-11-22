import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  // Apply theme to document
  const applyTheme = () => {
    if (typeof document === 'undefined') return

    const html = document.documentElement

    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    const saved = localStorage.getItem('theme')

    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    applyTheme()
  }

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // Watch for theme changes and apply
  watch(isDark, () => {
    applyTheme()
  })

  // Watch for system preference changes
  const watchSystemPreference = () => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e) => {
      // Only apply system preference if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
      }
    }

    darkModeQuery.addEventListener('change', handleChange)
  }

  return {
    isDark,
    initializeTheme,
    toggleTheme,
    watchSystemPreference
  }
})
