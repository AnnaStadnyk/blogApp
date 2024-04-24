<script setup async>
import { computed, onBeforeMount, onMounted, reactive, ref, onUpdated } from 'vue'
import TheHero from '@/components/layouts/TheHero.vue'
import TheLoader from '@/components/UI/TheLoader.vue'
import TheDialog from '@/components/UI/TheDialog.vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'

const router = useRouter()
const articleStore = useArticleStore()

const props = defineProps({
  category: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})

let post = reactive({})

const isLoading = ref(true)
const isExists = ref(true)
const isDialog = ref(false)

onBeforeMount(async () => {
  post = articleStore.getPost(props.category, props.id)
  if (!post) {
    post = await articleStore.loadPost(props.category, props.id)
    if (!post.hasOwnProperty('id')) {
      isExists.value = false
    }
  }
  isLoading.value = false
})

onMounted(() => {
  if (!isLoading.value) {
    document.querySelectorAll('figure.image>img').forEach((item) => {
      item.removeAttribute('style')
      item.removeAttribute('width')
      item.removeAttribute('height')
    })
  }
})

onUpdated(() => {
  document.querySelectorAll('figure.image>img').forEach((item) => {
    item.removeAttribute('style')
    item.removeAttribute('width')
    item.removeAttribute('height')
  })
})

const dt_txt = computed(() => {
  return new Date(post.date).toLocaleDateString('uk-ua', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const isEdit = computed(() => {
  return post.author.uid === articleStore.user.uid
})

function showDialog() {
  isDialog.value = true
}

function cancelDialog() {
  isDialog.value = false
}

async function deletePost() {
  await articleStore.deletePost(props.category, props.id)
  router.back()
}
</script>

<template>
  <TheLoader v-if="isLoading"></TheLoader>
  <div v-if="!isLoading && isExists">
    <TheHero type="content">
      <template #header>{{ post.title }}</template>

      <template #description
        >{{ dt_txt }}, <span>{{ post.author.name }}</span></template
      >
    </TheHero>
    <section class="edit">
      <div class="wrapper-content" v-if="isEdit">
        <div class="edit__btns">
          <TheButton link :to="{ name: 'editPost' }" mode="inverce">Edit Post</TheButton>
          <TheButton mode="inverce" @click="showDialog">Delete Post</TheButton>
          <Teleport to="body">
            <TheDialog
              v-show="isDialog"
              @confirm-dialog="deletePost"
              @cancel-dialog="cancelDialog"
              :class="{ isShown: isDialog }"
            >
              <p>The post will be deleted. Continue?</p>
            </TheDialog>
          </Teleport>
        </div>
      </div>
    </section>
    <section class="post">
      <div class="wrapper-content">
        <div class="post__hero">
          <img :src="post.images[0].url" :alt="post.images[0].name" />
        </div>
        <div class="post__content" v-html="post.content"></div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
main {
  flex: 1 1 100%;
}

span {
  font-weight: 600;
}

.post {
  background-color: var(--c-white);

  &__content {
    padding: 5rem;

    @media screen and (max-width: 1020px) {
      padding: clamp(2rem, 0.6286rem + 6.8571vw, 5rem);
    }
  }
}

.edit {
  background-color: var(--c-white);
  padding-bottom: 1rem;

  &__btns {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    align-items: center;
  }

  &:empty {
    display: none;
  }
}
</style>
