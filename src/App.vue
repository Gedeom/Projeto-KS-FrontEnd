<template>
  <v-app>
    <header-component></header-component>
    <v-main >
      <v-container class="container-center">
        <router-view></router-view>
      </v-container>
    </v-main>
    <footer-component></footer-component>
  </v-app>
</template>

<script>
import header from './components/Layout/HeaderComponent'
import footer from './components/Layout/FooterComponent'

export default {
  name: 'App',
  components: {
    "header-component": header,
    "footer-component": footer,
  },
  computed: {
    authenticated: function(){ return this.$store.state.UsersModule.token != null},
  }

}
</script>

<style>

</style>
