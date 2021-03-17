<template lang="pug">
  div.remapToolbox(ref="content")
    div.header
      Header(:data_version="this.excel_version")
    div.content
      b-container.p-2.mx-lg-5.mx-3(fluid="true")
        b-row
          b-col(sm="12" xl="4")
            b-navbar.pt-0
              .sidebar-header
                b-row.mb-0.pb-0
                  b-col()
                    p.h4.mb-2(style="font-weight: var(--bold-text); text-align:left display:inline-block") Survey <b-icon id="info" icon="exclamation-circle-fill" variant="dark"></b-icon>
                      b-tooltip(target="info")  End-of-life membranes

                  b-col(cols="auto" align-h="end")
                    b-button.clearButt(@click="download") MAKE PDF
                    b-button.clearButt(@click="clearValues") CLEAR ALL
                b-dropdown-divider(style="height: 0; margin: 0 0 0.75rem 0; overflow: hidden; border-top: 1px solid var(--light-gray-primary);")
                div(style="overflow-y: scroll; max-height: 70vh;").pr-2
                  template(v-for="q in questions1" :id="q.code" style="overflow-y: auto")
                    b {{q.name}}
                    template(v-if="q.tooltip")
                      b.asterisk_mark(:id="'tooltip'+q.code")  *
                      b-tooltip(:target="'tooltip'+q.code")  {{ q.tooltip }}

                    multiselect(
                      v-model="q.value",
                      :options="q.answers",
                      placeholder="Pick a value",
                      :disabled="is_disabled(q)",
                      :show-labels="false",
                      open-direction="bottom"
                    ).multiselect
                  hr( style="margin-top: 25px; height: 15px; margin: auto; overflow: hidden; border-top: 1px solid var(--light-gray-primary); width: 70%;")

                  template(v-for="q in questions2" :id="q.code" style="overflow-y: auto")
                    b {{q.name}}
                    template(v-if="q.tooltip")
                      b.asterisk_mark(:id="'tooltip'+q.code")  *
                      b-tooltip(:target="'tooltip'+q.code")  {{ q.tooltip }}

                    multiselect(
                      v-model="q.value",
                      :options="q.answers",
                      placeholder="Pick a value",
                      :disabled="is_disabled(q)",
                      :show-labels="false",
                      open-direction="bottom"
                    ).multiselect
                  hr(style="margin-top: 25px; height: 15px; margin: auto; overflow: hidden; border-top: 1px solid var(--light-gray-primary); width: 70%;")
                  template(v-for="q in questions3" :id="q.code" style="overflow-y: auto")
                    b {{q.name}}
                    template(v-if="q.tooltip")
                      b.asterisk_mark(:id="'tooltip'+q.code")  *
                    b-tooltip(:target="'tooltip'+q.code")  {{ q.tooltip }}

                    multiselect(
                      v-model="q.value",
                      :options="q.answers",
                      placeholder="Pick a value",
                      :disabled="is_disabled(q)",
                      :show-labels="false",
                      open-direction="bottom"
                    ).multiselect
          b-col
            //router-view
            <!--survey 2 outputs-->
            div
              b-tabs(content-class="" fill)
                b-tab#solutions(title="SOLUTIONS" active).p-3.tabBox
                  b Alternative end-of-life membrane management
                  div.membrane_reuse(v-for="s  in get_available_solutions")
                    div(style="display: grid; grid-template-columns: 1fr 10fr; grid-gap:20px").ml-0
                      div(:style="`background:${s.color}`" )
                      div
                        p.mb-0 {{ s.name }}

                  template(v-if="result_survey_2 !== null")
                    div.membrane_reuse

                      template(v-if="result_survey_2.input.membrane_reuse === 'Indirect recycling'")
                        b-col.py-2.px-0(style="background: var(--gray-for-tables)" class="text-center justify-content-center")
                          b {{ this.result_survey_2.input.membrane_reuse }}

                      template(v-else)
                        div
                          b-row(style="height:fit-content; " align-v="center")
                            b-col(cols="auto" style="height: 45px").mx-3.p-0
                              icon-base(class="solid-border" :icon-color="this.get_solutions_for_case_studies[0].color" width="40" weight="40" )
                                template(v-if="this.get_solutions_for_case_studies[0].code === 'RecNF' || this.get_solutions_for_case_studies[0].code === 'RecUF'")
                                  recycle-icon
                                template(v-else)
                                  reuse-icon
                            b-col.py-2.px-0(style="background: var(--gray-for-tables)" class="text-center justify-content-center")
                              b {{ this.result_survey_2.input.membrane_reuse }}

                      b-col.px-0
                        br
                        b Recommended process to produce second-hand membranes
                        b-table(
                          stacked
                          small
                          outlined
                          :fields="table_fields"
                          :items="[result_survey_2.survey2Result]"
                        )
                        p(style="font-size: small") <b>* Exposure dose (ppm h): </b> membrane exposure to a free chlorine solution with a certain concentration (ppm) during a specific time (h).
                  template(v-else)
                    br
                    b Recommended process to produce second-hand membranes
                    b.asterisk_mark#tooltip  *
                    b-tooltip(target="tooltip" ) Please answer 'Salt Rejection' and 'Variation of Permeability' to see the considerations to reproduce the recommended second-hand membranes
                b-tab#caseStudies(title="CASE STUDIES").p-3.tabBox
                  CaseStudies(
                    v-bind:solution_code="this.get_solutions_for_case_studies"
                    v-bind:membrane_type="this.get_question_by_code('T').value"
                    :salt_rejection="this.get_question_by_code('R').value"
                    :permeability="this.get_question_by_code('PV').value"
                    :case-studies="this.caseStudies_info"
                    v-bind:image_ids="this.result_survey_2"
                    :table_fields="this.case_studies_table_fields"
                    )

    //vue-cookie-accept-decline(
      //:ref="'myPanel1'"
      //:elementId="'myPanel1'"
      //:debug="false"
      //:position="'bottom-left'"
      //:type="'floating'"
      //:disableDecline="false"
      //:transitionName="'slideFromBottom'"
      //:showPostponeButton="false")
      //div(slot="postponeContent" ) &times;
      //div(slot="message" ) This site uses cookies to offer you a better browsing experience. Find out more on <a v-b-modal.cookies>how we use them and how you can change your settings.</a>.
      //div(slot="declineContent") Decline
      //div(slot="acceptContent" ) Got it!

    //Cookies
    div.cookies(v-if="this.cookies_open")
      cookie-law(
        buttonDecline = true
        v-on:accept="accept_cookies()"
        v-on:decline="decline_cookies()"
        buttonText="Accept"
        )
        div(slot="message") This site uses cookies to offer you a better browsing experience. Find out more on how we use them and how you can change your settings <a class="moreInfo" @click="openCookiesModal()">HERE</a>.

    div.cookiePolicy
      b-modal(header-bg-variant="secondary" header-text-variant="light" size="xl" role="dialog" title="COOKIE POLICY" @hidden="closeCookiesModal()" @close="closeCookiesModal()" id="cookies" scrollable button-size="sm" )
        include CookiePolicy.html

    footer.footer
      Footer

