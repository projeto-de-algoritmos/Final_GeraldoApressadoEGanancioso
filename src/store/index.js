import { createStore } from 'vuex';
import { Notify } from 'quasar';

// import app from './app';

// import example from './module-example'

const saveNodesToLocalStorage = (nodes) => {
  localStorage.setItem('nodes', JSON.stringify(nodes));
};

const getLocalStorageNodes = () => {
  const strNodes = localStorage.getItem('nodes') || '{}';

  if (strNodes) {
    try {
      return JSON.parse(strNodes);
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
    fastTravel: false,
    disableFields: false,
    knapsackCapacity: 50,
    nodes: getLocalStorageNodes(),
  },
  getters: {
    nodes(state) {
      return state.nodes;
    },
    fastTravel(state) {
      return state.fastTravel;
    },
    disableFields(state) {
      return state.disableFields;
    },
    knapsackCapacity(state) {
      return state.knapsackCapacity;
    },
  },
  mutations: {
    setNodes(state, nodes) {
      const newNodes = { ...nodes };

      saveNodesToLocalStorage(newNodes);

      state.nodes = newNodes;
    },
    setFastTravel(state, value) {
      state.fastTravel = value;
    },
    setDisableFields(state, value) {
      state.disableFields = value;
    },
    setKnapsackCapacity(state, value) {
      state.knapsackCapacity = value;
    },
  },
  actions: {
    setNodes({ commit }, value) {
      commit('setNodes', value);
    },
    setFastTravel({ commit }, value) {
      commit('setFastTravel', value);
    },
    setDisableFields({ commit }, value) {
      commit('setDisableFields', value);
    },
    setKnapsackCapacity({ commit }, value) {
      commit('setKnapsackCapacity', value);
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
        console.error(error);

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
      } catch (error) {
        console.error(error);

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
