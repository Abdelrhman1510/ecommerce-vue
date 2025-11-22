<template>
  <div class="p-6 dark:bg-gray-900 min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Orders Management</h1>
    </div>

    <SkeletonLoader v-if="loading" type="table" />

    <div v-else-if="orders.length === 0" class="text-center py-16">
      <p class="text-gray-600 text-lg">No orders found.</p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
      <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
            <th class="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Customer</th>
            <th class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Total</th>
            <th class="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th class="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
            <th class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300">#{{ order.order_number }}</td>
            <td class="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300">User #{{ order.user_id }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300 font-medium">${{ order.total }}</td>
            <td class="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
              <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">Pending</span>
            </td>
            <td class="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300">{{ formatDate(order.created_at) }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
              <button @click="viewDetails(order)" class="btn-info text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="error" class="mt-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-start">
      <svg class="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span class="whitespace-pre-line">{{ error }}</span>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDetailsModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Order #{{ selectedOrder?.order_number }} Details</h2>
          <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600 text-3xl leading-none bg-transparent border-0 cursor-pointer">×</button>
        </div>

        <div class="px-6 py-5">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">User ID</p>
                <p class="text-gray-900 dark:text-gray-300">{{ selectedOrder?.user_id }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Order Number</p>
                <p class="text-gray-900 dark:text-gray-300">{{ selectedOrder?.order_number }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Address</p>
                <p class="text-gray-900 dark:text-gray-300">{{ selectedOrder?.address || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</p>
                <p class="text-gray-900 dark:text-gray-300">{{ selectedOrder?.phone || 'N/A' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Date</p>
                <p class="text-gray-900 dark:text-gray-300">{{ formatDate(selectedOrder?.created_at) }}</p>
              </div>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Items</h3>
          <div v-if="selectedOrder?.items && selectedOrder.items.length > 0" class="overflow-x-auto mb-6">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Product</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in selectedOrder.items" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">{{ item.product?.name || 'N/A' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">{{ item.quantity }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">${{ item.price }}</td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-300">${{ (item.quantity * parseFloat(item.price)).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center text-gray-600 dark:text-gray-400 mb-6">
            No items in this order
          </div>

          <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6 flex justify-between items-center border border-indigo-200 dark:border-indigo-800">
            <span class="font-medium text-gray-700 dark:text-gray-300">Order Total:</span>
            <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${{ selectedOrder?.total }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-3 px-6 py-5 border-t border-gray-200 dark:border-gray-700">
          <button @click="closeDetailsModal" class="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../api/axios'
import SkeletonLoader from '../components/SkeletonLoader.vue'

const orders = ref([])
const loading = ref(false)
const error = ref(null)
const showDetailsModal = ref(false)
const selectedOrder = ref(null)

const fetchOrders = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get('/orders')

    // Handle different response structures
    let ordersArray = []
    if (Array.isArray(response.data.data)) {
      ordersArray = response.data.data
    } else if (Array.isArray(response.data)) {
      ordersArray = response.data
    } else if (response.data.data && Array.isArray(response.data.data.orders)) {
      ordersArray = response.data.data.orders
    }

    orders.value = ordersArray
  } catch (err) {
    error.value = 'Failed to load orders'
  } finally {
    loading.value = false
  }
}

const viewDetails = async (order) => {
  selectedOrder.value = order
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedOrder.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

onMounted(() => {
  fetchOrders()
})
</script>
