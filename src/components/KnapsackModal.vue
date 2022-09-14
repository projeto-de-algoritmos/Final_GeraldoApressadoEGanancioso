<template>
  <q-dialog v-model="opened" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h4">Knapsack</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="flex items-center q-my-md">
          <div class="text-h5" style="font-size: 20px">
            <strong>Valor total:</strong> {{ `${getTotalValue()} orens` }}
          </div>

          <div class="text-h5 q-ml-md" style="font-size: 20px">
            <strong>Peso total:</strong> {{ maskWeight(getTotalWeight()) }}
          </div>
        </div>

        <div class="flex wrap">
          <Item :item="item" :key="item.name" v-for="item in items" />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Fechar" color="negative" @click="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style></style>

<script>
import Item from './Item';

export default {
  name: 'KnapsackModal',
  components: {
    Item,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      opened: false,
    };
  },
  methods: {
    open() {
      this.opened = true;
    },
    close() {
      this.opened = false;
    },
    getTotalWeight() {
      return this.items.reduce((acc, item) => acc + item.weight, 0);
    },
    getTotalValue() {
      return this.items.reduce((acc, item) => acc + item.value, 0);
    },
    maskWeight(weight) {
      return weight > 1000 ? `${weight / 1000}kg` : `${weight}g`;
    },
  },
};
</script>
