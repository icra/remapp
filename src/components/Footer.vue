<template lang="pug">
  .footerContent
    hr(style="border-top: 5px solid var(--dark-gray-primary); margin-top: 0; margin-bottom: 0.5rem; width: 95%")
    b-container(fluid="true")
      div.p-2.mx-lg-5.mx-3
        b-container(fluid="true" style="left: auto;")
          b-row(class="justify-content-md-center")
            b-col(cols="auto").mx-lg-3
              b-row
                b-col(cols="12")
                  h5.logo_title Project
                  hr(style="border-top: 1px solid var(--light-gray-primary); margin-top: 0; margin-bottom: 0.5rem;")
              b-row.logo_row
                b-col(style="height: 65px;" cols="auto" )
                  b-img.logo_image(src="/img/logo_mem.png" fluid)
                b-col(style="height: 65px;" cols="auto")
                  b-img.logo_image(src="/img/logo_accio_tecnio_eu.png" fluid )

            b-col(cols="auto").mx-lg-3
              b-row
                b-col(cols="12" )
                  h5.logo_title Owner
                  hr(style="border-top: 1px solid var(--light-gray-primary); margin-top: 0; margin-bottom: 0.5rem;")
              b-row.logo_row
                b-col(style="height: 65px;" cols="auto" )
                  a(href="https://www.udg.edu/en/" title="Go to UdG webpage" target="_blank")
                    b-img.logo_image(src="/img/logo_udg.png" fluid)
                b-col(style="height: 65px;" cols="auto")
                  a(href="http://www.lequia.udg.edu/" title="Go to LEQUIA webpage" target="_blank")
                    b-img.logo_image(src="/img/logo_lequia.png")

            b-col(cols="auto").mx-lg-3
              b-row
                b-col( cols="12")
                  h5.logo_title Collaborators
                  hr(style="border-top: 1px solid var(--light-gray-primary); margin-top: 0; margin-bottom: 0.5rem;")
              b-row.logo_row(align-v="center")
                b-col(style="height: 65px;" cols="auto" )
                  a(href="https://www.unsw.edu.au/" title="Go to UNSW webpage" target="_blank")
                    b-img.logo_image(src="/img/logo_unsw.png" fluid)
                b-col(style="height: 65px;" cols="auto")
                  a(href="https://www.water.imdea.org/" title="Go to IMDEA webpage" target="_blank")
                    b-img.logo_image(src="/img/logo_imdea.png" fluid)

            b-col(cols="auto").mx-lg-3
              b-row
                b-col( cols="12")
                  h5.logo_title Web developer
                  hr(style="border-top: 1px solid var(--light-gray-primary); margin-top: 0; margin-bottom: 0.5rem;")
              b-row.logo_row(align-v="center")
                b-col(style="height: 65px;" cols="auto" )
                  a(href="http://icra.cat/index.php?lang=3" title="Go to ICRA webpage" target="_blank")
                    b-img.logo_image(src="/img/logo_icra.png" fluid)

        //h4.pt-3(style="font-weight: bold") REMapp owners:
        //p(style="font-weight: normal; font-size: 14px;") This decision-making tree has been developed by LEQUIA research group of University of Girona in collaboration with the University of New South Wales.
        //b-container(fluid="true" style="left: auto;").mb-3.mx-3
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
    //color: white;
    font-weight: var(--bold-text);
    /*height: 100px;*/
  }

  .logo_image{
    max-width: 100%;
    max-height: 100%;
  }

  .logo_row {
    width: fit-content;
    margin-bottom: 1.5rem;
  }

  .logo_title {
    width: 140px;
  }

</style>
