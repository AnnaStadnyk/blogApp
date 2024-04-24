<script setup>
import { ref, computed, onBeforeMount, watchEffect } from 'vue'
import TheHero from '@/components/layouts/TheHero.vue'
import PostList from '@/components/layouts/PostList.vue'
import TheCard from '@/components/UI/TheCard.vue'
import TheLoader from '@/components/UI/TheLoader.vue'
import { useArticleStore } from '@/stores/article'

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const articleStore = useArticleStore()
const isLoading = ref(null)

onBeforeMount(async () => {
  articleStore.currentCategory = props.category
  if (
    articleStore.categoryInfo[props.category].page < 1 &&
    (articleStore.categoryInfo[props.category].isExists ||
      !articleStore.categoryInfo[props.category].isLoaded) &&
    !articleStore.categoryInfo[props.category].isLast
  ) {
    isLoading.value = true
    await articleStore.loadPosts(props.category, false)
  }
  isLoading.value = false
})

// watchEffect(async () => {
//   const category = router.currentRoute.value.params.category
//   articleStore.currentCategory = category
//   if (
//     articleStore.categoryInfo[category].page < 1 &&
//     (articleStore.categoryInfo[category].isExists ||
//       !articleStore.categoryInfo[category].isLoaded) &&
//     !articleStore.categoryInfo[category].isLast
//   ) {
//     isLoading.value = true
//     await articleStore.loadPosts(category, false)
//   }
//   isLoading.value = false
// })

async function loadPosts() {
  isLoading.value = true
  await articleStore.loadPosts(props.category, false)
  isLoading.value = false
}

const category = computed(() => {
  const ctg = {}
  switch (props.category) {
    case 'daily-digest': {
      ctg.title = 'Daily Digest'
      ctg.description =
        'A description of the Daily Digest category goes right here. Be as expressive as possible, but in brief.'
      break
    }
    case 'design-tools': {
      ctg.title = 'Design Tools'
      ctg.description =
        'A description of the Design Tools category goes right here. Be as expressive as possible, but in brief.'
      break
    }
    case 'tutorials': {
      ctg.title = 'Tutorials'
      ctg.description =
        'A description of the Tutorials category goes right here. Be as expressive as possible, but in brief.'
      break
    }
    default:
      break
  }
  return ctg
})
</script>

<template>
  <TheHero type="content">
    <template #header>{{ category.title }}</template>

    <template #description>{{ category.description }}</template>
  </TheHero>

  <div class="content">
    <TheLoader v-show="isLoading"></TheLoader>

    <PostList>
      <template #header v-if="articleStore.user.uid">
        <TheButton
          link
          :to="{ name: 'addPost', params: { category: props.category } }"
          mode="inverce"
          >Add Post</TheButton
        >
      </template>

      <template #default>
        <TheCard
          v-for="article in articleStore.article[props.category]"
          :key="article.id"
          :article="article"
          :category="props.category"
        ></TheCard>
      </template>

      <template #footer v-if="articleStore.article[props.category].length > 0">
        <TheButton @click="loadPosts" :disabled="articleStore.categoryInfo[props.category].isLast"
          >Load More</TheButton
        >
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
