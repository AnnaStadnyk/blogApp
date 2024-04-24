<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import UploadAdapter from '@/uploadFile.js'

const editor = ClassicEditor
const editorConfig = {
  height: 400,
  extraPlugins: [editorUploader]
}

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const router = useRouter()
const articleStore = useArticleStore()

const fileInput = ref(null)

function onFilePick() {
  fileInput.value.click()
}
const selectedFiles = ref([])

function onFileChange(event) {
  selectedFiles.value = event.target.files
}

function editorUploader(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new UploadAdapter(loader)
}

const post = reactive({
  title: '',
  description: '',
  content: ''
})

const errors = reactive({
  isTitleValid: true,
  isDescriptionValid: true,
  isContentValid: true
})

function onTitleFocus() {
  errors.isTitleValid = true
}

function onDescriptionFocus() {
  errors.isDescriptionValid = true
}

function onContentFocus() {
  errors.isContentValid = true
}

async function onFormSubmit() {
  if (post.title === '') {
    errors.isTitleValid = false
  }
  if (post.description === '') {
    errors.isDescriptionValid = false
  }
  if (post.content === '') {
    errors.isContentValid = false
  }
  if (!errors.isTitleValid || !errors.isDescriptionValid || !errors.isContentValid) {
    return
  }

  const newPost = {
    title: post.title,
    description: post.description,
    content: post.content
  }
  await articleStore.addPost(props.category, newPost, selectedFiles.value)

  if (!articleStore.error) router.push(props.category)
}
</script>

<template>
  <section class="post">
    <div class="wrapper-content">
      <form action="" class="form" enctype="multipart/form-data" @submit.prevent="onFormSubmit">
        <div class="form__item form__item-column" :class="{ invalid: !errors.isTitleValid }">
          <label for="#title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            maxlength="150"
            autocomplete="off"
            v-model.trim="post.title"
            @focus="onTitleFocus"
          />
          <p v-if="!errors.isTitleValid">Please, enter a valid post title</p>
        </div>
        <div class="form__item form__item-column" :class="{ invalid: !errors.isDescriptionValid }">
          <label for="#description">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            maxlength="250"
            autocomplete="off"
            v-model.trim="post.description"
            @focus="onDescriptionFocus"
          />
          <p v-if="!errors.isDescriptionValid">Please, enter a valid post description</p>
        </div>
        <div class="form__item form__item-column" :class="{ invalid: !errors.isContentValid }">
          <ckeditor
            :editor="editor"
            v-model="post.content"
            :config="editorConfig"
            @focus="onContentFocus"
          ></ckeditor>
          <p v-if="!errors.isContentValid">Please, enter a valid post content</p>
        </div>
        <div class="form__item">
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            ref="fileInput"
            style="display: none"
          />
          <TheButton @click.prevent="onFilePick">Choose File</TheButton>
          <Transition>
            <span v-show="selectedFiles.length > 0"
              ><i class="fa-regular fa-file"></i><span>{{ selectedFiles.length }}</span></span>
          </Transition>
        </div>

        <TheButton mode="inverce">Add Post</TheButton>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
