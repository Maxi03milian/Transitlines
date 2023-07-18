<template>
  <div>
    <div
      v-for="(connection, index) in processedConnections"
      :key="connection.id"
    >
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
          <div v-if="connection.nextSection">
            Next up:
            <div v-if="connection.nextSection.journey">
              <span>
                <b
                  >{{ connection.nextSection.journey.category
                  }}{{ connection.nextSection.journey.number }}</b
                >
                To {{ connection.nextSection.journey.to }}<br />
              </span>
              <span>
                departing
                {{
                  getRemainingTime(
                    connection.nextSection.departure.departure,
                    false
                  )
                }}
                from
                {{ connection.nextSection.journey.passList[0].station.name }}
              </span>
            </div>
            <div v-else>walk you bitch</div>
          </div>
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
  computed: {
    processedConnections() {
      return this.connections.map((connection) => {
        const nextSection = this.nextSection(connection.sections);
        return { ...connection, nextSection };
      });
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
      const minutes = Math.floor(diff / 1000 / 60) + 1;
      let hours = Math.floor(minutes / 60);
      let remainingMinutes = minutes % 60;
      if (pasttime) {
        hours = hours * -1 - 1;
        remainingMinutes = remainingMinutes * -1;
      }

      if (hours === 0 && minutes === 0) {
        return 'now';
      }

      let timeString = '';

      if (hours !== 0) {
        timeString += `${hours} hour${hours === 1 ? '' : 's'}`;
      }

      if (minutes !== 0) {
        timeString += ` ${minutes} minute${minutes === 1 ? '' : 's'}`;
      }

      return `in ${timeString}`;
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
    nextSection(sections) {
      let nextSection = null;
      let now = new Date();
      sections.forEach((section) => {
        if (!section.journey) return;
        let departure = new Date(section.departure.departure);
        if (section.departure.delay) {
          departure.setMinutes(
            departure.getMinutes() + section.departure.delay
          );
        }
        if (departure > now) {
          nextSection ? null : (nextSection = section);
        }
      });
      return nextSection;
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
