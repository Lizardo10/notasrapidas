<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 9H16M8 12H12M8 15H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h3>No hay notas aún</h3>
    <p>Crea tu primera nota usando el formulario superior</p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.empty-state {
  animation: fadeIn 0.3s ease;
}
</style>

