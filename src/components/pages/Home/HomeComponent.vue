<template>
  <v-card id="teste">
    <v-card-title>
      Últimas 15 Dicas
    </v-card-title>

    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        class="mx-4"
    ></v-text-field>

    <v-data-table
        :headers="headers"
        :items="dicas"
        item-key="name"
        class="elevation-1"
        :search="search"
    ></v-data-table>
  </v-card>
</template>

<script>

export default {
  name: 'HomeComponent',
  mounted() {
    this.getDicas();
  },
  data() {
    return {
      search: '',
      dicas: [],
      headers: [
        {
          text: 'Número',
          align: 'start',
          sortable: true,
          value: 'numero',
        },
        {text: 'Dica', value: 'descricao', sortable: true},
        {text: 'Marca', value: 'marca'},
        {text: 'Modelo', value: 'modelo'},
        {text: 'Versão', value: 'versao'},
        {text: 'Usuário', value: 'user'},
      ],
    }
  },
  methods: {
    getDicas(){
      this.$http.get('http://localhost:8080/api/tip/lasts')
          .then(result => {
            console.log(result,result.data);
            this.dicas = result.data.data
            console.log(result.data.data);
          }).catch((error) => {
            console.log(error);
          }).finally();
    },
  }
}
</script>

<style>

</style>
