<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="connection in connections.connections"
        :key="connection.id"
        class="connectionCard"
      >
        <v-expansion-panel-header>
          <div class="connectionHeaderContent">
            <div class="nextConnection">
              <b>
                {{ connection.products[0] }} Richtung
                <span v-if="connection.sections[0].journey">{{ connection.sections[0].journey.to }}</span>
                <span v-else>{{ connection.sections[1].journey.to }}</span>
              </b>
            </div>
            <div class="connectionTimeline">
              <span class="alignCenter">{{
                getProperTime(connection.from.departure)
              }}</span>
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
              <span class="alignCenter alignRight">{{
                getProperTime(connection.to.arrival)
              }}</span>
            </div>
            <div class="connectionLength">
              <span>Platform {{ connection.from.platform }}</span>
              <span>{{ getProperLength(connection.duration) }}</span>
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="section in connection.sections" :key="section">
            <v-timeline align-top dense>
              <v-timeline-item small :color="section.departure.delay ? 'orange' : 'green'">
                <b>{{ section.departure.station.name }}</b> 
                <br />
                <div v-if="section.journey" class="journeyDetails">
                  <span
                    >{{ section.journey.category }}
                    {{ section.journey.number }} Richtung
                    {{ section.journey.to }}</span
                  >
                  <span
                    >Platform: {{ section.journey.passList[0].platform }}</span
                  >
                  <span>{{getProperTime(section.journey.passList[0].departure)}} <span class="delayNum" v-if="section.departure.delay != 0">+ {{section.departure.delay}}</span></span>
                </div>
                <div v-if="section.walk">
                  <span v-if="section.walk.duration">Walk: {{ section.walk.duration }}</span>
                </div>
              </v-timeline-item>
              <v-timeline-item small color="grey">
                <b>{{ section.arrival.station.name }}</b>
              </v-timeline-item>
            </v-timeline>
            <hr>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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
  },
};
</script>

<style>
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
    height: calc(100% - 110px)
}

.delayNum {
  color: red;
}
</style>