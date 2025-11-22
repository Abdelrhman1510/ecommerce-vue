<template>
  <div class="products">
    <div class="header">
      <h1>Products Management</h1>
      <button @click="openModal()" class="btn btn-primary">Add Product</button>
    </div>

    <div v-if="loading" class="loading">Loading products...</div>

    <div v-else-if="products.length === 0" class="empty-state">
      No products found. <button @click="openModal()" class="btn-link">Create one</button>
    </div>

    <table v-else class="products-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>${{ product.price }}</td>
          <td>{{ product.stock }}</td>
          <td class="actions">
            <button @click="editProduct(product)" class="btn btn-sm btn-edit">Edit</button>
            <button @click="deleteProduct(product.id)" class="btn btn-sm btn-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingProduct ? 'Edit Product' : 'Create Product' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>

        <form @submit.prevent="saveProduct" class="modal-body">
          <div class="form-group">
            <label for="name">Product Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Product name"
              required
            />
          </div>

          <div class="form-group">
            <label for="price">Price</label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              placeholder="Price"
              step="0.01"
              required
            />
          </div>

          <div class="form-group">
            <label for="stock">Stock</label>
            <input
              id="stock"
              v-model.number="form.stock"
              type="number"
              placeholder="Stock"
              required
            />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              placeholder="Product description"
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" :disabled="savingProduct" class="btn btn-primary">
              {{ savingProduct ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../api/axios'

const products = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const savingProduct = ref(false)
const editingProduct = ref(null)

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

    // Handle different response structures
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
      // Update product
      await axios.put(`/products/${editingProduct.value.id}`, form.value)
    } else {
      // Create product
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

const deleteProduct = async (productId) => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return
  }

  error.value = null

  try {
    await axios.delete(`/products/${productId}`)
    await fetchProducts()
  } catch (err) {
    let errorMsg = 'Failed to delete product'

    if (err.response?.data?.message) {
      errorMsg = err.response.data.message
    } else if (err.message) {
      errorMsg = err.message
    }

    error.value = errorMsg
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.products-table thead {
  background-color: #f5f5f5;
}

.products-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #e0e0e0;
}

.products-table td {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.products-table tbody tr:hover {
  background-color: #f9f9f9;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #5568d3;
}

.btn-secondary {
  background-color: #999;
  color: white;
}

.btn-secondary:hover {
  background-color: #777;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-edit {
  background-color: #4CAF50;
  color: white;
}

.btn-edit:hover {
  background-color: #45a049;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-delete:hover {
  background-color: #da190b;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background-color: #fee;
  color: #c33;
  border-radius: 5px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}
</style>
