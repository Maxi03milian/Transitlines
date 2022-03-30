<template>
  <div>
    <Header />
    <div class="input">
      <v-autocomplete
        v-model="state.searchInput"
        label="From"
        placeholder="Enter Location"
        prepend-icon="mdi-map-marker"
        clearable
      ></v-autocomplete>
      <v-text-field
        v-model="state.searchInput"
        label="To"
        placeholder="Enter Location"
        prepend-icon="mdi-map-marker"
        clearable
      ></v-text-field>
      <v-btn class="myButton" elevation="2" @click="search(state.searchInput)"
        >Go!</v-btn
      >
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";

export default {
  name: "Stationboard",

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
  },
};
</script>

<style>
</style>
