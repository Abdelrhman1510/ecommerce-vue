<template>
  <div class="orders">
    <div class="header">
      <h1>Orders Management</h1>
    </div>

    <div v-if="loading" class="loading">Loading orders...</div>

    <div v-else-if="orders.length === 0" class="empty-state">
      No orders found.
    </div>

    <table v-else class="orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>#{{ order.order_number }}</td>
          <td>User #{{ order.user_id }}</td>
          <td>${{ order.total }}</td>
          <td>
            <span class="status pending">Pending</span>
          </td>
          <td>{{ formatDate(order.created_at) }}</td>
          <td class="actions">
            <button @click="viewDetails(order)" class="btn btn-sm btn-info">View Details</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Order #{{ selectedOrder?.order_number }} Details</h2>
          <button @click="closeDetailsModal" class="close-btn">×</button>
        </div>

        <div class="modal-body">
          <div class="order-info">
            <div class="info-row">
              <span class="label">User ID:</span>
              <span class="value">{{ selectedOrder?.user_id }}</span>
            </div>
            <div class="info-row">
              <span class="label">Order Number:</span>
              <span class="value">{{ selectedOrder?.order_number }}</span>
            </div>
            <div class="info-row">
              <span class="label">Address:</span>
              <span class="value">{{ selectedOrder?.address || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">{{ selectedOrder?.phone || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Date:</span>
              <span class="value">{{ formatDate(selectedOrder?.created_at) }}</span>
            </div>
          </div>

          <h3 class="items-title">Order Items</h3>
          <table v-if="selectedOrder?.items && selectedOrder.items.length > 0" class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in selectedOrder.items" :key="index">
                <td>{{ item.product?.name || 'N/A' }}</td>
                <td>{{ item.quantity }}</td>
                <td>${{ item.price }}</td>
                <td>${{ (item.quantity * parseFloat(item.price)).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>

          <div v-else class="no-items">No items in this order</div>

          <div class="order-total">
            <span class="label">Total:</span>
            <span class="total-amount">${{ selectedOrder?.total }}</span>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeDetailsModal" class="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../api/axios'

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

<style scoped>
.orders {
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

.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.orders-table thead {
  background-color: #f5f5f5;
}

.orders-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #e0e0e0;
}

.orders-table td {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.orders-table tbody tr:hover {
  background-color: #f9f9f9;
}

.status {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status.completed {
  background-color: #d4edda;
  color: #155724;
}

.status.cancelled {
  background-color: #f8d7da;
  color: #721c24;
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

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
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
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
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

.order-info {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  font-weight: 600;
  color: #555;
}

.info-row .value {
  color: #333;
}

.items-title {
  margin: 20px 0 15px 0;
  color: #333;
  font-size: 16px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.items-table thead {
  background-color: #f5f5f5;
}

.items-table th {
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 1px solid #e0e0e0;
}

.items-table td {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.no-items {
  padding: 20px;
  text-align: center;
  color: #999;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.order-total {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
}

.order-total .label {
  color: #555;
}

.total-amount {
  color: #667eea;
  font-size: 18px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
