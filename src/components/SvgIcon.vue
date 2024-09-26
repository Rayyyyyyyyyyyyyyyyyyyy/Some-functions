<template>
  <svg
    class="svg-icon"
    :style="{
      width: props.width + 'px',
      height: props.height + 'px',
      color: props.color
    }"
  >
    <use :xlink:href="`#icon-${props.name}`" :fill="props.color" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SvgIcon",
  props: {
    name: {
      type: String,
      required: true,
      default: "logo"
    },
    width: {
      type: Number,
      default: 24
    },
    height: {
      type: Number,
      default: 24
    },
    color: {
      type: String,
      default: "inherit"
    }
  },
  setup(props) {
    return {
      props
    };
  }
});
</script>

<style lang="scss" scoped>
svg {
  @apply transition-colors duration-300 ease-linear;
}
</style>
