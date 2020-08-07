<template lang="pug">
  Menus
</template>

<script>
  import Menus from "./components/Menus";

  export default {
    name: 'App',
    components: {
      Menus
    },
    data () {
      return {

      }
    }
  }
</script>


<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>


<style>
  @import 'https://fonts.googleapis.com/css?family=Fira+Sans:400,300,300italic,400italic,500,500italic,700,700italic';
  @import "https://fonts.googleapis.com/css?family=Open+Sans";

  :root {
    --font-family-primary: 'Open Sans', sans-serif;
    --green-primary: #a0c04d;
    --blue-primary: #3a89b4;
    --red-primary: #ab585b;
    --bold-text: 600;
    --light-gray-primary: #ababab;
    --dark-gray-primary: #383838;
    --gray-for-tables: #dee2e6;

    /*EDICITY to remove */
    /*--font-family-primary: "Fira Sans",Helvetica,Arial,Lucida,sans-serif;*/
    --gray-font-color: #404040;
    --questions-font-color: #343a40;
    --dark-red: #c51e23;
    --light-gray-secondary: #f8f9fa;
    --text-weight: 400;
    --height-child-comp: calc(100vh - 4rem);
  }

  body {
    font-family: var(--font-family-primary);
    color: var(--gray-font-color);
    font-weight: var(--text-weight);
    font-size: 14px;
    line-height: normal;
  }

  /*---- BANNERS ----*/
  .banner {
    position: relative;
  }
  .bannerTitle {
    color: white;
    position: absolute;
    bottom: 52%;
    top: 48%;
    left: 20%;
  }

  .bannerTitle > p {
    font-size: 2vw;
    font-weight: var(--bold-text);
  }


  /*---- QUESTION STATEMENT FONT COLOR ----*/
  .col-form-label {
    color: var(--questions-font-color);
  }

  /*---- BUTTONS ----*/
  .buttonRed.btn-secondary {
    color: #fff;
    background-color: var(--dark-red);
    border-color: var(--dark-red);
    font-weight: var(--bold-text);
    font-size: small;
    overflow: hidden;
    min-width: fit-content;
  }

  .buttonRed.btn-secondary:hover {
    color: #fff;
  }

  .buttonGreen.btn-secondary  {
    color: #fff;
    background-color: var(--green-primary);
    border-color: var(--green-primary);
    font-weight: var(--bold-text);
    font-size: small;
    overflow: hidden;
    min-width: fit-content;
  }

  .buttonGreenSmall.btn-secondary {
    width: 50%;
    min-width: fit-content;
    border-radius: 1rem;
    color: #fff;
    background-color: var(--green-primary);
    border-color: var(--green-primary);
    font-weight: bold;
    font-size: x-small;
    overflow: hidden
  }

</style>