
<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       :width="width"
       :height="height"
       viewBox="0 0 1280 1280"
       :aria-labelledby="iconName"
       role="img"
  >

    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>


<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 50
    },
    height: {
      type: [Number, String],
      default: 50
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    }
  }
}
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
  stroke: black;
  stroke-width: 0.3;
}
</style>