</template>

<script>
  import Multiselect from 'vue-multiselect'
  import CaseStudies from "./CaseStudies";
  import Footer from "./Footer";
  import Header from "./Header";
  import _ from "lodash";
  import XLSX from 'xlsx';
  import IconBase from "./IconBase";
  import RecycleIcon from "./icons/RecycleIcon";
  import ReuseIcon from "./icons/ReuseIcon";
  import CookieLaw from 'vue-cookie-law';
  import VueCookieAcceptDecline from 'vue-cookie-accept-decline';
  import {bootstrap} from 'vue-gtag';
  import Cookies from "@/components/Cookies";

  export default {
    name: "Menus",
    components: {
      Cookies,
      ReuseIcon,
      RecycleIcon,
      IconBase,
      Header,
      Footer,
      CaseStudies,
      Multiselect,
      CookieLaw,
      VueCookieAcceptDecline
    },
    data() {
      return {
        cookies_open: false,
        excel_version: {
          version_number: null,
          created: null,
          last_modified: null
        },
        table_fields: [
          {key: 'chlorine_qualitative',   label: "Free Chlorine Exposure Dose (qualitative)"},
          {key: 'env_reduction',          label: "Potential Environmental Reduction compared to producing new membranes"},
          {key: 'env_cost',               label: "Potential Economical Cost (€ / membrane)"},
          {key: 'economical_saving',      label: "Potential Economical Saving compared to producing new membranes"},
          {key: 'skilled_crew',           label: "Skilled Crew"},
          {key: 'potential_application',  label: "Potential Application"}
        ],
        case_studies_table_fields: [
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
          {key: 'results_products', label: "Main results / products"},
          {key: 'mailing_address', label: "Mailing address of the supervising organization"},
          {key: 'contacts', label: "Contacts"}
        ],
        questions1: [
          // Survey 1
          {
            code: "T",
            name: "Type of membrane",
            value: null,
            answers: ["Reverse osmosis brackish model design", "Reverse osmosis sea model design", "Nanofiltration", "Ultrafiltration", "Microfiltration", "Other"]
          },
          {code: "W", name: "Membrane weight", value: null, answers: ["<17kg", "17-25 kg", ">25kg", "Don't know"]},
          {code: "ED", name: "External damage", value: null, answers: ["No", "Yes", "Don't know"]},
          {
            code: "ST",
            name: "Membrane storage",
            value: null,
            answers: ["Wet", "Immersed in a water solution", "Dry", "Don't know"],
            tooltip: "How did you store the end-of-life membranes after their replacement?"
          },
          {code: "D", name: "Storage duration", value: null, answers: ["<1 month", ">1 month", "Don't know"], tooltip: "For how long did you store the membranes after their replacement?"},
        ],
        questions2: [
          // Survey 1
          {code: "F", name: "Fouling type", value: null, answers: ["Inorganic scaling", "Other", "Don't know"], tooltip: "Insert “Inorganic – Scaling” if you think the membranes have salt precipitation. For organic, biofouling, colloidal, or clay fouling insert “Other”"},
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
            answers: ["Single pass", "Double pass - single stage", "Double pass - double stage", "Mix", "Don't know"],
            tooltip: "In which rack were the membranes placed?"
          },
          {
            code: "WT",
            name: "Type of water",
            value: null,
            answers: ["Seawater", "Brackish water", "Wastewater", "Chemical industry", "Food industry", "River water", "Don't know", "Other"],
            tooltip: "Feed water to be treated by the membranes"
          },
        ],
        questions3: [
          // Survey 2
          {
            code: "R",
            name: "Salt rejection",
            value: null,
            answers: ["<15%", ">10% of NaCl and >30% of MgSO4", "<10% of NaCl and <30% of MgSO4"],
            tooltip: "Comparing to the design value"
          },
          {
            code: "PV",
            name: "Variation of permeability or flux or water production",
            value: null,
            answers: ["<1-fold", "[1-5]-fold", ">5-fold"],
            tooltip: "Comparing to the design value"

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
          {code: "NEIR", name: "Not enough information. Potentially, indirect recycling.", color: "#ffff00"},
          {
            code: "IRC",
            name: "Indirect recycling of the membranes placed in the second stage. Potentially, apply intensive " +
              "cleaning before considering an alternative management for the membranes placed in the first stage.",
            color: "#f79447"
          },
        ],
        membraneReuse_info: [],
        caseStudies_info: [],
        fetches: []
      }
    },
    created: function() {
      let url = "/case_studies.xlsx"
      let _this = this;

      if(!_this.getCookies() === true) _this.cookies_open = true;
      let oReq = new XMLHttpRequest();

      oReq.open("GET", url, true);
      oReq.send();
      oReq.responseType = "arraybuffer";
      oReq.onload = function () {
        let arrayBuffer = oReq.response;
        let data = new Uint8Array(arrayBuffer); //convert data to binary string
        let arr = new Array();
        for(let i = 0; i !== data.length; i++)
          arr[i] = String.fromCharCode(data[i]);
        let str = arr.join("");

        let workbook = XLSX.read(str, {type: "binary"});    //call XLSX
        let first_sheet_name = workbook.SheetNames[0];
        let second_sheet_name = workbook.SheetNames[1];
        let third_sheet_name = workbook.SheetNames[2];
        let worksheet_1 = workbook.Sheets[first_sheet_name];      //get 1st worksheet
        let worksheet_2 = workbook.Sheets[second_sheet_name];     //get 2nd worksheet
        let worksheet_3 = workbook.Sheets[third_sheet_name];      //get 3rd worksheet
        let membraneReuse_data = XLSX.utils.sheet_to_json(worksheet_1, {raw: true});  //1st sheet data
        let caseStudies_data = XLSX.utils.sheet_to_json(worksheet_2, {raw: true});    //2nd sheet data
        let version_data = XLSX.utils.sheet_to_json(worksheet_3, {raw: true});    //2nd sheet data

        _this.parse_membraneReuse_data(membraneReuse_data);
        _this.parse_caseStudies_data(caseStudies_data);
        _this.excel_version = version_data[0];

      }
    },
    methods: {
      closeCookiesModal(){
        this.cookies_open = true;
      },
      openCookiesModal(){
        this.$bvModal.show('cookies');
        this.cookies_open = false; //close cookies banner
      },
      accept_cookies(){
        // eslint-disable-next-line
        bootstrap().then(gtag =>{
          this.cookies_open = false;
          //localStorage.setItem('GDPR:accepted', 'true');
          //location.reload();
          //console.log(localStorage);
        });
        console.log("Accepted COOKIES")
      },
      decline_cookies(){
        this.cookies_open = false;
        //localStorage.setItem('GDPR:accepted', 'false');
        console.log("Declined COOKIES")
      },
      getCookies() {
        return localStorage.getItem('cookies:accepted');
      },
      parse_membraneReuse_data(data){
        let _this = this;
        data.forEach(function (row){
          let caseNumbers;
          if(typeof row['image_id'] === "string")
            caseNumbers = Array.from(row['image_id'].split(','),Number);
          else if(typeof row['image_id'] === "number")
            caseNumbers = [row['image_id']];
          else
            caseNumbers = []

          /* add object to "membrane reuse options" as possible output after survey 2 is completed */
          const aux = {
            input: {
              membrane_type: row['membrane_type'],
              permeability: row['permeability'],
              salt_rejection: row['salt_rejection'],
              membrane_reuse: row['membrane_reuse'],
            },
            survey2Result: {
              chlorine_quantitative: row['chlorine_quantitative'],
              chlorine_qualitative: row['chlorine_qualitative'],
              env_reduction: row['env_reduction'],
              env_cost: row['env_cost'],
              economical_saving: row['economical_saving'],
              skilled_crew: row['skilled_crew'],
              potential_application: row['potential_application']
            },
            caseNumbers: caseNumbers
          }
          //find if it already exists the object before adding to the array or "membrane reuse options".
          let idx = _this.membraneReuse_info.findIndex(o =>
              (o.input.membrane_type === aux.input.membrane_type && o.input.permeability === aux.input.permeability
              && o.input.salt_rejection === aux.input.salt_rejection && o.input.membrane_reuse === aux.input.membrane_reuse));
          if(idx === -1) _this.membraneReuse_info.push(aux);

        });
      },
      parse_caseStudies_data(data){
        let _this = this;
        _this.caseStudies_info = data;
      },
      async download() {

        let _this=this

        //Survey
        let questions = this.questions1.concat(this.questions2).concat(this.questions3)
        let items= []
        questions.forEach(function (q) {
          items.push([{text:q.name, bold: true}, q.value ])
        })

        //Alternative end-of-life membrane management
        let alternatives = []
        this.available_solutions.forEach(function (s) {
          alternatives.push(s.name)
        })


        let pdfMake = require('pdfmake/build/pdfmake.js')
        if (pdfMake.vfs == undefined){
          let pdfFonts = require('pdfmake/build/vfs_fonts.js')
          pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }
        let dd = {
          pageSize: 'A4',
          pageMargins: [50, 60, 50, 70],
          footer: {
            image: await _this.getBase64ImageFromURL('footer.png'),
            width: 500,
            margin: [50, 10]
          }

        }

        dd['content'] = [

          {text: 'Report generated', style: 'header'},
          {
            text: [
              "Automatically generated content. For more information, please visit ",
              {text: 'remapp.icra.cat', link: 'https://remapp.icra.cat', style: 'link'}
            ]
          },
          {text: 'Survey', style: 'subheader'},
          {
            style: 'surveyTable',
            table: {
              widths: ['*', 200],
              body: items
            }
          },
          {text: 'Alternative end-of-life membrane management', style: 'subheader'},
          {
            ul: alternatives
          }
        ]
        dd['styles'] = {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          surveyTable: {
            margin: [0, 5, 0, 15]
          },
          link: {
            color: 'blue',
            decoration: 'underline'
          },
        }

        //Recommended process to produce second-hand membranes
        dd.content.push({text: 'Recommended process to produce second-hand membranes', style: 'subheader'})
        if (this.result_survey_2 !== null) {
          let recommendedProcess = []
          let o = this.result_survey_2.survey2Result

          this.table_fields.forEach(function (e){
            recommendedProcess.push([{text:e.label ,bold: true}, o[e.key]])
          })


          dd.content.push({
            style: 'surveyTable',
            table: {
              body: recommendedProcess
            }
          })
        }else{
          dd.content.push("No recommendations available")
        }

        //Case Studies
        dd.content.push({text: 'Case studies', style: 'subheader'})
        if (this.result_survey_2 != null){
          for (const c of this.result_survey_2.caseNumbers) {

            let caseStudyPDF = []
            let caseStudy = _this.caseStudies_info.find(i => i.image_id == c)
            //console.log(caseStudy)
            _this.case_studies_table_fields.forEach(function (e){
              let title = {text:e.label, bold: true}
              let val = caseStudy[e.key]
              if(val != undefined){
                if (e.key == 'website' || e.key == 'results_products'){
                  val = {text: val, link: val, style: 'link'}
                }
              }else{
                val = ''
              }

              caseStudyPDF.push([title, val])
            })
            //console.log(caseStudy)
            dd.content.push({
              style: 'surveyTable',
              table: {
                body: caseStudyPDF
              }
            })

            let image = "caseStudies/"+caseStudy.image_id + ".JPG"

            dd.content.push({
              image: await _this.getBase64ImageFromURL(image),
              width: 500
            })


          }

        }else{
          dd.content.push("No case studies available")
        }

        pdfMake.createPdf(dd).download('remappReport.pdf')
      },

      getBase64ImageFromURL(url) {
        return fetch(url)
            .then((response) => response.blob())
            .then(
                (blob) =>
                    new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result);
                      reader.onerror = reject;
                      reader.readAsDataURL(blob);
                    })
            );
      },


      get_question_by_code(code) {
        let questions = this.questions1.concat(this.questions2).concat(this.questions3)
        return questions.find(q => q.code == code);
      },
      clearValues() {
        this.questions1.forEach(function (item) {
          item.value = null;
        });
        this.questions2.forEach(function (item) {
          item.value = null;
        });
        this.questions3.forEach(function (item) {
          item.value = null;
        });
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
        let get_question = this.get_question_by_code;
        let type = get_question("T").value;
        let weight = get_question("W").value;


        if (code == "PV" || code == "R") {
          if (this.available_solutions.find(s => s.code === "LI") || this.available_solutions.find(s => s.code === "IR")) {
            return true;
          }
        }else if(type == "Ultrafiltration" || type == "Microfiltration" || type == "Other") return code != "T"
        else if(weight == ">25kg") return code != "W"


  return false;
      },
      remove_solutions(codes){
        for(let i=0; i<codes.length; i++){
          //console.log("deleting "+codes[i]);
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
              "Membranes might need to be rehydrated using an ethanol solution.",                                     color:"#c2d59a"},
          {code:"IC", name:"Intensive cleaning before considering an alternative management to landfill disposal " +
              "or incineration",                                                                                                color:"#0cae51"},
          {code:"NEIM", name:"Not enough information. Potentially, membranes are suitable for alternative management.",         color:"#4dabc5"},
          {code:"NEIC", name:"Not enough information. Potentially, apply intensive cleaning before alternative management.",    color:"#35849b"},
          {code:"NEIR", name:"Not enough information. Potentially, indirect recycling.",                                        color:"#ffff00"},
          {code:"IRC", name:"Indirect recycling of the membranes placed in the second stage. Potentially, " +
              "apply intensive cleaning before considering an alternative management for the membranes " +
              "placed in the first stage.",                                                                                     color:"#f79447"},
        ]
      },
      get_membrane_reuse(){
        this.init_available_solutions();
        let get_question = this.get_question_by_code;
        let type = get_question("T").value;
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

          //Membrane weight
          if (weight == ">25kg") {
            this.remove_solutions(["IR", "AM", "AMR", "IC", "NEIM", "NEIC", "NEIR", "IRC"]);
            return;
          } else if (weight == "<17kg" || weight == "17-25 kg") {
            this.remove_solutions(["LI"]);
            //External damage
            if (ext_damage == "Yes") {
              this.remove_solutions(["AM", "AMR", "IC", "NEIM", "NEIC", "NEIR", "IRC"]);
              return;
            } else if (ext_damage == "No") {
              //Fouling
              if (fouling == "Inorganic scaling") {
                this.remove_solutions(["AM", "AMR", "IRC"]);
                //Membrane storage
                if (storage == "Immersed in a water solution" || storage == "Wet") {
                  //Weight
                  if (weight == "17-25 kg") {
                    this.remove_solutions(["IC", "NEIM", "NEIC", "NEIR"]);
                    return;
                  } else if (weight == "<17kg") {
                    this.remove_solutions(["IR", "NEIM", "NEIC", "NEIR"]);
                    return;
                  }
                } else if (storage == "Dry") {
                  this.remove_solutions(["IC", "NEIM", "NEIC", "NEIR"]);
                  return;
                }
              } else if (fouling == "Other") {
                //Membrane storage
                if (storage == "Immersed in a water solution" || storage == "Wet") {
                  this.remove_solutions(["IR", "AMR", "IRC"]);
                  //Weight
                  if (weight == "17-25 kg") {
                    this.remove_solutions(["AM", "NEIM", "NEIC", "NEIR"]);
                    return;
                  } else if (weight == "<17kg") {
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
                      } else if (position == "Mix" && (cause_replacement == "Granted budget for replacement" || cause_replacement == "Don't know")) {
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
                    } else if (weight == "<17kg") {
                      this.remove_solutions(["NEIM", "NEIC", "NEIR", "IRC", "IR"]);
                      return;
                    }
                  } else if (storage_duration == ">1 month") {
                    this.remove_solutions(["IC", "AM", "IRC"]);
                    //Weight
                    if (weight == "17-25 kg") {
                      this.remove_solutions(["NEIM", "NEIC", "NEIR", "AMR"]);
                      return;
                    } else if (weight == "<17kg") {
                      this.remove_solutions(["NEIM", "NEIC", "NEIR", "IR"]);
                      return;
                    }
                  }
                }
              }
            }
          }


        }
        //Complementary information to the decision-making tree
        if((type == "Reverse osmosis brackish model design" || type == "Reverse osmosis sea model design" || type == "Nanofiltration")) {
          if (weight == "<17kg" && (ext_damage == "No" || ext_damage == "Don't know") && (fouling == "Other" || fouling == "Don't know")) this.remove_solutions(["NEIC", "NEIR", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
          else if (weight == "<17kg" && storage == "Dry" && fouling == "Inorganic scaling") this.remove_solutions(["NEIC", "NEIR", "NEIM", "LI", "AM", "AMR", "IC", "IRC"]);
          else if (weight == "<17kg" && (storage == "Wet" || storage == "Immersed in a water solution") && ext_damage == "Don't know" && fouling == "Inorganic scaling") this.remove_solutions(["NEIC", "NEIR", "NEIM", "LI", "AM", "AMR", "IC", "IRC"]);

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
            else if ((position == "Double pass - double stage" || position == "Mix" || position == "Don't know") && storage == "Dry" && storage_duration == "Don't know" && ext_damage == "Don't know" && fouling == "Other") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
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
            else if (cause_replacement == "Lost of membrane integrity" && (position == "Mix" || position == "Don't know") && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Other") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Don't know" && position == "Mix" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "Don't know" && fouling == "Other") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (cause_replacement == "Lost of membrane integrity" && position == "Don't know" && storage == "Dry" && storage_duration == "<1 month" && ext_damage == "No" && fouling == "Other") this.remove_solutions(["NEIM", "NEIC", "IR", "LI", "AM", "AMR", "IC", "IRC"]);
            else if (fouling == "Inorganic scaling") this.remove_solutions(["NEIC", "NEIR", "NEIM", "LI", "AM", "AMR", "IC", "IRC"]);


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
          if (permeability == "<1-fold") {
            if (rejection == "<15%") return "RegRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "RecNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == "[1-5]-fold") {
            if (rejection == "<15%") return "ReuRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == ">5-fold") {
            if (rejection == "<15%") return "ReuRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          }
        } else if (type == "Reverse osmosis sea model design") {
          if (permeability == "<1-fold") {
            if (rejection == "<15%") return "RegRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "RecNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == "[1-5]-fold") {
            if (rejection == "<15%") return "ReuRO"
            else if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == ">5-fold") {
            if (rejection == ">10% of NaCl and >30% of MgSO4") return "ReuNF"
            else if (rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
            else if (rejection == "<15%") return "ReuRO"
          }
        } else if (type == "Nanofiltration") {
          if (permeability == "<1-fold") {
            if (rejection == "<15%") return "RegNF"
            else if (rejection == ">10% of NaCl and >30% of MgSO4" || rejection == "<10% of NaCl and <30% of MgSO4") return "RecUF"
          } else if (permeability == "[1-5]-fold" || permeability == ">5-fold") {
            if (rejection == ">10% of NaCl and >30% of MgSO4" || rejection == "<15%") return "ReuNF"
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
          } else if (water_type == "River water") {
            return "Other";
          } else {
            return fouling_value;
          }
        } else
          return fouling_value;
      },
      adapt_survey_2_result(solution){
        //let ret = solution.survey2Result;
        let aux = {"membrane_reuse": solution.input.membrane_reuse}
        return Object.assign(aux, solution.survey2Result);
        //return solution.survey2Result;
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

        let ret;
        if (survey2Output) {
          auxObject = {
            membrane_type: membrane,
            permeability: perm,
            salt_rejection: rejection,
            membrane_reuse: survey2Output.name,
          };
          ret = this.membraneReuse_info.find(i => _.isEqual(i.input, auxObject));
        }
        //Indirect Recycling
        else if(this.available_solutions.length === 1 && this.available_solutions[0].code === "IR" && (membrane === "Reverse osmosis brackish model design" || membrane === "Reverse osmosis sea model design")){
          ret = this.membraneReuse_info.find(i => i.input.membrane_type === membrane && i.input.membrane_reuse === "Indirect recycling");
        }
        else{
          return null;
        }

        if(!ret)
          return null;
        else
          return ret;

      },
      get_solutions_for_case_studies() {
        let solutions = [];
        let aux = this.get_management_survey2();
        let options = this.membrane_reuse_options;
        //console.log("solutions: ",this.available_solutions);
        //console.log("aux: ", aux);
        this.available_solutions.forEach(function (sol) {
          let code = sol.code;
          if((code === "AM" || code === "AMR" || code === "IC")){
            if(aux !== ""){
              let survey2Output = options.find(q=>q.code == aux);
              solutions.push(survey2Output);
            }
          } else
            solutions.push(sol);
        });
        solutions = [ ...new Set(solutions) ]; //removes duplicate solutions.
        return solutions;

      },
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

  .Cookie--base {
    background: var(--dark-gray-primary);
    color: white;
  }

  .Cookie--base .Cookie__button--decline {
    background: var(--gray-for-tables);
    color: #727272;
  }

</style>

<style scoped>

  a.moreInfo{
    color: var(--green-primary);
  }

  a:hover.moreInfo {
    color: var(--blue-primary);
    text-decoration: underline;
  }
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
    //background-color: var(--dark-gray-primary);
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
