let app = new Vue({
  el:"#app",
  data:{
    questions:[
      {code:"T",  name:"Type of membrane",       value:null, answers:["Reverse osmosis","Nanofiltration","Ultrafiltration","Microfiltration","Other"]},
      {code:"C",  name:"Membrane configuration", value:null, answers:["Spiral-wound","Other"]},
      {code:"S",  name:"Membrane size",          value:null, answers:["Length: 1m. Diameter: 0.2m", "Other"]},
      {code:"W",  name:"Membrane weight",        value:null, answers:["<17kg","17-25 kg", ">25kg","Don't know"] },
      {code:"ED", name:"External damage",        value:null, answers:["No","Yes","Don't know"] },
      {code:"F",  name:"Fouling type",           value:null, answers:["Inorganic scaling","Other","Don't know"] },
      {code:"ST", name:"Membrane storage",       value:null, answers:["Wet","Immersed in a water solution","Dry","Don't know"] },
      {code:"D",  name:"Storage duration",       value:null, answers:["<1 month",">1 month","Don't know"] },
      {code:"RP", name:"Cause of replacement",   value:null, answers:["Granted budget for replacement","Operating more than the expected lifespan","Lost of membrane integrity","Don't know"] },
      {code:"P",  name:"Membrane position",      value:null, answers:["Single pass","Double pass - single stage","Double pass - double stage","Mix","Don't know"] },
      {code:"WT", name:"Type of water",          value:null, answers:["Seawater","Brackish water","Wastewater","Chemical industry","Food industry"] },
    ],

    membrane_reuse_options:[
      {code:"LI", name:"Landfill disposal or incineration",                                                                color:"#be514e"},
      {code:"IR", name:"Indirect recycling",                                                                               color:"#604b79"},
      {code:"AM", name:"Membranes are suitable for an alternative management to landfill disposal or incineration.",       color:"#9ab959"},
      {code:"AMR", name:"Membranes are suitable for an alternative management to landfill disposal or incineration. " +
          "Membranes might be need to be rehydrated using 50% w/w ethanol during 15 min.",                      color:"#c2d59a"},
      {code:"AMS", name:"Membranes are suitable for an alternative management to landfill disposal or incineration. " +
          "Please fill the following survey to estimate which alternative would suit better.",                  color:"#9ab959"},


      {code:"IC", name:"Intensive cleaning before considering an alternative management to landfill disposal " +
          "or incineration",                                                                                    color:"#0cae51"},
      {code:"NEIM", name:"Not enough information. Potentially, membranes are suitable for alternative management.",          color:"#4dabc5"},
      {code:"NEIC", name:"Not enough information. Potentially, apply intensive cleaning before alternative management.",     color:"#35849b"},
      {code:"NEIR", name:"Not enough information. Potentially, indirect recycling.",                                         color:"#ffff00"},
      {code:"IRC", name:"Indirect recycling of those membranes placed in the second stage. Potentially, " +
          "apply intensive cleaning before considering an alternative management for those membranes " +
          "placed in the first stage.",                                                                         color:"#f79447"},
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

      if(code=="WT"){
        if(this.get_question_by_code('F').value=="Don't know") return true;
        return false;
      }

      return true;
    },

    get_membrane_reuse(){
      let get_question = this.get_question_by_code;

      //For "Don't Know" answer for "Fouling type"
      if(get_question("WT").value == "Seawater" && !(get_question("P" ).value == "Double pass - double stage" || get_question("P" ).value == "Mix")){
        this.questions[5].value = "Other";
      }
      else if(get_question("WT").value == "Seawater" && (get_question("P" ).value == "Double pass - double stage" || get_question("P" ).value == "Mix")){
        this.questions[5].value = "Inorganic scaling";
      }
      else if(get_question("WT").value == "Brackish water" && !(get_question("P" ).value == "Double pass - double stage" || get_question("P" ).value == "Mix")){
        this.questions[5].value = "Other";
      }
      else if(get_question("WT").value == "Brackish water" && (get_question("P" ).value == "Double pass - double stage" || get_question("P" ).value == "Mix")){
        this.questions[5].value = "Inorganic scaling";
      }
      else if(get_question("WT").value == "Wastewater" || get_question("WT").value == "Food industry" ){
        this.questions[5].value = "Other";
      }
      else if(get_question("WT").value == "Chemical industry"){
        this.questions[5].value = "Inorganic scaling";
      }

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

      if((get_question("T").value == "Reverse osmosis" || get_question("T").value == "Nanofiltration") && get_question("C").value == "Spiral-wound" && get_question("S").value == "Length: 1m. Diameter: 0.2m" && (get_question("W").value == "<17kg" || get_question("W").value == "17-25 kg")){
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

      return "";
    },

    //frontend
    get_membrane_reuse_color(){
      let code  = this.get_membrane_reuse();
      let reuse = this.membrane_reuse_options.find(o=>o.code==code);
      if(reuse) return reuse.color;
      else return "";
    },
  },
});
