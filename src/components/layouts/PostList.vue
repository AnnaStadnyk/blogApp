<template>
  <section class="card">
    <div class="wrapper-content">
      <div class="card__header">
        <slot name="header"></slot>
      </div>
      <div class="card__main">
        <slot></slot>
      </div>
      <div class="card__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.card {
  &:not(:last-child) {
    margin-bottom: 3.75rem;

    @media screen and (max-width: 1020px) {
      margin-bottom: clamp(1.5rem, 0.4714rem + 5.1429vw, 3.75rem);
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:not(:has(h2 + a)) {
      flex-direction: row-reverse;
    }
  }

  &__footer {
    margin-top: 3.75rem;
    display: flex;
    justify-content: center;

    @media screen and (max-width: 1020px) {
      margin-top: clamp(1.5rem, 0.4714rem + 5.1429vw, 3.75rem);
    }

    &:empty {
      display: none;
    }
  }

  &__main {
    margin-top: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media screen and (max-width: 1020px) {
      margin-top: clamp(0.875rem, 0.475rem + 2vw, 1.75rem);
    }
  }
}
</style>
