<template>
  <div>
    <Header />
    <div class="about container">
      <h2>Settings</h2>
      <br />
      Reset Search Data
      <div class="text-caption" v-text="'This will reset the previously searched locations'"></div>
      <v-btn color="red" @click="resetData">Reset Data</v-btn>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";

export default {
  name: "Settings",
  components: {
    Header,
  },
  methods: {
    resetData() {
      localStorage.removeItem("prevLocations");
    },
  }
};
</script>


<style scoped>
</style>
