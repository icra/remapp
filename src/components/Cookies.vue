<template lang="pug">
  div.cookies
    div.cookieBanner(v-if="this.cookies_open")
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

</template>

<script>

import CookieLaw from 'vue-cookie-law';
import {bootstrap} from 'vue-gtag';

export default {
  name: "Cookies",
  components: {
    CookieLaw,
  },
  data() {
    return {
      cookies_open: true,
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
      });
      console.log("Accepted COOKIES")
    },
    decline_cookies(){
      this.cookies_open = false;
      console.log("Declined COOKIES")
    },
    getCookies() {
      return localStorage.getItem('cookies:accepted');
    }
  }
}
</script>

<style scoped>
  .Cookie--base {
    background: var(--dark-gray-primary);
    color: white;
  }

  .Cookie--base .Cookie__button--decline {
    background: var(--gray-for-tables);
    color: #727272;
  }

  a.moreInfo{
    color: var(--green-primary);
  }

  a:hover.moreInfo {
    color: var(--blue-primary);
    text-decoration: underline;
  }
</style>