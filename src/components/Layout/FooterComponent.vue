<template>
  <v-footer
      dark
      padless
  >
    <v-card
        class="flex"
        flat
        tile
    >
      <v-card-title class="teal">
        <strong class="subheading">Desenvolvido por Gedeom Anastácio, me encontre nas redes socias!</strong>

        <v-spacer></v-spacer>

        <v-btn
            v-for="data in icons"
            :key="data.icon"
            class="mx-4"
            dark
            icon
            :href="data.link"
            target="_blank"
        >
          <v-icon size="24px">
            {{ data.icon }}
          </v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
  </v-footer>
</template>

<script>

export default {
  name: 'FooterComponent',
  data: () => ({
    icons: [
      {icon: 'mdi-github', link: 'https://github.com/Gedeom'},
      {icon: 'mdi-linkedin', link: 'https://www.linkedin.com/in/gedeom'},
      {icon: 'mdi-instagram', link: 'https://www.instagram.com/_gedeom'},
    ],
  }),
}
</script>

<style>

</style>
