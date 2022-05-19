<template>
  <div>
    <Header />
    <div class="input">
      <v-autocomplete
        @input.native="fromOptions"
        :items="state.fromStations.stations"
        dense
        label="From"
      ></v-autocomplete>
      <v-autocomplete
        v-model="state.toSearchInput"
        :items="state.toStations.stations"
        dense
        label="To"
      ></v-autocomplete>
      <v-btn class="myButton" elevation="2" @click="fromOptions(state.fromSearchInput)"
        >Go!</v-btn
      >
      {{state.fromSearchInput}}
      {{state.fromStations}}
    </div>

  </div>
</template>

<script>
import Header from "../components/Header";

export default {
  name: "Stationboard",
  data() {
    return {};
  },

  components: {
    Header,
  },
  computed: {
    state() {
      return this.$store.state;
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
    fromOptions(e) {
      let params = "query=" + e.target.value;
      fetch("http://transport.opendata.ch/v1/locations?" + params)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.$store.commit("updateFromStations", data);
        });
    },
    toOptions(text) {
      let params = "query=" + text;
      fetch("http://transport.opendata.ch/v1/locations?" + params)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.$store.commit("updateToStations", data);
        });
    },
  },
};
</script>

<style>
</style>
