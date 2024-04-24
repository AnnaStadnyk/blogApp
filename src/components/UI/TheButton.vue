<script setup>
const props = defineProps({
  mode: {
    type: String,
    required: false,
    default: null
  },
  link: {
    type: Boolean,
    required: false,
    default: false
  },
  to: {
    // type: String,
    type: Object,
    required: false,
    // default: '/'
    default: { name: 'home' }
  }
})
</script>

<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>

<style scoped lang="scss">
@mixin button($bg, $c, $b) {
  background-color: $bg;
  color: $c;
  border: 1px solid $b;
}

a,
button {
  display: inline-block;
  min-width: 5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  border-radius: 0.5rem;
  @include button(var(--c-white), var(--c-gray-1), var(--c-gray-4));
  transition: all 0.3s ease;

  @media (hover: hover) {
    &:hover {
      @include button(var(--c-gray-1), var(--c-white), var(--c-gray-1));
    }
  }

  &:active {
    @include button(var(--c-gray-1), var(--c-white), var(--c-gray-1));
  }

  &:disabled {
    cursor: none;
    pointer-events: none;
    @include button(var(--c-white), var(--c-gray-4), var(--c-gray-4));
  }

  &.inverce,
  &.subscribe {
    @include button(var(--c-gray-1), var(--c-white), var(--c-gray-1));

    @media (hover: hover) {
      &:hover {
        @include button(var(--c-white), var(--c-gray-1), var(--c-gray-4));
      }
    }

    &:active {
      @include button(var(--c-white), var(--c-gray-1), var(--c-gray-4));
    }
  }

  &.subscribe {
    min-width: unset;
    padding: 0.5rem 1.75rem;
    border-radius: 0 0.5rem 0.5rem 0;

    @media screen and (max-width: 1020px) {
      padding: 0.5rem clamp(0.75rem, 0.2929rem + 2.2857vw, 1.75rem);
    }
  }
}
</style>
