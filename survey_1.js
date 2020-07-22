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
      {name:"Landfill disposal or incineration", color:"red"},
      {name:"Indirect recycling",                color:"purple"},
    ],
  },
  methods:{
    get_question_by_code(code){
      return this.questions.find(q=>q.code==code);
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
      if(get_question("T" ).value == "Other")                       return "Landfill disposal or incineration";
      if(get_question("C" ).value == "Other")                       return "Landfill disposal or incineration";
      if(get_question("S" ).value == "Other")                       return "Landfill disposal or incineration";
      if(get_question("W" ).value == "Other")                       return "Landfill disposal or incineration";
      if(get_question("ED").value == "Yes")                         return "Landfill disposal or incineration";
      if(get_question("ST").value == "Dry")                         return "Indirect recycling";
      if(get_question("D" ).value == ">1 month")                    return "Indirect recycling";
      if(get_question("F" ).value == "Inorganic scaling")           return "Indirect recycling";
      if(get_question("RP").value == "Lost of membrane integrity")  return "Indirect recycling";
      if(get_question("P" ).value == "Double pass - double stage ") return "Indirect recycling";

      return "answer survey 1 to get a membrane reuse";
    },

    //frontend
    get_membrane_reuse_color(){
      let name  = this.get_membrane_reuse();
      let reuse = this.membrane_reuse_options.find(o=>o.name==name);
      if(reuse) return reuse.color;
      else return "";
    },
  },
});
