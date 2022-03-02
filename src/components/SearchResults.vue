<template>
  <div>
    <v-expansion-panels accordion>
      <v-expansion-panel
        v-for="station in stations"
        :key="station.id"
        class="stationItem"
        @click="open(station.name, $event)"
      >
        <v-expansion-panel-header>
          <div class="headerContent">
            <div class="icons">
              <font-awesome-icon
                v-if="station.icon == 'train'"
                icon="fa-solid fa-train-subway"
                size="2x"
                class="customIcons"
              />
              <font-awesome-icon
                v-if="station.icon == 'bus'"
                icon="fa-solid fa-bus"
                size="2x"
                class="customIcons"
              />
              <font-awesome-icon
                v-if="station.icon == 'tram'"
                icon="fa-solid fa-train-tram"
                size="2x"
                class="customIcons"
              />
              <font-awesome-icon
                v-if="station.icon == null"
                icon="fa-solid fa-circle-question"
                size="2x"
                class="customIcons"
              />
            </div>
            <div class="itemText">
              {{ station.name }}
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="stationInfos">
            <span v-if="station.icon == 'train'">Type: Train station</span>
            <span v-if="station.icon == 'bus'">Type: Bus station</span>
            <span v-if="station.icon == 'tram'">Type: Tram station</span>
            <span v-if="station.icon == null">Type: Unkown</span>
          </div>
          Upcoming Connections:
          <div v-if="getStationBoard != null" class="stationStationboard">
            <ul>
              <li
                v-for="connection in getStationBoard.stationboard"
                :key="connection.name"
              >
                {{ connection.category }}{{ connection.number }}
              </li>
            </ul>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>

export default {
  name: "SearchResults",
  data() {
    return {
      stationBoard: null,
    };
  },
  props: {
    stations: Array,
  },
  components: {},
  computed: {
    getStationBoard() {
      return this.stationBoard;
    },
  },
  methods: {
    open(text, el) {
      if (
        el.target.classList.contains("v-expansion-panel-header--active")
      )
        return;
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time = today.getHours() + ":" + today.getMinutes();
      var dateTime = date + " " + time;

      let params = "station=" + text + " &datetime" + dateTime;
      fetch("http://transport.opendata.ch/v1/stationboard?" + params)
        .then((res) => res.json())
        .then((data) => {
          this.stationBoard = data;
          console.log(data);
        });
    },
  },
};
</script>

<style>
.itemText {
  margin: 5px;
  display: flex;
  align-items: center;
}
.headerContent {
  margin: 5px;
  display: grid;
  grid-template-columns: 15% 85%;
}

.stationInfos {
}

.stationStationboard {
}

</style>
