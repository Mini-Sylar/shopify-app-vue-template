<template>
  <main>
    <div v-if="showWarning" style="margin-top: 100px">
      <div class="banner warning">
        <strong>Redirecting outside of Shopify</strong>
        <p>Apps can only use /exitiframe to reach Shopify or the app itself.</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showWarning = ref(false)

onMounted(() => {
  const search = window.location.search
  if (search) {
    const params = new URLSearchParams(search)
    const redirectUri = params.get('redirectUri')
    if (redirectUri) {
      try {
        const url = new URL(decodeURIComponent(redirectUri))
        const allowed =
          [window.location.hostname, 'admin.shopify.com'].includes(url.hostname) ||
          url.hostname.endsWith('.myshopify.com')
        if (allowed) {
          window.open(url.toString(), '_top')
        } else {
          showWarning.value = true
        }
      } catch {
        showWarning.value = true
      }
    }
  }
})
</script>

<style scoped>
.banner.warning {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  color: #ad6800;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 0 auto;
  max-width: 500px;
  text-align: center;
}
</style>
