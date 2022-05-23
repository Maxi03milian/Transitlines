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
              <FlexibleIcon :station="station" />
            </div>
            <div class="itemText">
              {{ station.name }}
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="stationInfos">
            <span v-if="station.icon == 'train'">Train station</span>
            <span v-if="station.icon == 'bus'">Bus station</span>
            <span v-if="station.icon == 'tram'">Tram station</span>
            <span v-if="station.icon == null">Unkown station type</span>
          </div>
          Upcoming Connections:
          <div class="loadingSpinner" v-if="getStationBoard == null">
            <v-progress-circular
              indeterminate
              color="grey"
            ></v-progress-circular>
          </div>
          <div v-if="getStationBoard != null" class="stationStationboard">
            <v-expansion-panels>
              <v-expansion-panel
                v-for="connection in getStationBoard.stationboard"
                :key="connection.name"
              >
                <v-expansion-panel-header class="trainItem">
                  {{ connection.category }} {{ connection.number }} -->

                  {{ connection.to }}
                  <span class="trainTime">{{ connection.stop.departure.substr(11, 5) }}</span>
            
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <TransportDetail :transport="connection" />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <!--             <ul>
              <li
                v-for="connection in getStationBoard.stationboard"
                :key="connection.name"
              >
                {{ connection.category }} {{ connection.number }}
              </li>
            </ul> -->
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import FlexibleIcon from "../components/FlexibleIcon";
import TransportDetail from "../components/TransportDetail";

export default {
  name: "StationboardResults",
  data() {
    return {
      stationBoard: null,
    };
  },
  props: {
    stations: Array,
  },
  components: {
    FlexibleIcon,
    TransportDetail,
  },
  computed: {
    getStationBoard() {
      return this.stationBoard;
    },
  },
  methods: {
    open(text, el) {
      this.stationBoard = null;
      if (el.target.classList.contains("v-expansion-panel-header--active"))
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

.loadingSpinner {
  display: flex;
  justify-content: center;
}
.v-progress-circular {
  text-align: center;
}
.trainTime{
  text-align: right;
}

</style>
