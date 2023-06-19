<template>
  <div class="main-container">
    <div class="card">
      <h2>About</h2>
      <p>
        There are little or no references to using Vue as your frontend framework when building
        shopify apps even though Vue is a popular javascript framework.
      </p>
      <p>
        This starter template replaces react as the frontend framework with no compromises while
        using the latest vue features such as pinia and vue-router 4 while keeping your code clean
        with esLint and prettier.
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
}

.card {
  width: 50%;
  margin: 0 auto;
}
</style>
