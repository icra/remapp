let app2 = new Vue({
  el:"#app2",
  data:{
    questions:[
      {code:"T",  name:"Type of membrane",          value:null, answers:["Reverse osmosis","Nanofiltration","Ultrafiltration","Microfiltration","Other"]},
      {code:"R",  name:"Rejection",                 value:null, answers:["Lost of Rejection <15% comparing the design","<10% of NaCl and <30% of MgSO4"]},
      {code:"P",  name:"Variation of Permeability", value:null, answers:["<1-fold comparing to the design value","[1-5]-fold comparing to the design value",">5-fold comparing to the design value"]},
    ],

    membrane_reuse_options:[
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
    get_membrane_reuse(){
      let get_question = this.get_question_by_code;
      let membrane_type = get_question("T").value;
      let permeability = get_question("P").value;
      let rejection = get_question("R").value;

      //Type of membrane
      if(membrane_type == "Lost of Rejection <15% comparing the design")                       return "ReuRO";
      //if(get_question("R").value == "Ultrafiltration")             return "ReuRO";
      //if(get_question("R").value == "Microfiltration")             return "ReuRO";

      //Membrane configuration
      //if(get_question("C").value == "Other")                       return "ReuRO";

      //Membrane size
      //if(get_question("S").value == "Other")                       return "ReuRO";

      return "";
    },

    //frontend
    get_membrane_reuse_color(){
      let code  = this.get_membrane_reuse();
      let reuse = this.membrane_reuse_options.find(o=>o.code==code);
      if(reuse) return reuse.color;
      else return "";
    },
  }
});