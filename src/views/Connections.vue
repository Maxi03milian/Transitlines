<template>
  <div>
    <Header />
    <div class="input">
      <v-autocomplete
        class="inputItem"
        id="input1"
        @input.native="fromOptions"
        :items="state.fromStations.stations"
        item-text="name"
        item-value="name"
        dense
        label="From"
      ></v-autocomplete>
      <v-autocomplete
        class="inputItem"
        id="input2"
        @input.native="toOptions"
        :items="state.toStations.stations"
        item-text="name"
        item-value="name"
        dense
        label="To"
      ></v-autocomplete>
      <div class="routeOptions">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="state.routeOptions.date"
              id="input3"
              label="Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="state.routeOptions.date"
            class="optionModal"
            min="1950-01-01"
          ></v-date-picker>
        </v-menu>
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="time"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="state.routeOptions.time"
              id="input4"
              label="Picker in menu"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="state.routeOptions.time"
            class="optionModal"
            full-width
            @click:minute="$refs.menu.save(time)"
          ></v-time-picker>
        </v-menu>
      </div>
      <v-btn class="inputItem button" dark :loading="loading" elevation="2" @click="search">Go!</v-btn>
    </div>
    <div class="content" v-if="state.connections != null && !this.loading">
      <ConnectionResults :connections="state.connections" />
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import ConnectionResults from "../components/ConnectionResults";

export default {
  name: "Stationboard",
  data() {
    return {
      loading: false,
      time: null,
      menu: false,
      menu2: false,
    };
  },

  components: {
    Header,
    ConnectionResults,
  },
  computed: {
    state() {
      return this.$store.state;
    },
  },
  methods: {
    search() {
      const val1 = document.querySelector("#input1").value;
      const val2 = document.querySelector("#input2").value;
      const val3 = document.querySelector("#input3").value;
      const val4 = document.querySelector("#input4").value;

      const params = "from=" + val1 + "&to=" + val2 + "&date=" + val3 + "&time=" + val4;
      this.loading = true;

      fetch("https://transport.opendata.ch/v1/connections?" + params)
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit("updateConnections", data);
          this.loading = false;
        });
    },
    fromOptions(e) {
      let params = "query=" + e.target.value;
      fetch("https://transport.opendata.ch/v1/locations?" + params)
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit("updateFromStations", data);
        });
    },
    toOptions(e) {
      let params = "query=" + e.target.value;
      fetch("https://transport.opendata.ch/v1/locations?" + params)
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit("updateToStations", data);
        });
    },
  },
};
</script>

<style>
.loadingSpinner {
  display: flex;
  justify-content: center;
}
.v-progress-circular {
  text-align: center;
}

.input {
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
}

.inputItem {
  width: 100%;
}

.routeOptions{
  display: flex;
  flex-direction: row;
}

.v-menu_content {
  position: fixed;
  top: 50%;
  left: 50%;
}
</style>
