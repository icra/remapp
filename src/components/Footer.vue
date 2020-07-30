<template lang="pug">
  .footerContent
    b-container(fluid="true")
      div.p-2.mx-lg-5
        h6.py-3 Founding partners:
        b-container(fluid="true" style="max-width: fit-content; left: auto;").mb-3
          b-row(style="height: 10vh; background-color: white ")
            b-img.p-2(src="/img/logo_lequia.png" style="max-width: 100%; max-height: 100%; display: block;")
            b-img.p-2(src="/img/logo_udg.png" style="max-width: 100%; max-height: 100%; display: block;")
            b-img.p-2(src="/img/logo_unsw.png" style="max-width: 100%; max-height: 100%; display: block;")



</template>

<script>
  export default {
    name: "Footer"
  }
</script>

<style scoped>
  .footerContent {
    color: white;
    font-weight: var(--bold-text);
    /*height: 100px;*/
  }

</style>