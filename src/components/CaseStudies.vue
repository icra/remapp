<template lang="pug">
  .caseStudies
    b-container(fluid="true")
      //p {{ solutionCode }}
      template(v-if='solutionCode.length === 1')
        template(v-if="get_cases_to_show.length !== 0")
          b-row(v-for="c in get_cases_to_show" :key="c" )
            b-col(sm="10" xl="5" offset-sm="1" offset-xl="0" align-self="center")
              b-img(:src="get_case_path({c})" fluid style="max-width: 100%; max-height: 100%;")
            b-col(sm="12" xl="7" )
              //div(v-text="get_image_info({c})")
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
                  b-col(:style="`background:${solutionCode[0].color}`" sm="2")
                  b-col(sm="10") {{ solutionCode[0].name }}

      template(v-else)
        b-row
          b-col
            b Please, complete the survey to see case studies.

</template>

<script>

  import _ from 'lodash';
  //import XLSX from 'xlsx';
  //import survey_2 from "./components/survey_2";
  //import * as XLSX from "fs";
  //import XlsxJson from "./components/XlsxJson";

  export default {
    name: "CaseStudies",
    props: ['solutionCode', 'typeMembrane', 'saltRejection', 'permeability'],
    data: function () {
      return {
        file: null,
        mainPath: "/caseStudies/",
        images: [
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Regenerate to reuse as reverse osmosis membranes"
              },
            caseNumbers: [1, 2, 3, 4, 5, 6, 7]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Recycling into nanofiltration-like membranes"
              },
            caseNumbers: [8, 9, 10, 11, 12, 13, 6, 14]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 10, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 23, 2, 3, 4, 24, 25]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 10, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: ">5-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [23, 2, 3, 4, 24, 25]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: ">5-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis brackish model design",
                permeability: ">5-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 10, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Regenerate to reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 1, 8, 2, 3, 4, 5, 6, 27]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Recycling into nanofiltration-like membranes"
              },
            caseNumbers: [7, 28, 8, 9, 11, 12, 29, 13, 6, 14]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 23, 2, 3, 4, 8, 24, 25]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 18, 19, 15, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: ">5-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 23, 2, 3, 4, 8, 24, 25]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: ">5-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                typeMembrane: "Reverse osmosis sea model design",
                permeability: ">5-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Regenerate to reuse as nanofiltration membranes"
              },
            caseNumbers: [2]
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "<1-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "<1-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: "[1-5]-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: ">5-fold comparing to the design value",
                saltRejection: "<15% comparing to the design value",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: ">5-fold comparing to the design value",
                saltRejection: ">10% of NaCl and >30% of MgSO4",
                membraneReuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                typeMembrane: "Nanofiltration",
                permeability: ">5-fold comparing to the design value",
                saltRejection: "<10% of NaCl and <30% of MgSO4",
                membraneReuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                typeMembrane: null,
                permeability: null,
                saltRejection: null,
                membraneReuse: "Indirect recycling"
              },
            caseNumbers: [19,31,32,33,34,35,36,37,38,39]
          },

          // Survey 1
          /*{code: "LI",    caseNumbers: []},
          {code: "IR",    caseNumbers: [19,31,32,33,34,35,36,37,38,39]},
          {code: "AM",    caseNumbers: [1,2,3]},
          {code: "AMR",   caseNumbers: [1,2,3]},
          {code: "IC",    caseNumbers: [1,2,3]},
          {code: "NEIM",  caseNumbers: [1,2,3]},
          {code: "NEIC",  caseNumbers: [1,2,3]},
          {code: "NEIR",  caseNumbers: [1,2,3]},
          {code: "IRC",   caseNumbers: [1,2,3]},

          // Survey 2
          {code: "ReuRO", caseNumbers: [1,2,3]},
          {code: "ReuNF", caseNumbers: [1,2,3]},
          {code: "RegRO", caseNumbers: [1,2,3]},
          {code: "RegNF", caseNumbers: [1,2,3]},
          {code: "RecNF", caseNumbers: [1,2,3]},
          {code: "RecUF", caseNumbers: [1,2,3]},*/
        ],
        info: [
          {
            code: 1,
            "Specific application of second-hand membranes": "Wastewater treatment",
            "Company name": "Aqualia",
            "Name of the project": "Life Remembrane - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://life-remembrane.eu/?lang=es",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Preparing for reuse & Direct reuse",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Life Remembrane: demonstration plant in which diverse mechanical and chemical treatments are developed in order to recover these membranes to reuse them in reverse osmosis technology ",
            "results": "http://life-remembrane.eu/results/",
            "Mailing address of the supervising organization": "Aqualia gestión integral del agua, S.A. Av. del Camino de Santiago, 40. 28050, Madrid, Spain",
            "Contacts": "mviallon@leitat.org"
          },
          {
            code: 2,
            "Specific application of second-hand membranes": "Not focus on application but on preparing RO membranes to be reused",
            "Company name": "WaterSurplus",
            "Name of the project": "-",
            "Entity": "Private Company",
            "website": "http://www.watersurplus.com/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse and preparing for reuse",
            "Scale of implementation": "Industrial",
            "Main Investigation": "Cleans, tests, repackages, and repurposes used RO, UF and NF membranes and associated equipment at significant cost savings to the user",
            "results": "https://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch&#10;https://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch&#10;",
            "Mailing address of the supervising organization": "726 Beacon Street, 61111, Loves Park, IL ",
            "Contacts": "sales@watersurplus.com"
          },
          {
            code: 3,
            "Specific application of second-hand membranes": "Not focus on application but on preparing RO membranes to be reused",
            "Company name": "Avanale water solution",
            "Name of the project": "-",
            "Entity": "Private Company",
            "website": "https://www.pacificwatertreatment.com/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse and preparing for reuse",
            "Scale of implementation": "Industrial",
            "Main Investigation": "Refurbishment of old equipment supply of RO membranes",
            "results": "https://www.pacificwatertreatment.com/refurbishments-service",
            "Mailing address of the supervising organization": "PO Box 5869 Manly, Australia, 4179",
            "Contacts": "phil@avanale.com.au"
          },
          {
            code: 4,
            "Specific application of second-hand membranes": "Not focus on application but on preparing RO  membranes to be reused",
            "Company name": "Membrane Services",
            "Name of the project": "-",
            "Entity": "Private Company",
            "website": "http://www.membraneservices.com/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse and preparing for reuse",
            "Scale of implementation": "Industrial",
            "Main Investigation": "End-of-life RO membranes examination, cleaning and repackaging",
            "results": "http://www.membraneservices.com/Recycled_Membranes.html",
            "Mailing address of the supervising organization": "Membrane Services, LLC 10385 Commerce Row Suite C Montgomery, Texas 77356",
            "Contacts": "http://membraneservices.com/Contact_Us.html"
          },
          {
            code: 5,
            "Specific application of second-hand membranes": "Not focus on application but on preparing RO membranes to be reused",
            "Company name": "Sichuan University",
            "Name of the project": "-",
            "Entity": "University",
            "website": "http://ce.scu.edu.cn/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Preparing for reuse",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Refurbishing of the used RO membrane through chemical cleaning and repairing with a new system",
            "results": "https://www.sciencedirect.com/science/article/pii/S0011916413001756?via%3Dihub",
            "Mailing address of the supervising organization": "Chemical Engineering School of Sichuan University, Chengdu, Sichuan 610065, China",
            "Contacts": "li-yongsheng@scu.edu.cn lysgxf2005@yahoo.com.cn"
          },
          {
            code: 6,
            "Specific application of second-hand membranes": "Industrial wastewater",
            "Company name": "Eurecat",
            "Name of the project": "-",
            "Entity": "Public institutions",
            "website": "https://eurecat.org/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recycled RO/NF/UF membranes ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            "results": "https://eurecat.org/es/portfolio-items/eflucomp/",
            "Mailing address of the supervising organization": "Parc Científic i de la Innovació TecnoCampus, Av. d'Ernest Lluch, 36, 08302 Mataró, Barcelona",
            "Contacts": "xavier.martinez@eurecat.org"
          },
          {
            code: 7,
            "Specific application of second-hand membranes": "Landfill leachate water treatment",
            "Company name": "University of Girona (Spain) and University of New South Wales (Australia)",
            "Name of the project": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Entity": "Public institutions",
            "website": "http://www.lequia.udg.edu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of regenerated RO membranes (seawater models)",
            "Scale of implementation": "Industrial",
            "Main Investigation": "Mem2.0: Landfill leachate water treatment using end-of-life RO and regenerated membranes",
            "results": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Mailing address of the supervising organization": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Contacts": " joaquim.comas@udg.edu "
          },
          {
            code: 8,
            "Specific application of second-hand membranes": "Brackish water treatment for irrigation",
            "Company name": "IMDEA Agua",
            "Name of the project": "Life-Transfomem - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Validation of recycled membranes for treating brackish water at pilot scale",
            "results": "https://doi.org/10.1016/j.desal.2017.12.034",
            "Mailing address of the supervising organization": "IMDEA WATER. Avenida Punto Com, n°2 - 28805 Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org"
          },
          {
            code: 9,
            "Specific application of second-hand membranes": "Life cycle and economical assessment of the recycling process ",
            "Company name": "IMDEA Agua",
            "Name of the project": "Life-Transfomem",
            "Entity": "Public institutions",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Recycling of end-of-life reverse osmosis membranes: Comparative LCA and cost-effectiveness analysis at pilot scale",
            "results": "https://doi.org/10.1016/j.resconrec.2019.104423",
            "Mailing address of the supervising organization": "IMDEA WATER. Avenida Punto Com, n°2 - 28805 Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org"
          },
          {
            code: 10,
            "Specific application of second-hand membranes": "Synthetic river water",
            "Company name": "University of Girona (Spain) and University of New South Wales (Australia)",
            "Name of the project": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Entity": "Public institutions",
            "website": "http://www.lequia.udg.edu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Mem2.0:Novel membrane housing designs for gravity-driven NF and UF recycled membrane-based systems",
            "results": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Mailing address of the supervising organization": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Contacts": " joaquim.comas@udg.edu "
          },
          {
            code: 11,
            "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            "Company name": "Federal University of Itajubá",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://en.unifei.edu.br/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Evaluation of parameters that affect the efficiency of end-of-life RO membrane recycling by chemical oxidization / Extending the life-cycle of reverse osmosis membranes: A review ",
            "results": "http://journals.sagepub.com/doi/10.1177/0734242X16684383",
            "Mailing address of the supervising organization": "Federal University of Itajubá, Itabira, Minas Gerais, Brazil ",
            "Contacts": "ecoutinho@unifei.edu.br"
          },
          {
            code: 12,
            "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            "Company name": "Universidade Federal do Rio Grande do Sul",
            "Name of the project": "-",
            "Entity": "University",
            "website": "http://www.ufrgs.br/ufrgs/inicial",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Rejuvenating polyamide reverse osmosis membranes by tannic acid treatment",
            "results": "https://www.sciencedirect.com/science/article/pii/S1383586612004108",
            "Mailing address of the supervising organization": "UFRGS. Department of Chemical Engineering, Universidade Federal do Rio Grande do Sul, 90040-040 Porto Alegre, RS, Brazil",
            "Contacts": "isabel@enq.ufrgs.br"
          },
          {
            code: 13,
            "Specific application of second-hand membranes": "Wastewater treatment",
            "Company name": "MEDRC",
            "Name of the project": "-",
            "Entity": "Public institutions & Private Companies",
            "website": "https://www.medrc.org",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling ",
            "Scale of implementation": "Lab / Pilot",
            "Main Investigation": "Use of end-of-life RO membranes to treat wastewater for industrial and Agricultural use",
            "results": "https://www.medrc.org/kick-off-meeting-for-membrane-reuse-project/",
            "Mailing address of the supervising organization": "The Middle East Desalination Research Center (MEDRC) ",
            "Contacts": "elkharraz@medrc.org"
          },
          {
            code: 14,
            "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            "Company name": "Universidade Federal do Rio Grande do Sul",
            "Name of the project": "-",
            "Entity": "University",
            "website": "http://www.ufrgs.br/ufrgs/inicial",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Study on Potassium Permanganate Chemical Treatment of Discarded Reverse Osmosis Membranes Aiming their Reuse",
            "results": "https://www.tandfonline.com/doi/abs/10.1080/01496395.2012.745876",
            "Mailing address of the supervising organization": "Laboratory ofMembrane Separation Processes, Department of Chemical Engineering,  Universidade Federal do Rio Grande do Sul, Porto Alegre, Brazil",
            "Contacts": "alan.ambrosi@gmail.com"
          },
          {
            code: 15,
            "Specific application of second-hand membranes": "Wastewater treatment",
            "Company name": "Universidad de Las Palmas de Gran Canaria (ULPGC)",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.ulpgc.es/node ",
            "Type of end-of-life membranes": "Reverse osmosis -spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Reusing old seawater RO membranes in wastewater, conversion to a type of microfiltration membrane",
            "results": "https://www.sciencedirect.com/science/article/pii/S0011916403003849 ; https://www.sciencedirect.com/science/article/pii/S0011916402009773",
            "Mailing address of the supervising organization": "Departemento de Ingenieria de Procesos, Universidad de Las Palmas de Gran Canaria (ULPGC), Campus Tafira Baja, E-35017 Las Palmas de Gran Canaria, Spain ",
            "Contacts": "jveza@dip.ulpgc.es"
          },
          {
            code: 16,
            "Specific application of second-hand membranes": "Not focus on application but on producing UF-like membranes to be reused",
            "Company name": "UNSW,UNESCO",
            "Name of the project": "-",
            "Entity": "University & Research center",
            "website": "https://www.unsw.edu.au/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Production and characterisation of UF membranes by chemical conversion of used RO membranes",
            "results": "https://doi.org/10.1016/j.memsci.2013.07.015",
            "Mailing address of the supervising organization": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Contacts": "p.le-clech@unsw.edu.au"
          },
          {
            code: 17,
            "Specific application of second-hand membranes": "Life cycle assessment of the recycling process ",
            "Company name": "UNSW,UNESCO",
            "Name of the project": "-",
            "Entity": "University & Research center",
            "website": "https://www.unsw.edu.au/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Comparative life cycle assessment of end-of-life options for reverse osmosis membranes",
            "results": "https://doi.org/10.1016/j.desal.2014.10.013",
            "Mailing address of the supervising organization": "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            "Contacts": "p.le-clech@unsw.edu.au"
          },
          {
            code: 18,
            "Specific application of second-hand membranes": "Sea water pretreatment ",
            "Company name": "SACYR and IMDEA Agua",
            "Name of the project": "Life-Transfomem - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.life-transfomem.eu/publications/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Life-Transfomem project. Production of recycled UF membranes for seawater treatment as substitution of standard sand filtration",
            "results": "https://www.youtube.com/watch?v=DPp8uYN-iT8&feature=youtu.be",
            "Mailing address of the supervising organization": "IMDEA WATER. Avenida Punto Com, n°2 - 28805 Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org"
          },
          {
            code: 19,
            "Specific application of second-hand membranes": "Wastewater treatment",
            "Company name": "SACYR and IMDEA Agua",
            "Name of the project": "Life-Transfomem - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.life-transfomem.eu/publications/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Life-Transfomem project. Production of recycled UF membranes for wastewater treatment. Spiral-wound, semiopened and star configurations",
            "results": "https://drive.google.com/file/d/1AZxH825pFNvNKMYyNBoTDKOu80dR2DL4/view",
            "Mailing address of the supervising organization": "IMDEA WATER. Avenida Punto Com, n°2 - 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org"
          },
          {
            code: 20,
            "Specific application of second-hand membranes": "Economical assesment of the recycling process",
            "Company name": "Federal University of Minas Gerais",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.ufmg.br/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Environmental and economic evaluation of end-of-life reverse osmosis membranes recycling by means of chemical conversion",
            "results": "https://www.sciencedirect.com/science/article/pii/S0959652618314355#!",
            "Mailing address of the supervising organization": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Contacts": "ecoutinho@desa.ufmg.br"
          },
          {
            code: 21,
            "Specific application of second-hand membranes": "Wastewater treatment",
            "Company name": "Eurecat",
            "Name of the project": "H2020 Nextgen - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "https://nextgenwater.eu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recyed UF membrane ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Nextgenwater project: Application of recyed UF membrane for water reclaiming",
            "results": "https://nextgenwater.eu/demonstration-cases/costa-brava-region/",
            "Mailing address of the supervising organization": "Gelderlandhaven 7D, 3433 PG Nieuwegein, Netherlands",
            "Contacts": "xavier.martinez@eurecat.org"
          },
          {
            code: 22,
            "Specific application of second-hand membranes": "Urban wastewater",
            "Company name": "Eurecat",
            "Name of the project": "-",
            "Entity": "Public institutions",
            "website": "https://eurecat.org/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recyed UF membrane ",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Regireu project: Application of recycled membranes for treating urban wastewater",
            "results": "https://eurecat.org/es/portfolio-items/regireu/",
            "Mailing address of the supervising organization": "Parc Científic i de la Innovació TecnoCampus, Av. d'Ernest Lluch, 36 - 08302 Mataró, Barcelona",
            "Contacts": "xavier.martinez@eurecat.org"
          },
          {
            code: 23,
            "Specific application of second-hand membranes": "Not focus on application but on collecting end-of-life RO membranes to be reused",
            "Company name": "AquaTip",
            "Name of the project": "-",
            "Entity": "Private Company",
            "website": "https://aquatip.com.au/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse ",
            "Scale of implementation": "Industrial",
            "Main Investigation": "Collecting unwanted or used Reverse Osmosis membranes from water treatment plants with the aim to dispose, recycle, or repurpose them for a different application",
            "results": "https://aquatip.com.au/services/",
            "Mailing address of the supervising organization": "Sydney, Australia",
            "Contacts": "director@aquatip.com.au"
          },
          {
            code: 24,
            "Specific application of second-hand membranes": "Wastewater treatment",
            "Company name": "Centre d’Étude et de Recherche de Djibouti (CERD)",
            "Name of the project": "-",
            "Entity": "Research center",
            "website": "http://www.cerd.dj/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Wastewater reclamation using discarded reverse osmosis membranes for reuse in irrigation in Djibouti, an arid country",
            "results": "https://www.ncbi.nlm.nih.gov/pubmed/23508163",
            "Mailing address of the supervising organization": "Centre d’Etude et de Recherche de Djibouti (CERD), Djibouti",
            "Contacts": "awaleh@gmail.com"
          },
          {
            code: 25,
            "Specific application of second-hand membranes": "Synthetic water",
            "Company name": "Advanced Water Management Centre (The University of Queensland)",
            "Name of the project": "-",
            "Entity": "University",
            "website": "http://www.awmc.uq.edu.au/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse",
            "Scale of implementation": "Lab",
            "Main Investigation": "Virus removal (MS2 phage) and four membrane integrity indicators (salt, dissolved organic matter, rhodamine WT and sulphateand) in aged RO membranes ",
            "results": "https://www.sciencedirect.com/science/article/pii/S0043135415304206",
            "Mailing address of the supervising organization": "Advanced Water Management Centre, The University of Queensland, Brisbane, QLD 4072, Australia",
            "Contacts": "m.pype@awmc.uq.edu.au"
          },
          {
            code: 26,
            "Specific application of second-hand membranes": "Brackish water",
            "Company name": "Université de Nantes",
            "Name of the project": "-",
            "Entity": "University",
            "website": "-",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct reuse",
            "Scale of implementation": "Lab/Pilot",
            "Main Investigation": "Reuse of end-of-life RO membranes as NF membranes",
            "results": "https://www.sciencedirect.com/science/article/pii/S0011916409013204",
            "Mailing address of the supervising organization": "GEPEA, UMR CNRS 6144, Université de Nantes, 37 Bd. de l'université, CRTT BP406, 44602 Saint-Nazaire, France",
            "Contacts": "maxime.pontie@univ-angers.fr"
          },
          {
            code: 27,
            "Specific application of second-hand membranes": "Industrial wastewater",
            "Company name": "H2020 - Zero-Brine - Consortium",
            "Name of the project": "-",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.zerobrine.eu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of regenerated RO membranes for high concentrated sodium-sulfate solutions of industry",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Application of recycled NF membranes for high concentrated sodium-sulfate solutions of silica industry ",
            "results": "http://www.zerobrine.eu/pilot-projects/spain/",
            "Mailing address of the supervising organization": "TU Delft – Valorisation Centre, Building 26 Van der Burgh Tower – 4th floor. Van der Burghweg 1 Delft",
            "Contacts": "info@revolve.media"
          },
          {
            code: 28,
            "Specific application of second-hand membranes": "Landfill leachate water treatment",
            "Company name": "CTM",
            "Name of the project": "Life Releach - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://releach.eu/#pagina-ejemplo",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Application of recycled membranes",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Life-Releach: new landfill leachate treatment strategies based on the use of different existing technologies including recycled NF and RO membranes",
            "results": "http://releach.ctm.com.es/en/the-project/main-project-results",
            "Mailing address of the supervising organization": "Centro Tecnológico de Manresa (CTM). Plaça de la Ciència, 2 - 08243 Manresa (Barcelona)",
            "Contacts": "xavier.martinez@eurecat.org"
          },
          {
            code: 29,
            "Specific application of second-hand membranes": "Not focus on application but on producing NF-like membranes to be reused",
            "Company name": "Lappeenranta University of Technology",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.lut.fi/web/en",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "End-of-life RO membranes recycling: Reuse as NF membranes by polyelectrolyte layer-by-layer deposition",
            "results": "https://www.sciencedirect.com/science/article/pii/S0376738818327728",
            "Mailing address of the supervising organization": "LUT School of Engineering Science, Lappeenranta University of Technology, Lappeenranta 53851, Finland",
            "Contacts": "arto.pihlajamaki@lut.fi"
          },
          {
            code: 30,
            "Specific application of second-hand membranes": "River water&#10;treatment application",
            "Company name": "Federal University of Minas Gerais",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.ufmg.br/",
            "Type of end-of-life membranes": "Nanofiltration",
            "Research  - Business activity": "Direct recycling",
            "Scale of implementation": "Lab / Pilot",
            "Main Investigation": "Bench and pilot scale performance assessment of recycled membrane converted from old nanofiltration membranes",
            "results": "https://doi.org/10.1080/09593330.2018.1526218",
            "Mailing address of the supervising organization": "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            "Contacts": "ecoutinho@desa.ufmg.br"
          },
          {
            code: 31,
            "Specific application of second-hand membranes": "Synthetic river water",
            "Company name": "University of Girona (Spain) and University of New South Wales (Australia)",
            "Name of the project": "TECNIOSPRING+ Mem2.0 - Consortium",
            "Entity": "Public institutions",
            "website": "http://www.lequia.udg.edu/",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Pilot",
            "Main Investigation": "Mem2.0: Novel membrane housing designs for gravity-driven NF and UF recycled membrane-based systems",
            "results": "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            "Mailing address of the supervising organization": "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            "Contacts": " joaquim.comas@udg.edu "
          },
          {
            code: 32,
            "Specific application of second-hand membranes": "Recycling of membrane components",
            "Company name": "IMDEA Agua",
            "Name of the project": "INREMEM - Consortium",
            "Entity": "Research center & University",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "INREMEM project: innovation and recycling membranes  for water filtration(UF-MBR, FO, electrodyalisis, support)",
            "results": "http://inremem.simplesite.com/",
            "Mailing address of the supervising organization": "IMDEA Water. Avenida Punto Com, n°2 - 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org"
          },
          {
            code: 33,
            "Specific application of second-hand membranes": "Recycling of membrane components",
            "Company name": "IMDEA Agua",
            "Name of the project": "INREMEM - Consortium",
            "Entity": "Research center & University",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Circular economy in membrane technology: using end-of-life reverse osmosis modules for preparation of recycled anion exchange membranes and validation in electrodialysis.",
            "results": "https://doi.org/10.1016/j.memsci.2019.117423",
            "Mailing address of the supervising organization": "IMDEA Water. Avenida Punto Com, n°2 - 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org"
          },
          {
            code: 34,
            "Specific application of second-hand membranes": "Recycling of membrane components",
            "Company name": "IMDEA Agua",
            "Name of the project": "INREMEM - Consortium",
            "Entity": "Research center & University",
            "website": "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Recycled desalination membranes as a support material for biofilm development: A new approach for microcystin removal during water treatment",
            "results": "http://dx.doi.org/10.1016/j.scitotenv.2018.07.435",
            "Mailing address of the supervising organization": "IMDEA Water. Avenida Punto Com, n°2 - 28805, Alcalá de Henares, Madrid, Spain",
            "Contacts": "membranas.agua@imdea.org"
          },
          {
            code: 35,
            "Specific application of second-hand membranes": "Recycling of membrane components",
            "Company name": "FACSA",
            "Name of the project": "H2020 - Remeb - Consortium",
            "Entity": "Private Companies & Public institutions",
            "website": "http://www.remeb-h2020.com/about-us/",
            "Type of end-of-life membranes": "Ceramic membranes",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Industrial",
            "Main Investigation": "H2020 Remeb. Implementation and validation of a low cost recycled ceramic membrane bioreactor (MBR) for water reuse in a Wastewater Treatment Plant (WWTP)",
            "results": "http://www.remeb-h2020.com/project-progress/",
            "Mailing address of the supervising organization": "Grupo Gimeno. Av. del Mar, 53 - 12003 Castellón de la Plana, Castellón, Spain",
            "Contacts": "ezuriaga@facsa.com"
          },
          {
            code: 36,
            "Specific application of second-hand membranes": "Recycling of membrane components",
            "Company name": "MEMRE",
            "Name of the project": "MemRe GmbH Co.",
            "Entity": "Private Company",
            "website": "http://www.memre.de ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Industrial",
            "Main Investigation": "end-of-life membranes transportation and labeling, from the pickup on site until the recycling plant and special services for radioactive contaminated membranes if requested",
            "results": "https://www.dme-gmbh.de/new-founded-company-memre-gmbh/",
            "Mailing address of the supervising organization": "Memre. Achert 677889, Seebach,Germany ",
            "Contacts": "kontakt@memre.de"
          },
          {
            code: 37,
            "Specific application of second-hand membranes": "Recycling of membrane components",
            "Company name": "Université de Nantes",
            "Name of the project": "-",
            "Entity": "University",
            "website": "http://www.univ-nantes.fr/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Lab/Pilot",
            "Main Investigation": "Old RO membranes: solutions for reuse",
            "results": "https://www.tandfonline.com/doi/abs/10.1080/19443994.2014.943060",
            "Mailing address of the supervising organization": "GEPEA, UMR CNRS 6144, Université de Nantes, 37 Bd. de l’université, CRTT BP406, 44602 Saint-Nazaire, France",
            "Contacts": "maxime.pontie@univ-angers.fr"
          },
          {
            code: 38,
            "Specific application of second-hand membranes": "Recycling of membrane components",
            "Company name": "Angers University, GEIHP",
            "Name of the project": "Angers University, GEIHP",
            "Entity": "University",
            "website": "http://www.univ-angers.fr/fr/recherche/poles-et-unites/pole-sante/geihp.html ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling & energy recovery",
            "Scale of implementation": "Lab/Pilot",
            "Main Investigation": "Recycling and energy recovery solutions of end-of-life reverse osmosis (RO) membrane materials: A sustainable approach",
            "results": "https://www.sciencedirect.com/science/article/pii/S0011916417301042 ",
            "Mailing address of the supervising organization": "COMUE UBL, Angers University, GEIHP, EA3142, 4 rue Larrey, CHU - IBS, 49933 Angers 09, France",
            "Contacts": "maxime.pontie@univ-angers.fr"
          },
          {
            code: 39,
            "Specific application of second-hand membranes": "Recycling of membrane components",
            "Company name": "University Complutense of Madrid",
            "Name of the project": "-",
            "Entity": "University",
            "website": "https://www.ucm.es/ ",
            "Type of end-of-life membranes": "Reverse osmosis - spiral wound",
            "Research  - Business activity": "Indirect recycling",
            "Scale of implementation": "Lab",
            "Main Investigation": "Interfacial polymerization study for recycling RO membranes in FO wastewater treatment; Recycling RO membranes for the treatment of high saline solutions by membrane distillation ",
            "results": "EUROMEMBRANE 2018 CONGRESS: POSTER (N-404) (N-600)",
            "Mailing address of the supervising organization": "Department of Applied Physics I, Faculty of Physics, University Complutense of Madrid, Avda. Complutense s/n - 28040 Madrid, Spain",
            "Contacts": "mcgpayo@ucm.es"
          }
        ],
        table_fields: [
          {
            key: "Specific application of second-hand membranes",
            isRowHeader: true,
            label: "Specific application of second-hand membranes",
          }, "Company name", "Name of the project", "Entity", "website",
          "Type of end-of-life membranes", "Research  - Business activity", "Scale of implementation",
          "Main Investigation",
          { key: "results",
            label: "Main results / products"
          }, "Mailing address of the supervising organization", "Contacts"
        ]
      }
    },
    beforeCreate() {
      /*var fs = require("fs");
      console.log("HOLAAAAAA");
      let filename = "./src/components/survey_2.xlxs"
      fs.readFile(filename, "utf8", function(err, data) {
        if (err) {
          console.log(err.toString());
        } else {
          console.log(data.toString());
        }
      });*/

      //if(typeof require !== 'undefined') XLSX = require('xlsx');
      //let workbook = XLSX.readFile('survey_2.xlsx');
      //let xlsxReaded = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      //let first_sheet_name = workbook.SheetNames[0];
      //console.log("work: ", workbook);
      //console.log("workbook: ", first_sheet_name);
      //console.log("fjfjj: ", xlsxReaded);
      //xlsxReaded.forEach(row => {
    },
    watch:{
    },
    methods: {
      get_case_path(num){
        let aux = JSON.stringify(num.c);
        let path = this.mainPath + aux.toString() + ".JPG";
        return path;
      },
      get_image_info(num){
        let aux = JSON.stringify(num.c);
        let imageInfo = this.info.find(i => i.code == aux);
        return imageInfo;
      }
    },
    computed: {
      get_cases_to_show() {
        let caseNumbers = [];
        console.log("caseNumbers ini: ", caseNumbers);

        let membrane = this.typeMembrane;
        let perm = this.permeability;
        let rejection = this.saltRejection;
        let imagesList = this.images;

        this.solutionCode.forEach(function (sol) {
          console.log("name: ", sol.name);

            let auxObject = {
              typeMembrane: membrane,
              permeability: perm,
              saltRejection: rejection,
              membraneReuse: sol.name
            };
            function compare_membrane_reuse(obj1, obj2){
              if(obj1.membraneReuse === obj2.membraneReuse)
                return true;
              else
                return false;
            }
            let ret;
            if(sol.code !== "IR")
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
        console.log("caseNumbers: ", caseNumbers);
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
    padding: 1em;
    font-size: large;
  }

</style>