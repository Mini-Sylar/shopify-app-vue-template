<template>
    <div class="main-container">
        <div class="card">
            <div class="left-text">
                <h2>Nice work on building a shopify app with a <a href="#">Vue Template</a>💚</h2>
                <p>Your app is ready to explore, it contains everything you would need to build your awesome app!</p>
                <h3>Features</h3>
                <ul>
                    <li>Vue 3.3 - Latest vue version</li>
                    <li>Vue Router - For single page navigation</li>
                    <li>Pinia - For state management</li>
                </ul>
                <hr>
                <ul>
                    <li>vueAuthenticatedFetch - for making authenticated requests to your backend </li>
                    <li>AppBridge integration - Allows you to use various app bridge actions, see <a href="#">AppBridge</a>
                    </li>
                </ul>
                <p>Learn more about building out your app in <a href="#">this shopify tutorial</a></p>
                <p>This starter template is available on <a href="#">Github</a></p>
            </div>
            <div class="right-image">
                <img src="@/assets/images/home-trophy-vue.png" alt="Successfully created app with vue template">
            </div>
        </div>

        <div class="card product-counter">
            <h2>Product Counter</h2>
            <p>Sample Products are created with a default title and price. You can remove them at any time</p>
            <br>
            <h2>Total Products</h2>
            <p>Product Count...</p>
            <div class="create-sample-product">
                <button>Create 5 Sample Products</button>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.card {
    display: flex;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
    margin-block: 1.5rem;
}

.product-counter {
    flex-direction: column;
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

.create-sample-product button {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    background-color: #000;
    color: #fff;
    cursor: pointer;
}

.create-sample-product button:hover {
    background-color: #333;
}

</style>