<template>
  <div>
    <Header />
    <div class="input">
      <v-autocomplete
        id="input1"
        @input.native="fromOptions"
        :items="state.fromStations.stations"
        item-text="name"
        item-value="name"
        dense
        label="From"
      ></v-autocomplete><br>
      <v-autocomplete
        id="input2"
        @input.native="toOptions"
        :items="state.toStations.stations"
        item-text="name"
        item-value="name"
        dense
        label="To"
      ></v-autocomplete>
      <v-btn class="myButton" elevation="2" @click="search">Go!</v-btn>
    </div>
    <div class="content" v-if="state.connections != null">
      <p>hehee we got some connections</p>
      {{ state.connections }}
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
    search() {
      const val1 = document.querySelector('#input1').value;
      const val2 = document.querySelector('#input2').value;
      const params = "from=" + val1 + "&to=" + val2;

      fetch("http://transport.opendata.ch/v1/connections?" + params)
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit("updateConnections", data);
        });
    },
    fromOptions(e) {
      let params = "query=" + e.target.value;
      fetch("http://transport.opendata.ch/v1/locations?" + params)
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit("updateFromStations", data);
        });
    },
    toOptions(e) {
      let params = "query=" + e.target.value;
      fetch("http://transport.opendata.ch/v1/locations?" + params)
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit("updateToStations", data);
        });
    },
  },
};
</script>

<style>
</style>
