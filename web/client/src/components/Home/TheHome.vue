<template>
  <div class="main-container">
    <div class="card">
      <div class="left-text">
        <i18n-t keypath="HomePage.heading" tag="h2" for="link" scope="global">
          <template #link>
            <a href="https://shopifyvue.uagency.org/" target="_blank">{{
              $t('HomePage.heading-link-text')
            }}</a>
          </template>
        </i18n-t>
        <p>{{ $t('HomePage.subheading') }}</p>
        <h3>{{ $t('HomePage.feature-text') }}</h3>
        <ul>
          <!-- @vue-ignore -->
          <li v-for="(translation, index) in $tm('HomePage.feature-list-vue')" :key="index">
            <!-- @vue-ignore -->
            <a :href="translation.url" target="_blank">
              <!-- @vue-expect-error translated messages not typed -->
              {{ translation.title.replace('{version}', version) }}
            </a>
            <span>-</span>
            <span>
              <!-- @vue-expect-error translated messages not typed -->
              {{ translation.description }}
            </span>
          </li>
        </ul>
        <hr />
        <ul>
          <li>
            <span>{{ $t('HomePage.authenticated_fetch.title') }}</span> -
            {{ $t('HomePage.authenticated_fetch.description') }}
          </li>
          <li>
            <a href="https://shopify.dev/docs/api/app-bridge-library/apis" target="_blank"
              >{{ $t('HomePage.app_bridge.title') }}
            </a>
            -
            {{ $t('HomePage.app_bridge.description') }}
          </li>
        </ul>
        <h3>{{ $t('HomePage.useful-links') }}</h3>
        <i18n-t keypath="HomePage.app-bridge" tag="p" for="link" scope="global">
          <template #link>
            <a href="https://shopify.dev/docs/api/app-bridge-library/apis" target="_blank"
              >App Bridge</a
            >
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

      <h3>
        <span v-if="!productLoading">
          {{ count }}
        </span>
        <span v-else>
          {{ $t('HomePage.loading') }}
        </span>
      </h3>
      <div class="create-sample-product">
        <button @click.prevent="addProducts" :disabled="buttonDisabled">
          {{ $t('Products.button-text') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductCounterStore } from '@/stores/products'
import { storeToRefs } from 'pinia'
import { appBridge } from '@/plugins/appBridge'
import { ref, version } from 'vue'

const buttonDisabled = ref(false)
const { count, productLoading } = storeToRefs(useProductCounterStore())
useProductCounterStore().getProducts()

async function addProducts() {
  try {
    appBridge.toast.show('Creating sample products...')
    buttonDisabled.value = true
    await useProductCounterStore().createProducts()
  } catch {
    appBridge.toast.show('Error creating sample products', {
      isError: true
    })
  } finally {
    appBridge.toast.show('Sample products created successfully', {
      duration: 5000
    })
    buttonDisabled.value = false
    useProductCounterStore().getProducts()
  }
}
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
