<template>
  <div>
    <Header />
    <div class="content container">
      <div class="title">
        <h2>Transit</h2>
      </div>
      <p>Quick navigation</p>
      <Navcard
        title="Connections"
        text="Look up connections between 2 Stations"
        link="/connections"
      />
      <Navcard
        title="Stationboard"
        text="Look up all upcoming connections on a specific station"
        link="/stationboard"
      />
      <br>
      <div class="title">
        <h2>Journeys</h2>
      </div>
      <p>Saved Trips</p>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import Navcard from "../components/Navcard";

export default {
  name: "Home",

  components: {
    Header,
    Navcard,
  },
  computed: {
    state() {
      return this.$store.state;
    },
  },
  methods: {},
};
</script>

<style>
.content {
  padding-left: 20px;
  padding-right: 20px;
}
.container{
    margin-top: 4rem;
}
</style>