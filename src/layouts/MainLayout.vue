<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-toolbar style="color: #ffffff; background-color: #027be3;">

        <q-toolbar-title>
          Witcher 3
        </q-toolbar-title>
      </q-toolbar>

      <FormData />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import FormData from 'components/FormData.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    FormData,
  },
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
