<template lang="pug">
  .headerContent
    b-container(fluid="true").p-2.mx-lg-5
      b-row
        b-col(style="height: 8vh;" align-h="start")
          b-img.p-2(src="/img/logo_mem.png" style="max-width: 100%; max-height: 100%; display: block;")
        b-col(align-self="center" align-h="end" cols="auto" )
          b-row
            b-col(cols="auto")
              a(type="button") ABOUT REMapp

            b-col

              b-icon(
                icon="chevron-up"
                size="sm"
                v-b-toggle.about
              )

      b-row(align-h="end")
        b-col()
          b-collapse.collapsed(id="about" v-model="info" class="mt-2").p-2
            h4 What is REMapp for?
            p REMapp is a simple decision-making tool for end-of-life spiral-wound reverse osmosis and nanofiltration membranes with the specific size of 40 inches of length and 8 inches of diameter.
            h4 Who is REMapp useful for?
            p Membrane users who are going to replace membranes and are seeking alternative end-of-life membrane managements.
            h4 Which are the potential kind of end-of-life membrane managements?
            p The preferable order is: reuse, regeneration for reuse, direct recycling, indirect recycling, incineration and landfill disposal. Worldwide the most common management is incineration and landfill disposal (by far). REMapp shows current investigations and companies that try to boost alternative end-of-life membrane managements to those two last.



    b-jumbotron(
      header="REMapp decision-making tool"
      lead="Find your alternative solution for a sustainable end-of-life reverse osmosis membrane management"
      style="background-color: var(--dark-gray-primary)"
      ).px-lg-5

</template>

<script>
  export default {
    name: "Header",
    data() {
      return {
        info: false
      }
    }
  }
</script>

<style scoped>
  .headerContent {
    color: white;
    font-weight: var(--bold-text);
    /*height: 100px;*/
  }

  .jumbotron {
    background-image: url(/img/header_foto.gif);
    background-size: cover;
    height: fit-content;
    font-weight: bold;
  }

  .jumbotron > h1 {
    font-weight: bold;
    font-size: 3rem;
  }

  .jumbotron > p {
    font-weight: bold;
    font-size: 22px;
  }

  .b-icon.bi.collapsed {
    transform: rotate(180deg);
  }

  .collapsed > p{
    font-weight: normal;
    font-size: 14px;
  }

  .collapsed > h4{
    font-weight: bold;
  }

</style>