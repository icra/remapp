<template lang="pug">
  div.remapToolbox
    div.header
      Header
    div.content
      b-container.p-2.mx-lg-5(fluid="true")
        b-row
          <!--(style="background-color: var(--light-gray-primary)")-->
          b-col(sm="12" md="4" xl="3")
            //style="min-height: 90vh;  top:0; background-color: white"
            b-navbar.pt-0
              .sidebar-header
                b-row.mb-0.pb-0
                  b-col
                    h4(style="font-weight: var(--bold-text); text-align:left") Survey
                  b-col(cols="auto" align-h="end")
                    b-button.clearButt(@click="clearValues") CLEAR ALL
                b-dropdown-divider(style="height: 0; margin: 0 0 0.75rem 0; overflow: hidden; border-top: 1px solid var(--light-gray-primary);")
                div(style="overflow-y: scroll; max-height: 70vh;").pr-2
                  template(v-for="q in questions" :id="q.code" style="overflow-y: auto")
                    b {{q.name}}
                    multiselect(
                      v-model="q.value",
                      :options="q.answers",
                      placeholder="Pick a value",
                      :disabled="is_disabled(q)"
                    ).multiselect
                //b-button.clearButt.mt-3(block @click="clearValues") CLEAR ALL
          b-col
            //router-view
            <!--survey 1 outputs-->
            div
              b-tabs(content-class="" fill)
                b-tab#solutions(title="SOLUTIONS" active).p-3.tabBox
                  b Alternative end-of-life membrane management
                  //div.membrane_reuse(:style="`background:${get_membrane_reuse_color()}`")  {{show_membrane_reuse()}}
                  div.membrane_reuse(v-for="s in get_available_solutions" :id="s.code" :key="s.code" :style="`background:${s.color}`")  {{ s.name }}
                  br
                  template(v-if="result_survey_2.length !== 0")
                    b Considerations to reproduce the recommended second-hand membranes
                    //div.membrane_reuse(:style="`background:${get_membrane_reuse_color()}`")  {{show_membrane_reuse()}
                    div.membrane_reuse(v-for="s in result_survey_2")
                      b-table(striped hover :items="[s.survey2_result]")

                b-tab#caseStudies(title="CASE STUDIES").p-3.tabBox
                  CaseStudies(
                    v-bind:solution-code="this.get_solutions_for_case_studies"
                    v-bind:type-membrane="this.get_question_by_code('T').value"
                    :salt-rejection="this.get_question_by_code('R').value"
                    :permeability="this.get_question_by_code('PV').value"
                    )
                //b-tab#factSheets(title="FACT SHEETS").p-3.tabBox
                  FactSheets
    footer.footer
      Footer


</template>

