<template> 
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/incomes">Incomes</RouterLink>
    <RouterLink to="/sales">Sales</RouterLink>
    <RouterLink to="/orders">Orders</RouterLink>
    <RouterLink to="/stocks">Stocks</RouterLink>
  </nav>
  <main>
    <router-view></router-view>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>

nav {
  display: flex;
  gap: 10px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}

</style>
