import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * @typedef {Object} ProductsCountData
 * @property {number} count - The count of products
 */

/**
 * @typedef {Object} ProductsCountResponse
 * @property {ProductsCountData} productsCount - The products count object
 */

/**
 * @typedef {Object} CreateProductsResponse
 * @property {boolean} success - Indicates if the product creation was successful
 * @property {string} [error] - Error message if the product creation failed
 */

export const useProductCounterStore = defineStore('productCounter', () => {
  const count = ref(0)
  let controller = null
  const productLoading = ref(false)

  const getProducts = async () => {
    // Abort previous request if exists
    if (controller) {
      controller.abort()
    }
    controller = new AbortController()

    try {
      productLoading.value = true
      const response = await fetch('/api/products/count', {
        signal: controller.signal
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch product count: ${response.status}`)
      }
      /** @type {ProductsCountResponse} */
      const data = await response.json()
      console.log('Product count fetched:', data)
      count.value = data.productsCount.count
      return data
    } finally {
      controller = null
      productLoading.value = false
    }
  }

  const createProducts = async () => {
    // Abort previous request if exists
    if (controller) {
      controller.abort()
    }
    controller = new AbortController()

    try {
      const response = await fetch('/api/products/create', {
        signal: controller.signal
      })
      if (!response.ok) {
        throw new Error(`Failed to create products: ${response.status}`)
      }
      /** @type {CreateProductsResponse} */
      const data = await response.json()
      if (!data.success) {
        throw new Error(`Failed to create products: ${data.error}`)
      }
      await getProducts()
      return data
    } finally {
      controller = null
    }
  }

  return {
    count,
    getProducts,
    createProducts,
    productLoading
  }
})
