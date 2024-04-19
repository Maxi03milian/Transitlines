<template>
  <div>
    <font-awesome-icon
      v-if="station.icon == 'train'"
      icon="fa-solid fa-train-subway"
      size="2x"
      class="customIcons"
    />
    <font-awesome-icon
      v-if="station.icon == 'bus'"
      icon="fa-solid fa-bus"
      size="2x"
      class="customIcons"
    />
    <font-awesome-icon
      v-if="station.icon == 'tram'"
      icon="fa-solid fa-train-tram"
      size="2x"
      class="customIcons"
    />
    <font-awesome-icon
      v-if="station.icon == null"
      icon="fa-solid fa-circle-question"
      size="2x"
      class="customIcons"
    />
  </div>
</template>

<script>
export default {
  name: "FlexibleIcon",
  props: {
      station: Object,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
