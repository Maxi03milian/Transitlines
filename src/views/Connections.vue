<template>
  <div>
    <Header />
    <div class="input">
      <v-autocomplete
        @input.native="fromOptions"
        :items="state.fromStations.stations"
        item-text="name"
        item-value="name"
        dense
        label="From"
      ></v-autocomplete><br>
      <v-autocomplete
        @input.native="toOptions"
        :items="state.toStations.stations"
        item-text="name"
        item-value="name"
        dense
        label="To"
      ></v-autocomplete>
      <v-btn class="myButton" elevation="2">Go!</v-btn>
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
    toOptions(e) {
      let params = "query=" + e.target.value;
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
