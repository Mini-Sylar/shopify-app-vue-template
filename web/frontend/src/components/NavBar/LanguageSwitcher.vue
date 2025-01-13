<template>
  <div>
    <select v-model="selectedLocale" @change="changeLocale">
      <option v-for="locale in SUPPORT_LOCALES" :key="locale" :value="locale">
        {{ locale }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { SUPPORT_LOCALES } from '@/i18n'
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()

const selectedLocale = ref()
const router = useRouter()

const changeLocale = async () => {
  await router.push({
    name: route.name,
    params: { locale: selectedLocale.value }
  })
}

watchEffect(() => {
  selectedLocale.value = route.params.locale
})
</script>

<style scoped></style>
