<template>
  <v-card id="teste">
    <v-card-title>
      Marcas
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

      Erro ao salvar: <br>{{ messageError }}
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
        :items="marcas"
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
                          label="Descricao"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4">
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
  name: 'MarcaComponent',
  data: () => ({
    errorM: false,
    errors: [],
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
      {text: 'Descrição', value: 'descricao',        sortable: true,
      },
      {text: 'Actions', value: 'actions', sortable: false},
    ],
    marcas: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      descricao: '',
    },
    defaultItem: {
      id: '',
      descricao: '',
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

      this.$http.get('http://localhost:8080/api/brand')
          .then(result => {
            this.marcas = result.data.data
          }).catch((error) => {
        this.errorM = true;
        this.messageError = error.response.data.error;
      }).finally();
    },

    editItem(item) {
      this.editedIndex = this.marcas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.marcas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.$http.delete(`http://localhost:8080/api/brand/${this.editedItem.id}`).then(result => {
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

        this.$http.put(`http://localhost:8080/api/brand/${this.editedItem.id}`, {
          descricao: this.editedItem.descricao
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

        //atualizar
      } else {


        this.$http.post('http://localhost:8080/api/brand', {
          descricao: this.editedItem.descricao
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
      this.close()
    },
  },
}
</script>

<style>

</style>
