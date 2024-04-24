<script setup>
import PostsView from '@/views/PostView.vue'
const props = defineProps({
  category: {
    type: String,
    required: true
  }
})
</script>

<template>
  <PostsView :category></PostsView>
</template>
