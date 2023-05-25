<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-btn 
        color="primary" 
        elevation="0"
        @click="creationDialog = true">
          Создать
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-simple-table>
          <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">
                Имя
              </th>
              <th class="text-center">
                Фамилия
              </th>
              <th class="text-center">
                Дата рождения
              </th>
              <th class="text-center">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
            v-for="item in paginatedData"
            :key="item.id"
            >
            <td class="text-center">{{ item.name }}</td>
            <td class="text-center">{{ item.surname }}</td>
            <td class="text-center">{{ item.birthDate }}</td>
            <td class="text-center">
              <v-btn icon @click="openEditDialog(item.id)">
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
              <v-btn icon color="red" @click="deleteItem(item.id)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </td>
            </tr>
          </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col>
        <v-pagination
          v-model="page"
          :length="paginationLength"
          circle
        ></v-pagination>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-dialog
    v-model="creationDialog"
    max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Добавить запись
        </v-card-title>

        <v-form v-model="validCreationForm" ref="creationForm">
          <v-card-text>
            <v-text-field
            v-model="newName"
            label="Имя"
            ></v-text-field>

            <v-text-field
            v-model="newSurname"
            label="Фамилия"
            :rules="surnameRules"
            required
            ></v-text-field>

            <v-text-field
            v-model="newBirthDate"
            label="Дата рождения"
            :rules="birthDateRules"
            required
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="red darken-1"
              text
              @click="closeDialog"
            >
              Отмена
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              text
              @click="createItem"
            >
              Добавить
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog
    v-model="editionDialog"
    max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Изменить запись
        </v-card-title>

        <v-form v-model="validEditionForm" ref="edirionForm">
          <v-card-text>
            <v-text-field
            v-model="selectedItem.name"
            label="Имя"
            ></v-text-field>

            <v-text-field
            v-model="selectedItem.surname"
            label="Фамилия"
            :rules="surnameRules"
            required
            ></v-text-field>

            <v-text-field
            v-model="selectedItem.birthDate"
            label="Дата рождения"
            :rules="birthDateRules"
            required
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="red darken-1"
              text
              @click="editionDialog = false"
            >
              Отмена
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              text
              @click="editItem"
            >
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    
    <v-snackbar
    v-model="snackbar"
    :timeout="2000"
    :color="snackbarColor"
    top
    right
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { api } from "@/service"

export default {
  name: 'MainScreen',
  components: {
  },
  data(){
    return {
      people: [],
      paginationLength: 0,
      page: 1,
      creationDialog: false,
      editionDialog: false,
      newName: '',
      newSurname: '',
      newBirthDate: '',
      selectedItem: {},
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      validCreationForm: false,
      validEditionForm: false,
      surnameRules: [
        v => !!v || 'Обязательное поле'
      ],
      birthDateRules: [
        v => !!v || 'Обязательное поле',
        v => /[0-3][0-9]\.[01][0-9]\.[12][0-9][0-9][0-9]/.test(v) || 'Неверный формат даты',
      ],
    }
  },
  watch: {},
  mounted() {},
  created(){
    this.getItems()
  },
  computed: {
    paginatedData(){
      const start = this.page * 3 - 3,
            end = start + 3
      return this.people.slice(start, end)
    }
  },
  methods: {
    getItems(){
      api.getAllPeople().then((response) => {
        this.people = response.data
        this.paginationLength = Math.ceil(response.data.length / 3)
      })
    },
    createItem() {
      if(this.validCreationForm) {
        const newItem = {
          name: this.newName,
          surname: this.newSurname,
          birthDate: this.newBirthDate
        }

        api.createNewItem(newItem)
          .then( () => {
            this.snackbarText = 'Запись создана успешно'
            this.snackbarColor = 'green darken-1'
            this.snackbar = true
            this.closeDialog()
            this.getItems()
          })
          .catch(() => {
            this.snackbarText = 'Произошла ошибка'
            this.snackbarColor = 'red darken-1'
            this.snackbar = true
            this.closeDialog()
          })
      } else {
        this.$refs.creationForm.validate()
      }
    },
    editItem() {
      if(this.validEditionForm){
        api.editItem(this.selectedItem)
          .then( () => {
            this.snackbarText = 'Запись изменена успешно'
            this.snackbarColor = 'green darken-1'
            this.snackbar = true
            this.editionDialog = false
            this.getItems()
          })
          .catch(() => {
            this.snackbarText = 'Произошла ошибка'
            this.snackbarColor = 'red darken-1'
            this.snackbar = true
            this.editionDialog = false
          })
      } else {
        this.$refs.edirionForm.validate()
      }
    },
    deleteItem(id) {
      api.deleteItem(id)
        .then( () => {
          this.snackbarText = 'Запись удалена успешно'
          this.snackbarColor = 'green darken-1'
          this.snackbar = true
          this.getItems()
        })
        .catch(() => {
          this.snackbarText = 'Произошла ошибка'
          this.snackbarColor = 'red darken-1'
          this.snackbar = true
        })
    },
    openEditDialog(id) {
      this.selectedItem = {...this.people.find(el => el.id === id)}
      this.editionDialog = true
    },
    closeDialog(){
      this.newName = ''
      this.newSurname = ''
      this.newBirthDate = ''
      this.creationDialog = false
    }
  }
}
</script>

<style lang="scss">
</style>
