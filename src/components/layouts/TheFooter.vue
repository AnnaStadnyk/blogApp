<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'

const router = useRouter()
const articleStore = useArticleStore()

let type = ref('')

watchEffect(() => {
  switch (router.currentRoute.value.name) {
    case 'addPost':
    case 'editPost':
      type.value = 'content'
      break
    case 'signUp':
    case 'signIn':
      type.value = 'signUp'
      break
    case 'viewPost':
      type.value = 'post'
      break
    default:
      type.value = 'main'
      break
  }
})

const year = computed(() => {
  return new Date().getFullYear()
})

const email = ref('')
const isEmailValid = ref(true)

function onEmailFocus() {
  isEmailValid.value = true
  articleStore.error = null
}

async function onFormSubmit() {
  if (email.value === '') {
    isEmailValid.value = false
  }
  //await articleStore.subscribe(email)
}
</script>

<template>
  <footer class="footer">
    <div class="wrapper-app">
      <div class="footer__content" v-if="!articleStore.user.uid && type !== 'signUp'">
        <h3>Personally Newsletter</h3>
        <p>
          A biweekly newsletter of design inspiration, resources and anything related to career
          development.
        </p>
        <form action="" class="form form-subscribe" @submit.prevent="onFormSubmit">
          <div class="form__item" :class="{ invalid: !isEmailValid }">
            <input
              type="email"
              name="subscribe"
              id="subscribe"
              placeholder="Email address"
              autocomplete="off"
              v-model="email"
              @focus="onEmailFocus"
            />
            
            <TheButton mode="subscribe">Subscribe</TheButton>
          </div>
        </form>
      </div>
      <div
        class="footer__line"
        v-show="(!articleStore.user.uid && type !== 'signUp') || type === 'post'"
      ></div>
      <div class="footer__copy">
        <span>&copy; {{ year }} - Personally<sup>TM</sup></span>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background-color: var(--c-white);

  &__content {
    max-width: 500px;
    margin: 0 auto;
    padding: 3.75rem 0;

    @media screen and (max-width: 1020px) {
      padding: clamp(1.5rem, 0.4714rem + 5.1429vw, 3.75rem) 0;
    }
  }

  h3 {
    font-weight: 700;
    text-align: center;
    background: var(--c-graient);
    margin-bottom: 0.625rem;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    text-align: center;
    margin-bottom: 2rem;

    @media screen and (max-width: 1020px) {
      margin-bottom: clamp(0.8rem, 0.2514rem + 2.7429vw, 2rem);
    }
  }

  input[type='email'] {
    border-radius: 0.5rem 0 0 0.5rem;
  }

  &__copy {
    padding: 2.5rem 0;

    @media screen and (max-width: 1020px) {
      padding: clamp(1rem, 0.3143rem + 3.4286vw, 2.5rem) 0;
    }

    text-align: center;

    span {
      font-size: 10px;
      line-height: 1;

      sup {
        font-size: 6px;
      }
    }
  }

  &__line {
    border-top: 1px solid var(--c-gray-4);
  }
}
</style>
