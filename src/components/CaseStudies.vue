<template lang="pug">
  .caseStudies
    b-container(fluid="true")
      //p {{ solutionCode }}
      b-row(v-for="c in get_cases_to_show" :key="c" )
        b-col(lg="8" sm="12" xl="6" )
          b-img(:src="get_case_path({c})" fluid style="max-width: 100%; max-height: 100%;")
        b-col(lg="8" sm="12" xl="6" )
          b-img(:src="get_case_path({c})" fluid style="max-width: 100%; max-height: 100%;")

</template>

<script>

  import _ from 'lodash';

  export default {
    name: "CaseStudies",
    props: ['solutionCode', 'typeMembrane', 'saltRejection', 'permeability'],
    data: function () {
      return {
        mainPath: "/caseStudies/",
        images: [
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Regenerate to reuse as reverse osmosis membranes"
              },
            caseNumbers: [1, 2, 3, 4, 5, 6, 7]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Recycling into nanofiltration-like membranes"
              },
            caseNumbers: [8, 9, 10, 11, 12, 13, 6, 14]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [16]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [17, 10, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 23, 2, 3, 4, 24, 25]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 10, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: ">5-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [23, 2, 3, 4, 24, 25]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: ">5-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: ">5-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 10, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Regenerate to reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 1, 8, 2, 3, 4, 5, 6, 27]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Recycling into nanofiltration-like membranes"
              },
            caseNumbers: [7, 28, 8, 9, 11, 12, 29, 13, 6, 14]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [16, 17, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 23, 2, 3, 4, 8, 24, 25]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 18, 19, 15, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 23, 2, 3, 4, 8, 24, 25]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: ">5-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: ">5-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Regenerate to reuse as Nanofiltration"
              },
            caseNumbers: [2]
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "<1-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: ">5-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: ">5-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: ">5-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                typeMembrane: null,
                permeability: null,
                saltRejection: null,
                membraneReuse: "Indirect recycling"
              },
            caseNumbers: [19,31,32,33,34,35,36,37,38,39]
          },

          // Survey 1
          /*{code: "LI",    caseNumbers: []},
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
          {code: "RecUF", caseNumbers: [1,2,3]},*/
        ],
      }
    },
    mounted: function(){
    },
    watch:{
    },
    methods: {
      get_case_path(num){
        let aux = JSON.stringify(num.c);
        let path = this.mainPath + aux.toString() + ".JPG";
        return path;
      },
      is_equal(obj1, obj2){
        const obj1_keys = Object.keys(obj1);
        const obj2_keys = Object.keys(obj2);

        if(obj1_keys.length !== obj2_keys.length)
          return false;

        for(let obj_key of obj1_keys){
          if(obj1_keys[obj_key] !== obj2_keys[obj_key])
            return false;
        }
        return true;
      }
    },
    computed: {

      get_cases_to_show() {
        let caseNumbers = [];
        console.log("caseNumbers ini: ", caseNumbers);

        let membrane = this.typeMembrane;
        let perm = this.permeability;
        let rejection = this.saltRejection;
        let imagesList = this.images;

        this.solutionCode.forEach(function (sol) {
          console.log("name: ", sol.name);
          let auxObject = {
            typeMembrane: membrane,
            permeability: perm,
            saltRejection: rejection,
            membraneReuse: sol.name
          };
          let ret = imagesList.find(i => _.isEqual(i.inputs, auxObject));
          console.log("ret: ", ret);
          if(ret){
            ret.caseNumbers.forEach(function (num) {
              caseNumbers.push(num);
            })
          }
        });
        caseNumbers = [ ...new Set(caseNumbers) ]; //removes duplicate numbers.
        console.log("caseNumbers: ", caseNumbers);
        return caseNumbers;

      },
    }
  }
</script>

<style scoped>

</style>