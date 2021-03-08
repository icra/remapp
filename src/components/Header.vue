<template lang="pug">
  .headerContent
    b-container(fluid="true").p-2.mx-lg-5.mx-3
      b-row
        //b-col(align-h="start" style="height: 8vh;")
          b-img.p-2(src="/img/logo_mem.png" fluid style="max-width: 100%; max-height: 100%;")
        //b-col(align-self="center" align-h="end" cols="auto" )
          b-row
        b-col(cols="auto")
          a(type="button") ABOUT REMapp
        b-col
          b-icon(
            icon="chevron-up"
            size="sm"
            v-b-toggle.about
          )
      b-row(align-h="end")
        b-col()
          b-collapse.collapsed(id="about" class="mt-2").p-2
            hr.solid
            h4 Membrane Waste Challenge
            ul
              li Reverse osmosis desalination plants use thousands of elements that need to be replaced every 5-10 years.
              li In many parts of the world, landfill is currently the only option for disposal.
              li Over 2.000.000 of membranes per year are to be disposed globally by 2025.
              li Many reuse and recycle options are available at laboratory, pilot and full scale implementation.

            br
            h4 What is REMapp for?
            p REMapp is a simple decision-making tool for end-of-life spiral-wound reverse osmosis and nanofiltration membranes with the specific size of 40 inches of length and 8 inches of diameter.

            br
            h4 Who is REMapp useful for?
            p Membrane users who are going to replace membranes and are seeking alternative end-of-life membrane managements.

            br
            h4 Which are the potential types of end-of-life membrane management?
            p The preferable order is: reuse, direct recycling, indirect recycling, incineration and landfill disposal. Worldwide, the most common types of management, by fare, are incineration and landfill disposal (by far). REMapp shows current investigations and companies that try to avoid those practices.

            br
            h4 Glossary
            div(v-for="g in this.glossary")
              div(style="display: grid; grid-template-columns: 1fr 10fr; grid-gap:20px").ml-0
                div(:style="`background:${g.color}`")
                div
                  p.mb-0 <b><i>'{{g.title}}'</i></b> {{ g.description }}
              br

            br
            h4 How the tool works
            p The REMapp tool is comprised of a number of user interaction steps and background calculations based on user inputs.
            p When using the tool, <u>the user will provide information</u> about:
            ul
              li The condition of the end-of-life membranes: type, configuration, size, weight, damage, fouling type.
              li How end-of-life membranes were stored once they were replaced.
              li Which was the main cause of the replacement.
              li Which was the main type of water that membranes were treating.
              li Variation of water production and salt rejection compared to the design value.
            p The potential solutions will appear as the user completes the survey.
            p <u>Only when the user fully completes the survey</u>, the tool will provide information about how to produce second-hand membranes and it will also show the cases studies.

            br
            h4 Who owns REMapp?
            p This decision-making tree was developed by the LEQUIA research group of the University of Girona (UdG) in collaboration with the University of New South Wales (UNSW), IMDEA Water Institute and ICRA Institute. Specific scientific literature, results of research and development projects, as well as freely available information of companies, was used.
            ul Main team:
              li Raquel García Pacheco (<a title="mailto:raquel.garcia@udg.edu" href="mailto:raquel.garcia@udg.edu?Subject=[REMapp]%20" target="_blank">raquel.garcia@udg.edu</a> / <a title="mailto:recycledmembranes@gmail.com" href="mailto:recycledmembranes@gmail.com?Subject=[REMapp]%20" target="_blank">recycledmembranes@gmail.com</a>). Postdoctoral researcher at LEQUIA-UdG and IMDEA Water associated researcher. Decision making tree developer.
              li Joaquim Comas (<a title="mailto:joaquim.comas@udg.edu" href="mailto:joaquim.comas@udg.edu?Subject=[REMapp]%20" target="_blank">joaquim.comas@udg.edu</a>). Professor at LEQUIA-UdG and ICRA associated researcher. Advisor.
              li Pierre Le-Clech(<a title="mailto:p.le-clech@unsw.edu.au" href="mailto:p.le-clech@unsw.edu.au?Subject=[REMapp]%20" target="_blank">p.le-clech@unsw.edu.au</a>). Professor at UNSW. Advisor.
              li Joan Saló Grau (<a title="mailto:joansalograu@gmail.com" href="mailto:joansalograu@gmail.com?Subject=[REMapp]%20" target="_blank">joansalograu@gmail.com</a>). ICRA. Online interface developer.
              li Roser Brugués i Pujolràs (<a title="mailto:roserbrugues@gmail.com" href="mailto:roserbrugues@gmail.com?Subject=[REMapp]%20" target="_blank">roserbrugues@gmail.com</a>). ICRA. Online interface developer.

            br
            h4 Contact
            p <u>Do not hesitate to contact us through the main team or in</u> <a title="mailto:info@lequia.udg.edu" href="mailto:info@lequia.udg.edu?Subject=[REMapp]%20" target="_blank">info@lequia.udg.edu</a>

            br
            h4 Other online interactive tools
            ul
              li <a title="Go to MemEol" href="http://www.desalwiki.che.unsw.edu.au/w/index.php/MemEOL_Test" target="_blank">MemEOL</a>
              li <a title="Go to Webmapping" href="http://geomatica.imdea-agua.org:21000/webmappings/Membranes/index.html" target="_blank">Webmapping</a>

            br
            h4 Acknowledgements
            p The authors acknowledge the financial support of the European Union’s Horizon 2020 research and innovation programme under the Marie Skłodowska-Curie grant agreement nº 712949 (TECNIOspring PLUS) and to the Agency for Business Competitiveness of the Government of Catalonia for the grant TECSPR17-1-0019 Mem2.0 project.


    b-jumbotron(
      header="REMapp decision-making tool"
      lead="Find your alternative solution for a sustainable end-of-life reverse osmosis membrane management"
      style="background-color: var(--dark-gray-primary)"
      ).px-lg-5.px-4

