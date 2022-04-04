<template>
  <div>
    <v-app-bar app
               class="teal"
               dark>
      <v-tabs>
        <v-tab class="text-h5" :to="{name:'Home'}">
          Início
        </v-tab>

        <v-tab :to="{name:'Marca'}" v-if="logado">
          Marca
        </v-tab>

        <v-tab v-if="logado" :to="{name:'Modelo'}">
          Modelo
        </v-tab>

        <v-tab v-if="logado" :to="{name:'Versao'}">
          Versão
        </v-tab>

        <v-tab v-if="logado" :to="{name:'Veiculo'}">
          Veículo
        </v-tab>

        <v-tab v-if="logado" :to="{name:'Dicas'}">
          Dicas
        </v-tab>
      </v-tabs>


      <v-tabs right >
        <v-tab :to="{name:'Login'}" v-if="logado === false">
          Login
        </v-tab>

        <v-tab v-if="logado" @click="logout()">
          Logout
        </v-tab>


        <v-tab :to="{name:'Cadastro'}">
          Cadastro
        </v-tab>

        <v-tab v-if="logado">
          <v-icon>mdi-account</v-icon>
          {{ getNameLogado }}

        </v-tab>
      </v-tabs>
    </v-app-bar>
  </div>
</template>

<script>

export default {
  name: 'HeaderComponent',
  data() {
    return {
      autenticado: this.$store.state.UsersModule.name != null
    }
  },
  methods: {
    getToken(){
      return localStorage.getItem('token');
    },
    clearToken(){
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('name');
      return true
    },
    logout: function(){
      this.$http.post(`http://localhost:8080/api/logout`, {
        token: this.getToken(),
      }).then(result => {
        this.success = true
        this.messageSucesso = result.data.msg;
        this.clearToken();

        setTimeout(() => {
          this.$router.go('/');
        },1000)
      }).catch((error) => {
        if (error.response.status == 403) {
          this.errors = error.response.data.errors;
          return false;
        }
        this.errorM = true;
        this.messageError = error.response.data.error;
      });
    }
  },
  computed: {
    logado: function(){
      return localStorage.getItem('token') != null
    },
    getNameLogado: function(){
      return localStorage.getItem('name')
    },

  }
}
</script>

<style>

</style>
