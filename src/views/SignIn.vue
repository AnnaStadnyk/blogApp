<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'

const router = useRouter()
const articleStore = useArticleStore()

const user = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  isEmailValid: true,
  isPasswordValid: true
})

function onEmailFocus() {
  errors.isEmailValid = true
  articleStore.error = null
}
function onPasswordFocus() {
  errors.isPasswordValid = true
  articleStore.error = null
}

async function onFormSubmit() {
  if (user.email === '') {
    errors.isEmailValid = false
  }
  if (user.password === '') {
    errors.isPasswordValid = false
  }
  if (!errors.isEmailValid || !errors.isPasswordValid) {
    return
  }

  await articleStore.signIn(user)

  if (!articleStore.error) {
    if (router.options.history.state.back !== '/sign-up') router.back()
    else router.push({ name: 'home' })
  }
}
</script>

<template>
  <div class="wrapper-content">
    <form action="" class="form" @submit.prevent="onFormSubmit">
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

      <TheButton mode="inverce">Sign In</TheButton>
      <span
        >Do not have an account? <RouterLink :to="{ name: 'signUp' }">Sign Up.</RouterLink></span
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
