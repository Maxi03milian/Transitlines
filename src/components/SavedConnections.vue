<template>
  <div>
    <div v-for="(connection, index) in connections" :key="connection.id">
      <v-card class="connectionCard" elevation="5" outlined shaped tile>
        <div class="cardTitle">
          <div class="cardTitleText">
            <b>
              {{ connection.from.station.name }} --><br />
              {{ connection.to.station.name }}
            </b>
          </div>
          <div class="cardTitleIndicators">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-if="hasIssues(connection).hasIssue"
                  :color="hasIssues(connection).color"
                  v-bind="attrs"
                  v-on="on"
                  >mdi-alert-box
                </v-icon>
              </template>
              <span>{{ hasIssues(connection).text }}</span>
            </v-tooltip>
            <v-btn icon @click="removeConnection(index)">
              <v-icon>mdi-delete</v-icon></v-btn
            >
          </div>
        </div>
        <div class="cardTimeline">
          <span class="departure">{{
            getProperTime(connection.from.departure)
          }}</span>
          <span class="line">
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
          <span class="arrival">{{
            getProperTime(connection.to.arrival)
          }}</span>
        </div>
        <div class="cardInfo">
          <div class="transportIcons">
            <span
              v-for="section in getOnlyTransportSections(connection.sections)"
              :key="section.departure.station.name"
            >
              <div class="transportIcon">
                <v-icon small color="white" class="typeIcon">{{
                  getTransportIcon(section.journey.category)
                }}</v-icon>
                <span
                  >{{ section.journey.category
                  }}{{ section.journey.number }}</span
                >
              </div>
            </span>
          </div>
          Next up:
          <div>
            <b>{{ connection.products[0] }}</b> To
            <span v-if="connection.sections[0].journey">{{
              connection.sections[0].journey.to
            }}</span>
            <span v-else>{{ connection.sections[1].journey.to }}</span>
          </div>
          <span v-if="isRemainingTimeAhead(connection.from.departure)">
            departs in
            {{ getRemainingTime(connection.from.departure, false) }} from
            {{ connection.from.station.name }}
          </span>
          <span v-else>
            departed
            {{ getRemainingTime(connection.from.departure, true) }} ago from
            {{ connection.from.station.name }}
          </span>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SavedConnections',
  props: {
    connections: {
      type: Array,
      required: true,
    },
  },
  methods: {
    removeConnection(key) {
      const savedConnections = JSON.parse(
        localStorage.getItem('savedConnections').split(',')
      );
      savedConnections.splice(key, 1);
      if (savedConnections.length == 0) {
        localStorage.removeItem('savedConnections');
      } else {
        localStorage.setItem(
          'savedConnections',
          JSON.stringify(savedConnections)
        );
      }
      window.location.reload();
    },
    getProperTime(time) {
      const date = new Date(time);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      if (hours < 10) {
        hours = '0' + hours;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      return hours + ':' + minutes;
    },
    getRemainingTime(time, pasttime) {
      const now = new Date();
      const departure = new Date(time);
      const diff = departure - now;
      const minutes = Math.floor(diff / 1000 / 60);
      let hours = Math.floor(minutes / 60);
      let remainingMinutes = minutes % 60;
      if (pasttime) {
        hours = hours * -1 - 1;
        remainingMinutes = remainingMinutes * -1;
      }

      if (hours === 1 && minutes === 1) {
        return `${hours} hour and ${remainingMinutes} minute`;
      } else if (hours === 1) {
        return `${hours} hour and ${remainingMinutes} minutes`;
      } else if (minutes === 1) {
        return `${hours} hours and ${remainingMinutes} minute`;
      } else if (hours === 0) {
        return `${remainingMinutes} minutes`;
      } else if (minutes === 0) {
        return `${hours} hours`;
      } else {
        return `${hours} hours and ${remainingMinutes} minutes`;
      }
    },
    isRemainingTimeAhead(time) {
      const now = new Date();
      const departure = new Date(time);
      const diff = departure - now;
      const minutes = Math.floor(diff / 1000 / 60);
      return minutes > 0;
    },
    getOnlyTransportSections(sections) {
      return sections.filter(function (section) {
        return section.journey !== null;
      });
    },
    getTransportIcon(category) {
      switch (category) {
        case 'IC':
        case 'IR':
          return 'mdi-train';
        case 'S':
          return 'mdi-subway-variant';
        case 'B':
          return 'mdi-bus';
        case 'T':
          return 'mdi-tram';
        default:
          return 'mdi-help-circle';
      }
    },
    hasIssues(connection) {
      let lineHasIssue = false;
      let biggestDelay = 0;
      connection.sections.forEach((section) => {
        if (section.arrival.delay || section.departure.delay) {
          if (section.arrival.delay > biggestDelay) {
            biggestDelay = section.arrival.delay;
          }
          lineHasIssue = true;
        }
      });
      if (!lineHasIssue) {
        return {
          hasIssue: false,
          color: 'green',
          text: 'No issues',
        };
      }
      if (biggestDelay > 3) {
        return {
          hasIssue: true,
          color: 'red',
          text: 'This route contains major delays',
        };
      } else {
        return {
          hasIssue: true,
          color: 'orange',
          text: 'This route contains minor delays',
        };
      }
    },
  },
};
</script>

<style scoped>
.connectionCard {
  height: auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.cardTitle {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.cardTitleIndicators {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: 36px;
}

.cardTimeline {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.cardTimeline .line {
  display: flex;
  align-items: center;
  width: 100%;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.timelineDots {
  position: absolute;
  width: calc(100% - 8rem);
  display: flex;
  justify-content: space-around;
}

.transportIcons {
  display: flex;
  flex-direction: row;
  color: white;
  gap: 0.25rem;
  margin-left: -0.25rem;
}

.transportIcon {
  background-color: #262626;
  border-radius: 5px;
  padding: 0px 2px 0px 2px;
}

.typeIcon {
  margin-top: -3px;
}
</style>
