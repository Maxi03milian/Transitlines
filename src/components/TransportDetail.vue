<template>
  <div>
    <v-timeline align-top dense>
      <v-timeline-item small color="green">{{ transport.stop.station.name }}<br />{{ getProperTime() }}</v-timeline-item>
      <v-timeline-item small color="grey" v-for="stop in filteredArray" :key="stop.station.id"> {{ stop.station.name }} </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
export default {
  name: "TransportDetail",
  props: {
    transport: Object,
  },
  computed:{
    filteredArray() {
      return this.$props.transport.passList.filter(item => !!item.station.name);
    },
  },
  methods: {
    getProperTime() {
      return this.$props.transport.stop.departure.substr(11, 5);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
