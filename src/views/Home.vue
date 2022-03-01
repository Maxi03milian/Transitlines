<template>
  <div>
    <Header />
    <div class="input">
      <v-text-field
        v-model="state.searchInput"
        label="Search"
        placeholder="Enter Location"
        prepend-icon="mdi-map-marker"
        clearable
      ></v-text-field>
      <v-btn class="myButton" elevation="2" @click="search(state.searchInput)">Go!</v-btn>
    </div>
    <div class="content" v-if="state.stations != null">
      <SearchResults :stations="state.stations.stations"/>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import SearchResults from "../components/SearchResults";

export default {
  name: "Home",

  components: {
    Header,
    SearchResults,
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
        .then((data) => this.$store.commit("updateStations", data));
    },
  },
};
</script>

<style>
.input {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
}

.inputField {
  width: 10px !important;
}

.myButton{
  margin-left: 10px;
  margin-bottom: 10px;
}

.content{
  padding-left: 20px;
  padding-right: 20px;
}

</style>
