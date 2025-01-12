import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthenticatedFetch } from '../services/useAuthenticatedFetch'

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
  const useFetch = useAuthenticatedFetch()

  const getProducts = async () => {
    const response = await useFetch('/api/products/count')
    if (!response.ok) {
      throw new Error(`Failed to fetch product count: ${response.status}`)
    }
    /** @type {ProductsCountResponse} */
    const data = await response.json() // { productsCount: { count: number } }
    count.value = data.productsCount.count
    return data
  }

  const createProducts = async () => {
    const response = await useFetch('/api/products/create')
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
  }
  return {
    count,
    getProducts,
    createProducts
  }
})
