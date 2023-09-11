<template>
  <div class="main-container">
    <div class="card">
      <div class="left-text">
        <h2>
          Nice work on building a shopify app with a
          <a href="https://vuejs.org/guide/introduction.html" target="_blank">Vue Template</a>💚
        </h2>
        <p>
          Your app is ready to explore, it contains everything you would need to build your awesome
          app!
        </p>
        <h3>Features</h3>
        <ul>
          <li>Vue 3.3 🟢</li>
          <li>Vue Router🔗 - For single page navigation</li>
          <li>Pinia🍍 - For state management</li>
        </ul>
        <hr />
        <ul>
          <li>vueAuthenticatedFetch 🚀 - for making authenticated requests to your backend</li>
          <li>
            AppBridge integration🚉 - Allows you to use various app bridge actions, see
            <a href="#">AppBridge</a>
          </li>
        </ul>
        <p>
          Learn more about building out your app in
          <a href="https://shopify.dev/docs/apps/getting-started/existing" target="_blank"
            >this shopify tutorial</a
          >
        </p>
        <p>
          This starter template is available on
          <a href="https://github.com/Mini-Sylar/shopify-app-vue-template" target="_blank"
            >Github</a
          >
        </p>
      </div>
      <div class="right-image">
        <img
          src="@/assets/images/home-trophy-vue.png"
          alt="Successfully created app with vue template"
        />
      </div>
    </div>

    <div class="card product-counter">
      <h2>Product Counter</h2>
      <p>
        Sample Products are created with a default title and price. You can remove them at any time
      </p>
      <br />
      <h2>Total Products</h2>
      <h3>{{ currentProductCount }}</h3>
      <div class="create-sample-product">
        <button @click.prevent="addProducts" :disabled="buttonDisabled">
          Create Sample Products
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Loading, Toast } from '@shopify/app-bridge/actions'
import { useProductCounterStore } from '@/stores/counter.js'
import { ref, inject, onMounted, computed } from 'vue'
const appBridge = inject('useAppBridge')
const buttonDisabled = ref(false)

const currentProductCount = computed(() => {
  return useProductCounterStore().count
})

const useToast = (message, isError = false) => {
  const toast = Toast.create(appBridge, {
    message: message,
    duration: 3000,
    isError: isError
  })
  toast.dispatch(Toast.Action.SHOW)
}

const addProducts = async () => {
  await appBridge.dispatch(Loading.Action.START)
  buttonDisabled.value = true
  useToast('Creating products')
  try {
    await useProductCounterStore().createProducts()
    useToast('Successfully created products')
    buttonDisabled.value = false
    await appBridge.dispatch(Loading.Action.STOP)
  } catch (error) {
    useToast('Error creating products', true)
    buttonDisabled.value = false
    await appBridge.dispatch(Loading.Action.STOP)
  }
}

onMounted(() => {
  useProductCounterStore().getProducts()
})
</script>

<style scoped>
.card {
  display: flex;
  flex-wrap: wrap;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  margin-block: 1.5rem;
}

.product-counter {
  flex-direction: column;
}

.right-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.create-sample-product {
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background-color: #000;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background-color: #333;
}

button:disabled,
button:disabled:hover {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
