<template>
  <div class="space-y-4">
    <!-- Table Skeleton -->
    <div v-if="type === 'table'" class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Header -->
      <div class="bg-gray-50 px-6 py-4 flex gap-4">
        <div class="h-4 bg-gray-300 rounded w-1/6 animate-pulse"></div>
        <div class="h-4 bg-gray-300 rounded w-1/6 animate-pulse"></div>
        <div class="h-4 bg-gray-300 rounded w-1/6 animate-pulse"></div>
        <div class="h-4 bg-gray-300 rounded w-1/6 animate-pulse"></div>
        <div class="h-4 bg-gray-300 rounded w-1/6 animate-pulse"></div>
      </div>
      <!-- Rows -->
      <div v-for="i in 5" :key="i" class="border-b border-gray-200 px-6 py-4 flex gap-4">
        <div class="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
      </div>
    </div>

    <!-- Card Skeleton -->
    <div v-else-if="type === 'card'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="i in 2" :key="i" class="bg-white rounded-lg shadow-md p-8 space-y-4">
        <div class="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
        <div class="h-12 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div class="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-else-if="type === 'list'" class="space-y-3">
      <div v-for="i in 6" :key="i" class="bg-white rounded-lg p-4 h-16 animate-pulse bg-gray-200"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'table',
    validator: (value) => ['table', 'card', 'list'].includes(value)
  }
})
</script>
