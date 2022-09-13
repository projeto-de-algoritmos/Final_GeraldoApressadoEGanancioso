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

        <q-checkbox v-model="showAllEdges" label="Mostrar Arestas" :disable="disableFields">
          <q-tooltip style="font-size: 12px">
            Desenha todas as arestas disponíveis
          </q-tooltip>
        </q-checkbox>
      </div>

      <div class="q-my-lg">
        <div class="text-subtitle2 q-mb-sm">Algoritmo de busca</div>

        <q-btn-toggle
          v-model="isBfs"
          class="my-custom-toggle"
          no-caps
          rounded
          unelevated
          color="white"
          toggle-color="primary"
          text-color="primary"
          spread
          :disable="disableFields"
          :options="[
            {label: 'BFS', value: true},
            {label: 'Dijkstra', value: false},
          ]"
        />
      </div>

      <div class="q-mt-lg">
        <div class="text-subtitle2 q-mb-sm">Árvore Geradora Mínima</div>

        <div class="q-px-sm">
          <q-input
            v-model="sleepTime"
            class="col-6"
            label="Delay (ms)"
            :disable="disableFields"
          >
            <q-tooltip style="font-size: 12px">
              Intervalo entre o desenho de cada aresta
            </q-tooltip>
          </q-input>

          <div v-if="weightSum">
            <q-tooltip style="font-size: 12px">
              Soma dos pesos das arestas
            </q-tooltip>

            <q-input
              v-model="weightSum"
              class="col-6 q-mt-sm"
              label="Soma custos"
              style="pointer-events: none;"
            />
          </div>
        </div>
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
      isBfs: false,
      fastTravel: false,
      showAllEdges: false,
      sleepTime: 50,
    };
  },
  watch: {
    isBfs(newValue, _) {
      this.setIsBfs(newValue);
    },
    fastTravel(newValue, _) {
      this.setFastTravel(newValue);
    },
    showAllEdges(newValue, _) {
      this.setShowAllEdges(newValue);
    },
    sleepTime(newValue, _) {
      this.setSleepTime(newValue);
    },
    weightSum(newValue, _) {
      this.setWeightSum(newValue);
    },
  },
  computed: mapGetters({
    disableFields: 'disableFields',
    weightSum: 'weightSum',
  }),
  methods: {
    ...mapActions({
      setIsBfs: 'setIsBfs',
      setFastTravel: 'setFastTravel',
      setShowAllEdges: 'setShowAllEdges',
      setSleepTime: 'setSleepTime',
      setWeightSum: 'setWeightSum',
    }),
  },
});
</script>
