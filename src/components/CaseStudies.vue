<template lang="pug">
  .caseStudies
    b-container(fluid="true")
      template(v-if='solution_code.length === 1')
        template(v-if="get_cases_to_show.length !== 0")
          b-row(v-for="c in get_cases_to_show" :key="c" )
            b-col(sm="10" xl="5" offset-sm="1" offset-xl="0" align-self="center")
              b-img(:src="get_case_path({c})" fluid v-b-modal="getID({c})")#caseImg
              b-modal(:id="getID({c})" model-class="modal-content" hide-footer hide-header size="xl" centered)
                b-img(:src="get_case_path({c})" fluid-grow)#img
            b-col(sm="12" xl="7" )
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
                  b-col(:style="`background:${solution_code[0].color}`" sm="2" xl="1" )
                  b-col(sm="10"  xl="11" ) {{ solution_code[0].name }}
      template(v-else)
        b-row
          b-col
            b Please, complete all the survey to see case studies.

</template>

<script>

  import _ from 'lodash';
  //import XLSX from 'xlsx';
  //import survey_2 from "./components/survey_2";
  //import * as XLSX from "fs";
  //import XlsxJson from "./components/XlsxJson";

  export default {
    name: "CaseStudies",
    props: ['solution_code', 'membrane_type', 'salt_rejection', 'permeability'],
    data: function () {
      return {
        file: null,
        mainPath: "/caseStudies/",
        images: [
          {
            inputs:
              {
                membrane_type: "Reverse osmosis brackish model design",
                permeability: "<1-fold comparing to the design value",
                salt_rejection: "<15% comparing to the design value",
                membrane_reuse: "Regenerate to reuse as reverse osmosis membranes"
              },
            caseNumbers: [1, 2, 3, 4, 5, 6, 7]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis brackish model design",
                permeability: "<1-fold comparing to the design value",
                salt_rejection: ">10% of NaCl and >30% of MgSO4",
                membrane_reuse: "Recycling into nanofiltration-like membranes"
              },
            caseNumbers: [8, 9, 10, 11, 12, 13, 6, 14]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis brackish model design",
                permeability: "<1-fold comparing to the design value",
                salt_rejection: "<10% of NaCl and <30% of MgSO4",
                membrane_reuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 10, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis brackish model design",
                permeability: "[1-5]-fold comparing to the design value",
                salt_rejection: "<15% comparing to the design value",
                membrane_reuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 23, 2, 3, 4, 24, 25]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis brackish model design",
                permeability: "[1-5]-fold comparing to the design value",
                salt_rejection: ">10% of NaCl and >30% of MgSO4",
                membrane_reuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis brackish model design",
                permeability: "[1-5]-fold comparing to the design value",
                salt_rejection: "<10% of NaCl and <30% of MgSO4",
                membrane_reuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 10, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis brackish model design",
                permeability: ">5-fold comparing to the design value",
                salt_rejection: "<15% comparing to the design value",
                membrane_reuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [23, 2, 3, 4, 24, 25]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis brackish model design",
                permeability: ">5-fold comparing to the design value",
                salt_rejection: ">10% of NaCl and >30% of MgSO4",
                membrane_reuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis brackish model design",
                permeability: ">5-fold comparing to the design value",
                salt_rejection: "<10% of NaCl and <30% of MgSO4",
                membrane_reuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 10, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis sea model design",
                permeability: "<1-fold comparing to the design value",
                salt_rejection: "<15% comparing to the design value",
                membrane_reuse: "Regenerate to reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 1, 8, 2, 3, 4, 5, 6, 27]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis sea model design",
                permeability: "<1-fold comparing to the design value",
                salt_rejection: ">10% of NaCl and >30% of MgSO4",
                membrane_reuse: "Recycling into nanofiltration-like membranes"
              },
            caseNumbers: [7, 28, 8, 9, 11, 12, 29, 13, 6, 14]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis sea model design",
                permeability: "<1-fold comparing to the design value",
                salt_rejection: "<10% of NaCl and <30% of MgSO4",
                membrane_reuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis sea model design",
                permeability: "[1-5]-fold comparing to the design value",
                salt_rejection: "<15% comparing to the design value",
                membrane_reuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 23, 2, 3, 4, 8, 24, 25]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis sea model design",
                permeability: "[1-5]-fold comparing to the design value",
                salt_rejection: ">10% of NaCl and >30% of MgSO4",
                membrane_reuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis sea model design",
                permeability: "[1-5]-fold comparing to the design value",
                salt_rejection: "<10% of NaCl and <30% of MgSO4",
                membrane_reuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 18, 19, 15, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis sea model design",
                permeability: ">5-fold comparing to the design value",
                salt_rejection: "<15% comparing to the design value",
                membrane_reuse: "Reuse as reverse osmosis membranes"
              },
            caseNumbers: [7, 23, 2, 3, 4, 8, 24, 25]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis sea model design",
                permeability: ">5-fold comparing to the design value",
                salt_rejection: ">10% of NaCl and >30% of MgSO4",
                membrane_reuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: [8, 26]
          },
          {
            inputs:
              {
                membrane_type: "Reverse osmosis sea model design",
                permeability: ">5-fold comparing to the design value",
                salt_rejection: "<10% of NaCl and <30% of MgSO4",
                membrane_reuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [15, 16, 17, 18, 19, 9, 20, 21, 22, 6]
          },
          {
            inputs:
              {
                membrane_type: "Nanofiltration",
                permeability: "<1-fold comparing to the design value",
                salt_rejection: "<15% comparing to the design value",
                membrane_reuse: "Regenerate to reuse as nanofiltration membranes"
              },
            caseNumbers: [2]
          },
          {
            inputs:
              {
                membrane_type: "Nanofiltration",
                permeability: "<1-fold comparing to the design value",
                salt_rejection: ">10% of NaCl and >30% of MgSO4",
                membrane_reuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                membrane_type: "Nanofiltration",
                permeability: "<1-fold comparing to the design value",
                salt_rejection: "<10% of NaCl and <30% of MgSO4",
                membrane_reuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                membrane_type: "Nanofiltration",
                permeability: "[1-5]-fold comparing to the design value",
                salt_rejection: "<15% comparing to the design value",
                membrane_reuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                membrane_type: "Nanofiltration",
                permeability: "[1-5]-fold comparing to the design value",
                salt_rejection: ">10% of NaCl and >30% of MgSO4",
                membrane_reuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                membrane_type: "Nanofiltration",
                permeability: "[1-5]-fold comparing to the design value",
                salt_rejection: "<10% of NaCl and <30% of MgSO4",
                membrane_reuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                membrane_type: "Nanofiltration",
                permeability: ">5-fold comparing to the design value",
                salt_rejection: "<15% comparing to the design value",
                membrane_reuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                membrane_type: "Nanofiltration",
                permeability: ">5-fold comparing to the design value",
                salt_rejection: ">10% of NaCl and >30% of MgSO4",
                membrane_reuse: "Reuse as nanofiltration-like membranes"
              },
            caseNumbers: []
          },
          {
            inputs:
              {
                membrane_type: "Nanofiltration",
                permeability: ">5-fold comparing to the design value",
                salt_rejection: "<10% of NaCl and <30% of MgSO4",
                membrane_reuse: "Recycling into ultrafiltration-like membranes"
              },
            caseNumbers: [30]
          },
          {
            inputs:
              {
                membrane_type: null,
                permeability: null,
                salt_rejection: null,
                membrane_reuse: "Indirect recycling"
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
        caseStudies_info: [
          {
            image_id: 1,
            specific_application: "Wastewater treatment",
            company_name: "Aqualia",
            project_name: "Life Remembrane - Consortium",
            entity: "Private Companies & Public institutions",
            website: "http://life-remembrane.eu/?lang=es",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Preparing for reuse & Direct reuse",
            implementation: "Pilot",
            investigation: "Life Remembrane: demonstration plant in which diverse mechanical and chemical treatments are developed in order to recover these membranes to reuse them in reverse osmosis technology ",
            results: "http://life-remembrane.eu/results/",
            mailing_address: "Aqualia gestión integral del agua, S.A. Av. del Camino de Santiago, 40. 28050, Madrid, Spain",
            contacts: "mviallon@leitat.org"
          },
          {
            image_id: 2,
            specific_application: "Not focus on application but on preparing RO membranes to be reused",
            company_name: "WaterSurplus",
            project_name: "-",
            entity: "Private Company",
            website: "http://www.watersurplus.com/ ",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct reuse and preparing for reuse",
            implementation: "Industrial",
            investigation: "Cleans, tests, repackages, and repurposes used RO, UF and NF membranes and associated equipment at significant cost savings to the user",
            results: "https://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch&#10;https://www.watersurplus.com/surplus-assets.cfm?c=MEM&s=286&a=Membrane%20Elements&b=RO%20-%20Brackish%208%20Inch&#10;",
            mailing_address: "726 Beacon Street, 61111, Loves Park, IL ",
            contacts: "sales@watersurplus.com"
          },
          {
            image_id: 3,
            specific_application: "Not focus on application but on preparing RO membranes to be reused",
            company_name: "Avanale water solution",
            project_name: "-",
            entity: "Private Company",
            website: "https://www.pacificwatertreatment.com/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct reuse and preparing for reuse",
            implementation: "Industrial",
            investigation: "Refurbishment of old equipment supply of RO membranes",
            results: "https://www.pacificwatertreatment.com/refurbishments-service",
            mailing_address: "PO Box 5869 Manly, Australia, 4179",
            contacts: "phil@avanale.com.au"
          },
          {
            image_id: 4,
            specific_application: "Not focus on application but on preparing RO  membranes to be reused",
            company_name: "Membrane Services",
            project_name: "-",
            entity: "Private Company",
            website: "http://www.membraneservices.com/ ",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct reuse and preparing for reuse",
            implementation: "Industrial",
            investigation: "End-of-life RO membranes examination, cleaning and repackaging",
            results: "http://www.membraneservices.com/Recycled_Membranes.html",
            mailing_address: "Membrane Services, LLC 10385 Commerce Row Suite C Montgomery, Texas 77356",
            contacts: "http://membraneservices.com/Contact_Us.html"
          },
          {
            image_id: 5,
            specific_application: "Not focus on application but on preparing RO membranes to be reused",
            company_name: "Sichuan University",
            project_name: "-",
            entity: "University",
            website: "http://ce.scu.edu.cn/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Preparing for reuse",
            implementation: "Pilot",
            investigation: "Refurbishing of the used RO membrane through chemical cleaning and repairing with a new system",
            results: "https://www.sciencedirect.com/science/article/pii/S0011916413001756?via%3Dihub",
            mailing_address: "Chemical Engineering School of Sichuan University, Chengdu, Sichuan 610065, China",
            contacts: "li-yongsheng@scu.edu.cn lysgxf2005@yahoo.com.cn"
          },
          {
            image_id: 6,
            specific_application: "Industrial wastewater",
            company_name: "Eurecat",
            project_name: "-",
            entity: "Public institutions",
            website: "https://eurecat.org/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Application of recycled RO/NF/UF membranes ",
            implementation: "Pilot",
            investigation: "Eflucomp project: Application of recycled membranes for treating industrial wastewater ",
            results: "https://eurecat.org/es/portfolio-items/eflucomp/",
            mailing_address: "Parc Científic i de la Innovació TecnoCampus, Av. d'Ernest Lluch, 36, 08302 Mataró, Barcelona",
            contacts: "xavier.martinez@eurecat.org"
          },
          {
            image_id: 7,
            specific_application: "Landfill leachate water treatment",
            company_name: "University of Girona (Spain) and University of New South Wales (Australia)",
            project_name: "TECNIOSPRING+ Mem2.0 - Consortium",
            entity: "Public institutions",
            website: "http://www.lequia.udg.edu/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Application of regenerated RO membranes (seawater models)",
            implementation: "Industrial",
            investigation: "Mem2.0: Landfill leachate water treatment using end-of-life RO and regenerated membranes",
            results: "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            mailing_address: "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            contacts: " joaquim.comas@udg.edu "
          },
          {
            image_id: 8,
            specific_application: "Brackish water treatment for irrigation",
            company_name: "IMDEA Agua",
            project_name: "Life-Transfomem - Consortium",
            entity: "Private Companies & Public institutions",
            website: "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Pilot",
            investigation: "Validation of recycled membranes for treating brackish water at pilot scale",
            results: "https://doi.org/10.1016/j.desal.2017.12.034",
            mailing_address: "IMDEA WATER. Avenida Punto Com, n°2 - 28805 Alcalá de Henares, Madrid, Spain",
            contacts: "membranas.agua@imdea.org"
          },
          {
            image_id: 9,
            specific_application: "Life cycle and economical assessment of the recycling process ",
            company_name: "IMDEA Agua",
            project_name: "Life-Transfomem",
            entity: "Public institutions",
            website: "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Pilot",
            investigation: "Recycling of end-of-life reverse osmosis membranes: Comparative LCA and cost-effectiveness analysis at pilot scale",
            results: "https://doi.org/10.1016/j.resconrec.2019.104423",
            mailing_address: "IMDEA WATER. Avenida Punto Com, n°2 - 28805 Alcalá de Henares, Madrid, Spain",
            contacts: "membranas.agua@imdea.org"
          },
          {
            image_id: 10,
            specific_application: "Synthetic river water",
            company_name: "University of Girona (Spain) and University of New South Wales (Australia)",
            project_name: "TECNIOSPRING+ Mem2.0 - Consortium",
            entity: "Public institutions",
            website: "http://www.lequia.udg.edu/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Pilot",
            investigation: "Mem2.0:Novel membrane housing designs for gravity-driven NF and UF recycled membrane-based systems",
            results: "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            mailing_address: "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            contacts: " joaquim.comas@udg.edu "
          },
          {
            image_id: 11,
            specific_application: "Not focus on application but on producing NF-like membranes to be reused",
            company_name: "Federal University of Itajubá",
            project_name: "-",
            entity: "University",
            website: "https://en.unifei.edu.br/ ",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Lab",
            investigation: "Evaluation of parameters that affect the efficiency of end-of-life RO membrane recycling by chemical oxidization / Extending the life-cycle of reverse osmosis membranes: A review ",
            results: "http://journals.sagepub.com/doi/10.1177/0734242X16684383",
            mailing_address: "Federal University of Itajubá, Itabira, Minas Gerais, Brazil ",
            contacts: "ecoutinho@unifei.edu.br"
          },
          {
            image_id: 12,
            specific_application: "Not focus on application but on producing NF-like membranes to be reused",
            company_name: "Universidade Federal do Rio Grande do Sul",
            project_name: "-",
            entity: "University",
            website: "http://www.ufrgs.br/ufrgs/inicial",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Lab",
            investigation: "Rejuvenating polyamide reverse osmosis membranes by tannic acid treatment",
            results: "https://www.sciencedirect.com/science/article/pii/S1383586612004108",
            mailing_address: "UFRGS. Department of Chemical Engineering, Universidade Federal do Rio Grande do Sul, 90040-040 Porto Alegre, RS, Brazil",
            contacts: "isabel@enq.ufrgs.br"
          },
          {
            image_id: 13,
            specific_application: "Wastewater treatment",
            company_name: "MEDRC",
            project_name: "-",
            entity: "Public institutions & Private Companies",
            website: "https://www.medrc.org",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling ",
            implementation: "Lab / Pilot",
            investigation: "Use of end-of-life RO membranes to treat wastewater for industrial and Agricultural use",
            results: "https://www.medrc.org/kick-off-meeting-for-membrane-reuse-project/",
            mailing_address: "The Middle East Desalination Research Center (MEDRC) ",
            contacts: "elkharraz@medrc.org"
          },
          {
            image_id: 14,
            specific_application: "Not focus on application but on producing NF-like membranes to be reused",
            company_name: "Universidade Federal do Rio Grande do Sul",
            project_name: "-",
            entity: "University",
            website: "http://www.ufrgs.br/ufrgs/inicial",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Lab",
            investigation: "Study on Potassium Permanganate Chemical Treatment of Discarded Reverse Osmosis Membranes Aiming their Reuse",
            results: "https://www.tandfonline.com/doi/abs/10.1080/01496395.2012.745876",
            mailing_address: "Laboratory ofMembrane Separation Processes, Department of Chemical Engineering,  Universidade Federal do Rio Grande do Sul, Porto Alegre, Brazil",
            contacts: "alan.ambrosi@gmail.com"
          },
          {
            image_id: 15,
            specific_application: "Wastewater treatment",
            company_name: "Universidad de Las Palmas de Gran Canaria (ULPGC)",
            project_name: "-",
            entity: "University",
            website: "https://www.ulpgc.es/node ",
            typeEOF_membrane: "Reverse osmosis -spiral wound",
            research_activity: "Direct recycling",
            implementation: "Pilot",
            investigation: "Reusing old seawater RO membranes in wastewater, conversion to a type of microfiltration membrane",
            results: "https://www.sciencedirect.com/science/article/pii/S0011916403003849 ; https://www.sciencedirect.com/science/article/pii/S0011916402009773",
            mailing_address: "Departemento de Ingenieria de Procesos, Universidad de Las Palmas de Gran Canaria (ULPGC), Campus Tafira Baja, E-35017 Las Palmas de Gran Canaria, Spain ",
            contacts: "jveza@dip.ulpgc.es"
          },
          {
            image_id: 16,
            specific_application: "Not focus on application but on producing UF-like membranes to be reused",
            company_name: "UNSW,UNESCO",
            project_name: "-",
            entity: "University & Research center",
            website: "https://www.unsw.edu.au/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Lab",
            investigation: "Production and characterisation of UF membranes by chemical conversion of used RO membranes",
            results: "https://doi.org/10.1016/j.memsci.2013.07.015",
            mailing_address: "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            contacts: "p.le-clech@unsw.edu.au"
          },
          {
            image_id: 17,
            specific_application: "Life cycle assessment of the recycling process ",
            company_name: "UNSW,UNESCO",
            project_name: "-",
            entity: "University & Research center",
            website: "https://www.unsw.edu.au/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Lab",
            investigation: "Comparative life cycle assessment of end-of-life options for reverse osmosis membranes",
            results: "https://doi.org/10.1016/j.desal.2014.10.013",
            mailing_address: "The UNESCO Centre for Membrane Science and Technology & University of New South Wales (UNSW). School of Chemical Engineering (F10 building), NSW, 2052, Australia",
            contacts: "p.le-clech@unsw.edu.au"
          },
          {
            image_id: 18,
            specific_application: "Sea water pretreatment ",
            company_name: "SACYR and IMDEA Agua",
            project_name: "Life-Transfomem - Consortium",
            entity: "Private Companies & Public institutions",
            website: "http://www.life-transfomem.eu/publications/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Pilot",
            investigation: "Life-Transfomem project. Production of recycled UF membranes for seawater treatment as substitution of standard sand filtration",
            results: "https://www.youtube.com/watch?v=DPp8uYN-iT8&feature=youtu.be",
            mailing_address: "IMDEA WATER. Avenida Punto Com, n°2 - 28805 Alcalá de Henares, Madrid, Spain",
            contacts: "membranas.agua@imdea.org"
          },
          {
            image_id: 19,
            specific_application: "Wastewater treatment",
            company_name: "SACYR and IMDEA Agua",
            project_name: "Life-Transfomem - Consortium",
            entity: "Private Companies & Public institutions",
            website: "http://www.life-transfomem.eu/publications/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Pilot",
            investigation: "Life-Transfomem project. Production of recycled UF membranes for wastewater treatment. Spiral-wound, semiopened and star configurations",
            results: "https://drive.google.com/file/d/1AZxH825pFNvNKMYyNBoTDKOu80dR2DL4/view",
            mailing_address: "IMDEA WATER. Avenida Punto Com, n°2 - 28805, Alcalá de Henares, Madrid, Spain",
            contacts: "membranas.agua@imdea.org"
          },
          {
            image_id: 20,
            specific_application: "Economical assesment of the recycling process",
            company_name: "Federal University of Minas Gerais",
            project_name: "-",
            entity: "University",
            website: "https://www.ufmg.br/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Lab",
            investigation: "Environmental and economic evaluation of end-of-life reverse osmosis membranes recycling by means of chemical conversion",
            results: "https://www.sciencedirect.com/science/article/pii/S0959652618314355#!",
            mailing_address: "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            contacts: "ecoutinho@desa.ufmg.br"
          },
          {
            image_id: 21,
            specific_application: "Wastewater treatment",
            company_name: "Eurecat",
            project_name: "H2020 Nextgen - Consortium",
            entity: "Private Companies & Public institutions",
            website: "https://nextgenwater.eu/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Application of recyed UF membrane ",
            implementation: "Pilot",
            investigation: "Nextgenwater project: Application of recyed UF membrane for water reclaiming",
            results: "https://nextgenwater.eu/demonstration-cases/costa-brava-region/",
            mailing_address: "Gelderlandhaven 7D, 3433 PG Nieuwegein, Netherlands",
            contacts: "xavier.martinez@eurecat.org"
          },
          {
            image_id: 22,
            specific_application: "Urban wastewater",
            company_name: "Eurecat",
            project_name: "-",
            entity: "Public institutions",
            website: "https://eurecat.org/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Application of recyed UF membrane ",
            implementation: "Pilot",
            investigation: "Regireu project: Application of recycled membranes for treating urban wastewater",
            results: "https://eurecat.org/es/portfolio-items/regireu/",
            mailing_address: "Parc Científic i de la Innovació TecnoCampus, Av. d'Ernest Lluch, 36 - 08302 Mataró, Barcelona",
            contacts: "xavier.martinez@eurecat.org"
          },
          {
            image_id: 23,
            specific_application: "Not focus on application but on collecting end-of-life RO membranes to be reused",
            company_name: "AquaTip",
            project_name: "-",
            entity: "Private Company",
            website: "https://aquatip.com.au/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct reuse ",
            implementation: "Industrial",
            investigation: "Collecting unwanted or used Reverse Osmosis membranes from water treatment plants with the aim to dispose, recycle, or repurpose them for a different application",
            results: "https://aquatip.com.au/services/",
            mailing_address: "Sydney, Australia",
            contacts: "director@aquatip.com.au"
          },
          {
            image_id: 24,
            specific_application: "Wastewater treatment",
            company_name: "Centre d’Étude et de Recherche de Djibouti (CERD)",
            project_name: "-",
            entity: "Research center",
            website: "http://www.cerd.dj/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct reuse",
            implementation: "Pilot",
            investigation: "Wastewater reclamation using discarded reverse osmosis membranes for reuse in irrigation in Djibouti, an arid country",
            results: "https://www.ncbi.nlm.nih.gov/pubmed/23508163",
            mailing_address: "Centre d’Etude et de Recherche de Djibouti (CERD), Djibouti",
            contacts: "awaleh@gmail.com"
          },
          {
            image_id: 25,
            specific_application: "Synthetic water",
            company_name: "Advanced Water Management Centre (The University of Queensland)",
            project_name: "-",
            entity: "University",
            website: "http://www.awmc.uq.edu.au/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct reuse",
            implementation: "Lab",
            investigation: "Virus removal (MS2 phage) and four membrane integrity indicators (salt, dissolved organic matter, rhodamine WT and sulphateand) in aged RO membranes ",
            results: "https://www.sciencedirect.com/science/article/pii/S0043135415304206",
            mailing_address: "Advanced Water Management Centre, The University of Queensland, Brisbane, QLD 4072, Australia",
            contacts: "m.pype@awmc.uq.edu.au"
          },
          {
            image_id: 26,
            specific_application: "Brackish water",
            company_name: "Université de Nantes",
            project_name: "-",
            entity: "University",
            website: "-",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct reuse",
            implementation: "Lab/Pilot",
            investigation: "Reuse of end-of-life RO membranes as NF membranes",
            results: "https://www.sciencedirect.com/science/article/pii/S0011916409013204",
            mailing_address: "GEPEA, UMR CNRS 6144, Université de Nantes, 37 Bd. de l'université, CRTT BP406, 44602 Saint-Nazaire, France",
            contacts: "maxime.pontie@univ-angers.fr"
          },
          {
            image_id: 27,
            specific_application: "Industrial wastewater",
            company_name: "H2020 - Zero-Brine - Consortium",
            project_name: "-",
            entity: "Private Companies & Public institutions",
            website: "http://www.zerobrine.eu/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Application of regenerated RO membranes for high concentrated sodium-sulfate solutions of industry",
            implementation: "Pilot",
            investigation: "Application of recycled NF membranes for high concentrated sodium-sulfate solutions of silica industry ",
            results: "http://www.zerobrine.eu/pilot-projects/spain/",
            mailing_address: "TU Delft – Valorisation Centre, Building 26 Van der Burgh Tower – 4th floor. Van der Burghweg 1 Delft",
            contacts: "info@revolve.media"
          },
          {
            image_id: 28,
            specific_application: "Landfill leachate water treatment",
            company_name: "CTM",
            project_name: "Life Releach - Consortium",
            entity: "Private Companies & Public institutions",
            website: "http://releach.eu/#pagina-ejemplo",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Application of recycled membranes",
            implementation: "Pilot",
            investigation: "Life-Releach: new landfill leachate treatment strategies based on the use of different existing technologies including recycled NF and RO membranes",
            results: "http://releach.ctm.com.es/en/the-project/main-project-results",
            mailing_address: "Centro Tecnológico de Manresa (CTM). Plaça de la Ciència, 2 - 08243 Manresa (Barcelona)",
            contacts: "xavier.martinez@eurecat.org"
          },
          {
            image_id: 29,
            specific_application: "Not focus on application but on producing NF-like membranes to be reused",
            company_name: "Lappeenranta University of Technology",
            project_name: "-",
            entity: "University",
            website: "https://www.lut.fi/web/en",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Direct recycling",
            implementation: "Lab",
            investigation: "End-of-life RO membranes recycling: Reuse as NF membranes by polyelectrolyte layer-by-layer deposition",
            results: "https://www.sciencedirect.com/science/article/pii/S0376738818327728",
            mailing_address: "LUT School of Engineering Science, Lappeenranta University of Technology, Lappeenranta 53851, Finland",
            contacts: "arto.pihlajamaki@lut.fi"
          },
          {
            image_id: 30,
            specific_application: "River water&#10;treatment application",
            company_name: "Federal University of Minas Gerais",
            project_name: "-",
            entity: "University",
            website: "https://www.ufmg.br/",
            typeEOF_membrane: "Nanofiltration",
            research_activity: "Direct recycling",
            implementation: "Lab / Pilot",
            investigation: "Bench and pilot scale performance assessment of recycled membrane converted from old nanofiltration membranes",
            results: "https://doi.org/10.1080/09593330.2018.1526218",
            mailing_address: "Department of Sanitary and Environmental Engineering, Federal University of Minas Gerais, Av. Antônio Carlos, no. 6627, Pampulha, Belo Horizonte, Minas Gerais, Brazil",
            contacts: "ecoutinho@desa.ufmg.br"
          },
          {
            image_id: 31,
            specific_application: "Synthetic river water",
            company_name: "University of Girona (Spain) and University of New South Wales (Australia)",
            project_name: "TECNIOSPRING+ Mem2.0 - Consortium",
            entity: "Public institutions",
            website: "http://www.lequia.udg.edu/",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Indirect recycling",
            implementation: "Pilot",
            investigation: "Mem2.0: Novel membrane housing designs for gravity-driven NF and UF recycled membrane-based systems",
            results: "http://www.lequia.udg.edu/research/ongoing-projects/item/2621-mem2-0.html",
            mailing_address: "LEQUIA. Institut de Medi Ambient, Universitat de Girona. Campus Montilivi - 17003 Girona ",
            contacts: " joaquim.comas@udg.edu "
          },
          {
            image_id: 32,
            specific_application: "Recycling of membrane components",
            company_name: "IMDEA Agua",
            project_name: "INREMEM - Consortium",
            entity: "Research center & University",
            website: "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Indirect recycling",
            implementation: "Lab",
            investigation: "INREMEM project: innovation and recycling membranes  for water filtration(UF-MBR, FO, electrodyalisis, support)",
            results: "http://inremem.simplesite.com/",
            mailing_address: "IMDEA Water. Avenida Punto Com, n°2 - 28805, Alcalá de Henares, Madrid, Spain",
            contacts: "membranas.agua@imdea.org"
          },
          {
            image_id: 33,
            specific_application: "Recycling of membrane components",
            company_name: "IMDEA Agua",
            project_name: "INREMEM - Consortium",
            entity: "Research center & University",
            website: "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Indirect recycling",
            implementation: "Lab",
            investigation: "Circular economy in membrane technology: using end-of-life reverse osmosis modules for preparation of recycled anion exchange membranes and validation in electrodialysis.",
            results: "https://doi.org/10.1016/j.memsci.2019.117423",
            mailing_address: "IMDEA Water. Avenida Punto Com, n°2 - 28805, Alcalá de Henares, Madrid, Spain",
            contacts: "membranas.agua@imdea.org"
          },
          {
            image_id: 34,
            specific_application: "Recycling of membrane components",
            company_name: "IMDEA Agua",
            project_name: "INREMEM - Consortium",
            entity: "Research center & University",
            website: "http://www.agua.imdea.org/infraestructuras-cientificas/plantas-piloto/tecnologia-membranas",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Indirect recycling",
            implementation: "Lab",
            investigation: "Recycled desalination membranes as a support material for biofilm development: A new approach for microcystin removal during water treatment",
            results: "http://dx.doi.org/10.1016/j.scitotenv.2018.07.435",
            mailing_address: "IMDEA Water. Avenida Punto Com, n°2 - 28805, Alcalá de Henares, Madrid, Spain",
            contacts: "membranas.agua@imdea.org"
          },
          {
            image_id: 35,
            specific_application: "Recycling of membrane components",
            company_name: "FACSA",
            project_name: "H2020 - Remeb - Consortium",
            entity: "Private Companies & Public institutions",
            website: "http://www.remeb-h2020.com/about-us/",
            typeEOF_membrane: "Ceramic membranes",
            research_activity: "Indirect recycling",
            implementation: "Industrial",
            investigation: "H2020 Remeb. Implementation and validation of a low cost recycled ceramic membrane bioreactor (MBR) for water reuse in a Wastewater Treatment Plant (WWTP)",
            results: "http://www.remeb-h2020.com/project-progress/",
            mailing_address: "Grupo Gimeno. Av. del Mar, 53 - 12003 Castellón de la Plana, Castellón, Spain",
            contacts: "ezuriaga@facsa.com"
          },
          {
            image_id: 36,
            specific_application: "Recycling of membrane components",
            company_name: "MEMRE",
            project_name: "MemRe GmbH Co.",
            entity: "Private Company",
            website: "http://www.memre.de ",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Indirect recycling",
            implementation: "Industrial",
            investigation: "end-of-life membranes transportation and labeling, from the pickup on site until the recycling plant and special services for radioactive contaminated membranes if requested",
            results: "https://www.dme-gmbh.de/new-founded-company-memre-gmbh/",
            mailing_address: "Memre. Achert 677889, Seebach,Germany ",
            contacts: "kontakt@memre.de"
          },
          {
            image_id: 37,
            specific_application: "Recycling of membrane components",
            company_name: "Université de Nantes",
            project_name: "-",
            entity: "University",
            website: "http://www.univ-nantes.fr/ ",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Indirect recycling",
            implementation: "Lab/Pilot",
            investigation: "Old RO membranes: solutions for reuse",
            results: "https://www.tandfonline.com/doi/abs/10.1080/19443994.2014.943060",
            mailing_address: "GEPEA, UMR CNRS 6144, Université de Nantes, 37 Bd. de l’université, CRTT BP406, 44602 Saint-Nazaire, France",
            contacts: "maxime.pontie@univ-angers.fr"
          },
          {
            image_id: 38,
            specific_application: "Recycling of membrane components",
            company_name: "Angers University, GEIHP",
            project_name: "Angers University, GEIHP",
            entity: "University",
            website: "http://www.univ-angers.fr/fr/recherche/poles-et-unites/pole-sante/geihp.html ",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Indirect recycling & energy recovery",
            implementation: "Lab/Pilot",
            investigation: "Recycling and energy recovery solutions of end-of-life reverse osmosis (RO) membrane materials: A sustainable approach",
            results: "https://www.sciencedirect.com/science/article/pii/S0011916417301042 ",
            mailing_address: "COMUE UBL, Angers University, GEIHP, EA3142, 4 rue Larrey, CHU - IBS, 49933 Angers 09, France",
            contacts: "maxime.pontie@univ-angers.fr"
          },
          {
            image_id: 39,
            specific_application: "Recycling of membrane components",
            company_name: "University Complutense of Madrid",
            project_name: "-",
            entity: "University",
            website: "https://www.ucm.es/ ",
            typeEOF_membrane: "Reverse osmosis - spiral wound",
            research_activity: "Indirect recycling",
            implementation: "Lab",
            investigation: "Interfacial polymerization study for recycling RO membranes in FO wastewater treatment; Recycling RO membranes for the treatment of high saline solutions by membrane distillation ",
            results: "EUROMEMBRANE 2018 CONGRESS: POSTER (N-404) (N-600)",
            mailing_address: "Department of Applied Physics I, Faculty of Physics, University Complutense of Madrid, Avda. Complutense s/n - 28040 Madrid, Spain",
            contacts: "mcgpayo@ucm.es"
          }
        ],
        table_fields: [
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
          {key: 'results', label: "Main results / products"},
          {key: 'mailing_address', label: "Mailing address of the supervising organization"},
          {key: 'contacts', label: "Contacts"}
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
      getID: function(num) {
        let aux = JSON.stringify(num.c);
        let id="caseImg" + aux.toString();
        return id;
      },
      get_image_info(num){
        let aux = JSON.stringify(num.c);
        let imageInfo = this.caseStudies_info.find(i => i.image_id == aux);
        return imageInfo;
      }
    },
    computed: {
      get_cases_to_show() {
        let caseNumbers = [];

        let membrane = this.membrane_type;
        let perm = this.permeability;
        let rejection = this.salt_rejection;
        let imagesList = this.images;

        this.solution_code.forEach(function (sol) {
            let auxObject = {
              membrane_type: membrane,
              permeability: perm,
              salt_rejection: rejection,
              membrane_reuse: sol.name
            };
            function compare_membrane_reuse(obj1, obj2){
              if(obj1.membrane_reuse === obj2.membrane_reuse)
                return true;
              else
                return false;
            }
            let ret;
            if(sol.image_id !== "IR")
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
        console.log("caseNumbers to show: ", caseNumbers);
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
    padding: 0.6em 1em;
  }

  .imageContainer:hover img {
    transform: scale(1.5);
    //overflow: visible;
  }

  #caseImg {
    cursor: pointer;
    transition: 0.3s;
  }
  #caseImg:hover {
    opacity: 0.5;
  }

</style>
