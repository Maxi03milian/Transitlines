<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="connection in connections.connections"
        :key="connection.id"
        class="connectionCard"
      >
        <v-expansion-panel-header>
          <div class="headerContent">
            <div class="nextConnection">
              {{ connection.products[0] }} Richtung
              {{ connection.sections[0].journey.to }}
            </div>
            <div class="connectionTimeline">
              <span class="alignCenter">{{
                getProperTime(connection.from.departure)
              }}</span>
              <span class="alignCenter">
                <v-divider></v-divider>
                <div class="timelineDots">
                  <v-icon small color="blue-grey darken-2" v-for="index in connection.transfers" :key="index">
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
              <span>{{getProperLength(connection.duration)}}</span>
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
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
        var number  = hours.replace(/^0+/, ''); 
        output += number + "h and ";
      }
      if(minutes != "00"){
        var number  = minutes.replace(/^0+/, ''); 
        output += number + " min";
        return output;
      }else{
        let newoutput = output.replace(" and ", "");
        return newoutput;
      }
    },
  },
};
</script>

<style>
.headerContent {
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

.timelineDots{
  position: absolute;
  width: 204px;
  display: flex;
  justify-content: space-around;
}

.connectionLength{
  display: flex;
  justify-content: space-between;
}
</style>