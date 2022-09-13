<template>
  <q-page>
    <FormModal ref="formModal" />

    <div class="page-container flex column q-mt-xl q-mx-auto">
      <q-table
        title="Itens"
        :rows="node.items"
        row-key="name"
        :columns="columns"
        v-model:pagination="pagination"
        no-data-label="Nenhum item cadastrado"
      >
        <template v-slot:top-right>
          <!-- <q-btn
            color="negative"
            icon-right="delete_forever"
            no-caps
            @click="deleteAll"
          >
            <q-tooltip>Apagar todos os itens</q-tooltip>
          </q-btn> -->

          <q-btn
            color="primary"
            icon-right="add"
            no-caps
            class="q-ml-md"
            @click="() => openModal()"
          >
            <q-tooltip>Adicionar novo item</q-tooltip>
          </q-btn>
        </template>

        <template v-slot:body-cell-imageUrl="props">
          <q-td :props="props">
            <q-img
              style="width: 32px; height: 32px"
              :src="props.row.imageUrl"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              color="primary"
              icon-right="edit"
              no-caps
              flat
              dense
              @click="() => openModal(props.row)"
            >
              <q-tooltip>Editar este item</q-tooltip>
            </q-btn>

            <q-btn
              color="negative"
              icon-right="delete"
              no-caps
              flat
              dense
              @click="deleteItem(props.row.name)"
            >
              <q-tooltip>Remover este item</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data="{ icon, message }">
          <div
            class="full-width row flex-center q-gutter-sm"
            style="color: #ff00ff"
          >
            <q-icon size="2em" name="sentiment_dissatisfied" />

            <span> {{ message }} </span>

            <q-icon size="2em" :name="icon" />
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<style>
.page-container {
  width: 80%;
}
</style>

<script>
import { mapGetters, mapActions } from 'vuex';
import FormModal from 'components/ItemModal.vue';
import { loadMapData } from '../model/load';

// import itemsJson from 'assets/itemsSeed';

export default {
  name: 'ItemsManagement',
  components: {
    FormModal,
  },
  created() {
    this.saveMapData().then(() => {
      this.node = this.nodes[this.$route.params.nodeId];
    });
  },
  mounted() {
    this.$q.lang.table.recordsPerPage = 'Registros por páginas';

    this.$q.lang.table.pagination = (start, end, total) => `${start}-${end} de ${total}`;
  },
  computed: mapGetters({
    nodes: 'nodes',
  }),
  data() {
    return {
      node: {
        items: [],
      },
      pagination: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: 'name',
          label: 'Nome',
          align: 'left',
          required: true,
          field: 'name',
        },
        {
          name: 'value',
          label: 'Valor',
          align: 'left',
          required: true,
          field: 'value',
          format: (val) => `${val} orens`,
        },
        {
          name: 'weight',
          label: 'Peso',
          align: 'left',
          required: true,
          field: 'weight',
          format: (val) => `${val} g`,
        },
        {
          name: 'imageUrl',
          label: 'Imagem',
          align: 'left',
          required: true,
          field: 'imageUrl',
        },
        { name: 'actions', label: 'Ações', align: 'right' },
      ],
    };
  },
  watch: {
    nodes(newValue) {
      if (newValue[this.$route.params.nodeId]) {
        this.node = { ...newValue[this.$route.params.nodeId] };
      } else {
        this.$router.push({ name: 'Home' });

        this.$q.notify({
          message: 'Nó não encontrado',
          type: 'negative',
          position: 'top-right',
        });
      }
    },
  },
  methods: {
    ...mapActions({
      setNodes: 'setNodes',
      addItem: 'addItem',
      editItem: 'editItem',
      removeItem: 'removeItem',
    }),
    saveMapData() {
      return new Promise((resolve) => {
        const { nodes } = loadMapData(false);

        this.setNodes({ ...nodes });

        resolve();
      });
    },
    openModal(item = null) {
      this.$refs.formModal.open(item);
    },
    deleteItem(itemName) {
      this.$q
        .dialog({
          title: 'Confirmação',
          message: 'Você tem certeza que deseja apagar este item?',
          cancel: {
            flat: true,
            color: 'negative',
            label: 'Cancelar',
          },
          persistent: true,
        })
        .onOk(() => {
          this.removeItem({ nodeId: this.node.id, itemName });
        });
    },
  },
};
</script>
