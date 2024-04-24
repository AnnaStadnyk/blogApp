<script setup>
import { computed } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  category: {
    type: String,
    required: true
  }
})

const dt_txt = computed(() => {
  return new Date(props.article.date).toLocaleDateString('uk-ua', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const bg_img = computed(() => {
  return props.article.images[0]
})
</script>

<template>
  <article>
    <div class="card">
      <div class="card__content">
        <span class="card__date">{{ dt_txt }}</span>
        <h3>
          <RouterLink
            :to="{ name: 'viewPost', params: { category: props.category, id: article.id } }"
            >{{ article.title }}
          </RouterLink>
        </h3>
        <p>{{ article.description }}</p>
        <span class="card__author">{{ article.author.name }}</span>
      </div>
      <div class="card__img">
        <img :src="bg_img.url" :alt="bg_img.name" />
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">

.card {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-1);
  border-radius: 1rem;
  background-color: var(--c-white);
  height: 100%;

  &__content {
    display: flex;
    flex-direction: column;
    align-self: start;
    flex: 1 1 100%;
  }

  &__date {
    display: block;
    font-size: 0.8125rem;
    line-height: 1.2;
    color: var(--c-gray-3);
    text-transform: uppercase;
    margin-bottom: 1.875rem;
  }

  p {
    color: var(--c-gray-2);
    margin-bottom: 0.625rem;
  }

  &__author {
    display: block;
    font-size: 1rem;
    line-height: 1.2;
    color: var(--c-gray-3);
  }

  &__img {
    flex: 0 0 33.333%;
  }

  @media screen and (max-width: 662px) {
    flex-direction: column;
  }
}
</style>
