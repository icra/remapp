<template lang="pug">
  
</template>

<script>
  export default {
<<<<<<< HEAD
    name: "CaseStudies",
    props: ['solutions', 'typeWater'],
    data: function () {
      return {
        mainPath: "/static/slides/",
        images: [
          // Survey 1
          {code: "LI", name: "Landfill disposal or incineration", color: "#be514e"},
          {code: "IR", name: "Indirect recycling", color: "#604b79"},
          {
            code: "AM",
            name: "Membranes are suitable for an alternative management to landfill disposal or incineration.",
            color: "#9ab959"
          },
          {
            code: "AMR",
            name: "Membranes are suitable for an alternative management to landfill disposal or incineration. " +
              "Membranes might need to be rehydrated using 50% w/w ethanol during 15 min.",
            color: "#c2d59a"
          },
          {
            code: "IC", name: "Intensive cleaning before considering an alternative management to landfill disposal " +
              "or incineration", color: "#0cae51"
          },
          {
            code: "NEIM",
            name: "Not enough information. Potentially, membranes are suitable for alternative management.",
            color: "#4dabc5"
          },
          {
            code: "NEIC",
            name: "Not enough information. Potentially, apply intensive cleaning before alternative management.",
            color: "#35849b"
          },
          {code: "NEIR", name: "Not enough information. Potentially, indirect recycling.", color: "#ffff00"},
          {
            code: "IRC", name: "Indirect recycling of those membranes placed in the second stage. Potentially, " +
              "apply intensive cleaning before considering an alternative management for those membranes " +
              "placed in the first stage.", color: "#f79447"
          },

          // Survey 2
          {code: "ReuRO", name: "Reuse as reverse osmosis membranes", color: "#00ff00"},
          {code: "ReuNF", name: "Reuse as nanofiltration-like membranes", color: "#66ff66"},
          {code: "RegRO", name: "Regenerate to reuse as reverse osmosis membranes", color: "#99ff33"},
          {code: "RegNF", name: "Regenerate to reuse as nanofiltration membranes", color: "#ccff33"},
          {code: "RecNF", name: "Recycling into nanofiltration-like membranes", color: "#33cc33"},
          {code: "RecUF", name: "Recycling into ultrafiltration-like membranes", color: "#77933c"},
        ],
      }
    },
=======
    name: "CaseStudies"
>>>>>>> joan
  }
</script>

<style scoped>

</style>