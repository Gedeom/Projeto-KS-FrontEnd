<template>
  <v-card id="teste">


    <v-card-title>
      Login
    </v-card-title>

    <v-alert
        v-if="error"
        type="error"
        dismissible>

      Erro ao logar: <br>{{ messageError }}
    </v-alert>

    <v-alert
        v-if="success"
        type="success"
        dismissible>
      Logado com sucesso!
    </v-alert>

    <v-form class="mx-4"
            ref="form"
            v-model="valid"
            lazy-validation
    >
      <v-row>

        <v-col cols="4">
          <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
              type="password"
              :rules="senhaRules"
              label="Senha"
              id="senha"
              required
          ></v-text-field>
        </v-col>

      </v-row>
      <v-row>
        <v-col cols="2">
          <v-btn @click="logar"
                 color="primary"
                 dark>
            Logar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>


  </v-card>


</template>

<script>
import { mapActions } from "vuex";
export default {
  name: 'LoginComponent',
  data: () => ({
    valid: false,
    messageError: '',
    error: false,
    success: false,
    email: '',
    emailRules: [
      v => !!v || 'E-mail é obrigatório',
      v => /.+@.+\..+/.test(v) || 'E-mail precsa ser válido',
    ],
    senhaRules: [
      v => !!v || 'Senha é obrigatória',
    ],
    items: [
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
    ],
  }),
  methods: {
    ...mapActions(["addUsers"]),
    logar() {
      if (this.valid) {
        const password = document.querySelector('#senha').value;
        this.$http.post('http://localhost:8080/api/login', {
          email: this.email,
          password: password
        })
            .then(resp => {
              this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + resp.data.token;
              console.log(resp.data.user);
              // this.$store.commit('LOGIN_SUCCESS', resp);
              localStorage.setItem('token', resp.data.token);
              localStorage.setItem('user_id', resp.data.user.id);
              localStorage.setItem('name', resp.data.user.name);
              localStorage.setItem('img', resp.data.user.img);
              this.success = true;

              setTimeout(() => {
                this.$router.go({path:'Home'});
              },1000)
            }).catch(resp => {
          console.log(resp);
          this.messageError = resp.response.data.error;
          this.error = true;
        })
      }
    }
  }
}
</script>

<style>

</style>
