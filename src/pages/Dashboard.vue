<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <div v-if="loading" class="loading">Loading dashboard data...</div>

    <div v-else class="stats-grid">
      <div class="stat-card">
        <h3>Total Products</h3>
        <p class="stat-number">{{ stats.totalProducts }}</p>
      </div>

      <div class="stat-card">
        <h3>Total Orders</h3>
        <p class="stat-number">{{ stats.totalOrders }}</p>
      </div>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../api/axios'

const stats = ref({
  totalProducts: 0,
  totalOrders: 0
})

const loading = ref(true)
const error = ref(null)

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
    if (Array.isArray(ordersRes.data.data)) {
      orderCount = ordersRes.data.data.length
    } else if (ordersRes.data.data?.orders) {
      orderCount = ordersRes.data.data.orders.length
    }

    stats.value.totalProducts = productCount
    stats.value.totalOrders = orderCount
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
.dashboard {
  padding: 20px;
}

.dashboard h1 {
  margin-bottom: 30px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.stat-card h3 {
  margin: 0;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  margin: 15px 0 0 0;
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background-color: #fee;
  color: #c33;
  border-radius: 5px;
}
</style>