<script>
  import Multiselect from 'vue-multiselect'
  import CaseStudies from "./CaseStudies";
  import FactSheets from "./FactSheets";
  import Footer from "./Footer";
  import Header from "./Header";
  import _ from "lodash";
  export default {
    name: "Menus",
    components: {
      Header,
      Footer,
      FactSheets,
      CaseStudies,
      Multiselect
    },
    data() {
      return {
        questions: [
          // Survey 1
          {
            code: "T",
            name: "Type of membrane",
            value: null,
            answers: ["Reverse osmosis brackish model design", "Reverse osmosis sea model design", "Nanofiltration", "Ultrafiltration", "Microfiltration", "Other"]
          },
          {code: "C", name: "Membrane configuration", value: null, answers: ["Spiral-wound", "Other"]},
          {code: "S", name: "Membrane size", value: null, answers: ["Length: 1m. Diameter: 0.2m", "Other"]},
          {code: "W", name: "Membrane weight", value: null, answers: ["<17kg", "17-25 kg", ">25kg", "Don't know"]},
          {code: "ED", name: "External damage", value: null, answers: ["No", "Yes", "Don't know"]},
          {code: "F", name: "Fouling type", value: null, answers: ["Inorganic scaling", "Other", "Don't know"]},
          {
            code: "ST",
            name: "Membrane storage",
            value: null,
            answers: ["Wet", "Immersed in a water solution", "Dry", "Don't know"]
          },
          {code: "D", name: "Storage duration", value: null, answers: ["<1 month", ">1 month", "Don't know"]},
          {
            code: "RP",
            name: "Cause of replacement",
            value: null,
            answers: ["Granted budget for replacement", "Operating more than the expected lifespan", "Lost of membrane integrity", "Don't know"]
          },
          {
            code: "P",
            name: "Membrane position",
            value: null,
            answers: ["Single pass", "Double pass - single stage", "Double pass - double stage", "Mix", "Don't know"]
          },
          {
            code: "WT",
            name: "Type of water",
            value: null,
            answers: ["Seawater", "Brackish water", "Wastewater", "Chemical industry", "Food industry"]
          },
          // Survey 2
          {
            code: "R",
            name: "Salt rejection",
            value: null,
            answers: ["<15% comparing to the design value", ">10% of NaCl and >30% of MgSO4", "<10% of NaCl and <30% of MgSO4"]
          },
          {
            code: "PV",
            name: "Variation of Permeability",
            value: null,
            answers: ["<1-fold comparing to the design value", "[1-5]-fold comparing to the design value", ">5-fold comparing to the design value"]
          },
        ],
        membrane_reuse_options: [
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
            code: "IC",
            name: "Intensive cleaning before considering an alternative management to landfill disposal " +
              "or incineration",
            color: "#0cae51"
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
          {
            code: "NEIR",
            name: "Not enough information. Potentially, indirect recycling.",
            color: "#ffff00"
          },
          {
            code: "IRC",
            name: "Indirect recycling of those membranes placed in the second stage. Potentially, " +
              "apply intensive cleaning before considering an alternative management for those membranes " +
              "placed in the first stage.",
            color: "#f79447"
          },
          // Survey 2
          {code: "ReuRO", name: "Reuse as reverse osmosis membranes",               color: "#00ff00"},
          {code: "ReuNF", name: "Reuse as nanofiltration-like membranes",           color: "#66ff66"},
          {code: "RegRO", name: "Regenerate to reuse as reverse osmosis membranes", color: "#99ff33"},
          {code: "RegNF", name: "Regenerate to reuse as nanofiltration membranes",  color: "#ccff33"},
          {code: "RecNF", name: "Recycling into nanofiltration-like membranes",     color: "#33cc33"},
          {code: "RecUF", name: "Recycling into ultrafiltration-like membranes",    color: "#77933c"},
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 2,500 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Waste water treatment",
            },
            "Company name": "Aqualia",
            "Name of the project": "Life Remembrane - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://life-remembrane.eu/?lang=es",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Preparing for reuse & Direct reuse",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Life Remembrane: demonstration plant in which diverse mechanical and chemical treatments are developed in order to recover these membranes to reuse them in reverse osmosis technology ",
            "Main results /products": "http://life-remembrane.eu/results/",
            "Dirección postal entidad coordinadora": "Aqualia gestión integral del agua, S.A. Av. del Camino de Santiago, 40. 28050, Madrid, Spain",
            "Contacts": "mviallon@leitat.org",
            "Image": "1",
            "Imágenes sin repeticiones": "1"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 2,500 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Not focus on application but on preparing RO membranes to be reused",

            },
            "Company name": "WaterSurplus",
            "Name of the project": "-",
            "Entity": "Private Company",
            "website": "http://www.watersurplus.com/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse and preparing for reuse",
            "Scale of implementation": "Industrial",
            "Main Investigation": "Cleans, tests, repackages, and repurposes used RO, UF and NF membranes and associated equipment at significant cost savings to the user",
            "Main results /products": "https://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch\nhttps://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch\n",
            "Dirección postal entidad coordinadora": "726 Beacon Street, 61111, Loves Park, IL ",
            "Contacts": "sales@watersurplus.com",
            "Image": "2",
            "Imágenes sin repeticiones": "2"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",

            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 2,500 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Not focus on application but on preparing RO membranes to be reused",
            },
            "Company name": "Avanale water solution",
            "Name of the project": "-",
            "Entity": "Private Company",
            "website": "https://www.pacificwatertreatment.com/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse and preparing for reuse",
            "Scale of implementation": "Industrial",
            "Main Investigation": "Refurbishment of old equipment supply of RO membranes",
            "Main results /products": "https://www.pacificwatertreatment.com/refurbishments-service",
            "Dirección postal entidad coordinadora": "PO Box 5869 Manly, Australia, 4179",
            "Contacts": "phil@avanale.com.au",
            "Image": "3",
            "Imágenes sin repeticiones": "3"
          },
          {
            code: {


              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 2,500 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Not focus on application but on preparing RO  membranes to be reused",
            },
            "Company name": "Membrane Services",
            "Name of the project": "-",
            "Entity": "Private Company",
            "website": "http://www.membraneservices.com/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse and preparing for reuse",
            "Scale of implementation": "Industrial",
            "Main Investigation": "End-of-life RO membranes examination, cleaning and repackaging",
            "Main results /products": "http://www.membraneservices.com/Recycled_Membranes.html",
            "Dirección postal entidad coordinadora": "Membrane Services, LLC 10385 Commerce Row Suite C Montgomery, Texas 77356",
            "Contacts": "http://membraneservices.com/Contact_Us.html",
            "Image": "4",
            "Imágenes sin repeticiones": "4"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 2,500 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Not focus on application but on preparing RO membranes to be reused",
            },
            "Company name": "Sichuan University",
            "Name of the project": "-",
            "Entity": "University",
            "website": "http://ce.scu.edu.cn/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Preparing for reuse",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Refurbishing of the used RO membrane through chemical cleaning and repairing with a new system",
            "Main results /products": "https://www.sciencedirect.com/science/article/pii/S0011916413001756?via%3Dihub",
            "Dirección postal entidad coordinadora": "Chemical Engineering School of Sichuan University, Chengdu, Sichuan 610065, China",
            "Contacts": "li-yongsheng@scu.edu.cn, lysgxf2005@yahoo.com.cn (Y.-S.",
            "Image": "5",
            "Imágenes sin repeticiones": "5"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 2,500 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Industrial wastewater",
            },
            "Company name": "Eurecat",
            "Name of the project": "-",
            "Entity": "Public institutions",
            "website": "https://eurecat.org/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recycled RO/NF/UF membranes ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            "Main results /products": "https://eurecat.org/es/portfolio-items/eflucomp/",
            "Dirección postal entidad coordinadora": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Contacts": "xavier.martinez@eurecat.org",
            "Image": "6",
            "Imágenes sin repeticiones": "6"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 2,500 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Landfill leachate water treatment",
            },
            "Company name": "University of Girona and University (Spain)  of New South Wales (Australia)",
            "Name of the project": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Entity": "Public institutions",
            "website": "http://www.lequia.udg.edu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of regenerated RO membranes (seawater models)",
            "Scale of implementation": "Industrial",
            "Main Investigation": "Mem2.0: Landfill leachate water treatment using end-of-life RO and regenerated membranes",
            "Main results /products": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Dirección postal entidad coordinadora": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Contacts": " joaquim.comas@udg.edu ",
            "Image": "7",
            "Imágenes sin repeticiones": "7"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[2,500-25,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Brackish water treatment for irrigation",
            },
            "Company name": "IMDEA Agua",
            "Name of the project": "Life-Transfomem - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Validation of recycled membranes for treating brackish water at pilot scale",
            "Main results /products": "https://doi.org/10.1016/j.desal.2017.12.034",
            "Dirección postal entidad coordinadora": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "8",
            "Imágenes sin repeticiones": "8"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[2,500-25,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Life cycle and economical assessment of the recycling process ",
            },
            "Company name": "IMDEA Agua",
            "Name of the project": "Life-Transfomem",
            "Entity": "Public institutions",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Recycling of end-of-life reverse osmosis membranes: Comparative LCA and cost-effectiveness analysis at pilot scale",
            "Main results /products": "https://doi.org/10.1016/j.resconrec.2019.104423",
            "Dirección postal entidad coordinadora": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "9",
            "Imágenes sin repeticiones": "9"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[2,500-25,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Synthetic river water",
            },
            "Company name": "University of Girona and University (Spain)  of New South Wales (Australia)",
            "Name of the project": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Entity": "Public institutions",
            "website": "http://www.lequia.udg.edu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Mem2.0:Novel membrane housing designs for gravity-driven NF and UF recycled membrane-based systems",
            "Main results /products": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Dirección postal entidad coordinadora": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Contacts": " joaquim.comas@udg.edu ",
            "Image": "10",
            "Imágenes sin repeticiones": "10"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[2,500-25,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            },
            "Company name": "Federal University of Itajubá",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://en.unifei.edu.br/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Evaluation of parameters that affect the efficiency of end-of-life RO membrane recycling by chemical oxidization / Extending the life-cycle of reverse osmosis membranes: A review ",
            "Main results /products": "http://journals.sagepub.com/doi/10.1177/0734242X16684383",
            "Dirección postal entidad coordinadora": "Federal University of Itajubá, Itabira, Minas Gerais, Brazil ",
            "Contacts": "ecoutinho@unifei.edu.br",
            "Image": "11",
            "Imágenes sin repeticiones": "11"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[2,500-25,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            },
            "Company name": "Universidade Federal do Rio Grande do Sul",
            "Name of the project": "-",
            "Entity": "University",
            "website": "http://www.ufrgs.br/ufrgs/inicial",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Rejuvenating polyamide reverse osmosis membranes by tannic acid treatment",
            "Main results /products": "https://www.sciencedirect.com/science/article/pii/S1383586612004108",
            "Dirección postal entidad coordinadora": "UFRGS. Department of Chemical Engineering, Universidade Federal do Rio Grande do Sul, 90040-040 Porto Alegre, RS, Brazil",
            "Contacts": "isabel@enq.ufrgs.br",
            "Image": "12",
            "Imágenes sin repeticiones": "12"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[2,500-25,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Waste water treatment",
            },
            "Company name": "MEDRC",
            "Name of the project": "-",
            "Entity": "Public institutions & Private Companies",
            "website": "https://www.medrc.org",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling ",
            "Scale of implementation": "Lab / Pilot",
            "Main Investigation": "Use of end-of-life RO membranes to treat wastewater for industrial and Agricultural use",
            "Main results /products": "https://www.medrc.org/kick-off-meeting-for-membrane-reuse-project/",
            "Dirección postal entidad coordinadora": "The Middle East Desalination Research Center (MEDRC) ",
            "Contacts": "elkharraz@medrc.org",
            "Image": "13",
            "Imágenes sin repeticiones": "13"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[2,500-25,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Industrial wastewater",
            },
            "Company name": "Eurecat",
            "Name of the project": "-",
            "Entity": "Public institutions",
            "website": "https://eurecat.org/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recycled RO/NF/UF membranes ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            "Main results /products": "https://eurecat.org/es/portfolio-items/eflucomp/",
            "Dirección postal entidad coordinadora": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Contacts": "xavier.martinez@eurecat.org",
            "Image": "14",
            "Imágenes sin repeticiones": "6"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[2,500-25,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            },
            "Company name": "Universida de Universidade Federal do Rio Grande do Su",
            "Name of the project": "-",
            "Entity": "University",
            "website": "http://www.ufrgs.br/ufrgs/inicial",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Study on Potassium Permanganate Chemical Treatment of Discarded Reverse Osmosis Membranes Aiming their Reuse",
            "Main results /products": "https://www.tandfonline.com/doi/abs/10.1080/01496395.2012.745876",
            "Dirección postal entidad coordinadora": "Laboratory ofMembrane Separation Processes, Department of Chemical Engineering,  Universidade Federal do Rio Grande do Sul, Porto Alegre, Brazil",
            "Contacts": "alan.ambrosi@gmail.com",
            "Image": "15",
            "Imágenes sin repeticiones": "14"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Waste water treatment",
            },
            "Company name": "Universidad de Las Palmas de Gran Canaria (ULPGC)",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.ulpgc.es/node ",
            "Type of end-of-life membranes": "Reverse osmosis -spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Reusing old seawater RO membranes in wastewater, conversion to a type of microfiltration membrane",
            "Main results /products": "https://www.sciencedirect.com/science/article/pii/S0011916403003849 ; https://www.sciencedirect.com/science/article/pii/S0011916402009773",
            "Dirección postal entidad coordinadora": "Departemento de Ingenieria de Procesos, Universidad de Las Palmas de Gran Canaria (ULPGC), Campus Tafira Baja, E-35017 Las Palmas de Gran Canaria, Spain ",
            "Contacts": "jveza@dip.ulpgc.es",
            "Image": "16",
            "Imágenes sin repeticiones": "15"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",

            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Not focus on application but on producing UF-like membranes to be reused",
            },
            "Company name": "UNSW,UNESCO",
            "Name of the project": "-",
            "Entity": "University & Research center",
            "website": "https://www.unsw.edu.au/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Production and characterisation of UF membranes by chemical conversion of used RO membranes",
            "Main results /products": "https://doi.org/10.1016/j.memsci.2013.07.015",
            "Dirección postal entidad coordinadora": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Contacts": "p.le-clech@unsw.edu.au",
            "Image": "17",
            "Imágenes sin repeticiones": "16"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Life cycle assessment of the recycling process ",
            },
            "Company name": "UNSW,UNESCO",
            "Name of the project": "-",
            "Entity": "University & Research center",
            "website": "https://www.unsw.edu.au/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Comparative life cycle assessment of end-of-life options for reverse osmosis membranes",
            "Main results /products": "https://doi.org/10.1016/j.desal.2014.10.013",
            "Dirección postal entidad coordinadora": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Contacts": "p.le-clech@unsw.edu.au",
            "Image": "18",
            "Imágenes sin repeticiones": "17"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Synthetic river water",
            },
            "Company name": "University of Girona and University (Spain)  of New South Wales (Australia)",
            "Name of the project": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Entity": "Public institutions",
            "website": "http://www.lequia.udg.edu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Mem2.0: Novel membrane housing designs for gravity-driven NF and UF recycled membrane-based systems",
            "Main results /products": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Dirección postal entidad coordinadora": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Contacts": " joaquim.comas@udg.edu ",
            "Image": "19",
            "Imágenes sin repeticiones": "10"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Sea water pretreatment ",
            },
            "Company name": "SACYR and IMDEA Agua",
            "Name of the project": "Life-Transfomem - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.life-transfomem.eu/publications/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Life-Transfomem project. Production of recycled UF membranes for seawater treatment as substitution of standard sand filtration",
            "Main results /products": "https://www.youtube.com/watch?v=DPp8uYN-iT8&feature=youtu.be",
            "Dirección postal entidad coordinadora": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "20",
            "Imágenes sin repeticiones": "18"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Waste water treatment",
            },
            "Company name": "SACYR and IMDEA Agua",
            "Name of the project": "Life-Transfomem - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.life-transfomem.eu/publications/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Life-Transfomem project. Production of recycled UF membranes for wastewater treatment. Spiral-wound, semiopened and star configurations",
            "Main results /products": "https://drive.google.com/file/d/1AZxH825pFNvNKMYyNBoTDKOu80dR2DL4/view",
            "Dirección postal entidad coordinadora": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "21",
            "Imágenes sin repeticiones": "19"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Life cycle and economical assessment of the recycling process ",
            },
            "Company name": "IMDEA Agua",
            "Name of the project": "Life-Transfomem",
            "Entity": "Public institutions",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Recycling of end-of-life reverse osmosis membranes: Comparative LCA and cost-effectiveness analysis at pilot scale",
            "Main results /products": "https://doi.org/10.1016/j.resconrec.2019.104423",
            "Dirección postal entidad coordinadora": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "22",
            "Imágenes sin repeticiones": "9"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",

            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Economical assesment of the recycling process",
            },
            "Company name": "Federal University of Minas Gerais",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.ufmg.br/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Environmental and economic evaluation of end-of-life reverse osmosis membranes recycling by means of chemical conversion",
            "Main results /products": "https://www.sciencedirect.com/science/article/pii/S0959652618314355#!",
            "Dirección postal entidad coordinadora": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Contacts": "ecoutinho@desa.ufmg.br",
            "Image": "23",
            "Imágenes sin repeticiones": "20"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Wastewater treatment",
            },
            "Company name": "Eurecat",
            "Name of the project": "H2020 Nextgen - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "https://nextgenwater.eu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recyed UF membrane ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Nextgenwater project: Application of recyed UF membrane for water reclaiming",
            "Main results /products": "https://nextgenwater.eu/demonstration-cases/costa-brava-region/",
            "Dirección postal entidad coordinadora": "Gelderlandhaven 7D, 3433 PG Nieuwegein, Netherlands",
            "Contacts": "xavier.martinez@eurecat.org",
            "Image": "24",
            "Imágenes sin repeticiones": "21"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Urban wastewater",
            },
            "Company name": "Eurecat",
            "Entity": "Public institutions",
            "website": "https://eurecat.org/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recyed UF membrane ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Regireu project: Application of recycled membranes for treating urban wastewater",
            "Main results /products": "https://eurecat.org/es/portfolio-items/regireu/",
            "Dirección postal entidad coordinadora": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Contacts": "xavier.martinez@eurecat.org",
            "Image": "25",
            "Imágenes sin repeticiones": "22"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Industrial wastewater",
            },
            "Company name": "Eurecat",
            "Name of the project": "-",
            "Entity": "Public institutions",
            "website": "https://eurecat.org/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recycled RO/NF/UF membranes ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            "Main results /products": "https://eurecat.org/es/portfolio-items/eflucomp/",
            "Dirección postal entidad coordinadora": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Contacts": "xavier.martinez@eurecat.org",
            "Image": "26",
            "Imágenes sin repeticiones": "6"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Landfill leachate water treatment",
              "Specific application of second-hand membranes": "University of Girona and University (Spain)  of New South Wales (Australia)",
            },
            "Company name": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Name of the project": "Public institutions",
            "Entity": "http://www.lequia.udg.edu/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of end-of-life RO membranes (seawater models)",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Mem2.0: Landfill leachate water treatment using end-of-life RO and regenerated membranes",
            "Main Investigation": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Main results /products": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Dirección postal entidad coordinadora": " joaquim.comas@udg.edu ",
            "Contacts": "27",
            "Image": "7"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "AquaTip",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "https://aquatip.com.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse ",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Collecting unwanted or used Reverse Osmosis membranes from water treatment plants with the aim to dispose, recycle, or repurpose them for a different application",
            "Main Investigation": "https://aquatip.com.au/services/",
            "Main results /products": "Sydney, Australia",
            "Dirección postal entidad coordinadora": "director@aquatip.com.au",
            "Contacts": "28",
            "Image": "23"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "WaterSurplus",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "http://www.watersurplus.com/ ",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Cleans, tests, repackages, and repurposes used RO, UF and NF membranes and associated equipment at significant cost savings to the user",
            "Main Investigation": "https://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch\nhttps://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch\n",
            "Main results /products": "726 Beacon Street, 61111, Loves Park, IL ",
            "Dirección postal entidad coordinadora": "sales@watersurplus.com",
            "Contacts": "29",
            "Image": "2"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "Avanale water solution",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "https://www.pacificwatertreatment.com/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Refurbishment of old equipment supply of RO membranes",
            "Main Investigation": "https://www.pacificwatertreatment.com/refurbishments-service",
            "Main results /products": "PO Box 5869 Manly, Australia, 4179",
            "Dirección postal entidad coordinadora": "phil@avanale.com.au",
            "Contacts": "30",
            "Image": "3"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "Membrane Services",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "http://www.membraneservices.com/ ",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "End-of-life RO membranes examination, cleaning and repackaging",
            "Main Investigation": "http://www.membraneservices.com/Recycled_Membranes.html",
            "Main results /products": "Membrane Services, LLC 10385 Commerce Row Suite C Montgomery, Texas 77356",
            "Dirección postal entidad coordinadora": "http://membraneservices.com/Contact_Us.html",
            "Contacts": "31",
            "Image": "4"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "Centre d’Etude et de Recherche de Djibouti (CERD)",
            },
            "Company name": "-",
            "Name of the project": "Research center",
            "Entity": "http://www.cerd.dj/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Wastewater reclamation using discarded reverse osmosis membranes for reuse in irrigation in Djibouti, an arid country",
            "Main Investigation": "https://www.ncbi.nlm.nih.gov/pubmed/23508163",
            "Main results /products": "Centre d’Etude et de Recherche de Djibouti (CERD), Djibouti",
            "Dirección postal entidad coordinadora": "awaleh@gmail.com",
            "Contacts": "32",
            "Image": "24"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Synthetic water",
              "Specific application of second-hand membranes": "Advanced Water Management Centre (The University of Queensland)",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "http://www.awmc.uq.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Virus removal (MS2 phage) and four membrane integrity indicators (salt, dissolved organic matter, rhodamine WT and sulphateand) in aged RO membranes ",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0043135415304206",
            "Main results /products": "Advanced Water Management Centre, The University of Queensland, Brisbane, QLD 4072, Australia",
            "Dirección postal entidad coordinadora": "m.pype@awmc.uq.edu.au",
            "Contacts": "33",
            "Image": "25"
          },
          {
            codec: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Brackish water treatment for irrigation",
              "Specific application of second-hand membranes": "IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Validation of recycled membranes for treating brackish water at pilot scale",
            "Main Investigation": "https://doi.org/10.1016/j.desal.2017.12.034",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "34",
            "Image": "8"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Brackish water",
              "Specific application of second-hand membranes": "Université de Nantes",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "-",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Lab/Pilot",
            "Scale of implementation": "Reuse of end-of-life RO membranes as NF membranes",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0011916409013204",
            "Main results /products": "GEPEA, UMR CNRS 6144, Université de Nantes, 37 Bd. de l&apos;université, CRTT BP406, 44602 Saint-Nazaire, France",
            "Dirección postal entidad coordinadora": "maxime.pontie@univ-angers.fr",
            "Contacts": "35",
            "Image": "26"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "Universidad de Las Palmas de Gran Canaria (ULPGC)",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "https://www.ulpgc.es/node ",
            "website": "Reverse osmosis -spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "reusing old seawater RO membranes in wastewater, conversion to a type of microfiltration membrane",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0011916403003849 ; https://www.sciencedirect.com/science/article/pii/S0011916402009773",
            "Main results /products": "Departemento de Ingenieria de Procesos, Universidad de Las Palmas de Gran Canaria (ULPGC), Campus Tafira Baja, E-35017 Las Palmas de Gran Canaria, Spain ",
            "Dirección postal entidad coordinadora": "jveza@dip.ulpgc.es",
            "Contacts": "36",
            "Image": "15"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Not focus on application but on producing UF-like membranes to be reused",
              "Specific application of second-hand membranes": "UNSW,UNESCO",
            },
            "Company name": "-",
            "Name of the project": "University & Research center",
            "Entity": "https://www.unsw.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Production and characterisation of UF membranes by chemical conversion of used RO membranes",
            "Main Investigation": "https://doi.org/10.1016/j.memsci.2013.07.015",
            "Main results /products": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Dirección postal entidad coordinadora": "p.le-clech@unsw.edu.au",
            "Contacts": "37",
            "Image": "16"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Life cycle assessment of the recycling process ",
              "Specific application of second-hand membranes": "UNSW,UNESCO",
            },
            "Company name": "-",
            "Name of the project": "University & Research center",
            "Entity": "https://www.unsw.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Comparative life cycle assessment of end-of-life options for reverse osmosis membranes",
            "Main Investigation": "https://doi.org/10.1016/j.desal.2014.10.013",
            "Main results /products": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Dirección postal entidad coordinadora": "p.le-clech@unsw.edu.au",
            "Contacts": "38",
            "Image": "17"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Synthetic river water",
              "Specific application of second-hand membranes": "University of Girona and University (Spain)  of New South Wales (Australia)",
            },
            "Company name": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Name of the project": "Public institutions",
            "Entity": "http://www.lequia.udg.edu/",
            "website": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Mem2.0: Novel membrane housing designs for gravity-driven NF and UF recycled membrane-based systems",
            "Main Investigation": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Main results /products": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Dirección postal entidad coordinadora": " joaquim.comas@udg.edu ",
            "Contacts": "39",
            "Image": "10"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Sea water pretreatment ",
              "Specific application of second-hand membranes": "SACYR and IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.life-transfomem.eu/publications/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Life-Transfomem project. Production of recycled UF membranes for seawater treatment as substitution of standard sand filtration",
            "Main Investigation": "https://www.youtube.com/watch?v=DPp8uYN-iT8&feature=youtu.be",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "40",
            "Image": "18"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "SACYR and IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.life-transfomem.eu/publications/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Life-Transfomem project. Production of recycled UF membranes for wastewater treatment. Spiral-wound, semiopened and star configurations",
            "Main Investigation": "https://drive.google.com/file/d/1AZxH825pFNvNKMYyNBoTDKOu80dR2DL4/view",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "41",
            "Image": "19"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Life cycle and economical assessment of the recycling process ",
              "Specific application of second-hand membranes": "IMDEA Agua",
            },
            "Company name": "Life-Transfomem",
            "Name of the project": "Public institutions",
            "Entity": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Recycling of end-of-life reverse osmosis membranes: Comparative LCA and cost-effectiveness analysis at pilot scale",
            "Main Investigation": "https://doi.org/10.1016/j.resconrec.2019.104423",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "42",
            "Image": "9"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Economical Evaluation of the recycling process",
              "Specific application of second-hand membranes": "Federal University of Minas Gerais",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "https://www.ufmg.br/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Environmental and economic evaluation of end-of-life reverse osmosis membranes recycling by means of chemical conversion",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0959652618314355#!",
            "Main results /products": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Dirección postal entidad coordinadora": "ecoutinho@desa.ufmg.br",
            "Contacts": "43",
            "Image": "20"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Wastewater treatment",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Company name": "H2020 Nextgen - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "https://nextgenwater.eu/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recyed UF membrane ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Nextgenwater project: Application of recyed UF membrane for water reclaiming",
            "Main Investigation": "https://nextgenwater.eu/demonstration-cases/costa-brava-region/",
            "Main results /products": "Gelderlandhaven 7D, 3433 PG Nieuwegein, Netherlands",
            "Dirección postal entidad coordinadora": "Jos.Frijns@kwrwater.nl",
            "Contacts": "44",
            "Image": "21"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Urban wastewater",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Name of the project": "Public institutions",
            "Entity": "https://eurecat.org/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recyed UF membrane ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Regireu project: Application of recycled membranes for treating urban wastewater",
            "Main Investigation": "https://eurecat.org/es/portfolio-items/regireu/",
            "Main results /products": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Dirección postal entidad coordinadora": "xavier.martinez@eurecat.org",
            "Contacts": "45",
            "Image": "22"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Industrial wastewater",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Company name": "Public institutions",
            "Name of the project": "https://eurecat.org/",
            "Entity": "Reverse osmosis - spiral wound",
            "website": "Application of recycled RO/NF/UF membranes ",
            "Type of end-of-life membranes": "Pilot",
            "Research  - Business activity": "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            "Scale of implementation": "https://eurecat.org/es/portfolio-items/eflucomp/",
            "Main Investigation": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Main results /products": "xavier.martinez@eurecat.org",
            "Dirección postal entidad coordinadora": "46",
            "Contacts": "6"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "AquaTip",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "https://aquatip.com.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse ",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Collecting unwanted or used Reverse Osmosis membranes from water treatment plants with the aim to dispose, recycle, or repurpose them for a different application",
            "Main Investigation": "https://aquatip.com.au/services/",
            "Main results /products": "Sydney, Australia",
            "Dirección postal entidad coordinadora": "director@aquatip.com.au",
            "Contacts": "47",
            "Image": "23"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "WaterSurplus",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "http://www.watersurplus.com/ ",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Cleans, tests, repackages, and repurposes used RO, UF and NF membranes and associated equipment at significant cost savings to the user",
            "Main Investigation": "https://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch\nhttps://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch\n",
            "Main results /products": "726 Beacon Street, 61111, Loves Park, IL ",
            "Dirección postal entidad coordinadora": "sales@watersurplus.com",
            "Contacts": "48",
            "Image": "2"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "Avanale water solution",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "https://www.pacificwatertreatment.com/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Refurbishment of old equipment supply of RO membranes",
            "Main Investigation": "https://www.pacificwatertreatment.com/refurbishments-service",
            "Main results /products": "PO Box 5869 Manly, Australia, 4179",
            "Dirección postal entidad coordinadora": "phil@avanale.com.au",
            "Contacts": "49",
            "Image": "3"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "Membrane Services",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "http://www.membraneservices.com/ ",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "End-of-life RO membranes examination, cleaning and repackaging",
            "Main Investigation": "http://www.membraneservices.com/Recycled_Membranes.html",
            "Main results /products": "Membrane Services, LLC 10385 Commerce Row Suite C Montgomery, Texas 77356",
            "Dirección postal entidad coordinadora": "http://membraneservices.com/Contact_Us.html",
            "Contacts": "50",
            "Image": "4"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "Centre d’Etude et de Recherche de Djibouti (CERD)",
            },
            "Company name": "-",
            "Name of the project": "Research center",
            "Entity": "http://www.cerd.dj/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Wastewater reclamation using discarded reverse osmosis membranes for reuse in irrigation in Djibouti, an arid country",
            "Main Investigation": "https://www.ncbi.nlm.nih.gov/pubmed/23508163",
            "Main results /products": "Centre d’Etude et de Recherche de Djibouti (CERD), Djibouti",
            "Dirección postal entidad coordinadora": "awaleh@gmail.com",
            "Contacts": "51",
            "Image": "24"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Synthetic water",
              "Specific application of second-hand membranes": "Advanced Water Management Centre (The University of Queensland)",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "http://www.awmc.uq.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Virus removal (MS2 phage) and four membrane integrity indicators (salt, dissolved organic matter, rhodamine WT and sulphateand) in aged RO membranes ",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0043135415304206",
            "Main results /products": "Advanced Water Management Centre, The University of Queensland, Brisbane, QLD 4072, Australia",
            "Dirección postal entidad coordinadora": "m.pype@awmc.uq.edu.au",
            "Contacts": "52",
            "Image": "25"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Brackish water treatment for irrigation",
              "Specific application of second-hand membranes": "IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Validation of recycled membranes for treating brackish water at pilot scale",
            "Main Investigation": "https://doi.org/10.1016/j.desal.2017.12.034",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "53",
            "Image": "8"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Potential application of the second hand membranes": "Brackish water",
              "Specific application of second-hand membranes": "Université de Nantes",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "-",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Lab/Pilot",
            "Scale of implementation": "Reuse of end-of-life RO membranes as NF membranes",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0011916409013204",
            "Main results /products": "GEPEA, UMR CNRS 6144, Université de Nantes, 37 Bd. de l&apos;université, CRTT BP406, 44602 Saint-Nazaire, France",
            "Dirección postal entidad coordinadora": "maxime.pontie@univ-angers.fr",
            "Contacts": "54",
            "Image": "26"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "Universidad de Las Palmas de Gran Canaria (ULPGC)",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "https://www.ulpgc.es/node ",
            "website": "Reverse osmosis -spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "reusing old seawater RO membranes in wastewater, conversion to a type of microfiltration membrane",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0011916403003849 ; https://www.sciencedirect.com/science/article/pii/S0011916402009773",
            "Main results /products": "Departemento de Ingenieria de Procesos, Universidad de Las Palmas de Gran Canaria (ULPGC), Campus Tafira Baja, E-35017 Las Palmas de Gran Canaria, Spain ",
            "Dirección postal entidad coordinadora": "jveza@dip.ulpgc.es",
            "Contacts": "55",
            "Image": "15"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Not focus on application but on producing UF-like membranes to be reused",
              "Specific application of second-hand membranes": "UNSW,UNESCO",
            },
            "Company name": "-",
            "Name of the project": "University & Research center",
            "Entity": "https://www.unsw.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Production and characterisation of UF membranes by chemical conversion of used RO membranes",
            "Main Investigation": "https://doi.org/10.1016/j.memsci.2013.07.015",
            "Main results /products": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Dirección postal entidad coordinadora": "p.le-clech@unsw.edu.au",
            "Contacts": "56",
            "Image": "16"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Life cycle assessment of the recycling process ",
              "Specific application of second-hand membranes": "UNSW,UNESCO",
            },
            "Company name": "-",
            "Name of the project": "University & Research center",
            "Entity": "https://www.unsw.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Comparative life cycle assessment of end-of-life options for reverse osmosis membranes",
            "Main Investigation": "https://doi.org/10.1016/j.desal.2014.10.013",
            "Main results /products": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Dirección postal entidad coordinadora": "p.le-clech@unsw.edu.au",
            "Contacts": "57",
            "Image": "17"
          },
          {
            "Type of RO membrane": "Reverse osmosis brackish model design",
            "Permeability": "> 5-fold comparing to the design value",
            "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
            "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
            "Free chlorine exposure dose qualitative": "high",
            "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
            "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
            "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
            "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
            "Potential application of the second hand membranes": "Synthetic river water",
            "Specific application of second-hand membranes": "University of Girona and University (Spain)  of New South Wales (Australia)",
            "Company name": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Name of the project": "Public institutions",
            "Entity": "http://www.lequia.udg.edu/",
            "website": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Mem2.0: Novel membrane housing designs for gravity-driven NF and UF recycled membrane-based systems",
            "Main Investigation": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Main results /products": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Dirección postal entidad coordinadora": " joaquim.comas@udg.edu ",
            "Contacts": "58",
            "Image": "10"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Sea water pretreatment ",
              "Specific application of second-hand membranes": "SACYR and IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.life-transfomem.eu/publications/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Life-Transfomem project. Production of recycled UF membranes for seawater treatment as substitution of standard sand filtration",
            "Main Investigation": "https://www.youtube.com/watch?v=DPp8uYN-iT8&feature=youtu.be",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "59",
            "Image": "18"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "SACYR and IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.life-transfomem.eu/publications/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Life-Transfomem project. Production of recycled UF membranes for wastewater treatment. Spiral-wound, semiopened and star configurations",
            "Main Investigation": "https://drive.google.com/file/d/1AZxH825pFNvNKMYyNBoTDKOu80dR2DL4/view",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "60",
            "Image": "19"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Life cycle and economical assessment of the recycling process ",
              "Specific application of second-hand membranes": "IMDEA Agua",
            },
            "Company name": "Life-Transfomem",
            "Name of the project": "Public institutions",
            "Entity": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Recycling of end-of-life reverse osmosis membranes: Comparative LCA and cost-effectiveness analysis at pilot scale",
            "Main Investigation": "https://doi.org/10.1016/j.resconrec.2019.104423",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "61",
            "Image": "9"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Economical Evaluation of the recycling process",
              "Specific application of second-hand membranes": "Federal University of Minas Gerais",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "https://www.ufmg.br/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Environmental and economic evaluation of end-of-life reverse osmosis membranes recycling by means of chemical conversion",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0959652618314355#!",
            "Main results /products": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Dirección postal entidad coordinadora": "ecoutinho@desa.ufmg.br",
            "Contacts": "62",
            "Image": "20"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Wastewater treatment",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Company name": "H2020 Nextgen - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "https://nextgenwater.eu/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recyed UF membrane ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Nextgenwater project: Application of recyed UF membrane for water reclaiming",
            "Main Investigation": "https://nextgenwater.eu/demonstration-cases/costa-brava-region/",
            "Main results /products": "Gelderlandhaven 7D, 3433 PG Nieuwegein, Netherlands",
            "Dirección postal entidad coordinadora": "Jos.Frijns@kwrwater.nl",
            "Contacts": "63",
            "Image": "21"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Urban wastewater",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Name of the project": "Public institutions",
            "Entity": "https://eurecat.org/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recyed UF membrane ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Regireu project: Application of recycled membranes for treating urban wastewater",
            "Main Investigation": "https://eurecat.org/es/portfolio-items/regireu/",
            "Main results /products": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Dirección postal entidad coordinadora": "xavier.martinez@eurecat.org",
            "Contacts": "64",
            "Image": "22"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis brackish model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Industrial wastewater",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Company name": "-",
            "Name of the project": "Public institutions",
            "Entity": "https://eurecat.org/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recycled RO/NF/UF membranes ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            "Main Investigation": "https://eurecat.org/es/portfolio-items/eflucomp/",
            "Main results /products": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Dirección postal entidad coordinadora": "xavier.martinez@eurecat.org",
            "Contacts": "65",
            "Image": "6"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 4,000 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Landfill leachate water treatment",
            },
            "Company name": "University of Girona and Telwe S.A.",
            "Name of the project": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Entity": "Public institutions & Private Companies",
            "website": "http://www.lequia.udg.edu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Preparing for reuse & Direct reuse",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Mem2.0: Landfill leachate water treatment using end-of-life RO and regenerated membranes",
            "Main results /products": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Dirección postal entidad coordinadora": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Contacts": " joaquim.comas@udg.edu ",
            "Image": "66",
            "Imágenes sin repeticiones": "7"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 4,000 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Waste water treatment",
            },
            "Company name": "Aqualia",
            "Name of the project": "Life Remembrane - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://life-remembrane.eu/?lang=es",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Preparing for reuse & Direct reuse",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Life Remembrane: demonstration plant in which diverse mechanical and chemical treatments are developed in order to recover these membranes to reuse them in reverse osmosis technology ",
            "Main results /products": "http://life-remembrane.eu/results/",
            "Dirección postal entidad coordinadora": "Aqualia gestión integral del agua, S.A. Av. del Camino de Santiago, 40. 28050, Madrid, Spain",
            "Contacts": "mviallon@leitat.org",
            "Image": "67",
            "Imágenes sin repeticiones": "1"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 4,000 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Brackish water treatment for irrigation",
            },
            "Company name": "IMDEA Agua",
            "Name of the project": "Life-Transfomem - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "https://doi.org/10.1016/j.desal.2017.12.034  ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab/Pilot",
            "Main Investigation": "Life-Transfomem project: end-of-life reverse osmosis membrane recycling intro nanofiltration and ultrafiltration recycled membranes",
            "Main results /products": "http://www.life-transfomem.eu/publications/",
            "Dirección postal entidad coordinadora": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "68",
            "Imágenes sin repeticiones": "8"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 4,000 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Not focus on application but on preparing RO membranes to be reused",
            },
            "Company name": "WaterSurplus",
            "Name of the project": "-",
            "Entity": "Private Company",
            "website": "http://www.watersurplus.com/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse and preparing for reuse",
            "Scale of implementation": "Industrial",
            "Main Investigation": "Cleans, tests, repackages, and repurposes used RO, UF and NF membranes and associated equipment at significant cost savings to the user",
            "Main results /products": "http://www.watersurplus.com/watersurplus-profile.cfm",
            "Dirección postal entidad coordinadora": "726 Beacon Street, 61111, Loves Park, IL ",
            "Contacts": "sales@watersurplus.com",
            "Image": "69",
            "Imágenes sin repeticiones": "2"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 4,000 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Not focus on application but on preparing RO membranes to be reused",
            },
            "Company name": "Avanale water solution",
            "Name of the project": "-",
            "Entity": "Private Company",
            "website": "https://www.pacificwatertreatment.com/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse and preparing for reuse",
            "Scale of implementation": "Industrial",
            "Main Investigation": "Refurbishment of old equipment supply of RO membranes",
            "Main results /products": "https://www.pacificwatertreatment.com/refurbishments-service",
            "Dirección postal entidad coordinadora": "PO Box 5869 Manly, Australia, 4179",
            "Contacts": "phil@avanale.com.au",
            "Image": "70",
            "Imágenes sin repeticiones": "3"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 4,000 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Not focus on application but on preparing RO membranes to be reused",
            },
            "Company name": "Membrane Services",
            "Name of the project": "-",
            "Entity": "Private Company",
            "website": "http://www.membraneservices.com/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse and preparing for reuse",
            "Scale of implementation": "Industrial",
            "Main Investigation": "End-of-life RO membranes examination, cleaning and repackaging",
            "Main results /products": "http://www.membraneservices.com/Recycled_Membranes.html",
            "Dirección postal entidad coordinadora": "Membrane Services, LLC 10385 Commerce Row Suite C Montgomery, Texas 77356",
            "Contacts": "http://membraneservices.com/Contact_Us.html",
            "Image": "71",
            "Imágenes sin repeticiones": "4"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 4,000 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Not focus on application but on preparing RO membranes to be reused",
            },
            "Company name": "Sichuan University",
            "Name of the project": "-",
            "Entity": "University",
            "website": "http://ce.scu.edu.cn/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Preparing for reuse",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Refurbishing of the used RO membrane through chemical cleaning and repairing with a new system",
            "Main results /products": "https://www.sciencedirect.com/science/article/pii/S0011916413001756?via%3Dihub",
            "Dirección postal entidad coordinadora": "Chemical Engineering School of Sichuan University, Chengdu, Sichuan 610065, China",
            "Contacts": "li-yongsheng@scu.edu.cn, lysgxf2005@yahoo.com.cn (Y.-S.",
            "Image": "72",
            "Imágenes sin repeticiones": "5"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 4,000 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Industrial wastewater",
            },
            "Company name": "Eurecat",
            "Name of the project": "-",
            "Entity": "Public institutions",
            "website": "https://eurecat.org/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recycled RO/NF/UF membranes ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            "Main results /products": "https://eurecat.org/es/portfolio-items/eflucomp/",
            "Dirección postal entidad coordinadora": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Contacts": "xavier.martinez@eurecat.org",
            "Image": "73",
            "Imágenes sin repeticiones": "6"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 4,000 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Industrial wastewater",
            },
            "Company name": "H2020 - Zero-Brine - Consortium",
            "Name of the project": "-",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.zerobrine.eu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of regenerated RO membranes for high concentrated sodium-sulfate solutions of industry",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Application of recycled NF membranes for high concentrated sodium-sulfate solutions of silica industry ",
            "Main results /products": "http://www.zerobrine.eu/pilot-projects/spain/",
            "Dirección postal entidad coordinadora": "2628CS Delft",
            "Contacts": "info@revolve.media",
            "Image": "74",
            "Imágenes sin repeticiones": "27"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[4,000-150,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Landfill leachate water treatment",
            },
            "Company name": "University of Girona and Telwe S.A.",
            "Name of the project": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Entity": "Public institutions & Private Companies",
            "website": "http://www.lequia.udg.edu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Preparing for reuse & Direct reuse",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Mem2.0: Landfill leachate water treatment using end-of-life RO and regenerated membranes",
            "Main results /products": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Dirección postal entidad coordinadora": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Contacts": " joaquim.comas@udg.edu ",
            "Image": "75",
            "Imágenes sin repeticiones": "7"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[4,000-150,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Landfill leachate water treatment",
            },
            "Company name": "CTM",
            "Name of the project": "Life Releach - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://releach.eu/#pagina-ejemplo",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recycled membranes",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Life-Releach: new landfill leachate treatment strategies based on the use of different existing technologies including recycled NF and RO membranes",
            "Main results /products": "http://releach.ctm.com.es/en/the-project/main-project-results",
            "Dirección postal entidad coordinadora": "Centro Tecnológico de Manresa (CTM). Plaça de la Ciència, 2 08243 Manresa (Barcelona)",
            "Contacts": "xavier.martinez@eurecat.org",
            "Image": "76",
            "Imágenes sin repeticiones": "28"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[4,000-150,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Brackish water treatment for irrigation",
            },
            "Company name": "IMDEA Agua",
            "Name of the project": "Life-Transfomem - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Validation of recycled membranes for treating brackish water at pilot scale",
            "Main results /products": "https://doi.org/10.1016/j.desal.2017.12.034",
            "Dirección postal entidad coordinadora": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "77",
            "Imágenes sin repeticiones": "8"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[4,000-150,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Life cycle and economical assessment of the recycling process ",
            },
            "Company name": "IMDEA Agua",
            "Name of the project": "Life-Transfomem",
            "Entity": "Public institutions",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Recycling of end-of-life reverse osmosis membranes: Comparative LCA and cost-effectiveness analysis at pilot scale",
            "Main results /products": "https://doi.org/10.1016/j.resconrec.2019.104423",
            "Dirección postal entidad coordinadora": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "78",
            "Imágenes sin repeticiones": "9"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[4,000-150,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            },
            "Company name": "Federal University of Itajubá",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://en.unifei.edu.br/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Evaluation of parameters that affect the efficiency of end-of-life RO membrane recycling by chemical oxidization / Extending the life-cycle of reverse osmosis membranes: A review ",
            "Main results /products": "http://journals.sagepub.com/doi/10.1177/0734242X16684383",
            "Dirección postal entidad coordinadora": "Federal University of Itajubá, Itabira, Minas Gerais, Brazil ",
            "Contacts": "ecoutinho@unifei.edu.br",
            "Image": "79",
            "Imágenes sin repeticiones": "11"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[4,000-150,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            },"Company name": "Universidade Federal do Rio Grande do Sul",

            "Name of the project": "-",
            "Entity": "University",
            "website": "http://www.ufrgs.br/ufrgs/inicial",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Rejuvenating polyamide reverse osmosis membranes by tannic acid treatment",
            "Main results /products": "https://www.sciencedirect.com/science/article/pii/S1383586612004108",
            "Dirección postal entidad coordinadora": "UFRGS. Department of Chemical Engineering, Universidade Federal do Rio Grande do Sul, 90040-040 Porto Alegre, RS, Brazil",
            "Contacts": "isabel@enq.ufrgs.br",
            "Image": "80",
            "Imágenes sin repeticiones": "12"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[4,000-150,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            },
            "Company name": "Lappeenranta University of Technology",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.lut.fi/web/en",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "End-of-life RO membranes recycling: Reuse as NF membranes by polyelectrolyte layer-by-layer deposition",
            "Main results /products": "https://www.sciencedirect.com/science/article/pii/S0376738818327728",
            "Dirección postal entidad coordinadora": "LUT School of Engineering Science, Lappeenranta University of Technology, Lappeenranta 53851, Finland",
            "Contacts": "arto.pihlajamaki@lut.fi",
            "Image": "81",
            "Imágenes sin repeticiones": "29"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[4,000-150,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            },
            "Company name": "MEDRC",
            "Name of the project": "-",
            "Entity": "Public institutions & Private Companies",
            "website": "https://www.medrc.org",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling ",
            "Scale of implementation": "Lab / Pilot",
            "Main Investigation": "Use of recycled NF membranes to treat wastewater for industrial and Agricultural use",
            "Main results /products": "https://www.medrc.org/kick-off-meeting-for-membrane-reuse-project/",
            "Dirección postal entidad coordinadora": "The Middle East Desalination Research Center (MEDRC) ",
            "Contacts": "elkharraz@medrc.org",
            "Image": "82",
            "Imágenes sin repeticiones": "13"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[4,000-150,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Industrial wastewater",
            },
            "Company name": "Eurecat",
            "Name of the project": "-",
            "Entity": "Public institutions",
            "website": "https://eurecat.org/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recycled RO/NF/UF membranes ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            "Main results /products": "https://eurecat.org/es/portfolio-items/eflucomp/",
            "Dirección postal entidad coordinadora": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Contacts": "xavier.martinez@eurecat.org",
            "Image": "83",
            "Imágenes sin repeticiones": "6"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[4,000-150,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "high",
              "Potential application of the second hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            },
            "Company name": "Universida de Universidade Federal do Rio Grande do Su",
            "Name of the project": "-",
            "Entity": "University",
            "website": "http://www.ufrgs.br/ufrgs/inicial",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Study on Potassium Permanganate Chemical Treatment of Discarded Reverse Osmosis Membranes Aiming their Reuse",
            "Main results /products": "https://www.tandfonline.com/doi/abs/10.1080/01496395.2012.745876",
            "Dirección postal entidad coordinadora": "Laboratory ofMembrane Separation Processes, Department of Chemical Engineering,  Universidade Federal do Rio Grande do Sul, Porto Alegre, Brazil",
            "Contacts": "alan.ambrosi@gmail.com",
            "Image": "84",
            "Imágenes sin repeticiones": "14"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[30,000-400,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Waste water treatment",
            },
            "Company name": "Universidad de Las Palmas de Gran Canaria (ULPGC)",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.ulpgc.es/node ",
            "Type of end-of-life membranes": "Reverse osmosis -spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "reusing old seawater RO membranes in wastewater, conversion to a type of microfiltration membrane",
            "Main results /products": "https://www.sciencedirect.com/science/article/pii/S0011916403003849 ; https://www.sciencedirect.com/science/article/pii/S0011916402009773",
            "Dirección postal entidad coordinadora": "Departemento de Ingenieria de Procesos, Universidad de Las Palmas de Gran Canaria (ULPGC), Campus Tafira Baja, E-35017 Las Palmas de Gran Canaria, Spain ",
            "Contacts": "jveza@dip.ulpgc.es",
            "Image": "85",
            "Imágenes sin repeticiones": "15"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[30,000-400,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Not focus on application but on producing UF-like membranes to be reused",
            },
            "Company name": "UNSW,UNESCO",
            "Name of the project": "-",
            "Entity": "University & Research center",
            "website": "https://www.unsw.edu.au/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Production and characterisation of UF membranes by chemical conversion of used RO membranes",
            "Main results /products": "https://doi.org/10.1016/j.memsci.2013.07.015",
            "Dirección postal entidad coordinadora": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Contacts": "p.le-clech@unsw.edu.au",
            "Image": "86",
            "Imágenes sin repeticiones": "16"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[30,000-400,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Life cycle assessment of the recycling process ",
            },
            "Company name": "UNSW,UNESCO",
            "Name of the project": "-",
            "Entity": "University & Research center",
            "website": "https://www.unsw.edu.au/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Comparative life cycle assessment of end-of-life options for reverse osmosis membranes",
            "Main results /products": "https://doi.org/10.1016/j.desal.2014.10.013",
            "Dirección postal entidad coordinadora": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Contacts": "p.le-clech@unsw.edu.au",
            "Image": "87",
            "Imágenes sin repeticiones": "17"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[30,000-400,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Sea water pretreatment ",
            },
            "Company name": "SACYR and IMDEA Agua",
            "Name of the project": "Life-Transfomem - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.life-transfomem.eu/publications/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Life-Transfomem project. Production of recycled UF membranes for seawater treatment as substitution of standard sand filtration",
            "Main results /products": "https://www.youtube.com/watch?v=DPp8uYN-iT8&feature=youtu.be",
            "Dirección postal entidad coordinadora": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "88",
            "Imágenes sin repeticiones": "18"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[30,000-400,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Waste water treatment",
            },
            "Company name": "SACYR and IMDEA Agua",
            "Name of the project": "Life-Transfomem - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.life-transfomem.eu/publications/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Life-Transfomem project. Production of recycled UF membranes for wastewater treatment. Spiral-wound, semiopened and star configurations",
            "Main results /products": "https://drive.google.com/file/d/1AZxH825pFNvNKMYyNBoTDKOu80dR2DL4/view",
            "Dirección postal entidad coordinadora": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "89",
            "Imágenes sin repeticiones": "19"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[30,000-400,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Life cycle and economical assessment of the recycling process ",
            },
            "Company name": "IMDEA Agua",
            "Name of the project": "Life-Transfomem",
            "Entity": "Public institutions",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Recycling of end-of-life reverse osmosis membranes: Comparative LCA and cost-effectiveness analysis at pilot scale",
            "Main results /products": "https://doi.org/10.1016/j.resconrec.2019.104423",
            "Dirección postal entidad coordinadora": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "90",
            "Imágenes sin repeticiones": "9"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[30,000-400,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Economical Evaluation of the recycling process",
            },
            "Company name": "Federal University of Minas Gerais",
            "Name of the project": "University",
            "Entity": "https://www.ufmg.br/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Environmental and economic evaluation of end-of-life reverse osmosis membranes recycling by means of chemical conversion",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0959652618314355#!",
            "Main results /products": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Dirección postal entidad coordinadora": "ecoutinho@desa.ufmg.br",
            "Contacts": "91",
            "Image": "20"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[30,000-400,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Wastewater treatment",
            },
            "Company name": "Eurecat",
            "Name of the project": "H2020 Nextgen - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "https://nextgenwater.eu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recyed UF membrane ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Nextgenwater project: Application of recyed UF membrane for water reclaiming",
            "Main results /products": "https://nextgenwater.eu/demonstration-cases/costa-brava-region/",
            "Dirección postal entidad coordinadora": "Gelderlandhaven 7D, 3433 PG Nieuwegein, Netherlands",
            "Contacts": "Jos.Frijns@kwrwater.nl",
            "Image": "92",
            "Imágenes sin repeticiones": "21"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[30,000-400,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Urban wastewater",
            },
            "Company name": "Eurecat",
            "Entity": "Public institutions",
            "website": "https://eurecat.org/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recyed UF membrane ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Regireu project: Application of recycled membranes for treating urban wastewater",
            "Main results /products": "https://eurecat.org/es/portfolio-items/regireu/",
            "Dirección postal entidad coordinadora": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Contacts": "xavier.martinez@eurecat.org",
            "Image": "93",
            "Imágenes sin repeticiones": "22"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[30,000-400,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "Industrial wastewater",
            },
            "Company name": "Eurecat",
            "Name of the project": "Public institutions",
            "Entity": "https://eurecat.org/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recycled RO/NF/UF membranes ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            "Main Investigation": "https://eurecat.org/es/portfolio-items/eflucomp/",
            "Main results /products": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Dirección postal entidad coordinadora": "xavier.martinez@eurecat.org",
            "Contacts": "94",
            "Image": "6"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Landfill leachate water treatment",
              "Specific application of second-hand membranes": "University of Girona and Telwe S.A.",
            },
            "Company name": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Name of the project": "Public institutions & Private Companies",
            "Entity": "http://www.lequia.udg.edu/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Preparing for reuse & Direct reuse",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Mem2.0: Landfill leachate water treatment using end-of-life RO and regenerated membranes",
            "Main Investigation": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Main results /products": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Dirección postal entidad coordinadora": " joaquim.comas@udg.edu ",
            "Contacts": "95",
            "Image": "7"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "AquaTip",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "https://aquatip.com.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse ",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Collecting unwanted or used Reverse Osmosis membranes from water treatment plants with the aim to dispose, recycle, or repurpose them for a different application",
            "Main Investigation": "https://aquatip.com.au/services/",
            "Main results /products": "Sydney, Australia",
            "Dirección postal entidad coordinadora": "director@aquatip.com.au",
            "Contacts": "96",
            "Image": "23"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "WaterSurplus",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "http://www.watersurplus.com/ ",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Cleans, tests, repackages, and repurposes used RO, UF and NF membranes and associated equipment at significant cost savings to the user",
            "Main Investigation": "https://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch\nhttps://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch\n",
            "Main results /products": "726 Beacon Street, 61111, Loves Park, IL ",
            "Dirección postal entidad coordinadora": "sales@watersurplus.com",
            "Contacts": "97",
            "Image": "2"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "Avanale water solution",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "https://www.pacificwatertreatment.com/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Refurbishment of old equipment supply of RO membranes",
            "Main Investigation": "https://www.pacificwatertreatment.com/refurbishments-service",
            "Main results /products": "PO Box 5869 Manly, Australia, 4179",
            "Dirección postal entidad coordinadora": "phil@avanale.com.au",
            "Contacts": "98",
            "Image": "3"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "Membrane Services",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "http://www.membraneservices.com/ ",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "End-of-life RO membranes examination, cleaning and repackaging",
            "Main Investigation": "http://www.membraneservices.com/Recycled_Membranes.html",
            "Main results /products": "Membrane Services, LLC 10385 Commerce Row Suite C Montgomery, Texas 77356",
            "Dirección postal entidad coordinadora": "http://membraneservices.com/Contact_Us.html",
            "Contacts": "99",
            "Image": "4"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Brackish water treatment for irrigation",
              "Specific application of second-hand membranes": "IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Validation of recycled membranes for treating brackish water at pilot scale",
            "Main Investigation": "https://doi.org/10.1016/j.desal.2017.12.034",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "100",
            "Image": "8"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "Centre d’Etude et de Recherche de Djibouti (CERD)",
            },
            "Company name": "-",
            "Name of the project": "Research center",
            "Entity": "http://www.cerd.dj/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Wastewater reclamation using discarded reverse osmosis membranes for reuse in irrigation in Djibouti, an arid country",
            "Main Investigation": "https://www.ncbi.nlm.nih.gov/pubmed/23508163",
            "Main results /products": "Centre d’Etude et de Recherche de Djibouti (CERD), Djibouti",
            "Dirección postal entidad coordinadora": "awaleh@gmail.com",
            "Contacts": "101",
            "Image": "24"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Synthetic water",
              "Specific application of second-hand membranes": "Advanced Water Management Centre (The University of Queensland)",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "http://www.awmc.uq.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Virus removal (MS2 phage) and four membrane integrity indicators (salt, dissolved organic matter, rhodamine WT and sulphateand) in aged RO membranes ",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0043135415304206",
            "Main results /products": "Advanced Water Management Centre, The University of Queensland, Brisbane, QLD 4072, Australia",
            "Dirección postal entidad coordinadora": "m.pype@awmc.uq.edu.au",
            "Contacts": "102",
            "Image": "25"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Brackish water treatment for irrigation",
              "Specific application of second-hand membranes": "IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Validation of recycled membranes for treating brackish water at pilot scale",
            "Main Investigation": "https://doi.org/10.1016/j.desal.2017.12.034",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "103",
            "Image": "8"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Brackish water",
              "Specific application of second-hand membranes": "Université de Nantes",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "-",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Lab/Pilot",
            "Scale of implementation": "Reuse of end-of-life RO membranes as NF membranes",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0011916409013204",
            "Main results /products": "GEPEA, UMR CNRS 6144, Université de Nantes, 37 Bd. de l&apos;université, CRTT BP406, 44602 Saint-Nazaire, France",
            "Dirección postal entidad coordinadora": "maxime.pontie@univ-angers.fr",
            "Contacts": "104",
            "Image": "26"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "Universidad de Las Palmas de Gran Canaria (ULPGC)",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "https://www.ulpgc.es/node ",
            "website": "Reverse osmosis -spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "reusing old seawater RO membranes in wastewater, conversion to a type of microfiltration membrane",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0011916403003849 ; https://www.sciencedirect.com/science/article/pii/S0011916402009773",
            "Main results /products": "Departemento de Ingenieria de Procesos, Universidad de Las Palmas de Gran Canaria (ULPGC), Campus Tafira Baja, E-35017 Las Palmas de Gran Canaria, Spain ",
            "Dirección postal entidad coordinadora": "jveza@dip.ulpgc.es",
            "Contacts": "105",
            "Image": "15"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Not focus on application but on producing UF-like membranes to be reused",
              "Specific application of second-hand membranes": "UNSW,UNESCO",
            },
            "Company name": "-",
            "Name of the project": "University & Research center",
            "Entity": "https://www.unsw.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Production and characterisation of UF membranes by chemical conversion of used RO membranes",
            "Main Investigation": "https://doi.org/10.1016/j.memsci.2013.07.015",
            "Main results /products": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Dirección postal entidad coordinadora": "p.le-clech@unsw.edu.au",
            "Contacts": "106",
            "Image": "16"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Life cycle assessment of the recycling process ",
              "Specific application of second-hand membranes": "UNSW,UNESCO",
            },
            "Company name": "-",
            "Name of the project": "University & Research center",
            "Entity": "https://www.unsw.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Comparative life cycle assessment of end-of-life options for reverse osmosis membranes",
            "Main Investigation": "https://doi.org/10.1016/j.desal.2014.10.013",
            "Main results /products": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Dirección postal entidad coordinadora": "p.le-clech@unsw.edu.au",
            "Contacts": "107",
            "Image": "17"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Sea water pretreatment ",
              "Specific application of second-hand membranes": "SACYR and IMDEA Agua",
              "Company name": "Life-Transfomem - Consortium",
            },
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.life-transfomem.eu/publications/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Life-Transfomem project. Production of recycled UF membranes for seawater treatment as substitution of standard sand filtration",
            "Main Investigation": "https://www.youtube.com/watch?v=DPp8uYN-iT8&feature=youtu.be",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "108",
            "Image": "18"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "SACYR and IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.life-transfomem.eu/publications/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Life-Transfomem project. Production of recycled UF membranes for wastewater treatment. Spiral-wound, semiopened and star configurations",
            "Main Investigation": "https://drive.google.com/file/d/1AZxH825pFNvNKMYyNBoTDKOu80dR2DL4/view",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "109",
            "Image": "19"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Life cycle and economical assessment of the recycling process ",
              "Specific application of second-hand membranes": "IMDEA Agua",
            },
            "Company name": "Life-Transfomem",
            "Name of the project": "Public institutions",
            "Entity": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Recycling of end-of-life reverse osmosis membranes: Comparative LCA and cost-effectiveness analysis at pilot scale",
            "Main Investigation": "https://doi.org/10.1016/j.resconrec.2019.104423",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "110",
            "Image": "15"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Economical Evaluation of the recycling process",
              "Specific application of second-hand membranes": "Federal University of Minas Gerais",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "https://www.ufmg.br/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Environmental and economic evaluation of end-of-life reverse osmosis membranes recycling by means of chemical conversion",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0959652618314355#!",
            "Main results /products": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Dirección postal entidad coordinadora": "ecoutinho@desa.ufmg.br",
            "Contacts": "111",
            "Image": "20"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Wastewater treatment",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Company name": "H2020 Nextgen - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "https://nextgenwater.eu/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recyed UF membrane ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Nextgenwater project: Application of recyed UF membrane for water reclaiming",
            "Main Investigation": "https://nextgenwater.eu/demonstration-cases/costa-brava-region/",
            "Main results /products": "Gelderlandhaven 7D, 3433 PG Nieuwegein, Netherlands",
            "Dirección postal entidad coordinadora": "Jos.Frijns@kwrwater.nl",
            "Contacts": "112",
            "Image": "21"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Urban wastewater",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Name of the project": "Public institutions",
            "Entity": "https://eurecat.org/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recyed UF membrane ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Regireu project: Application of recycled membranes for treating urban wastewater",
            "Main Investigation": "https://eurecat.org/es/portfolio-items/regireu/",
            "Main results /products": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Dirección postal entidad coordinadora": "xavier.martinez@eurecat.org",
            "Contacts": "113",
            "Image": "22"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Industrial wastewater",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Company name": "-",
            "Name of the project": "Public institutions",
            "Entity": "https://eurecat.org/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recycled RO/NF/UF membranes ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            "Main Investigation": "https://eurecat.org/es/portfolio-items/eflucomp/",
            "Main results /products": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Dirección postal entidad coordinadora": "xavier.martinez@eurecat.org",
            "Contacts": "114",
            "Image": "6"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Landfill leachate water treatment",
              "Specific application of second-hand membranes": "University of Girona and Telwe S.A.",
            },
            "Company name": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Name of the project": "Public institutions & Private Companies",
            "Entity": "http://www.lequia.udg.edu/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Preparing for reuse & Direct reuse",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Mem2.0: Landfill leachate water treatment using end-of-life RO and regenerated membranes",
            "Main Investigation": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Main results /products": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Dirección postal entidad coordinadora": " joaquim.comas@udg.edu ",
            "Contacts": "115",
            "Image": "7"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "AquaTip",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "https://aquatip.com.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse ",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Collecting unwanted or used Reverse Osmosis membranes from water treatment plants with the aim to dispose, recycle, or repurpose them for a different application",
            "Main Investigation": "https://aquatip.com.au/services/",
            "Main results /products": "Sydney, Australia",
            "Dirección postal entidad coordinadora": "director@aquatip.com.au",
            "Contacts": "116",
            "Image": "23"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "WaterSurplus",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "http://www.watersurplus.com/ ",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Cleans, tests, repackages, and repurposes used RO, UF and NF membranes and associated equipment at significant cost savings to the user",
            "Main Investigation": "https://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch\nhttps://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch\n",
            "Main results /products": "726 Beacon Street, 61111, Loves Park, IL ",
            "Dirección postal entidad coordinadora": "sales@watersurplus.com",
            "Contacts": "117",
            "Image": "2"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "Avanale water solution",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "https://www.pacificwatertreatment.com/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "Refurbishment of old equipment supply of RO membranes",
            "Main Investigation": "https://www.pacificwatertreatment.com/refurbishments-service",
            "Main results /products": "PO Box 5869 Manly, Australia, 4179",
            "Dirección postal entidad coordinadora": "phil@avanale.com.au",
            "Contacts": "118",
            "Image": "3"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
              "Specific application of second-hand membranes": "Membrane Services",
            },
            "Company name": "-",
            "Name of the project": "Private Company",
            "Entity": "http://www.membraneservices.com/ ",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse and preparing for reuse",
            "Research  - Business activity": "Industrial",
            "Scale of implementation": "End-of-life RO membranes examination, cleaning and repackaging",
            "Main Investigation": "http://www.membraneservices.com/Recycled_Membranes.html",
            "Main results /products": "Membrane Services, LLC 10385 Commerce Row Suite C Montgomery, Texas 77356",
            "Dirección postal entidad coordinadora": "http://membraneservices.com/Contact_Us.html",
            "Contacts": "119",
            "Image": "4"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Brackish water treatment for irrigation",
              "Specific application of second-hand membranes": "IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab/Pilot",
            "Scale of implementation": "Validation of recycled membranes for treating brackish water at pilot scale",
            "Main Investigation": "https://doi.org/10.1016/j.desal.2017.12.034",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "120",
            "Image": "8"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "Centre d’Etude et de Recherche de Djibouti (CERD)",
            },
            "Company name": "-",
            "Name of the project": "Research center",
            "Entity": "http://www.cerd.dj/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Wastewater reclamation using discarded reverse osmosis membranes for reuse in irrigation in Djibouti, an arid country",
            "Main Investigation": "https://www.ncbi.nlm.nih.gov/pubmed/23508163",
            "Main results /products": "Centre d’Etude et de Recherche de Djibouti (CERD), Djibouti",
            "Dirección postal entidad coordinadora": "awaleh@gmail.com",
            "Contacts": "121",
            "Image": "24"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as reverse osmosis membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Skilled crew for the production of second-hand membrane production ": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (instalation in the second stage of the process, seawater process to treat the concentrate",
              "Potential application of the second hand membranes": "Synthetic water",
              "Specific application of second-hand membranes": "Advanced Water Management Centre (The University of Queensland)",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "http://www.awmc.uq.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Virus removal (MS2 phage) and four membrane integrity indicators (salt, dissolved organic matter, rhodamine WT and sulphateand) in aged RO membranes ",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0043135415304206",
            "Main results /products": "Advanced Water Management Centre, The University of Queensland, Brisbane, QLD 4072, Australia",
            "Dirección postal entidad coordinadora": "m.pype@awmc.uq.edu.au",
            "Contacts": "122",
            "Image": "25"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Potential application of the second hand membranes": "Brackish water treatment for irrigation",
              "Specific application of second-hand membranes": "IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Validation of recycled membranes for treating brackish water at pilot scale",
            "Main Investigation": "https://doi.org/10.1016/j.desal.2017.12.034",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "123",
            "Image": "8"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
              "Potential application of the second hand membranes": "Brackish water",
              "Specific application of second-hand membranes": "Université de Nantes",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "-",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct reuse",
            "Research  - Business activity": "Lab/Pilot",
            "Scale of implementation": "Reuse of end-of-life RO membranes as NF membranes",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0011916409013204",
            "Main results /products": "GEPEA, UMR CNRS 6144, Université de Nantes, 37 Bd. de l&apos;université, CRTT BP406, 44602 Saint-Nazaire, France",
            "Dirección postal entidad coordinadora": "maxime.pontie@univ-angers.fr",
            "Contacts": "124",
            "Image": "26"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "Universidad de Las Palmas de Gran Canaria (ULPGC)",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "https://www.ulpgc.es/node ",
            "website": "Reverse osmosis -spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "reusing old seawater RO membranes in wastewater, conversion to a type of microfiltration membrane",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0011916403003849 ; https://www.sciencedirect.com/science/article/pii/S0011916402009773",
            "Main results /products": "Departemento de Ingenieria de Procesos, Universidad de Las Palmas de Gran Canaria (ULPGC), Campus Tafira Baja, E-35017 Las Palmas de Gran Canaria, Spain ",
            "Dirección postal entidad coordinadora": "jveza@dip.ulpgc.es",
            "Contacts": "125",
            "Image": "15"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Not focus on application but on producing UF-like membranes to be reused",
              "Specific application of second-hand membranes": "UNSW,UNESCO",
            },
            "Company name": "-",
            "Name of the project": "University & Research center",
            "Entity": "https://www.unsw.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Production and characterisation of UF membranes by chemical conversion of used RO membranes",
            "Main Investigation": "https://doi.org/10.1016/j.memsci.2013.07.015",
            "Main results /products": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Dirección postal entidad coordinadora": "p.le-clech@unsw.edu.au",
            "Contacts": "126",
            "Image": "16"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Life cycle assessment of the recycling process ",
              "Specific application of second-hand membranes": "UNSW,UNESCO",
            },
            "Company name": "-",
            "Name of the project": "University & Research center",
            "Entity": "https://www.unsw.edu.au/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Comparative life cycle assessment of end-of-life options for reverse osmosis membranes",
            "Main Investigation": "https://doi.org/10.1016/j.desal.2014.10.013",
            "Main results /products": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Dirección postal entidad coordinadora": "p.le-clech@unsw.edu.au",
            "Contacts": "127",
            "Image": "17"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Sea water pretreatment ",
              "Specific application of second-hand membranes": "SACYR and IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.life-transfomem.eu/publications/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Life-Transfomem project. Production of recycled UF membranes for seawater treatment as substitution of standard sand filtration",
            "Main Investigation": "https://www.youtube.com/watch?v=DPp8uYN-iT8&feature=youtu.be",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "128",
            "Image": "18"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "SACYR and IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.life-transfomem.eu/publications/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Life-Transfomem project. Production of recycled UF membranes for wastewater treatment. Spiral-wound, semiopened and star configurations",
            "Main Investigation": "https://drive.google.com/file/d/1AZxH825pFNvNKMYyNBoTDKOu80dR2DL4/view",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "129",
            "Image": "19"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Life cycle and economical assessment of the recycling process ",
              "Specific application of second-hand membranes": "IMDEA Agua",
            },
            "Company name": "Life-Transfomem",
            "Name of the project": "Public institutions",
            "Entity": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Recycling of end-of-life reverse osmosis membranes: Comparative LCA and cost-effectiveness analysis at pilot scale",
            "Main Investigation": "https://doi.org/10.1016/j.resconrec.2019.104423",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "130",
            "Image": "9"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Economical Evaluation of the recycling process",
              "Specific application of second-hand membranes": "Federal University of Minas Gerais",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "https://www.ufmg.br/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab",
            "Scale of implementation": "Environmental and economic evaluation of end-of-life reverse osmosis membranes recycling by means of chemical conversion",
            "Main Investigation": "https://www.sciencedirect.com/science/article/pii/S0959652618314355#!",
            "Main results /products": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Dirección postal entidad coordinadora": "ecoutinho@desa.ufmg.br",
            "Contacts": "131",
            "Image": "20"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Wastewater treatment",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Company name": "H2020 Nextgen - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "https://nextgenwater.eu/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recyed UF membrane ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Nextgenwater project: Application of recyed UF membrane for water reclaiming",
            "Main Investigation": "https://nextgenwater.eu/demonstration-cases/costa-brava-region/",
            "Main results /products": "Gelderlandhaven 7D, 3433 PG Nieuwegein, Netherlands",
            "Dirección postal entidad coordinadora": "Jos.Frijns@kwrwater.nl",
            "Contacts": "132",
            "Image": "21"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Urban wastewater",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Name of the project": "Public institutions",
            "Entity": "https://eurecat.org/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recyed UF membrane ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Regireu project: Application of recycled membranes for treating urban wastewater",
            "Main Investigation": "https://eurecat.org/es/portfolio-items/regireu/",
            "Main results /products": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Dirección postal entidad coordinadora": "xavier.martinez@eurecat.org",
            "Contacts": "133",
            "Image": "22"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis sea model design",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[42-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low ",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Industrial wastewater",
              "Specific application of second-hand membranes": "Eurecat",
            },
            "Company name": "-",
            "Name of the project": "Public institutions",
            "Entity": "https://eurecat.org/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Application of recycled RO/NF/UF membranes ",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            "Main Investigation": "https://eurecat.org/es/portfolio-items/eflucomp/",
            "Main results /products": "Parc Científic i de la Innovació TecnoCampus, Av. de Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Dirección postal entidad coordinadora": "xavier.martinez@eurecat.org",
            "Contacts": "134",
            "Image": "6"
          },
          {
            code: {
              "Type of RO membrane": "Nanofiltration membranes",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as nanofiltration membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 2,500 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membrane production ": "medium",
              "Potential application of the second hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
              "Specific application of second-hand membranes": "Not focus on application but on preparing NF membranes to be reused",
            },
            "Company name": "WaterSurplus",
            "Name of the project": "-",
            "Entity": "Private Company",
            "website": "http://www.watersurplus.com/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Preparing for reuse",
            "Scale of implementation": "Industrial",
            "Main Investigation": "Cleans, tests, repackages, and repurposes used RO, UF and NF membranes and associated equipment at significant cost savings to the user",
            "Main results /products": "http://www.watersurplus.com/watersurplus-profile.cfm",
            "Dirección postal entidad coordinadora": "726 Beacon Street, 61111, Loves Park, IL ",
            "Contacts": "sales@watersurplus.com",
            "Image": "135",
            "Imágenes sin repeticiones": "2"
          },
          {
            code: {
              "Type of RO membrane": "Nanofiltration membranes",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[2,500-25,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membrane production ": "low ",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "treatment application",
            },
            "Company name": "Federal University of Minas Gerais",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.ufmg.br/",
            "Type of end-of-life membranes": "Nanofiltration",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab / Pilot",
            "Main Investigation": "Bench and pilot scale performance assessment of recycled membrane converted from old nanofiltration membranes",
            "Main results /products": "https://doi.org/10.1080/09593330.2018.1526218",
            "Dirección postal entidad coordinadora": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Contacts": "ecoutinho@desa.ufmg.br",
            "Image": "136",
            "Imágenes sin repeticiones": "30"
          },
          {
            code: {
              "Type of RO membrane": "Nanofiltration membranes",
              "Permeability": "<1-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membrane production ": "low",
              "Potential application of the second hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Specific application of second-hand membranes": "treatment application",
            },
            "Company name": "Federal University of Minas Gerais",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.ufmg.br/",
            "Type of end-of-life membranes": "Nanofiltration",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab / Pilot",
            "Main Investigation": "Bench and pilot scale performance assessment of recycled membrane converted from old nanofiltration membranes",
            "Main results /products": "https://doi.org/10.1080/09593330.2018.1526218",
            "Dirección postal entidad coordinadora": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Contacts": "ecoutinho@desa.ufmg.br",
            "Image": "137",
            "Imágenes sin repeticiones": "30"
          },
          {
            code: {
              "Type of RO membrane": "Nanofiltration membranes",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
            },
            "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
            "Contacts": "-"
          },
          {
            code: {
              "Type of RO membrane": "Nanofiltration membranes",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
            },
            "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
            "Contacts": "-"
          },
          {
            code: {
              "Type of RO membrane": "Nanofiltration membranes",
              "Permeability": "[1-5]-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "treatment application",
              "Specific application of second-hand membranes": "Federal University of Minas Gerais",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "https://www.ufmg.br/",
            "website": "Nanofiltration",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab / Pilot",
            "Scale of implementation": "Bench and pilot scale performance assessment of recycled membrane converted from old nanofiltration membranes",
            "Main Investigation": "https://doi.org/10.1080/09593330.2018.1526218",
            "Main results /products": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Dirección postal entidad coordinadora": "ecoutinho@desa.ufmg.br",
            "Contacts": "138",
            "Image": "30"
          },
          {
            code: {
              "Type of RO membrane": "Nanofiltration membranes",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<15% comparing to the design value",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
            },
            "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
            "Contacts": "-"
          },
          {
            code: {
              "Type of RO membrane": "Nanofiltration membranes",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": ">10% of NaCl and >30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Reuse as nanofiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "high +++",
              "Potential environmental reduction for the production of second-hand membranes": "0",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high +++",
              "Potential economical saving for the production of second-hand membranes, qualitative": "Not required",
            },
            "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas",
            "Contacts": "-"
          },
          {
            code: {
              "Type of RO membrane": "Nanofiltration membranes",
              "Permeability": "> 5-fold comparing to the design value",
              "% Salt rejection": "<10% of NaCl and <30% of MgSO4",
              "Alternative end-of-life RO membrane management recommended": "Recycling into ultrafiltration-like membranes",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "[32-63]",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "low",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "treatment application",
              "Specific application of second-hand membranes": "Federal University of Minas Gerais",
            },
            "Company name": "-",
            "Name of the project": "University",
            "Entity": "https://www.ufmg.br/",
            "website": "Nanofiltration",
            "Type of end-of-life membranes": "Direct recycling",
            "Research  - Business activity": "Lab / Pilot",
            "Scale of implementation": "Bench and pilot scale performance assessment of recycled membrane converted from old nanofiltration membranes",
            "Main Investigation": "https://doi.org/10.1080/09593330.2018.1526218",
            "Main results /products": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Dirección postal entidad coordinadora": "ecoutinho@desa.ufmg.br",
            "Contacts": "139",
            "Image": "30"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis membranes",
              "Alternative end-of-life RO membrane management recommended": "Indirect recycling",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": ">63",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water). It requires taking out the fiber glass casing",
              "Potential application of the second hand membranes": "Waste water treatment",
              "Specific application of second-hand membranes": "SACYR and IMDEA Agua",
            },
            "Company name": "Life-Transfomem - Consortium",
            "Name of the project": "Private Companies & Public institutions",
            "Entity": "http://www.life-transfomem.eu/publications/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Indirect recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Life-Transfomem project. Production of recycled UF membranes for wastewater treatment. Spiral-wound, semiopened and star configurations",
            "Main Investigation": "https://drive.google.com/file/d/1AZxH825pFNvNKMYyNBoTDKOu80dR2DL4/view",
            "Main results /products": "IMDEA WATER. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Dirección postal entidad coordinadora": "membranas.agua@imdea.org",
            "Contacts": "140",
            "Image": "19"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis membranes",
              "Alternative end-of-life RO membrane management recommended": "Indirect recycling",
            },
            survey2_result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": ">63",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "high",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high",
              "Skilled crew for the production of second-hand membrane production ": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)",
              "Potential application of the second hand membranes": "Synthetic river water",
              "Specific application of second-hand membranes": "University of Girona and University (Spain)  of New South Wales (Australia)",
            },
            "Company name": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Name of the project": "Public institutions",
            "Entity": "http://www.lequia.udg.edu/",
            "website": "Reverse osmosis - spiral wound",
            "Type of end-of-life membranes": "Indirect recycling",
            "Research  - Business activity": "Pilot",
            "Scale of implementation": "Mem2.0: Novel membrane housing designs for gravity-driven NF and UF recycled membrane-based systems",
            "Main Investigation": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Main results /products": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Dirección postal entidad coordinadora": " joaquim.comas@udg.edu ",
            "Contacts": "141",
            "Image": "31"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis membranes",
              "Alternative end-of-life RO membrane management recommended": "Indirect recycling",
            },
            survey2_result: {
              "Specific application of second-hand membranes": "Recycling of membrane components",
            },
            "Company name": "IMDEA Agua",
            "Name of the project": "INREMEM - Consortium",
            "Entity": "Research center & University",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "INREMEM project: innovation and recycling membranes  for water filtration(UF-MBR, FO, electrodyalisis, support)",
            "Main results /products": "http://inremem.simplesite.com/",
            "Dirección postal entidad coordinadora": "IMDEA Water. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "142",
            "Imágenes sin repeticiones": "32"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis membranes",
              "Alternative end-of-life RO membrane management recommended": "Indirect recycling",
            },
            survey2_result: {
              "Specific application of second-hand membranes": "Recycling of membrane components",
            },
            "Company name": "IMDEA Agua",
            "Name of the project": "INREMEM - Consortium",
            "Entity": "Research center & University",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Circular economy in membrane technology: using end-of-life reverse osmosis modules for preparation of recycled anion exchange membranes and validation in electrodialysis.",
            "Main results /products": "https://doi.org/10.1016/j.memsci.2019.117423",
            "Dirección postal entidad coordinadora": "IMDEA Water. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "143",
            "Imágenes sin repeticiones": "33"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis membranes",
              "Alternative end-of-life RO membrane management recommended": "Indirect recycling",
            },
            survey2_result: {
              "Specific application of second-hand membranes": "Recycling of membrane components",
            },
            "Company name": "IMDEA Agua",
            "Name of the project": "INREMEM - Consortium",
            "Entity": "Research center & University",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Recycled desalination membranes as a support material for biofilm development: A new approach for microcystin removal during water treatment",
            "Main results /products": "http://dx.doi.org/10.1016/j.scitotenv.2018.07.435",
            "Dirección postal entidad coordinadora": "IMDEA Water. Avenida Punto Com. n°2. 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org",
            "Image": "144",
            "Imágenes sin repeticiones": "34"
          },
          {
            code: {
              "Type of RO membrane": "Ceramic membranes",
              "Alternative end-of-life RO membrane management recommended": "Indirect recycling",
            },
            survey2_result: {
              "Specific application of second-hand membranes": "Recycling of membrane components",
            },
            "Company name": "FACSA",
            "Name of the project": "H2020 - Remeb - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.remeb-h2020.com/about-us/",
            "Type of end-of-life membranes": "Ceramic membranes",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Industrial",
            "Main Investigation": "H2020 Remeb. Implementation and validation of a low cost recycled ceramic membrane bioreactor (MBR) for water reuse in a Wastewater Treatment Plant (WWTP)",
            "Main results /products": "http://www.remeb-h2020.com/project-progress/",
            "Dirección postal entidad coordinadora": "12003 Castellón de la Plana. Castellón Spain",
            "Contacts": "ezuriaga@facsa.com",
            "Image": "145",
            "Imágenes sin repeticiones": "35"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis membranes",
              "Alternative end-of-life RO membrane management recommended": "Indirect recycling",
            },
            survey2_result: {
              "Specific application of second-hand membranes": "Recycling of membrane components",
            },
            "Company name": "MEMRE",
            "Name of the project": "MemRe GmbH Co.",
            "Entity": "Private Company",
            "website": "http://www.memre.de ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Industrial",
            "Main Investigation": "end-of-life membranes transportation and labeling, from the pickup on site until the recycling plant and special services for radioactive contaminated membranes if requested",
            "Main results /products": "https://www.dme-gmbh.de/new-founded-company-memre-gmbh/",
            "Dirección postal entidad coordinadora": "Memre. Achert 677889, Seebach,Germany ",
            "Contacts": "kontakt@memre.de",
            "Image": "146",
            "Imágenes sin repeticiones": "36"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis membranes",
              "Alternative end-of-life RO membrane management recommended": "Indirect recycling",
            },
            survey2_result: {
              "Specific application of second-hand membranes": "Recycling of membrane components",
            },
            "Company name": "Universite ́de Nantes",
            "Name of the project": "-",
            "Entity": "University",
            "website": "http://www.univ-nantes.fr/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Lab/Pilot",
            "Main Investigation": "Old RO membranes: solutions for reuse",
            "Main results /products": "https://www.tandfonline.com/doi/abs/10.1080/19443994.2014.943060",
            "Dirección postal entidad coordinadora": "GEPEA, UMR CNRS 6144, Universite ́de Nantes, 37 Bd. de l’universite ́, CRTT BP406, 44602 Saint-Nazaire, France",
            "Contacts": "maxime.pontie@univ-angers.fr",
            "Image": "147",
            "Imágenes sin repeticiones": "37"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis membranes",
              "Alternative end-of-life RO membrane management recommended": "Indirect recycling",
            },
            survey2_result: {
              "Specific application of second-hand membranes": "Recycling of membrane components",
            },
            "Company name": "Angers University, GEIHP",
            "Name of the project": "Angers University, GEIHP",
            "Entity": "University",
            "website": "http://www.univ-angers.fr/fr/recherche/poles-et-unites/pole-sante/geihp.html ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling & energy recovery",
            "Scale of implementation": "Lab/Pilot",
            "Main Investigation": "Recycling and energy recovery solutions of end-of-life reverse osmosis (RO) membrane materials: A sustainable approach",
            "Main results /products": "https://www.sciencedirect.com/science/article/pii/S0011916417301042 ",
            "Dirección postal entidad coordinadora": "COMUE UBL, Angers University, GEIHP, EA3142, 4 rue Larrey, CHU - IBS, 49933 Angers 09, France",
            "Contacts": "maxime.pontie@univ-angers.fr",
            "Image": "148",
            "Imágenes sin repeticiones": "38"
          },
          {
            code: {
              "Type of RO membrane": "Reverse osmosis membranes",
              "Alternative end-of-life RO membrane management recommended": "Indirect recycling",
            },
            survey2_result: {
              "Specific application of second-hand membranes": "Recycling of membrane components",
            },
            "Company name": "University Complutense of Madrid",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.ucm.es/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Interfacial polymerization study for recycling RO membranes in FO wastewater treatment; Recycling RO membranes for the treatment of high saline solutions by membrane distillation ",
            "Main results /products": "EUROMEMBRANE 2018 CONGRESS: POSTER (N-404) (N-600)",
            "Dirección postal entidad coordinadora": "Department of Applied Physics I, Faculty of Physics, University Complutense of Madrid, Avda. Complutense s/n, 28040 Madrid, Spain",
            "Contacts": "mcgpayo@ucm.es",
            "Image": "149",
            "Imágenes sin repeticiones": "39"
          }



        ],
        available_solutions: [
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


        ],
      }
    },
    methods: {
      get_question_by_code(code) {
        return this.questions.find(q => q.code == code);
      },
      clearValues() {
        this.questions.forEach(function (item) {
          item.value = null;
        });
        console.log("all values cleared: ", this.questions);
      },
      //frontend
      get_membrane_reuse_color() {
        let code = this.get_membrane_reuse();
        let reuse = this.membrane_reuse_options.find(o => o.code == code);
        if (reuse) return reuse.color;
        else return "";
      },
      get_membrane_reuse_option_by_code(code) {
        if (code) {
          let option = this.membrane_reuse_options.find(o => o.code == code);
          return option.name;
        }
        return "answer survey 1 to get a membrane reuse";
      },
      show_membrane_reuse() {
        let code = this.get_membrane_reuse();
        return this.get_membrane_reuse_option_by_code(code);
      },
      is_rendered(question) {
        let code = question.code;
        if (code == "WT") {
          if (this.get_question_by_code('F').value == "Don't know") return true;
          return false;
        }
        return true;
      },
      is_disabled(question) {
        let code = question.code;
        if (code == "PV" || code == "R") {
          if (this.available_solutions.find(s => s.code === "LI") || this.available_solutions.find(s => s.code === "IR")) {
            return true;
          }
        }
        return false;
        /*let code = question.code;
        let reuse_code = this.get_membrane_reuse();
        if(code == "PV" || code == "R") {
          if (reuse_code == "LI" || reuse_code == "IR") {
            return true;
          }
        }
        return false;*/
      },
      remove_solutions(codes){
        for(let i=0; i<codes.length; i++){
          console.log("deleting "+codes[i]);
          let index = this.available_solutions.findIndex(s=>s.code === codes[i]);
          if(index >= 0){
            this.available_solutions.splice(index, 1);
          }
        }
      },
      init_available_solutions(){
        this.available_solutions=[
          // Survey 1
          {code:"LI", name:"Landfill disposal or incineration",                                                                 color:"#be514e"},
          {code:"IR", name:"Indirect recycling",                                                                                color:"#604b79"},
          {code:"AM", name:"Membranes are suitable for an alternative management to landfill disposal or incineration.",        color:"#9ab959"},
          {code:"AMR", name:"Membranes are suitable for an alternative management to landfill disposal or incineration. " +
              "Membranes might need to be rehydrated using 50% w/w ethanol during 15 min.",                                     color:"#c2d59a"},
          {code:"IC", name:"Intensive cleaning before considering an alternative management to landfill disposal " +
              "or incineration",                                                                                                color:"#0cae51"},
          {code:"NEIM", name:"Not enough information. Potentially, membranes are suitable for alternative management.",         color:"#4dabc5"},
          {code:"NEIC", name:"Not enough information. Potentially, apply intensive cleaning before alternative management.",    color:"#35849b"},
          {code:"NEIR", name:"Not enough information. Potentially, indirect recycling.",                                        color:"#ffff00"},
          {code:"IRC", name:"Indirect recycling of those membranes placed in the second stage. Potentially, " +
              "apply intensive cleaning before considering an alternative management for those membranes " +
              "placed in the first stage.",                                                                                     color:"#f79447"},
        ]
      },
      get_membrane_reuse(){
        this.init_available_solutions();
        let get_question = this.get_question_by_code;
        let type = get_question("T").value;
        let config = get_question("C").value;
        let size = get_question("S").value;
        let weight = get_question("W").value;
        let ext_damage = get_question("ED").value;
        let fouling = this.get_fouling_type();
        let storage = get_question("ST").value;
        let storage_duration = get_question("D").value;
        //let water_type = get_question("WT").value;
        let cause_replacement = get_question("RP").value;
        let position = get_question("P").value;
        //let rejection = get_question("R").value;
        //let permeability = get_question("PV").value;
        //Type of membrane
        if(type == "Other"){
          this.remove_solutions(["IR", "AM", "AMR", "IC", "NEIM", "NEIC", "NEIR", "IRC"]);
          return;
        }
        else if(type == "Ultrafiltration"){
          this.remove_solutions(["IR", "AM", "AMR", "IC", "NEIM", "NEIC", "NEIR", "IRC"]);
          return;
        }
        else if(type == "Microfiltration"){
          this.remove_solutions(["IR", "AM", "AMR", "IC", "NEIM", "NEIC", "NEIR", "IRC"]);
          return;
        }
        else if(type == "Reverse osmosis brackish model design" || type == "Reverse osmosis sea model design" || type == "Nanofiltration"){
          //Membrane configuration
          if(config == "Other"){
            this.remove_solutions(["IR", "AM", "AMR", "IC", "NEIM", "NEIC", "NEIR", "IRC"]);
            return;
          }
          else if(config == "Spiral-wound"){
            //Membrane size
            if(size == "Other"){
              this.remove_solutions(["IR", "AM", "AMR", "IC", "NEIM", "NEIC", "NEIR", "IRC"]);
              return;
            }
            else if(size == "Length: 1m. Diameter: 0.2m"){
              //Membrane weight
              if(weight == ">25kg"){
                this.remove_solutions(["IR", "AM", "AMR", "IC", "NEIM", "NEIC", "NEIR", "IRC"]);
                return;
              }
              else if(weight == "<17kg" || weight == "17-25 kg"){
                this.remove_solutions([ "LI"]);
                //External damage
                if(ext_damage == "Yes"){
                  this.remove_solutions([ "AM", "AMR", "IC", "NEIM", "NEIC", "NEIR", "IRC"]);
                  return;
                }else if (ext_damage == "No") {
                  //Fouling
                  if (fouling == "Inorganic scaling") {
                    this.remove_solutions(["AM", "AMR", "IRC"]);
                    //Membrane storage
                    if (storage == "Immersed in a water solution" || storage == "Wet") {
                      //Weight
                      if (weight == "17-25 kg"){
                        this.remove_solutions(["IC", "NEIM", "NEIC", "NEIR"]);
                        return;
                      }
                      else if (weight == "<17kg"){
                        this.remove_solutions(["IR", "NEIM", "NEIC", "NEIR"]);
                        return;
                      }
                    } else if (storage == "Dry"){
                      this.remove_solutions(["IC", "NEIM", "NEIC", "NEIR"]);
                      return;
                    }
                  } else if (fouling == "Other") {
                    //Membrane storage
                    if (storage == "Immersed in a water solution" || storage == "Wet") {
                      this.remove_solutions(["IR", "AMR", "IRC"]);
                      //Weight
                      if (weight == "17-25 kg"){
                        this.remove_solutions(["AM", "NEIM", "NEIC", "NEIR"]);
                        return;
                      }
                      else if (weight == "<17kg"){
                        this.remove_solutions(["IC", "NEIM", "NEIC", "NEIR"]);
                        return;
                      }
                    } else if (storage == "Dry") {
                      //Duration of storage after the replacement
                      this.remove_solutions(["AM"]);
                      if (storage_duration == "<1 month") {
                        this.remove_solutions(["AMR"]);
                        //Weight
                        if (weight == "17-25 kg") {
                          if (position == "Single pass" || position == "Double pass - single stage") {
                            //*1a
                            this.remove_solutions(["NEIM", "NEIC", "NEIR", "IRC", "IR"]);
                            return;
                          } else if(position == "Mix" && cause_replacement == "Granted budget for replacement"){
                            //*1b
                            this.remove_solutions(["NEIM", "NEIC", "NEIR", "IRC", "IR"]);
                            return;
                          } else if (position == "Mix" && (cause_replacement == "Operating more than the expected lifespan" || cause_replacement == "Lost of membrane integrity")) {
                            //*2
                            this.remove_solutions(["NEIM", "NEIC", "NEIR", "IC", "IR"]);
                            return;
                          } else if (position == "Double pass - double stage") {
                            //*3
                            this.remove_solutions(["NEIM", "NEIC", "NEIR", "IC", "IRC"]);
                            return;
                          }
                        } else if (weight == "<17kg"){
                          this.remove_solutions(["NEIM", "NEIC", "NEIR", "IRC", "IR"]);
                          return;
                        }
                      } else if (storage_duration == ">1 month") {
                        this.remove_solutions(["IC", "AM", "IRC"]);
                        //Weight
                        if (weight == "17-25 kg"){
                          this.remove_solutions(["NEIM", "NEIC", "NEIR", "AMR"]);
                          return;
                        }
                        else if (weight == "<17kg"){
                          this.remove_solutions(["NEIM", "NEIC", "NEIR", "IR"]);
                          return;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        //Complementary information to the decision-making tree
        if((type == "Reverse osmosis brackish model design" || type == "Reverse osmosis sea model design" || type == "Nanofiltration") && config == "Spiral-wound" && size == "Length: 1m. Diameter: 0.2m") {
          if (weight == "<17kg" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "Other" || fouling == "Don't know")) this.remove_solutions(["NEIC", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
          else if(weight == "17-25 kg"){
            if ((storage == "Immersed in a water solution" || storage == "Wet") && (ext_damage == "No" || ext_damage == "Don't know") && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if ((position == "Single pass" || position == "Double pass - single stage") && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Granted budget for replacement" && (position == "Single pass" || position == "Double pass - single stage" || position == "Mix") && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Operating more than the expected lifespan" && position == "Don't know" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Don't know" && position == "Don't know" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if ((position == "Single pass" || position == "Double pass - single stage") && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Granted budget for replacement" && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if ((cause_replacement == "Granted budget for replacement" || cause_replacement == "Operating more than the expected lifespan") && position == "Don't know" && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Lost of membrane integrity" && (position == "Single pass" || position == "Double pass - single stage") && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (storage == "Don't know" && storage_duration == "Don't know" && ext_damage == "Don't know" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Operating more than the expected lifespan" && (position == "Double pass - double stage" || position == "Mix") && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Lost of membrane integrity" && (position == "Double pass - double stage" || position == "Mix" || position == "Don't know") && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if ((position == "Double pass - double stage" || position == "Mix" || position == "Don't know") && storage == "Dry" && storage_duration == "Don't know" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Lost of membrane integrity" && (position == "Mix" || position == "Don't know") &&  storage == "Dry" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Don't know" && position == "Mix" && storage == "Dry" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (storage == "Dry" && storage_duration == ">1 month") this.remove_solutions(["NEIC", "NEIR", "NEIM", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (position == "Double pass - double stage" && storage == "Dry") this.remove_solutions(["NEIC", "NEIR", "NEIM", "LI", "AM", "AMR", "IC", "IRC"]);
          }
        }
      },
      get_management_survey2() {
        let get_question = this.get_question_by_code;
        let type = get_question("T").value;
        let rejection = get_question("R").value;
        let permeability = get_question("PV").value;

        if(type === undefined || permeability === undefined || rejection === undefined){
          return "";
        }

        // management according to survey_2
        if (type == "Reverse osmosis brackish model design") {
          if (permeability == "<1-fold comparing to the design value") {
            if (rejection == "<15% comparing to the design value") return "RegRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "RecNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == "[1-5]-fold comparing to the design value") {
            if (rejection == "<15% comparing to the design value") return "ReuRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == ">5-fold comparing to the design value") {
            if (rejection == "<15% comparing to the design value") return "ReuRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          }
        } else if (type == "Reverse osmosis sea model design") {
          if (permeability == "<1-fold comparing to the design value") {
            if (rejection == "<15% comparing to the design value") return "RegRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "RecNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == "[1-5]-fold comparing to the design value") {
            if (rejection == "<15% comparing to the design value") return "ReuRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == ">5-fold comparing to the design value") {
            if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
          }
        } else if (type == "Nanofiltration") {
          if (permeability == "<1-fold comparing to the design value") {
            if (rejection == "<15% comparing to the design value") return "RegNF"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "RecUF"
          } else if (permeability == "[1-5]-fold comparing to the design value") {
            if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == ">5-fold comparing to the design value") {
            if (rejection == "<15% comparing to the design value") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          }
        }
        return "";
      },
      get_fouling_type(){
        let get_question = this.get_question_by_code;
        let fouling_value = get_question("F").value;
        let water_type = get_question("WT").value;
        let membrane_position = get_question("P").value;
        if(fouling_value == "Don't know") {
          if (water_type == "Seawater" && !(membrane_position == "Double pass - double stage" || membrane_position == "Mix")) {
            return "Other";
          } else if (water_type == "Seawater" && (membrane_position == "Double pass - double stage" || membrane_position == "Mix")) {
            return "Inorganic scaling";
          } else if (water_type == "Brackish water" && !(membrane_position == "Double pass - double stage" || membrane_position == "Mix")) {
            return "Other";
          } else if (water_type == "Brackish water" && (membrane_position == "Double pass - double stage" || membrane_position == "Mix")) {
            return "Inorganic scaling";
          } else if (water_type == "Wastewater" || water_type == "Food industry") {
            return "Other";
          } else if (water_type == "Chemical industry") {
            return "Inorganic scaling";
          } else {
            return fouling_value;
          }
        } else
          return fouling_value;
      },

    },
    computed: {
      get_available_solutions: function () {
        this.get_membrane_reuse();
        return this.available_solutions;
      },
      result_survey_2(){

        let code = this.get_management_survey2();
        //console.log("ccccccccccc")
        console.log(code);
        let survey2Output = this.membrane_reuse_options.find(q=>q.code==code);
        //console.log("bbbbbbbbbbbbbbbbbbbbb")
        console.log(survey2Output)
        if (survey2Output){
          let get_question = this.get_question_by_code;
          let auxObject = {
            "Type of RO membrane": get_question("T").value,
            "Permeability": get_question("PV").value,
            "% Salt rejection": get_question("R").value,
            "Alternative end-of-life RO membrane management recommended": survey2Output.name,
          };
          /*
          let auxObject = {
            "Type of RO membrane": "Reverse osmosis membranes, BW design",
            "Permeability": "<1-fold comparing to the design value",
            "% Salt rejection": "<15% comparing to the design value",
            "Alternative end-of-life RO membrane management recommended": "Regenerate to reuse as reverse osmosis membranes",
          };*/

          let ret = this.membrane_reuse_options.find(i => _.isEqual(i.code, auxObject));
          //console.log("aaaaaaaaaaaaaaaaa");
          console.log(auxObject);
          console.log(ret);
          if(!ret) return [];
          else return [ret];

        }
        return [];

      },
      get_solutions_for_case_studies() {
        let solutions = [];
        let aux = this.get_management_survey2();
        let options = this.membrane_reuse_options;
        console.log("solutions: ",this.available_solutions);
        console.log("aux: ", aux);
        this.available_solutions.forEach(function (sol) {
          let code = sol.code;
          if((code === "AM" || code === "AMR" || code === "IC")){
            if(aux !== ""){
              let survey2Output = options.find(q=>q.code == aux);
              console.log(survey2Output);
              solutions.push(survey2Output);
            }
          } else
            solutions.push(sol);
        });
        solutions = [ ...new Set(solutions) ]; //removes duplicate solutions.
        return solutions;

      }
    }
  }
</script>


<style>
  a.nav-link {
    color: var(--light-gray-primary);
    font-size: 18px;
    font-weight: var(--bold-text);
  }
  a.nav-link:hover {
    color: white;
    background-color: var(--light-gray-primary) !important;
    font-size: 18px;
  }
  .nav-tabs .nav-link {
    background-color: white !important;
    border: 1px solid var(--light-gray-primary) !important;
    border-radius: 0 !important;
  }
  .nav-tabs #solutions___BV_tab_button__.nav-link.active {
    background-color: var(--blue-primary) !important;
    border: 2px solid var(--blue-primary) !important;
    border-radius: 0 !important;
    color: white;
    font-weight: var(--bold-text);
  }
  .nav-tabs #caseStudies___BV_tab_button__.nav-link.active {
    background-color: var(--green-primary) !important;
    border: 2px solid var(--green-primary) !important;
    border-radius: 0 !important;
    color: white;
    font-weight: var(--bold-text);
  }
  .nav-tabs #factSheets___BV_tab_button__.nav-link.active {
    background-color: var(--red-primary) !important;
    border: 2px solid var(--red-primary) !important;
    border-radius: 0 !important;
    color: white;
    font-weight: var(--bold-text);
  }
  #__BVID__48__BV_tab_container_.tab-content #solutions {
    border: 2px solid var(--blue-primary) !important;
  }
  #__BVID__48__BV_tab_container_.tab-content #caseStudies {
    border: 2px solid var(--green-primary) !important;
  }
  #__BVID__48__BV_tab_container_.tab-content #factSheets {
    border: 2px solid var(--red-primary) !important;
  }
</style>

<style scoped>
  table {
    border-collapse: collapse;
  }
  td, th {
    padding: 0.2em;
  }
  .membrane_reuse {
    padding: 1em;
    font-size: large;
    border: 1px solid #ccc;
  }
  .sidebar-header > a {
    color: var(--green-primary);
  }
  .sidebar-header {
    width: 100%;
  }
  .tabBox {
    min-height: 70vh;
  }
  .remapToolbox {
    position: relative;
    min-height: 100vh;
  }
  .header {
    width: 100%;
    height: fit-content; /* Footer height */
    background-color: var(--dark-gray-primary);
  }
  .content {
    padding-bottom: 2.5rem; /* Footer height */
    /*max-height: 60vh;*/
  }
  .footer {
    position: relative;
    bottom: 0;
    width: 100%;
    height: fit-content; /* Footer height */
    background-color: var(--dark-gray-primary);
  }
  .multiselect{
    margin-bottom: 0.75rem;
    margin-top: 0.35rem;
  }
  .clearButt.btn-secondary  {
    color: white;
    background-color: var(--dark-gray-primary);
    border-color: var(--dark-gray-primary);
    font-weight: var(--bold-text);
    font-size: small;
    overflow: hidden;
    min-width: fit-content;
  }
</style>