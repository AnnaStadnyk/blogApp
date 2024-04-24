<script setup>
import { computed } from 'vue'
import { useArticleStore } from '@/stores/article'

const articleStore = useArticleStore()

const userLogo = computed(() => {
  return articleStore.user.name
    .split(' ')
    .map((item) => item.slice(0, 1))
    .join('')
})

async function signOut() {
  await articleStore.signOut()
}
</script>

<template>
  <div class="user">
    <div class="user__content">
      <div class="user__info">
        <span class="user__logo">{{ userLogo }}</span>
        <span>{{ articleStore.user.name }}</span>
      </div>
      
      <TheButton @click="signOut">Sign Out</TheButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user__card:hover {
  .user {
    pointer-events: all;
    visibility: visible;
    opacity: 1;
  }
}

.user {
  width: 280px;
  padding-top: 1.75rem;
  position: absolute;
  top: 1.75rem;
  right: 0;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease;

  @media screen and (max-width: 662px) {
    right: calc(-30px - 1.875rem);
  }

  &__content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--c-white);
    border: 1px solid var(--c-gray-4);
    border-radius: 0.5rem;
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  span {
    font-size: 1.5rem;

    @media screen and (max-width: 768px) {
      font-size: 1.15rem;
    }
  }

  &__logo {
    width: 60px;
    height: 60px;
    padding: 4px;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: var(--c-gray-1);
    color: var(--c-white);
    font-size: 2rem;
    font-weight: 600;
    text-transform: uppercase;
    overflow: hidden;

    @media screen and (max-width: 768px) {
      width: 40px;
      height: 40px;
      font-size: 1.5rem;
    }
  }

  button {
    align-self: flex-end;
  }
}
</style>
