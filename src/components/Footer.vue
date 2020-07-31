<template lang="pug">
  .footerContent
    b-container(fluid="true")
      div.p-2.mx-lg-5
        h6.pt-3 Founding partners:
        b-container(fluid="true" style="left: auto;").mb-3
          b-row(style="background-color: white; width: fit-content;")
            b-col(style="height: 8vh;" cols="auto" )
              b-img.p-2(src="/img/logo_lequia.png" fluid style="max-width: 100%; max-height: 100%;")
            b-col(style="height: 8vh;" cols="auto")
              b-img.p-2(src="/img/logo_udg.png" fluid style="max-width: 100%; max-height: 100%;")
            b-col(style="height: 8vh;" cols="auto" )
              b-img.p-2(src="/img/logo_unsw.png" fluid style="max-width: 100%; max-height: 100%;")
      div.p-2.mx-lg-5
        h6 Founding partners:


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