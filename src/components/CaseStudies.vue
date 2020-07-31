<template lang="pug">
  .caseStudies
    b-container(fluid="true")
      p {{ solutionCode }}
      template(v-for="c in case_studies_to_show" )
        p {{ c }}

</template>

<script>
  export default {
    name: "CaseStudies",
    props: ['solutionCode', 'typeMembrane'],
    data: function () {
      return {
        mainPath: "/caseStudies/",
        images: [
          // Survey 1
          {code: "LI",    caseNumbers: []},
          {code: "IR",    caseNumbers: [19,31,32,33,34,35,36,37,38,39]},
          {code: "AM",    caseNumbers: [1,2,3]},
          {code: "AMR",   caseNumbers: [1,2,3]},
          {code: "IC",    caseNumbers: [1,2,3]},
          {code: "NEIM",  caseNumbers: [1,2,3]},
          {code: "NEIC",  caseNumbers: [1,2,3]},
          {code: "NEIR",  caseNumbers: [1,2,3]},
          {code: "IRC",   caseNumbers: [1,2,3]},

          // Survey 2
          {code: "ReuRO", caseNumbers: [1,2,3]},
          {code: "ReuNF", caseNumbers: [1,2,3]},
          {code: "RegRO", caseNumbers: [1,2,3]},
          {code: "RegNF", caseNumbers: [1,2,3]},
          {code: "RecNF", caseNumbers: [1,2,3]},
          {code: "RecUF", caseNumbers: [1,2,3]},
        ],
      }
    },
    mounted: function(){
    },
    watch:{
    },
    methods: {
      case_studies_to_show(){
        let reuse = this.images.find(i => i.code == this.solutionCode);
        console.log("reuse: ", reuse);
        return reuse.caseNumbers;
      }
    }
  }
</script>

<style scoped>

</style>