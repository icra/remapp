<template lang="pug">
  div.remapToolbox
    div.header
      Header
    div.content
      b-container.p-2.mx-lg-5(fluid="true")
        b-row
          b-col(sm="12" xl="4")
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
                      :disabled="is_disabled(q)",
                      :show-labels="false"
                    ).multiselect
          b-col
            //router-view
            <!--survey 1 outputs-->
            div
              b-tabs(content-class="" fill)
                b-tab#solutions(title="SOLUTIONS" active).p-3.tabBox
                  b Alternative end-of-life membrane management
                  //div.membrane_reuse(:style="`background:${get_membrane_reuse_color()}`")  {{show_membrane_reuse()}}
                  div.membrane_reuse(v-for="s  in get_available_solutions").px-0
                    //div.membrane_reuse(:id="s.code" :key="s.code" :style="`background:${s.color}`")  {{ s.name }}
                    div(style="display: grid; grid-template-columns: 1fr 10fr; grid-gap:20px").ml-0
                      div(:style="`background:${s.color}`" )
                      div
                        p.mb-0 {{ s.name }}
                  br
                  b Considerations to reproduce the recommended second-hand membranes
                  template(v-if="result_survey_2.length !== 0")
                    div.membrane_reuse(v-for="s in result_survey_2")
                      b-table(stacked small outlined :fields="table_fields" :items="[adapt_survey_2_result(s)]")
                  template(v-else)
                    b.asterisk_mark#tooltip  *
                    b-tooltip(target="tooltip" ) Please answer 'Salt Rejection' and 'Variation of Permeability' to see the considerations to reproduce the recommended second-hand membranes
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
  import Footer from "./Footer";
  import Header from "./Header";
  import _ from "lodash";

  export default {
    name: "Menus",
    components: {
      Header,
      Footer,
      CaseStudies,
      Multiselect
    },
    data() {
      return {
        table_fields: [
          {
            key: "membrane_reuse",
            isRowHeader: true,
            label: "Membrane reuse",
            class: "tHeader",
            //thStyle: {background: '#3eef33'},
            //variant: "danger"
          },
          "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931",
          "Free chlorine exposure dose qualitative",
          "Potential environmental reduction for the production of second-hand membranes",
          "Potential economical cost for the production of second-hand membranes, quantitative €",
          "Potential economical saving for the production of second-hand membranes, qualitative",
          "Skilled crew for the production of second-hand membranes, production",
          "Potential application of the second-hand membranes"
        ],
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
              "Membranes might need to be rehydrated using an ethanol solution.",
            color: "#c2d59a"
          },
          {
            code: "IC",
            name: "Intensive cleaning before considering an alternative management to landfill disposal or incineration.",
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
            name: "Indirect recycling of the membranes placed in the second stage. Potentially, apply intensive " +
              "cleaning before considering an alternative management for the membranes placed in the first stage.",
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
              "typeMembrane": "Reverse osmosis brackish model design",
              "permeability": "<1-fold comparing to the design value",
              "saltRejection": "<15% comparing to the design value",
              "membraneReuse": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 2,500 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membranes, production": "medium",
              "Potential application of the second-hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis brackish model design",
              "permeability": "<1-fold comparing to the design value",
              "saltRejection": ">10% of NaCl and >30% of MgSO4",
              "membraneReuse": "Recycling into nanofiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[2,500-25,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membranes, production": "high",
              "Potential application of the second-hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis brackish model design",
              "permeability": "<1-fold comparing to the design value",
              "saltRejection": "<10% of NaCl and <30% of MgSO4",
              "membraneReuse": "Recycling into ultrafiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membranes, production": "low ",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis brackish model design",
              "permeability": "[1-5]-fold comparing to the design value",
              "saltRejection": "<15% comparing to the design value",
              "membraneReuse": "Reuse as reverse osmosis membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis brackish model design",
              "permeability": "[1-5]-fold comparing to the design value",
              "saltRejection": ">10% of NaCl and >30% of MgSO4",
              "membraneReuse": "Reuse as nanofiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis brackish model design",
              "permeability": "[1-5]-fold comparing to the design value",
              "saltRejection": "<10% of NaCl and <30% of MgSO4",
              "membraneReuse": "Recycling into ultrafiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high",
              "Skilled crew for the production of second-hand membranes, production": "low ",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis brackish model design",
              "permeability": ">5-fold comparing to the design value",
              "saltRejection": "<15% comparing to the design value",
              "membraneReuse": "Reuse as reverse osmosis membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis brackish model design",
              "permeability": ">5-fold comparing to the design value",
              "saltRejection": ">10% of NaCl and >30% of MgSO4",
              "membraneReuse": "Reuse as nanofiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis brackish model design",
              "permeability": ">5-fold comparing to the design value",
              "saltRejection": "<10% of NaCl and <30% of MgSO4",
              "membraneReuse": "Recycling into ultrafiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high",
              "Skilled crew for the production of second-hand membranes, production": "low ",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis sea model design",
              "permeability": "<1-fold comparing to the design value",
              "saltRejection": "<15% comparing to the design value",
              "membraneReuse": "Regenerate to reuse as reverse osmosis membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 4,000 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membranes, production": "medium",
              "Potential application of the second-hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (installation in the second stage of the process, seawater process to treat the concentrate"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis sea model design",
              "permeability": "<1-fold comparing to the design value",
              "saltRejection": ">10% of NaCl and >30% of MgSO4",
              "membraneReuse": "Recycling into nanofiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[4,000-150,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[33-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membranes, production": "high",
              "Potential application of the second-hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (installation in the second stage of the process, seawater process to treat the concentrate"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis sea model design",
              "permeability": "<1-fold comparing to the design value",
              "saltRejection": "<10% of NaCl and <30% of MgSO4",
              "membraneReuse": "Recycling into ultrafiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[30,000-400,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membranes, production": "low ",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis sea model design",
              "permeability": "[1-5]-fold comparing to the design value",
              "saltRejection": "<15% comparing to the design value",
              "membraneReuse": "Reuse as reverse osmosis membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (installation in the second stage of the process, seawater process to treat the concentrate"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis sea model design",
              "permeability": "[1-5]-fold comparing to the design value",
              "saltRejection": ">10% of NaCl and >30% of MgSO4",
              "membraneReuse": "Reuse as nanofiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (installation in the second stage of the process, seawater process to treat the concentrate"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis sea model design",
              "permeability": "[1-5]-fold comparing to the design value",
              "saltRejection": "<10% of NaCl and <30% of MgSO4",
              "membraneReuse": "Recycling into ultrafiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high",
              "Skilled crew for the production of second-hand membranes, production": "low ",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis sea model design",
              "permeability": ">5-fold comparing to the design value",
              "saltRejection": "<15% comparing to the design value",
              "membraneReuse": "Reuse as reverse osmosis membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (installation in the second stage of the process, seawater process to treat the concentrate"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis sea model design",
              "permeability": ">5-fold comparing to the design value",
              "saltRejection": ">10% of NaCl and >30% of MgSO4",
              "membraneReuse": "Reuse as nanofiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Landfill leachate treatment, Wastewater treatment for water reuse, miner, swine treatment, brackish water desalination for irrigation or other uses excepting drinking water (installation in the second stage of the process, seawater process to treat the concentrate"}
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis sea model design",
              "permeability": ">5-fold comparing to the design value",
              "saltRejection": "<10% of NaCl and <30% of MgSO4",
              "membraneReuse": "Recycling into ultrafiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[20,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[42-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high",
              "Skilled crew for the production of second-hand membranes, production": "low ",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)"            }
          },
          {
            code: {
              "typeMembrane": "Nanofiltration",
              "permeability": "<1-fold comparing to the design value",
              "saltRejection": "<15% comparing to the design value",
              "membraneReuse": "Regenerate to reuse as nanofiltration membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "< 2,500 ppm h ",
              "Free chlorine exposure dose qualitative": "low",
              "Potential environmental reduction for the production of second-hand membranes": "high ++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[26-55]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ++",
              "Skilled crew for the production of second-hand membranes, production": "medium",
              "Potential application of the second-hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas"            }
          },
          {
            code: {
              "typeMembrane": "Nanofiltration",
              "permeability": "<1-fold comparing to the design value",
              "saltRejection": ">10% of NaCl and >30% of MgSO4",
              "membraneReuse": "Recycling into ultrafiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[2,500-25,000] ppm h",
              "Free chlorine exposure dose qualitative": "medium ",
              "Potential environmental reduction for the production of second-hand membranes": "high +",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +",
              "Skilled crew for the production of second-hand membranes, production": "low ",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)"            }
          },
          {
            code: {
              "typeMembrane": "Nanofiltration",
              "permeability": "<1-fold comparing to the design value",
              "saltRejection": "<10% of NaCl and <30% of MgSO4",
              "membraneReuse": "Recycling into ultrafiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[15,000-100,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high ",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high ",
              "Skilled crew for the production of second-hand membranes, production": "low",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)"            }
          },
          {
            code: {
              "typeMembrane": "Nanofiltration",
              "permeability": "[1-5]-fold comparing to the design value",
              "saltRejection": "<15% comparing to the design value",
              "membraneReuse": "Reuse as nanofiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas"            }
          },
          {
            code: {
              "typeMembrane": "Nanofiltration",
              "permeability": "[1-5]-fold comparing to the design value",
              "saltRejection": ">10% of NaCl and >30% of MgSO4",
              "membraneReuse": "Reuse as nanofiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas"            }
          },
          {
            code: {
              "typeMembrane": "Nanofiltration",
              "permeability": "[1-5]-fold comparing to the design value",
              "saltRejection": "<10% of NaCl and <30% of MgSO4",
              "membraneReuse": "Recycling into ultrafiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high",
              "Skilled crew for the production of second-hand membranes, production": "low",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)"            }
          },
          {
            code: {
              "typeMembrane": "Nanofiltration",
              "permeability": ">5-fold comparing to the design value",
              "saltRejection": "<15% comparing to the design value",
              "membraneReuse": "Reuse as nanofiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas"            }
          },
          {
            code: {
              "typeMembrane": "Nanofiltration",
              "permeability": ">5-fold comparing to the design value",
              "saltRejection": ">10% of NaCl and >30% of MgSO4",
              "membraneReuse": "Reuse as nanofiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "0",
              "Free chlorine exposure dose qualitative": "0",
              "Potential environmental reduction for the production of second-hand membranes": "high +++",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "0",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high +++",
              "Skilled crew for the production of second-hand membranes, production": "Not required",
              "Potential application of the second-hand membranes": "Wastewater treatment; Brackish water desalination for irrigation or other uses excepting drinking water; Seawater process to treat the concentrate; Industrial wastewater; Fresh water for isolated areas"            }
          },
          {
            code: {
              "typeMembrane": "Nanofiltration",
              "permeability": ">5-fold comparing to the design value",
              "saltRejection": "<10% of NaCl and <30% of MgSO4",
              "membraneReuse": "Recycling into ultrafiltration-like membranes",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-60,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high",
              "Potential economical cost for the production of second-hand membranes, quantitative €": "[32-63]",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high",
              "Skilled crew for the production of second-hand membranes, production": "low",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis brackish model design",
              "permeability": null,
              "saltRejection": null,
              "membraneReuse": "Indirect recycling",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high",
              "Potential economical cost for the production of second-hand membranes, quantitative €": ">63",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high",
              "Skilled crew for the production of second-hand membranes, production": "high",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water). It requires taking out the fiber glass casing"            }
          },
          {
            code: {
              "typeMembrane": "Reverse osmosis sea model design",
              "permeability": null,
              "saltRejection": null,
              "membraneReuse": "Indirect recycling",
            },
            survey2Result: {
              "Free chlorine exposure dose (ppm h) according to the patent PCT/EP2016/30931": "[10,000-200,000] ppm h",
              "Free chlorine exposure dose qualitative": "high",
              "Potential environmental reduction for the production of second-hand membranes": "high",
              "Potential economical cost for the production of second-hand membranes, quantitative €": ">63",
              "Potential economical saving for the production of second-hand membranes, qualitative": "high",
              "Skilled crew for the production of second-hand membranes, production": "high",
              "Potential application of the second-hand membranes": "Wastewater treatment, pre-treatment for desalination processes, gravity-driven water treatment (grey, urban water and drinking water)"            }
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
            code: "IC",
            name: "Intensive cleaning before considering an alternative management to landfill disposal or incineration",
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
          {code: "NEIR", name: "Not enough information. Potentially, indirect recycling.", color: "#ffff00"},
          {
            code: "IRC",
            name: "Indirect recycling of those membranes placed in the second stage. Potentially, apply intensive " +
              "cleaning before considering an alternative management for those membranes placed in the first stage.",
            color: "#f79447"
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
        let cause_replacement = get_question("RP").value;
        let position = get_question("P").value;

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
                          } else if(position == "Mix" && (cause_replacement == "Granted budget for replacement" || cause_replacement == "Don't know")){
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
            //Update
            else if ((cause_replacement == "Granted budget for replacement" || cause_replacement == "Operating more than the expected lifespan") && position == "Don't know" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "No" && fouling == "Other") this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if ((storage == "Wet" || storage == "Immersed in a water solution") && ext_damage == "Don't know" && fouling == "Other") this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if ((position == "Single pass" || position == "Double pass - single stage") && storage == "Don't know" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Other") this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Granted budget for replacement" && storage == "Don't know" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Other") this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if ((cause_replacement == "Granted budget for replacement" || cause_replacement == "Operating more than the expected lifespan")&& position == "Don't know" && storage == "Don't know" && storage_duration == "<1 month" && ext_damage == "No" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Don't know" && position == "Don't know" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "No" && fouling == "Other") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Operating more than the expected lifespan" && (position == "Double pass - double stage" || position == "Mix") && storage == "Don't know" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Other") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Lost of membrane integrity" && (position == "Double pass - double stage" || position == "Mix" || position == "Don't know") && storage == "Don't know" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Other") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if ((position == "Double pass - double stage" || position == "Mix" || position == "Don't know") && storage == "Dry" && storage_duration == "Don't know" && ext_damage == "No" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if ((position == "Double pass - double stage" || position == "Mix" || position == "Don't know") && storage == "Dry" && storage_duration == "Don't know" && ext_damage == "Don't know" && fouling == "Other") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Lost of membrane integrity" && (position == "Mix" || position == "Don't know") && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Other") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Don't know" && position == "Mix" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Other") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);



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
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
            else if (rejection == "<15% comparing to the design value") return "ReuRO"
          }
        } else if (type == "Nanofiltration") {
          if (permeability == "<1-fold comparing to the design value") {
            if (rejection == "<15% comparing to the design value") return "RegNF"
            else if (rejection == ">10% of NaCl and >30% of MgSO4" || rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == "[1-5]-fold comparing to the design value" || permeability == ">5-fold comparing to the design value") {
            if (rejection == ">10% of NaCl and >30% of MgSO4" || rejection == "<15% comparing to the design value") return "ReuNF"
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
      adapt_survey_2_result(solution){
        //let ret = solution.survey2Result;
        let aux = {"membrane_reuse": solution.code.membraneReuse}
        return Object.assign(aux, solution.survey2Result);
      }
    },
    computed: {
      get_available_solutions: function () {
        this.get_membrane_reuse();
        return this.available_solutions;
      },
      result_survey_2(){
        let code = this.get_management_survey2();
        let survey2Output = this.membrane_reuse_options.find(q=>q.code==code);
        let auxObject;
        let get_question = this.get_question_by_code;
        let membrane = get_question("T").value;
        let perm = get_question("PV").value;
        let rejection = get_question("R").value;

        if (survey2Output) {
          auxObject = {
            "typeMembrane": membrane,
            "permeability": perm,
            "saltRejection": rejection,
            "membraneReuse": survey2Output.name,
          };
        }
        //Indirect Recycling
        else if(this.available_solutions.length === 1 && this.available_solutions[0].code === "IR" && (membrane === "Reverse osmosis brackish model design" || membrane === "Reverse osmosis sea model design")){
          auxObject = {
            "typeMembrane": membrane,
            "permeability": null,
            "saltRejection": null,
            "membraneReuse": "Indirect recycling",
          };
        }else{
          return [];
        }

        let ret = this.membrane_reuse_options.find(i => _.isEqual(i.code, auxObject));
        console.log(ret)
        if(!ret)
          return [];
        else
          return [ret];

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
    },

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
    padding: 0.6em 1em;
    //font-size: large;
    //border: 1px solid #ccc;
  }
  .sidebar-header > a {
    color: var(--green-primary);
  }
  .sidebar-header {
    width: 100%;
  }
  .tabBox {
    height: 70vh;
    overflow-y: scroll;
  }
  .remapToolbox {
    position: relative;
    min-height: 100vh;
  }
  .header {
    width: 100%;
    height: fit-content; /* Footer height */
    //background-color: var(--light-gray-primary);
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
    font-size: small;
    min-width: 100%;
    width: auto;
    border: none;
    min-height: fit-content;
    height: auto;
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
  .asterisk_mark{
    color: #c51e23;
  }
</style>
