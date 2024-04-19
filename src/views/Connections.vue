<template>
  <div>
    <Header />
    <div class="input container content">
      <div class="topInputs">
        <div class="textInputs">
          <v-autocomplete
            class="inputItem"
            color="#262626"
            id="input1"
            @input.native="fromOptions"
            :items="isSearching1 ? state.fromStations.stations : existingSearch"
            item-text="name"
            item-value="name"
            dense
            label="From"
          ></v-autocomplete>
          <v-autocomplete
            class="inputItem"
            color="#262626"
            id="input2"
            @input.native="toOptions"
            :items="isSearching2 ? state.toStations.stations : existingSearch"
            item-text="name"
            item-value="name"
            dense
            label="To"
          ></v-autocomplete>
        </div>
        <div class="switchButtonContainer">
          <button class="switchButton" @click="swapSearch">
            <font-awesome-icon
              icon="fa-solid fa-retweet"
              size="2x"
              class="customIcons"
            />
          </button>
        </div>
      </div>
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
              color="#262626"
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
            color="#262626"
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
              color="#262626"
              id="input4"
              label="Time"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="state.routeOptions.time"
            class="optionModal"
            color="#262626"
            full-width
            @click:minute="$refs.menu.save(time)"
          ></v-time-picker>
        </v-menu>
      </div>
      <div class="routeSettings">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Route Settings
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="routeSettings-top">
                <v-switch
                  class="sliderSwitch"
                  v-model="state.routeOptions.isArrivalTime"
                  label="Arrival Time"
                  color="#262626"
                  :value="state.routeOptions.isArrivalTime"
                  hide-details
                ></v-switch>
                <v-switch
                  class="sliderSwitch"
                  v-model="state.routeOptions.bike"
                  label="Transporting Bike"
                  color="#262626"
                  :value="state.routeOptions.bike"
                  hide-details
                ></v-switch>
              </div>
              <div class="routeSettings-bottom"></div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-btn
        class="inputItem button"
        dark
        :loading="loading"
        elevation="2"
        @click="search"
        >Go!</v-btn
      >
    </div>
    <div class="content" v-if="state.connections != null && !this.loading">
      <ConnectionResults
        :connections="state.connections"
        :currentSearch="getCurrentSearchParams()"
      />
    </div>
  </div>
</template>

<script>
import Header from '../components/Header';
import ConnectionResults from '../components/ConnectionResults';

export default {
  name: 'Stationboard',
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
    existingSearch() {
      return JSON.parse(localStorage.getItem('prevLocations')).reverse();
    },
    isSearching1() {
      if (
        (localStorage.getItem('prevLocations') != null &&
          !this.$store.state.fromStations.stations) ||
        (this.$store.state.fromStations.stations != undefined
          ? this.$store.state.fromStations.stations.length == 0
          : null)
      ) {
        return false;
      } else {
        return true;
      }
    },
    isSearching2() {
      if (
        (localStorage.getItem('prevLocations') != null &&
          !this.$store.state.toStations.stations) ||
        (this.$store.state.toStations.stations != undefined
          ? this.$store.state.toStations.stations.length == 0
          : null)
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    search() {
      let state = this.$store.state;
      const val1 = document.querySelector('#input1').value;
      const val2 = document.querySelector('#input2').value;
      const val3 = document.querySelector('#input3').value;
      const val4 = document.querySelector('#input4').value;

      const params =
        'from=' +
        val1 +
        '&to=' +
        val2 +
        '&date=' +
        val3 +
        '&time=' +
        val4 +
        '&isArrivalTime=' +
        +state.routeOptions.isArrivalTime +
        '&limit=' +
        5 +
        '&bike=' +
        +state.routeOptions.bike;
      this.loading = true;

      //localStorage.setItem("lastSearch", params);

      // Save searches for autocomplete
      if (val1 != '' && val2 != '') {
        let existingEntries;
        if (localStorage.getItem('prevLocations') != null) {
          existingEntries = JSON.parse(localStorage.getItem('prevLocations'));
        } else {
          existingEntries = [];
        }
        if (!existingEntries.includes(val1)) {
          if (existingEntries.length > 5) {
            existingEntries.splice(0, 1);
          }
          existingEntries.push(val1);
        } else {
          existingEntries.push(
            existingEntries.splice(existingEntries.indexOf(val1), 1)[0]
          );
        }
        if (!existingEntries.includes(val2)) {
          if (existingEntries.length > 5) {
            existingEntries.splice(0, 1);
          }
          existingEntries.push(val2);
        } else {
          existingEntries.push(
            existingEntries.splice(existingEntries.indexOf(val2), 1)[0]
          );
        }
        localStorage.setItem('prevLocations', JSON.stringify(existingEntries));
      }

      fetch('https://transport.opendata.ch/v1/connections?' + params)
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit('updateConnections', data);
          this.loading = false;
        });
    },
    fromOptions(e) {
      let params = 'query=' + e.target.value;
      fetch('https://transport.opendata.ch/v1/locations?' + params)
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit('updateFromStations', data);
        });
    },
    toOptions(e) {
      let params = 'query=' + e.target.value;
      fetch('https://transport.opendata.ch/v1/locations?' + params)
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit('updateToStations', data);
        });
    },
    swapSearch() {
      const val1 = document.querySelector('#input1').value;
      const val2 = document.querySelector('#input2').value;
      document.querySelector('#input1').value = val2;
      document.querySelector('#input2').value = val1;
    },
    getCurrentSearchParams() {
      let state = this.$store.state;
      const val1 = document.querySelector('#input1').value;
      const val2 = document.querySelector('#input2').value;
      const val3 = document.querySelector('#input3').value;
      const val4 = document.querySelector('#input4').value;

      const params =
        'from=' +
        val1 +
        '&to=' +
        val2 +
        '&date=' +
        val3 +
        '&time=' +
        val4 +
        '&isArrivalTime=' +
        +state.routeOptions.isArrivalTime +
        '&limit=' +
        5 +
        '&bike=' +
        +state.routeOptions.bike;

      return params;
    },
  },
};
</script>

<style scoped>
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
  margin-bottom: 2rem;
}

.inputItem {
  width: 100%;
}

.routeOptions {
  display: flex;
  flex-direction: row;
}

.routeSettings {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
}

.sliderSwitch {
  margin-top: 0px !important;
  padding-top: 0px !important;
}

.v-menu_content {
  position: fixed;
  top: 50%;
  left: 50%;
}

.routeSettings-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.topInputs {
  display: grid;
  grid-template-columns: 90% 10%;
}

.switchButtonContainer {
  padding-top: 1.5rem;
  padding-left: 0.3rem;
}

.switchButton {
  transform: rotate(90deg);
}
</style>
