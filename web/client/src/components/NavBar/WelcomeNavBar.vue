<template>
  <header>
    <nav class="main-container">
      <ul>
        <li>
          <RouterLink
            :to="{
              name: 'home'
            }"
            >{{ $t('NavBar.home') }}
          </RouterLink>
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
      <div style="display: flex; align-items: center; gap: 1rem">
        <LanguageSwitcher />
      </div>
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
  padding-block: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  padding-inline: 2rem;
  margin-bottom: 2rem;
}

ul {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  gap: 1rem;
  padding: 0;
}

.router-link-exact-active {
  color: #3fad7d;
  font-weight: 500;
}
</style>
