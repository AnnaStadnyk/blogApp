<script setup>
import { ref, onBeforeMount } from 'vue'
import TheHero from '@/components/layouts/TheHero.vue'
import PostList from '@/components/layouts/PostList.vue'
import TheCard from '@/components/UI/TheCard.vue'
import TheLoader from '@/components/UI/TheLoader.vue'
import { useArticleStore } from '@/stores/article'

const articleStore = useArticleStore()
const isLoading = ref(true)

onBeforeMount(async () => {
  if (
    articleStore.categoryInfo['daily-digest'].page === 0 &&
    !articleStore.categoryInfo['daily-digest'].isLoaded
  ) {
    await articleStore.loadPosts('daily-digest', true)
  }
  if (
    articleStore.categoryInfo['design-tools'].page === 0 &&
    !articleStore.categoryInfo['design-tools'].isLoaded
  ) {
    await articleStore.loadPosts('design-tools', true)
  }
  if (
    articleStore.categoryInfo['tutorials'].page === 0 &&
    !articleStore.categoryInfo['tutorials'].isLoaded
  ) {
    await articleStore.loadPosts('tutorials', true)
  }
  isLoading.value = false
})
</script>

<template>
  <TheHero type="main">
    <template #header>Minimal blog template for creative expressions</template>

    <template #description
      >100% customisable and SEO-friendly blog template for personal and commercial
      purposes.</template
    >
  </TheHero>

  <div class="content">
    <TheLoader v-show="isLoading"></TheLoader>

    <PostList v-show="articleStore.getDailyDigest.length > 0">
      <template #header>
        <h2>Daily Digest</h2>

        <TheButton link :to="{ name: 'dailyDigest', params: { category: 'daily-digest' } }"
          >View All</TheButton
        >
      </template>

      <template #default>
        <TheCard
          v-for="article in articleStore.getDailyDigest"
          :key="article.id"
          :article="article"
          category="daily-digest"
        ></TheCard>
      </template>
    </PostList>

    <PostList v-show="articleStore.getDesignTools.length > 0">
      <template #header>
        <h2>Design Tools</h2>

        <TheButton link :to="{ name: 'designTools', params: { category: 'design-tools' } }"
          >View All</TheButton
        >
      </template>

      <template #default>
        <TheCard
          v-for="article in articleStore.getDesignTools"
          :key="article.id"
          :article="article"
          category="design-tools"
        ></TheCard>
      </template>
    </PostList>

    <PostList v-show="articleStore.getTutorials.length > 0">
      <template #header>
        <h2>Tutorials</h2>

        <TheButton link :to="{ name: 'tutorials', params: { category: 'tutorials' } }"
          >View All</TheButton
        >
      </template>

      <template #default>
        <TheCard
          v-for="article in articleStore.getTutorials"
          :key="article.id"
          :article="article"
          category="tutorials"
        >
        </TheCard>
      </template>
    </PostList>
  </div>
</template>

<style scoped lang="scss">
.content {
  padding: 3.75rem 0 5rem;

  @media screen and (max-width: 1020px) {
    padding: clamp(1.5rem, 0.4714rem + 5.1429vw, 3.75rem) 0 clamp(2rem, 0.6286rem + 6.8571vw, 5rem);
  }
}
</style>
