<template>
  <WelcomeNavBar />
  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </RouterView>
</template>

<script setup>
import { RouterView } from 'vue-router'
import WelcomeNavBar from './components/NavBar/WelcomeNavBar.vue'
</script>

<style scoped></style>
