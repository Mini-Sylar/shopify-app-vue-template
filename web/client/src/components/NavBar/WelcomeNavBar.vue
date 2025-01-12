<template>
  <header>
    <nav class="main-container">
      <ul>
        <li>
          <RouterLink
            :to="{
              name: 'home'
            }"
            >{{ $t('NavBar.home') }}</RouterLink
          >
        </li>
        <li>
          <RouterLink
            :to="{
              name: 'about'
            }"
            >{{ $t('NavBar.about') }}</RouterLink
          >
        </li>
      </ul>
      <LanguageSwitcher />
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import LanguageSwitcher from './LanguageSwitcher.vue'
</script>

<style scoped>
nav {
  background-color: #f2f2f2;
  padding-block: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ul {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  gap: 1rem;
}

.router-link-exact-active {
  color: #3fad7d;
  font-weight: 500;
}
</style>
