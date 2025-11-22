<template>
  <div class="p-6 dark:bg-gray-900 min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Products Management</h1>
      <button @click="openModal()" class="btn-primary">Add Product</button>
    </div>

    <SkeletonLoader v-if="loading" type="table" />

    <div v-else-if="products.length === 0" class="text-center py-16">
      <p class="text-gray-600 text-lg">
        No products found.
        <button @click="openModal()" class="text-indigo-600 hover:text-indigo-800 underline cursor-pointer bg-transparent border-0">
          Create one
        </button>
      </p>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md overflow-x-auto dark:bg-gray-800">
      <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
            <th class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Price</th>
            <th class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Stock</th>
            <th class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300">{{ product.id }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300">{{ product.name }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300">${{ product.price }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
              <span v-if="product.stock === 0" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">Out of Stock</span>
              <span v-else class="text-gray-900 dark:text-gray-300">{{ product.stock }}</span>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
              <div class="flex gap-1 sm:gap-2 flex-wrap">
                <button @click="editProduct(product)" class="btn-edit text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">Edit</button>
                <button @click="deleteProduct(product.id)" class="btn-delete text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">Delete</button>
              </div>
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

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">{{ editingProduct ? 'Edit Product' : 'Create Product' }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-3xl leading-none bg-transparent border-0 cursor-pointer">×</button>
        </div>

        <form @submit.prevent="saveProduct" class="px-6 py-5">
          <div class="mb-5">
            <label for="name" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Product name"
              required
              class="input-field"
            />
          </div>

          <div class="mb-5">
            <label for="price" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              placeholder="Price"
              step="0.01"
              required
              class="input-field"
            />
          </div>

          <div class="mb-5">
            <label for="stock" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
            <input
              id="stock"
              v-model.number="form.stock"
              type="number"
              placeholder="Stock"
              required
              class="input-field"
            />
          </div>

          <div class="mb-5">
            <label for="description" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              placeholder="Product description"
              class="input-field resize-y min-h-[100px]"
            ></textarea>
          </div>

          <div class="flex gap-3 justify-end pt-5 mt-5 border-t border-gray-200 dark:border-gray-700">
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
            <button type="submit" :disabled="savingProduct" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="savingProduct" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else>Save Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="cancelDelete">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="flex items-center justify-center w-12 h-12 mx-auto mt-6 bg-red-100 dark:bg-red-900/30 rounded-full">
          <svg class="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <div class="mt-4 text-center px-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Product</h3>
          <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">Are you sure you want to delete this product? This action cannot be undone.</p>
        </div>

        <div class="flex justify-end gap-3 px-6 py-5 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button @click="cancelDelete" class="btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../api/axios'
import SkeletonLoader from '../components/SkeletonLoader.vue'

const products = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const savingProduct = ref(false)
const editingProduct = ref(null)
const showDeleteConfirm = ref(false)
const productToDelete = ref(null)

const form = ref({
  name: '',
  price: 0,
  stock: 0,
  description: ''
})

const fetchProducts = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get('/products')

    let productsArray = []
    if (Array.isArray(response.data.data)) {
      productsArray = response.data.data
    } else if (Array.isArray(response.data)) {
      productsArray = response.data
    } else if (response.data.data && Array.isArray(response.data.data.products)) {
      productsArray = response.data.data.products
    }

    products.value = productsArray
  } catch (err) {
    error.value = 'Failed to load products'
  } finally {
    loading.value = false
  }
}

const openModal = (product = null) => {
  editingProduct.value = product
  if (product) {
    form.value = {
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || ''
    }
  } else {
    form.value = {
      name: '',
      price: 0,
      stock: 0,
      description: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
  form.value = {
    name: '',
    price: 0,
    stock: 0,
    description: ''
  }
}

const saveProduct = async () => {
  savingProduct.value = true
  error.value = null

  try {
    if (editingProduct.value) {
      await axios.put(`/products/${editingProduct.value.id}`, form.value)
    } else {
      await axios.post('/products', form.value)
    }

    await fetchProducts()
    closeModal()
  } catch (err) {
    let errorMsg = 'Failed to save product'

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
    savingProduct.value = false
  }
}

const editProduct = (product) => {
  openModal(product)
}

const deleteProduct = (productId) => {
  productToDelete.value = productId
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  error.value = null

  try {
    await axios.delete(`/products/${productToDelete.value}`)
    await fetchProducts()
    showDeleteConfirm.value = false
    productToDelete.value = null
  } catch (err) {
    let errorMsg = 'Failed to delete product'

    if (err.response?.data?.message) {
      errorMsg = err.response.data.message
    } else if (err.message) {
      errorMsg = err.message
    }

    error.value = errorMsg
    showDeleteConfirm.value = false
    productToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  productToDelete.value = null
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent;
}

.btn-primary {
  @apply px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer border-0;
}

.btn-secondary {
  @apply px-5 py-2.5 bg-gray-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer border-0;
}

.btn-edit {
  @apply px-4 py-2 bg-green-500 text-white rounded-md text-xs font-medium transition-all duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 cursor-pointer border-0;
}

.btn-delete {
  @apply px-4 py-2 bg-red-500 text-white rounded-md text-xs font-medium transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 cursor-pointer border-0;
}
</style>
