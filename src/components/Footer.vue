<template lang="pug">
  .footerContent
    b-container(fluid="true")
      div.p-2.mx-lg-5
        //h4.pt-3(style="font-weight: bold") Who owns REMapp?
        h4.pt-3(style="font-weight: bold") REMapp owners:
        //p(style="font-weight: normal; font-size: 14px;") This decision-making tree has been developed by LEQUIA research group of University of Girona in collaboration with the University of New South Wales.
        b-container(fluid="true" style="left: auto;").mb-3.mx-3
          b-row(style="background-color: white; width: fit-content;")
            b-col(style="height: 8vh;" cols="auto" )
              b-img.p-2(src="/img/logo_lequia.png" fluid style="max-width: 100%; max-height: 100%;")
            b-col(style="height: 8vh;" cols="auto")
              b-img.p-2(src="/img/logo_udg.png" fluid style="max-width: 100%; max-height: 100%;")
            b-col(style="height: 8vh;" cols="auto" )
              b-img.p-2(src="/img/logo_unsw.png" fluid style="max-width: 100%; max-height: 100%;")
        //p(style="font-weight: normal; font-size: 14px;") The authors acknowledge the financial support of the European Union’s Horizon 2020 research and innovation programme under the Marie Skłodowska-Curie grant agreement nº 712949 (TECNIOspring PLUS) and to the Agency for Business Competitiveness of the Government of Catalonia for the grant TECSPR17-1-0019 Mem2.0 project.


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