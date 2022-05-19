<template>
  <div>
    <Header />
    <div class="input">
      <v-autocomplete
        v-model="input1"
        :items="fromStations.stations"
        dense
        label="From"
      ></v-autocomplete>
      <v-autocomplete
        v-model="this.input2"
        :items="this.toStations.stations"
        @change="toOptions(this.input2)"
        dense
        label="To"
      ></v-autocomplete>
      <v-btn class="myButton" elevation="2" @click="fromOptions(this.input1)"
        >Go!</v-btn
      >
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";

export default {
  name: "Stationboard",
  data() {
    return {
      input1: "",
      input2: "",
      fromStations: [],
      toStations: [],
    };
  },

  components: {
    Header,
  },
  computed: {
    state() {
      return this.$store.state;
    },
  },
  watch: {
    input1() {
     this.formOptions(this.input1)
    },
  },
  methods: {
    search(text) {
      let params = "query=" + text;
      fetch("http://transport.opendata.ch/v1/locations?" + params)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.$store.commit("updateStations", data);
        });
    },
    fromOptions(text) {
      let params = "query=" + text;
      fetch("http://transport.opendata.ch/v1/locations?" + params)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.fromStations = data;
        });
    },
    toOptions(text) {
      let params = "query=" + text;
      fetch("http://transport.opendata.ch/v1/locations?" + params)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.toStations = data;
        });
    },
  },
};
</script>

<style>
</style>
