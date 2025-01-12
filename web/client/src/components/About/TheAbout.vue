<template>
  <div class="main-container">
    <div class="card">
      <h2>{{ $t('About.heading') }}</h2>
      <p>
        {{ $t('About.line-1') }}
      </p>
      <p>
        {{ $t('About.line-2') }}
      </p>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.main-container {
  padding: 1rem;
  margin: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 0 auto;
}

.card {
  width: 50%;
  margin: 0 auto;
}
</style>
