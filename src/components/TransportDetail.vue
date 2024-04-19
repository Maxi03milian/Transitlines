<template>
  <div>
    <v-timeline align-top dense>
      <v-timeline-item small color="green"><b>{{ transport.stop.station.name }}</b><br />Platform: {{transport.stop.platform}}<br />{{ getProperTime() }}</v-timeline-item>
      <v-timeline-item small color="grey" v-for="stop in filteredArray" :key="stop.station.id"> <b>{{ stop.station.name }}</b></v-timeline-item>
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

.v-timeline::before {
    top: 55px;
    height: calc(100% - 110px)
}
</style>
