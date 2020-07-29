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
            b-navbar
              .sidebar-header
                h2 Survey
                template(v-for="q in questions" :id="q.code")
                  b {{q.name}}
                  multiselect(
                    v-model="q.value",
                    :options="q.answers",
                    placeholder="Pick a value",
                    :disabled="is_disabled(q)"
                  ).multiselect
          b-col
            //router-view
            <!--survey 1 outputs-->
            div
              b-tabs(content-class="" fill)
                b-tab#solutions(title="SOLUTIONS" active).p-3.tabBox
                  b Membrane reuse
                  //div.membrane_reuse(:style="`background:${get_membrane_reuse_color()}`")  {{show_membrane_reuse()}}
                  div.membrane_reuse(v-for="s in get_available_solutions" :id="s.code" :key="s.code" :style="`background:${s.color}`")  {{ s.name }}
                b-tab#caseStudies(title="CASE STUDIES").p-3.tabBox
                  CaseStudies
                b-tab#factSheets(title="FACT SHEETS").p-3.tabBox
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
            name: "Rejection",
            value: null,
            answers: ["Lost of Rejection <15% comparing the design", ">10% of NaCl and >30% of MgSO4", "<10% of NaCl and <30% of MgSO4"]
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
        let water_type = get_question("WT").value;
        let cause_replacement = get_question("RP").value;
        let position = get_question("P").value;
        let rejection = get_question("R").value;
        let permeability = get_question("PV").value;


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

          console.log("aaaa");
          console.log(cause_replacement);
          console.log(position);
          console.log(storage_duration);
          console.log(ext_damage)
          console.log(fouling);




          this.remove_solutions(["LI", "AM", "AMR", "IC", "IRC"]);
          if (weight == "<17kg" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "Other" || fouling == "Don't know")) this.remove_solutions(["NEIC", "NEIR", "IR"]);
          else if(weight == "17-25 kg"){

            if ((storage == "Immersed in a water solution" || storage == "Wet") && (ext_damage == "No" || ext_damage == "Don't know") && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIR", "IR"]);
            else if ((position == "Single pass" || position == "Double pass - single stage") && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIR", "IR"]);
            else if (cause_replacement == "Granted budget for replacement" && (position == "Single pass" || position == "Double pass - single stage" || position == "Mix") && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIR", "IR"]);

            else if (cause_replacement == "Operating more than the expected lifespan" && position == "Don't know" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIR", "IR"]);
            else if (cause_replacement == "Don't know" && position == "Don't know" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIR", "IR"]);
            else if ((position == "Single pass" || position == "Double pass - single stage") && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIR", "IR"]);
            else if (cause_replacement == "Granted budget for replacement" && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIR", "IR"]);
            else if ((cause_replacement == "Granted budget for replacement" || cause_replacement == "Operating more than the expected lifespan") && position == "Don't know" && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIR", "IR"]);
            else if (cause_replacement == "Lost of membrane integrity" && (position == "Single pass" || position == "Double pass - single stage") && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIR", "IR"]);


            else if (storage == "Don't know" && storage_duration == "Don't know" && ext_damage == "Don't know" && fouling == "Don't know") this.remove_solutions(["NEIM", "NEIC", "IR"]);
            else if (cause_replacement == "Operating more than the expected lifespan" && (position == "Double pass - double stage" || position == "Mix") && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIC", "IR"]);
            else if (cause_replacement == "Lost of membrane integrity" && (position == "Double pass - double stage" || position == "Mix" || position == "Don't know") && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIC", "IR"]);
            else if ((position == "Double pass - double stage" || position == "Mix" || position == "Don't know") && storage == "Dry" && storage_duration == "Don't know" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIC", "IR"]);

            else if (cause_replacement == "Lost of membrane integrity" && (position == "Mix" || position == "Don't know") &&  storage == "Dry" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIC", "IR"]);
            else if (cause_replacement == "Don't know" && position == "Mix" && storage == "Dry" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) this.remove_solutions(["NEIM", "NEIC", "IR"]);

            else if (storage == "Dry" && storage_duration == ">1 month") this.remove_solutions(["NEIC", "NEIR", "NEIM"]);
            else if (position == "Double pass - double stage" && storage == "Dry") this.remove_solutions(["NEIC", "NEIR", "NEIM"]);
          }



        }
      },
      get_management_survey2() {
        let get_question = this.get_question_by_code;
        let type = get_question("T").value;
        let rejection = get_question("R").value;
        let permeability = get_question("PV").value;

        // management according to survey_2
        if (type == "Reverse osmosis brackish model design") {
          if (permeability == "<1-fold comparing to the design value") {
            if (rejection == "Lost of Rejection <15% comparing the design") return "RegRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "RecNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == "[1-5]-fold comparing to the design value") {
            if (rejection == "Lost of Rejection <15% comparing the design") return "ReuRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == ">5-fold comparing to the design value") {
            if (rejection == "Lost of Rejection <15% comparing the design") return "ReuRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          }
        } else if (type == "Reverse osmosis sea model design") {
          if (permeability == "<1-fold comparing to the design value") {
            if (rejection == "Lost of Rejection <15% comparing the design") return "RegRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "RecNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == "[1-5]-fold comparing to the design value") {
            if (rejection == "Lost of Rejection <15% comparing the design") return "ReuRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == ">5-fold comparing to the design value") {
            if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
          }
        } else if (type == "Nanofiltration") {
          if (permeability == "<1-fold comparing to the design value") {
            if (rejection == "Lost of Rejection <15% comparing the design") return "RegNF"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "RecUF"
          } else if (permeability == "[1-5]-fold comparing to the design value") {
            if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == ">5-fold comparing to the design value") {
            if (rejection == "Lost of Rejection <15% comparing the design") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          }
        }
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
    min-height: 60vh;
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
    padding-bottom: 5rem; /* Footer height */
  }

  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 4rem; /* Footer height */
    background-color: var(--dark-gray-primary);
  }

</style>
