import { createStore } from 'vuex';
import { Notify } from 'quasar';

// import app from './app';

// import example from './module-example'

const saveNodesToLocalStorage = (nodes) => {
  localStorage.setItem('nodes', JSON.stringify(nodes));
};

const getLocalStorageNodes = () => {
  const strNodes = localStorage.getItem('nodes');

  if (strNodes) {
    try {
      const nodes = JSON.parse(strNodes);

      if (nodes instanceof Array) return nodes;
    } catch {
      return {};
    }
  }

  return {};
};

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const Store = createStore({
  state: {
    isBfs: false,
    fastTravel: false,
    showAllEdges: false,
    sleepTime: 50,
    disableFields: false,
    weightSum: 0,
    nodes: getLocalStorageNodes(),
  },
  getters: {
    nodes(state) {
      return state.nodes;
    },
    isBfs(state) {
      return state.isBfs;
    },
    fastTravel(state) {
      return state.fastTravel;
    },
    showAllEdges(state) {
      return state.showAllEdges;
    },
    sleepTime(state) {
      return state.sleepTime;
    },
    disableFields(state) {
      return state.disableFields;
    },
    weightSum(state) {
      return state.weightSum;
    },
  },
  mutations: {
    setNodes(state, nodes) {
      const newNodes = { ...nodes };

      saveNodesToLocalStorage(newNodes);

      state.nodes = newNodes;
    },
    setIsBfs(state, value) {
      state.isBfs = value;
    },
    setFastTravel(state, value) {
      state.fastTravel = value;
    },
    setShowAllEdges(state, value) {
      state.showAllEdges = value;
    },
    setSleepTime(state, value) {
      state.sleepTime = value;
    },
    setDisableFields(state, value) {
      state.disableFields = value;
    },
    setWeightSum(state, value) {
      state.weightSum = value;
    },
  },
  actions: {
    setNodes({ commit }, value) {
      commit('setNodes', value);
    },
    setIsBfs({ commit }, value) {
      commit('setIsBfs', value);
    },
    setFastTravel({ commit }, value) {
      commit('setFastTravel', value);
    },
    setShowAllEdges({ commit }, value) {
      commit('setShowAllEdges', value);
    },
    setSleepTime({ commit }, value) {
      commit('setSleepTime', value);
    },
    setDisableFields({ commit }, value) {
      commit('setDisableFields', value);
    },
    setWeightSum({ commit }, value) {
      commit('setWeightSum', value);
    },
    addItem({ dispatch, rootState }, { item, nodeId }) {
      try {
        const newNodes = { ...rootState.nodes };

        if (newNodes[nodeId]) {
          newNodes[nodeId] = {
            ...newNodes[nodeId],
            items: [
              ...(newNodes[nodeId].items || []),
              item,
            ],
          };

          dispatch('setNodes', newNodes);

          Notify.create({
            message: 'Item adicionado com sucesso!',
            type: 'positive',
            position: 'top-right',
          });
        } else {
          throw Error('Nó não encontrado');
        }
      } catch (error) {
        Notify.create({
          message: error.message || 'Falha ao cadastrar o item',
          type: 'negative',
          position: 'top-right',
        });
      }
    },
    removeItem({ dispatch, rootState }, { itemName, nodeId }) {
      try {
        const newNodes = { ...rootState.nodes };

        if (newNodes[nodeId]) {
          const newItems = [...newNodes[nodeId].items];

          const itemIdx = newItems.findIndex((item) => item.name === itemName);

          newItems.splice(itemIdx, 1);

          newNodes[nodeId] = {
            ...newNodes[nodeId],
            items: newItems,
          };

          dispatch('setNodes', newNodes);
        }

        Notify.create({
          message: 'Item removido com sucesso!',
          type: 'positive',
          position: 'top-right',
        });
      } catch (error) {
        console.error(error);

        Notify.create({
          message: 'Falha ao remover o item',
          type: 'negative',
          position: 'top-right',
        });
      }
    },
    editItem({ dispatch, rootState }, { nodeId, itemData }) {
      try {
        const newNodes = { ...rootState.nodes };

        if (newNodes[nodeId]) {
          const newItems = [...newNodes[nodeId].items];

          const itemIdx = newItems.findIndex((item) => item.name === itemData.name);

          newItems[itemIdx] = {
            ...newItems[itemIdx],
            ...itemData,
          };

          newNodes[nodeId] = {
            ...newNodes[nodeId],
            items: newItems,
          };

          dispatch('setNodes', newNodes);
        }

        Notify.create({
          message: 'Item editado com sucesso!',
          type: 'positive',
          position: 'top-right',
        });
      } catch {
        Notify.create({
          message: 'Falha ao editar o item',
          type: 'negative',
          position: 'top-right',
        });
      }
    },
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: process.env.DEBUGGING,
});

export default Store;
