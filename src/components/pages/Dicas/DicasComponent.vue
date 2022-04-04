<template>
  <v-card id="teste">
    <v-card-title>
      Dicas
    </v-card-title>
    <div v-if="errors" class="bg-red-500 text-white py-2 px-4 pr-0 rounded font-bold mb-4 shadow-lg">
      <div v-for="(v, k) in errors" :key="k">
        <v-alert
            v-for="error in v" :key="error"
            type="error"
            dismissible>

          {{ error }}
        </v-alert>
      </div>
    </div>

    <v-alert
        v-if="errorM"
        type="error"
        dismissible>

      Erro: <br>{{ messageError }}
    </v-alert>

    <v-alert
        v-if="success"
        type="success"
        dismissible>
      <br>{{ messageSucesso }}
    </v-alert>

    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        item-key="id"
        hide-details
        class="mx-4"
    ></v-text-field>

    <v-data-table
        :headers="headers"
        :items="dicas"
        class="elevation-1"
        :search="search"
    >
      <template v-slot:top>
        <v-toolbar
            flat
        >

          <v-spacer></v-spacer>
          <v-dialog
              v-model="dialog"
              max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  v-on:click="getVeiculos()"
              >
                Adicionar
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                        cols="12"
                    >
                      <v-text-field
                          v-model="editedItem.descricao"
                          label="Descrição"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                        cols="12">
                      <v-select
                          :items="veiculos"
                          item-text="veiculo"
                          v-model="editedItem.veiculo_id"
                          label="Escolha um Veículo"
                          class="input-group--focused"
                          item-value="id"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                >
                  Cancelar
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                >
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Tem certeza que quer deletar?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">Ok</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>


  </v-card>
</template>

<script>

export default {
  name: 'DicasComponent',
  data: () => ({
    errorM: false,
    errors: [],
    veiculos: [],
    success: false,
    messageError: '',
    messageSucesso: '',
    dialog: false,
    search: '',
    dialogDelete: false,
    headers: [
      {
        text: 'Código',
        sortable: true,
        value: 'id',
        align: ' d-none'
      },
      {
        text: 'Número',
        sortable: true,
        value: 'numero',
      },
      {
        text: 'Descrição',
        sortable: true,
        value: 'descricao',
      },
      {text: 'Tipo', value: 'tipo', sortable: true},
      {text: 'Tipo_ID', value: 'tipo_id', sortable: true, align: ' d-none'},
      {text: 'Marca', value: 'marca', sortable: true},
      {text: 'Marca_ID', value: 'marca_id', sortable: true, align: ' d-none'},
      {text: 'Modelo', value: 'modelo', sortable: true},
      {text: 'Modelo_ID', value: 'modelo_id', sortable: true, align: ' d-none'},
      {text: 'Versão', value: 'versao', sortable: true},
      {text: 'Versao_ID', value: 'versao_id', sortable: true, align: ' d-none'},
      {text: 'Actions', value: 'actions', sortable: false},
    ],
    dicas: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      numero: '',
      tipo: '',
      tipo_id: '',
      marca: '',
      marca_id: '',
      modelo: '',
      modelo_id: '',
      versao: '',
      versao_id: '',
    },
    defaultItem: {
      id: '',
      numero: '',
      tipo: '',
      tipo_id: '',
      marca: '',
      marca_id: '',
      modelo: '',
      modelo_id: '',
      versao: '',
      versao_id: '',

    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Item' : 'Editar Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

      this.$http.post('http://localhost:8080/api/tip/search',{
          data:{
            "search":[{
              operator: "is",
              field: 'user_id',
              value: this.getUserId()
            }]
          }
      })
          .then(result => {
            this.dicas = result.data.data
          }).catch((error) => {
        this.errorM = true;
        this.messageError = error.response.data.error || error.response.data.error;
      }).finally();
    },

    editItem(item) {
      this.editedIndex = this.dicas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.getVeiculos();
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.dicas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.$http.delete(`http://localhost:8080/api/tip/${this.editedItem.id}`).then(result => {
        this.success = true
        this.messageSucesso = result.data.msg;
        this.initialize();
      }).catch((error) => {
        this.errorM = true;
        this.messageError = error.response.data.error;
      }).finally();
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    //salvar
    save() {

      if (this.editedIndex > -1) {

        this.$http.put(`http://localhost:8080/api/tip/${this.editedItem.id}`, {
          descricao: this.editedItem.descricao,user_id: this.getUserId(), veiculo_id: this.editedItem.veiculo_id
        }).then(result => {
          this.success = true
          this.messageSucesso = result.data.msg;
          this.initialize();
        }).catch((error) => {
          this.errorM = true;
          this.messageError = error.response.data.error;
        }).finally();

        //atualizar
      } else {

        this.$http.post('http://localhost:8080/api/tip', {
          descricao: this.editedItem.descricao,user_id: this.getUserId(), veiculo_id: this.editedItem.veiculo_id
        }).then(result => {
          this.success = true
          this.messageSucesso = result.data.msg;
          this.initialize();
        }).catch((error) => {
          if (error.response.status == 403) {
            this.errors = error.response.data.errors;
            return false;
          }
          this.errorM = true;
          this.messageError = error.response.data.error;
        }).finally();


      }
      this.close();
    },
    getVeiculos(){
      this.$http.get('http://localhost:8080/api/vehicle').then(result => {
        this.veiculos = result.data.data
      }).catch((error) => {
        this.errorM = true;
        this.messageError = error.response.data.error;
      }).finally();
    },
    getUserId(){
      console.log()
      return localStorage.getItem('user_id') || 0;
    }
  },
}
</script>

<style>

</style>
