<script setup>
import { RouterView } from 'vue-router'
import TheHeader from '@/components/UI/TheHeader.vue'
import TheFooter from '@/components/layouts/TheFooter.vue'
// import { useArticleStore } from './stores/article'

// const articleStore = useArticleStore();
// articleStore.tryLogin()
</script>

<template>
  <TheHeader></TheHeader>
  <main>
    <RouterView />
  </main>
  <TheFooter></TheFooter>
</template>

<style scoped>
main {
  flex: 1 1 100%;
}
</style>
