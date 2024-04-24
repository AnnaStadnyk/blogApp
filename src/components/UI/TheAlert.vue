<script setup>
import { useArticleStore } from '@/stores/article'
const articleStore = useArticleStore()
function closeDialog() {
  articleStore.error = null
}
</script>

<template>
  <div class="alert">
    <p>{{ articleStore.error }}</p>
    <i class="fa-solid fa-xmark" @click="closeDialog"></i>
  </div>
</template>

<style scoped lang="scss">
.alert {
  padding: 1.25rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-radius: 1rem;

  p {
    color: var(--c-red-2);
    text-align: center;
  }

  i {
    font-size: 40px;
    cursor: pointer;
    transition: all 0.3s ease;

    @media (hover: hover) {
      &:hover {
        color: var(--c-red-2);
      }
    }

    &:active {
      color: var(--c-red-2);
    }
  }
}
</style>
