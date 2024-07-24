<template>
  <svg class="iconfont" aria-hidden="true" :font-size="size" :color="color">
    <use :xlink:href="`#${type}`"></use>
  </svg>
</template>

<script lang="ts" setup>
  defineProps({
    type: {
      type: String,
    },
    size: {
      type: [String, Number],
      default: '1em',
    },
    color: {
      type: String,
      default: 'inherit',
    },
  });
</script>

<style scoped>
  .iconfont {
    width: 1em;
    height: 1em;
    margin: 0 5px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
