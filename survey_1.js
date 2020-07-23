let app = new Vue({
  el:"#app",
  data:{
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
      {code:"R",  name:"Rejection",                 value:null, answers:["Lost of Rejection <15% comparing the design","<10% of NaCl and <30% of MgSO4"]},
      {code:"PV", name:"Variation of Permeability", value:null, answers:["<1-fold comparing to the design value","[1-5]-fold comparing to the design value",">5-fold comparing to the design value"]},
    ],

    membrane_reuse_options:[
      // Survey 1
      {code:"LI", name:"Landfill disposal or incineration",                                                                color:"#be514e"},
      {code:"IR", name:"Indirect recycling",                                                                               color:"#604b79"},
      {code:"AM", name:"Membranes are suitable for an alternative management to landfill disposal or incineration.",       color:"#9ab959"},
      {code:"AMR", name:"Membranes are suitable for an alternative management to landfill disposal or incineration. " +
          "Membranes might be need to be rehydrated using 50% w/w ethanol during 15 min.",                                 color:"#c2d59a"},
      {code:"AMS", name:"Membranes are suitable for an alternative management to landfill disposal or incineration. " +
          "Please fill the following survey to estimate which alternative would suit better.",                             color:"#9ab959"},
      {code:"IC", name:"Intensive cleaning before considering an alternative management to landfill disposal " +
          "or incineration",                                                                                               color:"#0cae51"},
      {code:"NEIM", name:"Not enough information. Potentially, membranes are suitable for alternative management.",        color:"#4dabc5"},
      {code:"NEIC", name:"Not enough information. Potentially, apply intensive cleaning before alternative management.",   color:"#35849b"},
      {code:"NEIR", name:"Not enough information. Potentially, indirect recycling.",                                       color:"#ffff00"},
      {code:"IRC", name:"Indirect recycling of those membranes placed in the second stage. Potentially, " +
          "apply intensive cleaning before considering an alternative management for those membranes " +
          "placed in the first stage.",                                                                                    color:"#f79447"},

      // Survey 2
      {code:"ReuRO", name:"Reuse as reverse osmosis membranes",                   color:"#00ff00"},
      {code:"ReuNF", name:"Reuse as nanofiltration-like membranes",               color:"#66ff66"},
      {code:"RegRO", name:"Regenerate to reuse as reverse osmosis membranes",     color:"#99ff33"},
      {code:"RegNF", name:"Regenerate to reuse as nanofiltration membranes",      color:"#ccff33"},
      {code:"RecNF", name:"Recycling into nanofiltration-like membranes",         color:"#33cc33"},
      {code:"RecUF", name:"Recycling into ultrafiltration-like membranes",        color:"#77933c"},
    ],
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

      //Type of membrane
      if(get_question("T").value == "Other")                       return "LI";
      if(get_question("T").value == "Ultrafiltration")             return "LI";
      if(get_question("T").value == "Microfiltration")             return "LI";

      //Membrane configuration
      if(get_question("C").value == "Other")                       return "LI";

      //Membrane size
      if(get_question("S").value == "Other")                       return "LI";

      //Membrane weight
      if(get_question("W").value == ">25kg")                       return "LI";

      if((get_question("T").value == "Reverse osmosis brackish model design" || get_question("T").value == "Reverse osmosis sea model design" || get_question("T").value == "Nanofiltration") && get_question("C").value == "Spiral-wound" && get_question("S").value == "Length: 1m. Diameter: 0.2m" && (get_question("W").value == "<17kg" || get_question("W").value == "17-25 kg")){
        //External damage
        if(get_question("ED").value == "Yes"){
          return "IR";
        }else if (get_question("ED").value == "No") {

          //Fouling
          if (get_question("F").value == "Inorganic scaling") {

            //Membrane storage
            if (get_question("ST").value == "Immersed in a water solution" || get_question("ST").value == "Wet") {

              //Weight
              if (get_question("W").value == "17-25 kg") return "IR";
              else if (get_question("W").value == "<17kg") return "IC";
            } else if (get_question("ST").value == "Dry") return "IR";
          } else if (get_question("F").value == "Other") {

            //Membrane storage
            if (get_question("ST").value == "Immersed in a water solution" || get_question("ST").value == "Wet") {
              //Weight
              if (get_question("W").value == "17-25 kg") return "IC";
              else if (get_question("W").value == "<17kg") return "AMS";

            } else if (get_question("ST").value == "Dry") {

              //Duration of storage after the replacement
              if (get_question("D").value == ">1 month") {

                //Weight
                if (get_question("W").value == "17-25 kg") {
                  if (get_question("P").value == "Mix" && (get_question("RP").value == "Operating more than the expected lifespan" || get_question("RP").value == "Lost of membrane integrity" || get_question("RP").value == "Don't know")) {
                    //2*
                    return "IRC";
                  } else if (get_question("P").value == "Single pass" || get_question("P").value == "Double pass - single stage" || get_question("P").value == "Mix") {
                    //1*
                    return "IC";
                  } else if (get_question("P").value == "Double pass - double stage") {
                    //3*
                    return "IR";
                  }
                } else if (get_question("W").value == "<17kg") return "AMR";
              } else if (get_question("D").value == "<1 month") {

                //Weight
                if (get_question("W").value == "17-25 kg") return "IC";
                else if (get_question("W").value == "<17kg") return "AMS";
              }
            }
          }
        }
      }

      //Complementary information to the decision-making tree
      if((get_question("T").value == "Reverse osmosis brackish model design" || get_question("T").value == "Reverse osmosis sea model design" || get_question("T").value == "Nanofiltration") && get_question("C").value == "Spiral-wound" && get_question("S").value == "Length: 1m. Diameter: 0.2m") {

        if (get_question("W").value == "<17kg" && (get_question("ED").value == "No" || get_question("ED").value == "Don't know") && (get_question("F").value == "Other" || get_question("F").value == "Don't know")) return "NEIM";

        if (get_question("W").value == "17-25 kg" && (get_question("ST").value == "Immersed in a water solution" || get_question("ST").value == "Wet") && (get_question("ED").value == "No" || get_question("ED").value == "Don't know") && (get_question("F").value == "Other" || get_question("F").value == "Don't know")) return "NEIC";
        if ((get_question("P").value == "Single pass" || get_question("P").value == "Double pass - single stage") && get_question("W").value == "17-25 kg" && get_question("ST").value == "Dry" && get_question("D").value == "<1 month" && get_question("ED").value == "Don't know" && get_question("F").value == "Don't know") return "NEIC";
        if (get_question("RP").value == "Granted budget for replacement" && (get_question("P").value == "Single pass" || get_question("P").value == "Double pass - single stage" || get_question("P").value == "Mix") && get_question("W").value == "17-25 kg" && get_question("ST").value == "Dry" && get_question("D").value == "<1 month" && get_question("ED").value == "Don't know" && get_question("F").value == "Don't know") return "NEIC";
        if (get_question("RP").value == "Operating more than the expected lifespan" && get_question("P").value == "Don't know" && get_question("W").value == "17-25 kg" && get_question("ST").value == "Dry" && get_question("D").value == "<1 month" && get_question("ED").value == "Don't know" && get_question("F").value == "Don't know") return "NEIC";
        if (get_question("RP").value == "Don't know" && get_question("P").value == "Don't know" && get_question("W").value == "17-25 kg" && get_question("ST").value == "Dry" && get_question("D").value == "<1 month" && get_question("ED").value == "Don't know" && get_question("F").value == "Don't know") return "NEIC";
        if ((get_question("P").value == "Single pass" || get_question("P").value == "Double pass - single stage") && get_question("W").value == "17-25 kg" && get_question("ST").value == "Don't know" && get_question("D").value == "<1 month" && (get_question("ED").value == "No" || get_question("ED").value == "Don't know") && (get_question("F").value == "No" || get_question("F").value == "Don't know")) return "NEIC";
        if (get_question("RP").value == "Granted budget for replacement" && get_question("W").value == "17-25 kg" && get_question("ST").value == "Don't know" && get_question("D").value == "<1 month" && (get_question("ED").value == "No" || get_question("ED").value == "Don't know") && (get_question("F").value == "No" || get_question("F").value == "Don't know")) return "NEIC";
        if ((get_question("RP").value == "Granted budget for replacement" || get_question("RP").value == "Operating more than the expected lifespan") && get_question("P").value == "Don't know" && get_question("W").value == "17-25 kg" && get_question("ST").value == "Don't know" && get_question("D").value == "<1 month" && (get_question("ED").value == "No" || get_question("ED").value == "Don't know") && (get_question("F").value == "No" || get_question("F").value == "Don't know")) return "NEIC";
        if (get_question("RP").value == "Lost of membrane integrity" && (get_question("P").value == "Single pass" || get_question("P").value == "Double pass - single stage") && get_question("W").value == "17-25 kg" && get_question("ST").value == "Don't know" && get_question("D").value == "<1 month" && (get_question("ED").value == "No" || get_question("ED").value == "Don't know") && (get_question("F").value == "No" || get_question("F").value == "Don't know")) return "NEIC";


        if (get_question("W").value == "17-25 kg" && get_question("ST").value == "Don't know" && get_question("D").value == "Don't know" && get_question("ED").value == "Don't know" && get_question("F").value == "Don't know") return "IRC";
        if (get_question("RP").value == "Operating more than the expected lifespan" && (get_question("P").value == "Double pass - double stage" || get_question("P").value == "Mix") && get_question("W").value == "17-25 kg" && get_question("ST").value == "Don't know" && get_question("D").value == "<1 month" && (get_question("ED").value == "No" || get_question("ED").value == "Don't know") && (get_question("F").value == "No" || get_question("F").value == "Don't know")) return "IRC";
        if (get_question("RP").value == "Lost of membrane integrity" && (get_question("P").value == "Double pass - double stage" || get_question("P").value == "Mix" || get_question("P").value == "Don't know") && get_question("W").value == "17-25 kg" && get_question("ST").value == "Don't know" && get_question("D").value == "<1 month" && (get_question("ED").value == "No" || get_question("ED").value == "Don't know") && (get_question("F").value == "No" || get_question("F").value == "Don't know")) return "IRC";
        if ((get_question("P").value == "Double pass - double stage" || get_question("P").value == "Mix" || get_question("P").value == "Don't know") && get_question("W").value == "17-25 kg" && get_question("ST").value == "Dry" && get_question("D").value == "Don't know" && (get_question("ED").value == "No" || get_question("ED").value == "Don't know") && (get_question("F").value == "No" || get_question("F").value == "Don't know")) return "IRC";
        if (get_question("RP").value == "Lost of membrane integrity" && (get_question("P").value == "Mix" || get_question("P").value == "Don't know") && get_question("W").value == "17-25 kg" && get_question("ST").value == "Dry" && get_question("D").value == "<1 month" && (get_question("ED").value == "No" || get_question("ED").value == "Don't know") && (get_question("F").value == "No" || get_question("F").value == "Don't know")) return "IRC";
        if (get_question("RP").value == "Don't know" && get_question("P").value == "Mix" && get_question("W").value == "17-25 kg" && get_question("ST").value == "Dry" && get_question("D").value == "<1 month" && (get_question("ED").value == "No" || get_question("ED").value == "Don't know") && (get_question("F").value == "No" || get_question("F").value == "Don't know")) return "IRC";

        if ( get_question("W").value == "17-25 kg" && get_question("ST").value == "Dry" && get_question("D").value == ">1 month") return "IR";
        if (get_question("P").value == "Double pass - double stage" && get_question("W").value == "17-25 kg" && get_question("ST").value == "Dry") return "IR";
        
      }

      // reuse value according to survey_2

      return "";
    },

    //frontend
    get_membrane_reuse_color(){
      let code  = this.get_membrane_reuse();
      let reuse = this.membrane_reuse_options.find(o=>o.code==code);
      if(reuse) return reuse.color;
      else return "";
    },
  }, computed: {
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
  }
});
