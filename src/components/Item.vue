<template>
  <div class="item">
    <div v-if="!!item">
      <q-img style="width: 32px; height: 32px" :src="item.imageUrl">
        <q-tooltip content-class="text-body2">{{ item.name }}</q-tooltip>
      </q-img>

      <q-badge :label="`${item.value} $`" color="accent" class="value-badge" />

      <q-badge :label="`${item.weight} g`" color="secondary" class="weight-badge" />
    </div>
  </div>
</template>

<style>
.item {
  width: 96px;
  height: 96px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  border: 1px solid #000000;
  background-color: rgba(17, 17, 17, 0.85);
}

.quantity-input {
  position: absolute;
  left: 6px;
  top: 6px;
  padding: 0;
  margin: 0;
  width: 30px;
  height: 16px;
}

.value-badge {
  position: absolute;
  right: 6px;
  top: 6px;
}

.weight-badge {
  position: absolute;
  right: 6px;
  bottom: 6px;
}
</style>

<script>
export default {
  name: 'ItemPreview',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
