import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthenticatedFetch } from '../helpers/useAuthenticatedFetch'

export const useProductCounterStore = defineStore('productCounter', () => {
  const count = ref(0)
  const fetch = useAuthenticatedFetch()

  const getProducts = async () => {
    try {
      const response = await fetch('/api/products/count')
      if (!response.ok) {
        throw new Error(`Failed to fetch product count: ${response.status}`)
      }
      const data = await response.json()
      count.value = data.productsCount.count
    } catch (error) {
      console.log(`Failed to fetch product count: ${error.message}`)
    }
  }

  const createProducts = async () => {
    try {
      const response = await fetch('/api/products/create')
      if (!response.ok) {
        throw new Error(`Failed to create products: ${response.status}`)
      }
      const data = await response.json()
      if (!data.success) {
        throw new Error(`Failed to create products: ${data.error}`)
      }
      await getProducts()
      return data
    } catch (error) {
      console.error(`Failed to create products: ${error.message}`)
      throw error
    }
  }

  return { count, getProducts, createProducts }
})
