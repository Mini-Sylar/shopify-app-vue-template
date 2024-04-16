<template>
  <header>
    <nav>
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
  padding: 1rem;
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
</style>
