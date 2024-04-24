<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'

const router = useRouter()
const articleStore = useArticleStore()

const user = reactive({
  name: '',
  email: '',
  password: ''
})

const errors = reactive({
  isNameValid: true,
  isEmailValid: true,
  isPasswordValid: true
})
function onNameFocus() {
  errors.isNameValid = true
  articleStore.error = null
}
function onEmailFocus() {
  errors.isEmailValid = true
  articleStore.error = null
}
function onPasswordFocus() {
  errors.isPasswordValid = true
  articleStore.error = null
}

async function onFormSubmit() {
  if (user.name === '') {
    errors.isNameValid = false
  }
  if (user.email === '') {
    errors.isEmailValid = false
  }
  if (user.password === '') {
    errors.isPasswordValid = false
  }
  if (!errors.isNameValid || !errors.isEmailValid || !errors.isPasswordValid) {
    return
  }

  await articleStore.signUp(user)

  if (!articleStore.error) router.push('/')
}
</script>

<template>
  <div class="wrapper-content">
    <form action="" class="form" @submit.prevent="onFormSubmit">
      <div class="form__item form__item-column" :class="{ invalid: !errors.isNameValid }">
        <label for="#name">Full Name</label>
        <input
          type="text"
          name="name"
          id="name"
          autocomplete="off"
          v-model.trim="user.name"
          @focus="onNameFocus"
        />
        <p v-if="!errors.isEmailValid" class="error">Please, enter a valid e-mail</p>
      </div>
      <div class="form__item form__item-column" :class="{ invalid: !errors.isEmailValid }">
        <label for="#email">E-mail</label>
        <input
          type="email"
          name="email"
          id="email"
          autocomplete="off"
          v-model.trim="user.email"
          @focus="onEmailFocus"
        />
        <p v-if="!errors.isEmailValid" class="error">Please, enter a valid e-mail</p>
      </div>
      <div class="form__item form__item-column" :class="{ invalid: !errors.isPasswordValid }">
        <label for="#password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model.trim="user.password"
          @focus="onPasswordFocus"
        />
        <p v-if="!errors.isPasswordValid" class="error">Please, enter a valid password</p>
      </div>
      <p v-if="articleStore.error" class="error">{{ articleStore.error.message }}</p>

      <TheButton mode="inverce">Sign Up</TheButton>
      <span
        >Do you have an account? <RouterLink :to="{ name: 'signIn' }">Sign In.</RouterLink></span
      >
    </form>
  </div>
</template>

<style scoped lang="scss">
.wrapper-content {
  width: 420px;
  max-width: 100%;

  span {
    text-align: center;
    font-size: 0.875rem;
    font-weight: 500;

    a {
      display: inline;
      color: var(--c-red-2);

      @media (hover: hover) {
        &:hover {
          text-decoration: underline;
        }
      }

      &:active {
        text-decoration: underline;
      }
    }
  }
}
</style>