</template>

<script>
  export default {
    name: "Header",
    data() {
      return {
        glossary: [
          {
            color: '#21e714',
            title: 'Re-use',
            description: 'means checking, cleaning or repairing re-covery operations, by which products or components of products ' +
              'that have become waste are prepared so that they can be re-used without any other pre-processing (Directive 2008/98/EC).'
          },
          {
            color: null,
            title: 'Recycling',
            description: 'means any recovery operation by which waste materials are reprocessed into products, materials or substances ' +
              'whether for the original or other purposes. It includes the reprocessing of organic material but does not include energy ' +
              'recovery and the reprocessing into materials that are to be used as fuels or for backfilling operations (Directive 2008/98/EC),'
          },
          {
            color: '#9ab959',
            title: 'Direct recycling',
            description: 'aims at processes that do not change the module structure but act on the active layer of the end-of-life membranes.'
          },
          {
            color: '#604b79',
            title: 'Indirect recycling',
            description: 'aims at recycling processes that change the module structure. Therefore, it requires the deconstruction of the modules.'
          },
          {
            color: '#be514e',
            title: 'Incineration and landfill disposal',
            description: 'Worldwide the most common type of management.'
          },
        ]
      }
    }
  }
</script>

<style scoped>
  .headerContent {
    color: white;
    font-weight: var(--bold-text);
    /*height: 100px;*/
  }

  .jumbotron {
    background-image: url(/img/header_foto.gif);
    background-size: cover;
    height: fit-content;
    font-weight: bold;
  }

  .jumbotron > h1 {
    font-weight: bold;
    font-size: 3rem;
  }

  .jumbotron > p {
    font-weight: bold;
    font-size: 22px;
  }

  .b-icon.bi.collapsed {
    transform: rotate(180deg);
  }

  p, ul{
    font-weight: normal;
    font-size: 16px;
  }

  .collapsed > h4{
    font-weight: bold;
  }

  hr.solid{
    border-top: 3px solid #ffffff;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  hr.solid_small{
    border-top: 1px solid #ffffff;
    margin-top: 0;
    margin-bottom: 0.5rem;
    width: 30vw;
    text-align: left;
    margin-left: 0;
  }

  a {
    color: var(--green-primary);
  }

  a:hover{
    color: var(--blue-primary);
  }


</style>
