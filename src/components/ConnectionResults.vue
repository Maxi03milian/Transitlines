<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(connection, index) in connections.connections"
        :key="connection.from.id"
        class="connectionCard"
      >
        <v-expansion-panel-header>
          <div class="connectionHeaderContent">
            <div class="nextConnection">
              <b>{{ connection.products[0] }}</b> Richtung
              <span v-if="connection.sections[0].journey">{{
                connection.sections[0].journey.to
              }}</span>
              <span v-else>{{ connection.sections[1].journey.to }}</span>
            </div>
            <div class="connectionTimeline">
              <span class="alignCenter"
                ><b>{{ getProperTime(connection.from.departure) }}</b></span
              >
              <span class="alignCenter">
                <v-divider></v-divider>
                <div class="timelineDots">
                  <v-icon
                    small
                    color="blue-grey darken-2"
                    v-for="index in connection.transfers"
                    :key="index"
                  >
                    mdi-call-split
                  </v-icon>
                </div>
              </span>
              <span class="alignCenter alignRight"
                ><b>{{ getProperTime(connection.to.arrival) }}</b></span
              >
            </div>
            <div class="connectionLength">
              <span>Platform {{ connection.from.platform }}</span>
              <span>{{ getProperLength(connection.duration) }}</span>
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="connectionInputs">
            <v-btn elevation="2" class="saveButton" @click="saveConnection(index)">Save to Journeys</v-btn>
          </div>
          <div
            v-for="section in connection.sections"
            :key="section.departure.station.name"
          >
            <v-timeline align-top dense>
              <div v-if="section.walk" class="walkingSection">
                <span v-if="section.walk.duration"
                  >Walk: {{ section.walk.duration / 60 }} min</span
                >
              </div>
              <div v-if="!section.walk">
                <v-timeline-item
                  small
                  :color="getDelayColor(section.departure.delay)"
                >
                  <b>{{ section.departure.station.name }}</b>
                  <br />
                  <div v-if="section.journey" class="journeyDetails">
                    <span
                      >{{ section.journey.category }}
                      {{ section.journey.number }} Richtung
                      {{ section.journey.to }}</span
                    >
                    <span
                      >Platform:
                      {{ section.journey.passList[0].platform }}</span
                    >
                    <span
                      >{{
                        getProperTime(section.journey.passList[0].departure)
                      }}
                      <span
                        class="delayNum"
                        v-if="section.departure.delay"
                        :class="section.departure.delay ? 'blinking' : ''"
                        >+ {{ section.departure.delay }}</span
                      ></span
                    >
                    <span>
                      <v-dialog width="400">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="grey"
                            dark
                            x-small
                            v-bind="attrs"
                            v-on="on"
                          >
                            Station Passlist
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-title class="text-h5 grey lighten-2">
                            <span>
                              {{ section.journey.category }}
                              {{ section.journey.number }} Richtung
                              {{ section.journey.to }}
                            </span>
                          </v-card-title>

                          <v-card-text>
                            <v-timeline align-top dense>
                              <v-timeline-item small color="green"
                                ><b>{{
                                  section.journey.passList[0].station.name
                                }}</b
                                ><br />Platform:
                                {{ section.journey.passList[0].platform
                                }}<br /><span
                                  v-if="section.journey.passList[0].departure"
                                  >{{
                                    getProperTime(
                                      section.journey.passList[0].departure
                                    )
                                  }} </span
                                ><span
                                  class="delayNum"
                                  v-if="section.journey.passList[0].delay"
                                  :class="
                                    section.journey.passList[0].delay
                                      ? 'blinking'
                                      : ''
                                  "
                                  >+
                                  {{ section.journey.passList[0].delay }}</span
                                ></v-timeline-item
                              >
                              <v-timeline-item
                                small
                                v-for="stop in section.journey.passList.slice(
                                  1
                                )"
                                :key="stop.station.id"
                                :color="
                                  stop.station.name ==
                                  section.arrival.station.name
                                    ? 'green'
                                    : 'grey'
                                "
                              >
                                <b>{{ stop.station.name }}</b
                                ><br /><span v-if="stop.arrival">{{
                                  getProperTime(stop.arrival)
                                }}</span>
                                <span
                                  class="delayNum blinking"
                                  v-if="stop.delay"
                                >
                                  + {{ stop.delay }}
                                </span>
                              </v-timeline-item>
                            </v-timeline>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </span>
                  </div>
                </v-timeline-item>
                <v-timeline-item
                  small
                  :color="getDelayColor(section.arrival.delay)"
                >
                  <b>{{ section.arrival.station.name }}</b>
                  <br />
                  <div class="journeyDetails">
                    <span>Platform: {{ section.arrival.platform }}</span>
                    <span v-if="section.arrival.arrival"
                      >{{ getProperTime(section.arrival.arrival) }}
                      <span
                        class="delayNum"
                        v-if="section.arrival.delay"
                        :class="section.arrival.delay ? 'blinking' : ''"
                      >
                        + {{ section.arrival.delay }}</span
                      ></span
                    >
                  </div>
                </v-timeline-item>
              </div>
            </v-timeline>
            <hr />
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <br /><br />
  </div>
</template>

<script>
import FlexibleIcon from "../components/FlexibleIcon";
export default {
  name: "ConnectionResults",
  components: {
    FlexibleIcon,
  },
  props: {
    connections: Object,
    currentSearch: String,
  },
  computed: {
    state() {
      return this.$store.state;
    },
  },
  methods: {
    getProperTime(time) {
      return time.substr(11, 5);
    },
    getProperLength(time) {
      let hours = time.substr(3, 2);
      let minutes = time.substr(6, 2);
      let output = "";
      if (hours != "00") {
        var number = hours.replace(/^0+/, "");
        output += number + "h and ";
      }
      if (minutes != "00") {
        var number = minutes.replace(/^0+/, "");
        output += number + " min";
        return output;
      } else {
        let newoutput = output.replace(" and ", "");
        return newoutput;
      }
    },
    getDelayColor(delay) {
      if (delay > 3) {
        return "red";
      } else if (delay > 0) {
        return "orange";
      } else {
        return "green";
      }
    },
    saveConnection(index) {
      //save the search params to local storage and select the choosen connection
      console.log(this.currentSearch);
    },
  },
};
</script>

<style scoped>
.connectionHeaderContent {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.alignCenter {
  display: flex;
  align-items: center;
}
.alignRight {
  display: flex;
  justify-content: flex-end;
}

.connectionTimeline {
  display: grid;
  grid-template-columns: 15% 70% 15%;
}

.timelineDots {
  position: absolute;
  width: 204px;
  display: flex;
  justify-content: space-around;
}

.connectionLength {
  display: flex;
  justify-content: space-between;
}

.journeyDetails {
  display: flex;
  flex-direction: column;
}

.v-timeline::before {
  top: 55px;
  height: calc(100% - 110px);
}

.delayNum {
  color: red;
}

.walkingSection {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 24px;
}

.blinking {
  animation: blinker 1s linear infinite !important;
}

.saveButton {
  width: 100%;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>