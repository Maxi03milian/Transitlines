<template>
  <div>
    <Header />
    <div class="input container content">
      <v-text-field
        v-model="state.searchInput"
        color="#262626"
        label="Search"
        placeholder="Enter Location"
        prepend-icon="mdi-map-marker"
        clearable
      ></v-text-field>
      <v-btn class="myButton" elevation="2" @click="search(state.searchInput)"
        >Go!</v-btn
      >
    </div>
    <div class="content" v-if="state.stations != null">
      <StationboardResults :stations="state.stations.stations" />
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import StationboardResults from "../components/StationboardResults";

export default {
  name: "Home",

  components: {
    Header,
    StationboardResults,
  },
  computed: {
    state() {
      return this.$store.state;
    },
  },
  methods: {
    search(text) {
      let params = "query=" + text;
      fetch("https://transport.opendata.ch/v1/locations?" + params)
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit("updateStations", data);
        });
    },
  },
};
</script>

<style scoped>
.input {
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputField {
  width: 10px !important;
}

.myButton {
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>