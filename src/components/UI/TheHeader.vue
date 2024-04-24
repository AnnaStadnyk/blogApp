<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useArticleStore } from '@/stores/article'
import UserCard from '@/components/layouts/UserCard.vue'

const articleStore = useArticleStore()

// const {userAgent} = window.navigator;
// const isMobile = userAgent.includes("Mobi") ? true : false
const isMobile = ref(false)
const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
const isActive = ref(false)

function handleWindowResize() {
  isActive.value = false
  width.value = window.innerWidth
  height.value = window.innerHeight
  isMobile.value = width.value < 1020 ? true : false
}

function handleClickOutside(event) {
  if (event.target.closest('a:not(.sign-in)') || event.target.closest('i')) return
  else {
    const menu = document.querySelector('.menu')
    if (!menu.contains(event.target)) {
      isActive.value = false
      const body = document.querySelector('body')
      body.classList.remove('block')
    }
  }
}

function toogleMenu() {
  isActive.value = !isActive.value
  const body = document.querySelector('body')
  if (isActive.value) {
    body.classList.add('block')
  } else {
    body.classList.remove('block')
  }
}

onMounted(() => {
  window.addEventListener('resize', handleWindowResize)
  handleWindowResize()
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize)
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <header class="header">
    <div class="wrapper-app">
      <div class="header__nav">
        <div class="logo">
          <RouterLink to="/home" class="logo-link">Personally<sup>TM</sup></RouterLink>
        </div>

        <nav class="menu" v-show="!isMobile">
          <ul class="menu__list">
            <li class="menu__link">
              <RouterLink :to="{ name: 'dailyDigest', params: { category: 'daily-digest' } }"
                >Daily Digest</RouterLink
              >
            </li>
            <li class="menu__link">
              <RouterLink :to="{ name: 'designTools', params: { category: 'design-tools' } }"
                >Design Tools</RouterLink
              >
            </li>
            <li class="menu__link">
              <RouterLink :to="{ name: 'tutorials', params: { category: 'tutorials' } }"
                >Tutorials</RouterLink
              >
            </li>
          </ul>
        </nav>

        <div class="user">
          <div class="user__card" v-if="articleStore.user.uid">
            <a href="" @click.prevent=""><i class="fa-solid fa-user"></i></a>
            <UserCard></UserCard>
          </div>
          <TheButton link :to="{ name: 'signIn' }" mode="inverce" v-else>Sign In</TheButton>
        </div>

        <i class="fa-solid fa-bars" v-show="isMobile" @click="toogleMenu"></i>
      </div>
    </div>

    <Transition>
      <nav class="menu" v-show="isActive" :class="{ mobile: isMobile, active: isActive }">
        <i class="fa-solid fa-xmark" v-show="isMobile" @click="toogleMenu"></i>
        <ul class="menu__list">
          <li class="menu__link">
            <RouterLink
              :to="{ name: 'dailyDigest', params: { category: 'daily-digest' } }"
              @click="toogleMenu"
              >Daily Digest</RouterLink
            >
          </li>
          <li class="menu__link">
            <RouterLink
              :to="{ name: 'designTools', params: { category: 'design-tools' } }"
              @click="toogleMenu"
              >Design Tools</RouterLink
            >
          </li>
          <li class="menu__link">
            <RouterLink
              :to="{ name: 'tutorials', params: { category: 'tutorials' } }"
              @click="toogleMenu"
              >Tutorials</RouterLink
            >
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  padding: 1.25rem 0;
  background-color: var(--c-white);
  box-shadow: 0px 4px 70px 0px rgba(30, 40, 52, 0.08);
  z-index: 100;

  &__nav {
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.875rem;
  }
}

.menu {
  flex: 0 1 var(--cont-width);

  &__list {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1.875rem;

    .mobile & {
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
  }

  &__link {
    font-size: 1rem;
    font-weight: 500;

    .mobile & {
      font-size: 1.5rem;
    }
  }

  &.mobile {
    position: absolute;
    top: 0;
    width: 320px;
    height: 100vh;
    z-index: 0;
    background-color: var(--c-gray-6);
    padding: 1.25rem 10px;
    overflow: scroll;
    // box-shadow: 0px 4px 70px 0px rgba(30, 40, 52, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(1.25rem * 2 + 0.5rem * 2 + 0.875rem);

    i {
      align-self: flex-end;
    }
  }

  .router-link-active {
    color: var(--c-red-2);
  }
}

.logo {
  flex: 0 5 calc((var(--app-width) - var(--cont-width)) / 2 - 1.875rem);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;

  sup {
    font-size: 0.5rem;
  }
}

.user {
  flex: 1 1 100%;

  @media screen and (min-width: 1020px) {
    flex: 0 10 calc(210px - 1.875rem);
  }

  display: flex;
  justify-content: flex-end;

  &__card {
    position: relative;
  }
}

i {
  font-size: 40px;
  transition: all 0.3s ease;

  @media (hover: hover) {
    &:hover {
      color: var(--c-red-2);
    }
  }

  &:active {
    color: var(--c-red-2);
  }
}

.v-enter-active,
.v-leave-active {
  transition: left 0.3s ease;
  left: 0;
}

.v-enter-from,
.v-leave-to {
  left: -100%;
}
</style>
