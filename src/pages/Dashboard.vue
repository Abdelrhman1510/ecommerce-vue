<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Welcome back! Here's your business overview.</p>
    </div>

    <!-- Loading State -->
    <SkeletonLoader v-if="loading" type="card" />

    <!-- Stats Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Total Products Card -->
      <div class="card p-8 border-l-4 border-blue-500 hover:shadow-xl transition-all dark:bg-gray-800 dark:border-blue-400">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">Total Products</p>
            <p class="mt-4 text-4xl font-bold text-gray-900 dark:text-white">{{ stats.totalProducts }}</p>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Available in inventory</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Orders Card -->
      <div class="card p-8 border-l-4 border-green-500 hover:shadow-xl transition-all dark:bg-gray-800 dark:border-green-400">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">Total Orders</p>
            <p class="mt-4 text-4xl font-bold text-gray-900 dark:text-white">{{ stats.totalOrders }}</p>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">All time orders</p>
          </div>
          <div class="bg-green-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Income Card -->
      <div class="card p-8 border-l-4 border-purple-500 hover:shadow-xl transition-all dark:bg-gray-800 dark:border-purple-400">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">Total Income</p>
            <p class="mt-4 text-4xl font-bold text-gray-900 dark:text-white">${{ stats.totalIncome.toFixed(2) }}</p>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Revenue from orders</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.16 2.75a.75.75 0 00-.328 1.421A7.75 7.75 0 1014.971 14.84a.75.75 0 001.06-1.061A9.25 9.25 0 108.16 2.75z"></path>
              <path d="M7.58 11.75a.75.75 0 100-1.5.75.75 0 000 1.5zM13 8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div v-if="!loading" class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Revenue Analytics</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Income Chart -->
        <div class="card p-6 shadow-md dark:bg-gray-800">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Values (Last 5 Orders)</h3>
          <div class="h-80">
            <Bar
              v-if="incomeChartData.labels.length > 0"
              :data="incomeChartData"
              :options="chartOptions"
            />
          </div>
        </div>

        <!-- Summary Chart -->
        <div class="card p-6 shadow-md dark:bg-gray-800">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Income Summary</h3>
          <div class="h-80">
            <Bar
              v-if="summaryChartData.labels.length > 0"
              :data="summaryChartData"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <Transition name="fade">
      <div v-if="error" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
        <p class="text-sm font-medium text-red-800 dark:text-red-400">{{ error }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from '../api/axios'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const stats = ref({
  totalProducts: 0,
  totalOrders: 0,
  totalIncome: 0
})

const loading = ref(true)
const error = ref(null)
const orders = ref([])

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return '$' + value.toFixed(2)
        }
      }
    }
  }
}

const incomeChartData = computed(() => {
  if (orders.value.length === 0) {
    return {
      labels: ['No Data'],
      datasets: [{
        label: 'Income',
        data: [0],
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1
      }]
    }
  }

  const last5Orders = orders.value.slice(-5)
  return {
    labels: last5Orders.map((_, idx) => `Order ${idx + 1}`),
    datasets: [{
      label: 'Order Value ($)',
      data: last5Orders.map(order => parseFloat(order.total || 0)),
      backgroundColor: 'rgba(139, 92, 246, 0.5)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 2,
      borderRadius: 4
    }]
  }
})

const summaryChartData = computed(() => {
  return {
    labels: ['Total Income', 'Average Order Value'],
    datasets: [{
      label: 'Value ($)',
      data: [
        stats.value.totalIncome,
        orders.value.length > 0 ? (stats.value.totalIncome / orders.value.length) : 0
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.5)',
        'rgba(34, 197, 94, 0.5)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(34, 197, 94, 1)'
      ],
      borderWidth: 2,
      borderRadius: 4
    }]
  }
})

const fetchStats = async () => {
  try {
    loading.value = true
    error.value = null

    const [productsRes, ordersRes] = await Promise.all([
      axios.get('/products'),
      axios.get('/orders')
    ])

    // Handle different response structures
    let productCount = 0
    if (Array.isArray(productsRes.data.data)) {
      productCount = productsRes.data.data.length
    } else if (productsRes.data.data?.products) {
      productCount = productsRes.data.data.products.length
    }

    let orderCount = 0
    let ordersArray = []
    if (Array.isArray(ordersRes.data.data)) {
      ordersArray = ordersRes.data.data
      orderCount = ordersArray.length
    } else if (ordersRes.data.data?.orders) {
      ordersArray = ordersRes.data.data.orders
      orderCount = ordersArray.length
    } else if (Array.isArray(ordersRes.data)) {
      ordersArray = ordersRes.data
      orderCount = ordersArray.length
    }

    let totalIncome = 0
    ordersArray.forEach(order => {
      totalIncome += parseFloat(order.total || 0)
    })

    stats.value.totalProducts = productCount
    stats.value.totalOrders = orderCount
    stats.value.totalIncome = totalIncome
    orders.value = ordersArray
  } catch (err) {
    error.value = 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
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
