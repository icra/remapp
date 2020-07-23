<template lang="pug">

  div
    h1 REMApp
    div
      <!--survey 1-->
      div
        <!--survey 1 inputs-->
        div
          b Survey 1
          table(border="1")
          tr(v-for="q in questions" :id="q.code")
            td {{q.code}}
            td {{q.name}}
            td
              select(:id="q.name" v-model="q.value" :disabled="is_disabled(q)")
                option(:value="null") --select--
                option(v-for="ans in q.answers") {{ans}}

      <!--survey 1 outputs-->
      div
        b Membrane reuse
          div.membrane_reuse(:style="`background:${get_membrane_reuse_color()}`")  {{show_membrane_reuse()}}
          div.membrane_reuse {{ get_fouling_type() }}


</template>

<script>
  export default {
    name: "Menus",
    data () {
      return {
        questions:[
          // Survey 1
          {code:"T",  name:"Type of membrane",          value:null, answers:["Reverse osmosis brackish model design","Reverse osmosis sea model design", "Nanofiltration","Ultrafiltration","Microfiltration","Other"]},
          {code:"C",  name:"Membrane configuration",    value:null, answers:["Spiral-wound","Other"]},
          {code:"S",  name:"Membrane size",             value:null, answers:["Length: 1m. Diameter: 0.2m", "Other"]},
          {code:"W",  name:"Membrane weight",           value:null, answers:["<17kg","17-25 kg", ">25kg","Don't know"] },
          {code:"ED", name:"External damage",           value:null, answers:["No","Yes","Don't know"] },
          {code:"F",  name:"Fouling type",              value:null, answers:["Inorganic scaling","Other","Don't know"] },
          {code:"ST", name:"Membrane storage",          value:null, answers:["Wet","Immersed in a water solution","Dry","Don't know"] },
          {code:"D",  name:"Storage duration",          value:null, answers:["<1 month",">1 month","Don't know"] },
          {code:"RP", name:"Cause of replacement",      value:null, answers:["Granted budget for replacement","Operating more than the expected lifespan","Lost of membrane integrity","Don't know"] },
          {code:"P",  name:"Membrane position",         value:null, answers:["Single pass","Double pass - single stage","Double pass - double stage","Mix","Don't know"] },
          {code:"WT", name:"Type of water",             value:null, answers:["Seawater","Brackish water","Wastewater","Chemical industry","Food industry"] },

          // Survey 2
          {code:"R",  name:"Rejection",                 value:null, answers:["Lost of Rejection <15% comparing the design",">10% of NaCl and >30% of MgSO4","<10% of NaCl and <30% of MgSO4"]},
          {code:"PV", name:"Variation of Permeability", value:null, answers:["<1-fold comparing to the design value","[1-5]-fold comparing to the design value",">5-fold comparing to the design value"]},
        ],

        membrane_reuse_options:[
          // Survey 1
          {code:"LI", name:"Landfill disposal or incineration",                                                                 color:"#be514e"},
          {code:"IR", name:"Indirect recycling",                                                                                color:"#604b79"},
          {code:"AM", name:"Membranes are suitable for an alternative management to landfill disposal or incineration.",        color:"#9ab959"},
          {code:"AMR", name:"Membranes are suitable for an alternative management to landfill disposal or incineration. " +
              "Membranes might be need to be rehydrated using 50% w/w ethanol during 15 min.",                                  color:"#c2d59a"},
          {code:"AMS", name:"Membranes are suitable for an alternative management to landfill disposal or incineration. " +
              "Please fill the following survey to estimate which alternative would suit better.",                              color:"#9ab959"},
          {code:"IC", name:"Intensive cleaning before considering an alternative management to landfill disposal " +
              "or incineration",                                                                                                color:"#0cae51"},
          {code:"NEIM", name:"Not enough information. Potentially, membranes are suitable for alternative management.",         color:"#4dabc5"},
          {code:"NEIC", name:"Not enough information. Potentially, apply intensive cleaning before alternative management.",    color:"#35849b"},
          {code:"NEIR", name:"Not enough information. Potentially, indirect recycling.",                                        color:"#ffff00"},
          {code:"IRC", name:"Indirect recycling of those membranes placed in the second stage. Potentially, " +
              "apply intensive cleaning before considering an alternative management for those membranes " +
              "placed in the first stage.",                                                                                     color:"#f79447"},

          // Survey 2
          {code:"ReuRO", name:"Reuse as reverse osmosis membranes",                   color:"#00ff00"},
          {code:"ReuNF", name:"Reuse as nanofiltration-like membranes",               color:"#66ff66"},
          {code:"RegRO", name:"Regenerate to reuse as reverse osmosis membranes",     color:"#99ff33"},
          {code:"RegNF", name:"Regenerate to reuse as nanofiltration membranes",      color:"#ccff33"},
          {code:"RecNF", name:"Recycling into nanofiltration-like membranes",         color:"#33cc33"},
          {code:"RecUF", name:"Recycling into ultrafiltration-like membranes",        color:"#77933c"},
        ],
      }
    },
    methods:{
      get_question_by_code(code){
        return this.questions.find(q=>q.code==code);
      },
      get_membrane_reuse_option_by_code(code){
        if(code){
          let option = this.membrane_reuse_options.find(o=>o.code==code);
          return option.name;
        }
        return "answer survey 1 to get a membrane reuse";

      },
      show_membrane_reuse(){
        let code = this.get_membrane_reuse();
        return this.get_membrane_reuse_option_by_code(code);
      },
      is_rendered(question){
        let code = question.code;
        if(code == "WT"){
          if(this.get_question_by_code('F').value=="Don't know") return true;
          return false;
        }
        return true;
      },
      is_disabled(question){
        let code = question.code;
        let reuse_code = this.get_membrane_reuse();
        if(code == "PV" || code == "R") {
          if (reuse_code == "LI" || reuse_code == "IR") {
            return true;
          }
        }
        return false;
      },
      get_membrane_reuse(){
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
        if(type == "Other")                       return "LI";
        if(type == "Ultrafiltration")             return "LI";
        if(type == "Microfiltration")             return "LI";

        //Membrane configuration
        if(config == "Other")                       return "LI";

        //Membrane size
        if(size == "Other")                       return "LI";

        //Membrane weight
        if(weight == ">25kg")                       return "LI";

        if((type == "Reverse osmosis brackish model design" || type == "Reverse osmosis sea model design" || type == "Nanofiltration") && config == "Spiral-wound" && size == "Length: 1m. Diameter: 0.2m" && (weight == "<17kg" || weight == "17-25 kg")){
          //External damage
          if(ext_damage == "Yes"){
            return "IR";
          }else if (ext_damage == "No") {

            //Fouling
            if (fouling == "Inorganic scaling") {

              //Membrane storage
              if (storage == "Immersed in a water solution" || storage == "Wet") {

                //Weight
                if (weight == "17-25 kg") return "IR";
                else if (weight == "<17kg") return "IC";
              } else if (storage == "Dry") return "IR";
            } else if (fouling == "Other") {

              //Membrane storage
              if (storage == "Immersed in a water solution" || storage == "Wet") {
                //Weight
                if (weight == "17-25 kg") return "IC";
                else if (weight == "<17kg") return ("AM") ;

              } else if (storage == "Dry") {

                //Duration of storage after the replacement
                if (storage_duration == ">1 month") {

                  //Weight
                  if (weight == "17-25 kg") {
                    if (position == "Mix" && (cause_replacement == "Operating more than the expected lifespan" || cause_replacement == "Lost of membrane integrity" || cause_replacement == "Don't know")) {
                      //2*
                      return "IRC";
                    } else if (position == "Single pass" || position == "Double pass - single stage" || position == "Mix") {
                      //1*
                      return "IC";
                    } else if (position == "Double pass - double stage") {
                      //3*
                      return "IR";
                    }
                  } else if (weight == "<17kg") return "AMR";
                } else if (storage_duration == "<1 month") {

                  //Weight
                  if (weight == "17-25 kg") return "IC";
                  else if (weight == "<17kg") return "AM";
                }
              }
            }
          }
        }

        //Complementary information to the decision-making tree
        if((type == "Reverse osmosis brackish model design" || type == "Reverse osmosis sea model design" || type == "Nanofiltration") && config == "Spiral-wound" && size == "Length: 1m. Diameter: 0.2m") {

          if (weight == "<17kg" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "Other" || fouling == "Don't know")) return "NEIM";

          if (weight == "17-25 kg" && (storage == "Immersed in a water solution" || storage == "Wet") && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "Other" || fouling == "Don't know")) return "NEIC";
          if ((position == "Single pass" || position == "Double pass - single stage") && weight == "17-25 kg" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") return "NEIC";
          if (cause_replacement == "Granted budget for replacement" && (position == "Single pass" || position == "Double pass - single stage" || position == "Mix") && weight == "17-25 kg" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") return "NEIC";
          if (cause_replacement == "Operating more than the expected lifespan" && position == "Don't know" && weight == "17-25 kg" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") return "NEIC";
          if (cause_replacement == "Don't know" && position == "Don't know" && weight == "17-25 kg" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Don't know") return "NEIC";
          if ((position == "Single pass" || position == "Double pass - single stage") && weight == "17-25 kg" && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) return "NEIC";
          if (cause_replacement == "Granted budget for replacement" && weight == "17-25 kg" && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) return "NEIC";
          if ((cause_replacement == "Granted budget for replacement" || cause_replacement == "Operating more than the expected lifespan") && position == "Don't know" && weight == "17-25 kg" && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) return "NEIC";
          if (cause_replacement == "Lost of membrane integrity" && (position == "Single pass" || position == "Double pass - single stage") && weight == "17-25 kg" && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) return "NEIC";


          if (weight == "17-25 kg" && storage == "Don't know" && storage_duration == "Don't know" && ext_damage == "Don't know" && fouling == "Don't know") return "IRC";
          if (cause_replacement == "Operating more than the expected lifespan" && (position == "Double pass - double stage" || position == "Mix") && weight == "17-25 kg" && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) return "IRC";
          if (cause_replacement == "Lost of membrane integrity" && (position == "Double pass - double stage" || position == "Mix" || position == "Don't know") && weight == "17-25 kg" && storage == "Don't know" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) return "IRC";
          if ((position == "Double pass - double stage" || position == "Mix" || position == "Don't know") && weight == "17-25 kg" && storage == "Dry" && storage_duration == "Don't know" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) return "IRC";
          if (cause_replacement == "Lost of membrane integrity" && (position == "Mix" || position == "Don't know") && weight == "17-25 kg" && storage == "Dry" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) return "IRC";
          if (cause_replacement == "Don't know" && position == "Mix" && weight == "17-25 kg" && storage == "Dry" && storage_duration == "<1 month" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "No" || fouling == "Don't know")) return "IRC";

          if ( weight == "17-25 kg" && storage == "Dry" && storage_duration == ">1 month") return "IR";
          if (position == "Double pass - double stage" && weight == "17-25 kg" && storage == "Dry") return "IR";

        }

        return "";
      },
      get_management_survey2(){
        let get_question = this.get_question_by_code;
        let type = get_question("T").value;
        let rejection = get_question("R").value;
        let permeability = get_question("PV").value;

        // management according to survey_2
        if(type == "Reverse osmosis brackish model design"){
          if(permeability == "<1-fold comparing to the design value"){
            if(rejection == "Lost of Rejection <15% comparing the design")    return "RegRO"
            else if(rejection == ">10% of NaCl and >30% of MgSO4")            return "RecNF"
            else if(rejection == "<10% of NaCl and <30% of MgSO4")            return "RecUF"
          }
          else if(permeability == "[1-5]-fold comparing to the design value"){
            if(rejection == "Lost of Rejection <15% comparing the design")    return "ReuRO"
            else if(rejection == ">10% of NaCl and >30% of MgSO4")            return "ReuNF"
            else if(rejection == "<10% of NaCl and <30% of MgSO4")            return "RecUF"
          }
          else if(permeability == ">5-fold comparing to the design value"){
            if(rejection == "Lost of Rejection <15% comparing the design")    return "ReuRO"
            else if(rejection == ">10% of NaCl and >30% of MgSO4")            return "ReuNF"
            else if(rejection == "<10% of NaCl and <30% of MgSO4")            return "RecUF"
          }
        }
        else if(type == "Reverse osmosis sea model design"){
          if(permeability == "<1-fold comparing to the design value"){
            if(rejection == "Lost of Rejection <15% comparing the design")    return "RegRO"
            else if(rejection == ">10% of NaCl and >30% of MgSO4")            return "RecNF"
            else if(rejection == "<10% of NaCl and <30% of MgSO4")            return "RecUF"
          }
          else if(permeability == "[1-5]-fold comparing to the design value"){
            if(rejection == "Lost of Rejection <15% comparing the design")    return "ReuRO"
            else if(rejection == ">10% of NaCl and >30% of MgSO4")            return "ReuNF"
            else if(rejection == "<10% of NaCl and <30% of MgSO4")            return "RecUF"
          }
          else if(permeability == ">5-fold comparing to the design value"){
            if(rejection == ">10% of NaCl and >30% of MgSO4")                 return "ReuNF"
          }
        }
        else if(type == "Nanofiltration"){
          if(permeability == "<1-fold comparing to the design value"){
            if(rejection == "Lost of Rejection <15% comparing the design")    return "RegNF"
            else if(rejection == ">10% of NaCl and >30% of MgSO4")            return "RecUF"
          }
          else if(permeability == "[1-5]-fold comparing to the design value"){
            if(rejection == ">10% of NaCl and >30% of MgSO4")                 return "ReuNF"
            else if(rejection == "<10% of NaCl and <30% of MgSO4")            return "RecUF"
          }
          else if(permeability == ">5-fold comparing to the design value"){
            if(rejection == "Lost of Rejection <15% comparing the design")    return "ReuNF"
            else if(rejection == "<10% of NaCl and <30% of MgSO4")            return "RecUF"
          }
        }
      },

      //frontend
      get_membrane_reuse_color(){
        let code  = this.get_membrane_reuse();
        let reuse = this.membrane_reuse_options.find(o=>o.code==code);
        if(reuse) return reuse.color;
        else return "";
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
          }
        } else
          return fouling_value;
      },
    },
    computed: {

    }
  }
</script>


<style scoped>
  table{
    border-collapse:collapse;
  }
  td, th {
    padding:0.2em;
  }
  .membrane_reuse {
    padding:1em;
    font-size:large;
    border:1px solid #ccc;
  }
</style>
