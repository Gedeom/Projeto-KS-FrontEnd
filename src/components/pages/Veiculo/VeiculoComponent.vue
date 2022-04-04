<template>
  <v-card id="teste">
    <v-card-title>
      Veiculos
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
        :items="veiculos"
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
                  v-on:click="getTipos(); getModelos();getVersoes()"
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
                        cols="12">
                      <v-select
                          :items="tipos"
                          item-text="descricao"
                          v-model="editedItem.tipo_id"
                          label="Escolha um Tipo"
                          class="input-group--focused"
                          item-value="id"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                        cols="12">
                      <v-select
                          :items="modelos"
                          item-text="descricao"
                          v-model="editedItem.modelo_id"
                          label="Escolha um Modelo"
                          class="input-group--focused"
                          item-value="id"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                        cols="12">
                      <v-select
                          :items="versoes"
                          item-text="descricao"
                          v-model="editedItem.versao_id"
                          label="Escolha uma Versão"
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
  name: 'VeiculoComponent',
  data: () => ({
    errorM: false,
    errors: [],
    tipos: [],
    modelos: [],
    versoes: [],
    success: false,
    messageError: '',
    messageSucesso: '',
    dialog: false,
    search: '',
    dialogDelete: false,
    headers: [
      {
        text: 'Código',
        align: 'start',
        sortable: true,
        value: 'id',
      },
      {text: 'Tipo', value: 'tipo', sortable: true},
      {text: 'Tipo_ID', value: 'tipo_id', sortable: true, align: ' d-none'},
      {text: 'Marca', value: 'marca', sortable: true, },
      {text: 'Marca_ID', value: 'marca_id', sortable: true, align: ' d-none'},
      {text: 'Modelo', value: 'modelo', sortable: true},
      {text: 'Modelo_ID', value: 'modelo_id', sortable: true, align: ' d-none'},
      {text: 'Versão', value: 'versao', sortable: true},
      {text: 'Versao_ID', value: 'versao_id', sortable: true, align: ' d-none'},
      {text: 'Actions', value: 'actions', sortable: false},
    ],
    veiculos: [],
    editedIndex: -1,
    editedItem: {
      id: '',
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

      this.$http.get('http://localhost:8080/api/vehicle')
          .then(result => {
            this.veiculos = result.data.data
          }).catch((error) => {
        this.errorM = true;
        this.messageError = error.response.data.error || error.response.data.error;
      }).finally();
    },

    editItem(item) {
      this.editedIndex = this.veiculos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.getTipos();
      this.getModelos();
      this.getVersoes();
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.veiculos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.$http.delete(`http://localhost:8080/api/vehicle/${this.editedItem.id}`).then(result => {
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

        this.$http.put(`http://localhost:8080/api/vehicle/${this.editedItem.id}`, {
          tipo_id: this.editedItem.tipo_id, modelo_id: this.editedItem.modelo_id,
          versao_id: this.editedItem.versao_id, user_id: this.getUserId()
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

      console.log(this.editedItem);
        this.$http.post('http://localhost:8080/api/vehicle', {
          tipo_id: this.editedItem.tipo_id, modelo_id: this.editedItem.modelo_id,
          versao_id: this.editedItem.versao_id, user_id: this.getUserId()
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
    getTipos(){
      this.$http.get('http://localhost:8080/api/type').then(result => {
        this.tipos = result.data.data
      }).catch((error) => {
        this.errorM = true;
        this.messageError = error.response.data.error;
      }).finally();
    },
    getModelos(){
      this.$http.get('http://localhost:8080/api/model').then(result => {
        console.log(result.data.data);
        this.modelos = result.data.data
      }).catch((error) => {
        this.errorM = true;
        this.messageError = error.response.data.error;
      }).finally();
    },
    getVersoes(){
      this.$http.get('http://localhost:8080/api/version').then(result => {
        this.versoes = result.data.data
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
