<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <div class="q-mb-lg">
        <div class="text-subtitle2 q-mb-sm">Configuração grafo</div>

        <q-checkbox v-model="fastTravel" label="Fast Travel" :disable="disableFields">
          <q-tooltip style="font-size: 12px">
            Cria arestas entre todos os signposts
          </q-tooltip>
        </q-checkbox>
      </div>
    </div>
  </div>
</template>

<style>
.my-custom-toggle {
  border: 1px solid #027be3
}
</style>

<script>
/* eslint-disable no-unused-vars */
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
  name: 'FormData',
  data() {
    return {
      fastTravel: false,
    };
  },
  watch: {
    fastTravel(newValue, _) {
      this.setFastTravel(newValue);
    },
  },
  computed: mapGetters({
    disableFields: 'disableFields',
  }),
  methods: {
    ...mapActions({
      setFastTravel: 'setFastTravel',
    }),
  },
});
</script>
