<script setup>
defineEmits(['cancel-dialog', 'confirm-dialog'])
</script>

<template>
  <div class="dialog">
    <div class="wrapper-app">
      <div class="dialog__content">
        <div class="dialog__btns">
          <i class="fa-solid fa-xmark" @click="$emit('cancel-dialog')"></i>
        </div>
        <slot></slot>
        <div class="dialog__btns">
          <TheButton mode="inverce" @click="$emit('confirm-dialog')">OK</TheButton>
          <TheButton mode="inverce" @click="$emit('cancel-dialog')">Cancel</TheButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dialog {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);

  &__content {
    width: 420px;
    max-width: 100%;
    height: 240px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    border-radius: 1rem;
    background-color: var(--c-white);
    box-shadow: 0px 4px 70px 0px rgba(30, 40, 52, 0.08);
  }

  &__btns {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    &:first-child {
      align-self: flex-end;
    }
  }

  i {
    font-size: 30px;
    cursor: pointer;
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
}
</style>
