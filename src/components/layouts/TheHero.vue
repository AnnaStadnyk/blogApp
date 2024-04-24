<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true
  }
})
</script>

<template>
  <section class="hero" :style="{ 'min-height': `${props.type === 'main' ? 65 : 50}vmin` }">
    <div class="wrapper-content">
      <div class="hero__content">
        <h1>
          <slot name="header"></slot>
        </h1>
        <p>
          <slot name="description"></slot>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  padding: calc(7.5rem + 1.25rem * 2 + 0.5rem * 2 + 0.875rem) 0 5rem;
  background-color: var(--c-white);

  @media screen and (max-width: 1020px) {
    padding: calc(clamp(3rem, 0.9429rem + 10.2857vw, 7.5rem) + 1.25rem * 2 + 0.5rem * 2 + 0.875rem)
      0 clamp(2rem, 0.6286rem + 6.8571vw, 5rem);
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  p {
    font-size: 1.75rem;
    color: var(--c-gray-2);
    text-align: center;

    @media screen and (max-width: 1020px) {
      font-size: clamp(1.125rem, 0.8393rem + 1.4286vw, 1.75rem);
    }
  }
}
</style>
