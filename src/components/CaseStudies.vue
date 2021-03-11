<template lang="pug">
  .caseStudies
    b-container(fluid="true")
      template(v-if='solution_code.length === 1')
        div.membrane_reuse
          b-row.ml-0
            b-col(:style="`background:${solution_code[0].color}`" sm="2" xl="1" )
            b-col(sm="10"  xl="11" ) {{ solution_code[0].name }}
        template(v-if="image_ids !== null")
          b-row(v-for="c in image_ids.caseNumbers" :key="c" )
            b-col(sm="10" xl="5" offset-sm="1" offset-xl="0" align-self="center")
              b-img(:src="get_case_path({c})" fluid v-b-modal="getID({c})")#caseImg
              b-modal(:id="getID({c})" model-class="modal-content" hide-footer hide-header size="xl" centered)
                b-img(:src="get_case_path({c})" fluid-grow)#img
            b-col(sm="12" xl="7" )
              b-table(stacked small outlined :items="[get_image_info({c})]" :fields="table_fields" )
                template(v-slot:cell(website)="{ value }")
                  b-link.url(:href="value" target="_blank") {{ value }}
                template(v-slot:cell(results)="{ value }")
                  b-link.url(:href="value" target="_blank") {{ value }}
                template(v-slot:cell(contacts)="{ value }")
                  b-link.url(:href="'mailto:'+value+'?Subject=reverse osmosis and nanofiltration membranes'" target="_blank") {{ value }}
            b-dropdown-divider(style="height: 0px; margin: 0px 0.75rem 0.75rem; width: 100%; overflow: hidden; border-top: 2px solid var(--green-primary);")
        template(v-else)
          b-row
            b-col
              b No case studies are available to this specific solution.
              div.membrane_reuse
                b-row.ml-0
                  b-col(:style="`background:${solution_code[0].color}`" sm="2" xl="1" )
                  b-col(sm="10"  xl="11" ) {{ solution_code[0].name }}
      template(v-else)
        b-row
          b-col
            b Please, complete all the survey to see case studies.

</template>

<script>
  import _ from 'lodash';

  export default {
    name: "CaseStudies",
    props: ['solution_code', 'membrane_type', 'salt_rejection', 'permeability', 'caseStudies', 'image_ids'],
    data: function () {
      return {
        file: null,
        mainPath: "/caseStudies/",
        //cases_to_show: this.image_ids,
        //caseStudies_info: this.caseStudies,
        table_fields: [
          {
            key: "specific_application",
            isRowHeader: true,
            label: "Specific application of second-hand membranes",
          },
          {key: 'company_name', label: "Company name"},
          {key: 'project_name', label: "Name of the project"},
          {key: 'entity', label: "Entity"},
          {key: 'website', label: "Website"},
          {key: 'typeEOF_membrane', label: "Type of end-of-life membranes"},
          {key: 'research_activity', label: "Research  - Business activity"},
          {key: 'implementation', label: "Scale of implementation"},
          {key: 'investigation', label: "Main Investigation"},
          {key: 'results', label: "Main results / products"},
          {key: 'mailing_address', label: "Mailing address of the supervising organization"},
          {key: 'contacts', label: "Contacts"}
        ]
      }
    },
    methods: {
      get_case_path(num){
        let aux = JSON.stringify(num.c);
        let path = this.mainPath + aux.toString() + ".JPG";
        return path;
      },
      getID: function(num) {
        let aux = JSON.stringify(num.c);
        let id="caseImg" + aux.toString();
        return id;
      },
      get_image_info(num){
        let aux = JSON.stringify(num.c);
        let imageInfo = this.caseStudies.find(i => i.image_id == aux);
        return imageInfo;
      }
    },
    computed: {
      get_cases_to_show() {
        let caseNumbers = [];

        let membrane = this.membrane_type;
        let perm = this.permeability;
        let rejection = this.salt_rejection;
        let imagesList = this.images;

        this.solution_code.forEach(function (sol) {
            let auxObject = {
              membrane_type: membrane,
              permeability: perm,
              salt_rejection: rejection,
              membrane_reuse: sol.name
            };
            function compare_membrane_reuse(obj1, obj2){
              if(obj1.membrane_reuse === obj2.membrane_reuse)
                return true;
              else
                return false;
            }
            let ret;
            if(sol.image_id !== "IR")
              ret = imagesList.find(i => _.isEqual(i.inputs, auxObject));
            else
              ret = imagesList.find(i => _.isEqualWith(i.inputs, auxObject, compare_membrane_reuse));
            console.log("ret: ", ret);
            if (ret) {
              ret.caseNumbers.forEach(function (num) {
                caseNumbers.push(num);
              })
            }
        });
        caseNumbers = [ ...new Set(caseNumbers) ]; //removes duplicate numbers.
        console.log("caseNumbers to show: ", caseNumbers);
        return caseNumbers;

      },
    }
  }
</script>

<style >
  th  {
    background: var(--gray-for-tables);
  }

</style>

<style scoped>
  .url{
    word-wrap: break-word;
  }

  .membrane_reuse {
    padding: 0.6em 1em;
  }

  .imageContainer:hover img {
    transform: scale(1.5);
    //overflow: visible;
  }

  #caseImg {
    cursor: pointer;
    transition: 0.3s;
  }
  #caseImg:hover {
    opacity: 0.5;
  }

</style>
