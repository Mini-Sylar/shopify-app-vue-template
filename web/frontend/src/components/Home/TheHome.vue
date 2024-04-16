<template>
  <div class="main-container">
    <div class="card">
      <div class="left-text">
        <i18n-t keypath="HomePage.heading" tag="h2" for="link" scope="global">
          <template #link>
            <a href="https://shopify-vue-template.vercel.app/" target="_blank">{{
              $t('HomePage.heading-link-text')
            }}</a>
          </template>
        </i18n-t>
        <p>{{ $t('HomePage.subheading') }}</p>
        <h3>{{ $t('HomePage.feature-text') }}</h3>
        <ul>
          <li v-for="(translation, index) in $tm('HomePage.feature-list-vue')" :key="index">
            <a :href="translation.url">{{ translation.title.replace('{version}', version) }}</a>
            -
            <span>{{ translation.description }}</span>
          </li>
        </ul>
        <hr />
        <ul>
          <li v-for="(shopifyFeature, index) in $tm('HomePage.shopify-features-vue')" :key="index">
            {{ shopifyFeature }}
          </li>
        </ul>
        <h3>{{ $t('HomePage.useful-links') }}</h3>
        <i18n-t keypath="HomePage.app-bridge" tag="p" for="link" scope="global">
          <template #link>
            <a href="https://shopify.dev/docs/api/app-bridge" target="_blank">App Bridge</a>
          </template>
        </i18n-t>
        <i18n-t keypath="HomePage.learn-more" tag="p" for="link" scope="global">
          <template #link>
            <a href="https://shopify.dev/docs/apps/getting-started/existing" target="_blank">
              {{ $t('HomePage.this-shopify-tutorial') }}</a
            >
          </template>
        </i18n-t>
        <i18n-t keypath="HomePage.starter-available" tag="p" for="link" scope="global">
          <template #link>
            <a href="https://github.com/Mini-Sylar/shopify-app-vue-template" target="_blank">
              Github</a
            >
          </template>
        </i18n-t>
      </div>
      <div class="right-image">
        <img
          src="@/assets/images/home-trophy-vue.png"
          alt="Successfully created app with vue template image"
        />
      </div>
    </div>

    <div class="card product-counter">
      <h2>{{ $t('Products.heading') }}</h2>
      <p>
        {{ $t('Products.subheading') }}
      </p>
      <br />
      <h2>{{ $t('Products.total-products') }}</h2>
      <h3>{{ currentProductCount }}</h3>
      <div class="create-sample-product">
        <button @click.prevent="addProducts" :disabled="buttonDisabled">
          {{ $t('Products.button-text') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Loading, Toast } from '@shopify/app-bridge/actions'
import { useProductCounterStore } from '@/stores/products.js'
import { ref, inject, onMounted, computed, version } from 'vue'

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

async function addProducts() {
  await appBridge.dispatch(Loading.Action.START)
  buttonDisabled.value = true
  useToast('Creating products')
  try {
    await useProductCounterStore().createProducts()
    useToast('Successfully created products')
  } catch (error) {
    useToast('Error creating products', true)
  } finally {
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

.left-text {
  flex: 1;
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

a {
  color: #3fad7d;
}

li {
  margin: 0.5rem 0;
}
</style>
