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
               {{connection.products[0]}} Richtung {{connection.sections[0].journey.to}}
            </div>
            <div class="connectionTimeline">
              {{getProperTime(connection.from.departure)}} -------------------------------------------------{{getProperTime(connection.to.arrival)}}
            </div>
            <div class="connectionLength">
              Platform <b>{{connection.from.platform}}</b> ---------------------------------{{getProperLength(connection.duration)}}

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
    FlexibleIcon
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
      if(hours != "00"){
        output += hours + " h and"
      }
      output += minutes + " min"
      return output
    },
  },
};
</script>

<style>

.headerContent{
  display: flex;
  flex-direction: column;
}
</style>