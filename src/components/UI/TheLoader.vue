<template>
  <div>
    <i class="fa-solid fa-spinner fa-spin-pulse"></i>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
div {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;

  i {
    font-size: 100px;
  }
}
</style>
