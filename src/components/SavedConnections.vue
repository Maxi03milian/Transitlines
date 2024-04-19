<template>
  <div>
    <div
      v-for="(connection, index) in processedConnections"
      :key="connection.id"
    >
      <v-card
        class="connectionCard"
        elevation="5"
        outlined
        shaped
        tile
        :loading="isTransitNow(connection) ? hasIssues(connection).color : null"
        @click.stop="openDialog(connection)"
      >
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
            <v-btn icon @click.stop="removeConnection(index)">
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
          <div v-if="connection.nextSection" class="nextSectionInfo">
            Up Next:
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
                    connection.nextSection.departure.delay,
                    false
                  )
                }}
                from
                {{ connection.nextSection.departure.station.name }}
              </span>
            </div>
            <div v-else>walk you bitch</div>
          </div>
        </div>
      </v-card>
    </div>
    <!--Details dialog-->
    <v-dialog
      v-if="this.viewingConnection"
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card
        :loading="
          isTransitNow(this.viewingConnection)
            ? hasIssues(this.viewingConnection).color
            : false
        "
        class="detailDialogHeader"
        id="connectionDetailDialog"
      >
        <v-toolbar dark :color="'#262626'">
          <v-btn icon dark @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="toolbarTitleContainer">
            <span class="toolbarTitleSmall"
              >{{ this.viewingConnection.from.station.name }} --></span
            >
            <span class="toolbarTitleBig">
              <b> {{ this.viewingConnection.to.station.name }} </b></span
            >
          </v-toolbar-title>
        </v-toolbar>
        <div class="sectionHeader">
          <v-list three-line subheader>
            <v-subheader>Overview</v-subheader>
            <div class="detailLineOverview">
              <div class="detailLineTimeline">
                <span class="departure">{{
                  getProperTime(this.viewingConnection.from.departure)
                }}</span>
                <span class="detailLine">
                  <div
                    class="sections"
                    v-for="section in this.viewingConnection.sections.filter(
                      (section) => section.journey
                    )"
                    :key="section.departure.station.name"
                    :class="{ pulsing: isCurrentSection(section) }"
                  >
                    <div>
                      <v-icon small color="black" class="typeIcon">{{
                        getTransportIcon(section.journey.category)
                      }}</v-icon>
                    </div>
                    <span class="sectionItem"></span>
                    <span
                      >{{ section.journey.category
                      }}{{ section.journey.number }}</span
                    >
                  </div>
                </span>
                <span class="arrival">{{
                  getProperTime(this.viewingConnection.to.arrival)
                }}</span>
              </div>
            </div>
            <v-list-item v-if="this.viewingConnection.currentSection">
              <v-list-item-content>
                <v-list-item-title>Current connection</v-list-item-title>
                <div class="nextSectionInfo">
                  <div v-if="this.viewingConnection.currentSection.journey">
                    <v-list-item-subtitle>
                      <b
                        >{{
                          this.viewingConnection.currentSection.journey
                            .category
                        }}{{
                          this.viewingConnection.currentSection.journey.number
                        }}</b
                      >
                      To {{ this.viewingConnection.currentSection.journey.to }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      arriving
                      {{
                        getRemainingTime(
                          this.viewingConnection.currentSection.arrival.arrival,
                          this.viewingConnection.currentSection.arrival.delay,
                          false
                        )
                      }}
                      at
                      {{
                        this.viewingConnection.currentSection.arrival.station
                          .name
                      }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle
                      v-if="
                        this.viewingConnection.currentSection.arrival.platform
                      "
                    >
                      Platform
                      {{
                        this.viewingConnection.currentSection.arrival.platform
                      }}
                    </v-list-item-subtitle>
                  </div>
                  <div v-else>walk you bitch</div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="this.viewingConnection.nextSection">
              <v-list-item-content>
                <v-list-item-title>Up Next</v-list-item-title>
                <div class="nextSectionInfo">
                  <div v-if="this.viewingConnection.nextSection.journey">
                    <v-list-item-subtitle>
                      <b
                        >{{ this.viewingConnection.nextSection.journey.category
                        }}{{
                          this.viewingConnection.nextSection.journey.number
                        }}</b
                      >
                      To {{ this.viewingConnection.nextSection.journey.to }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      departing
                      {{
                        getRemainingTime(
                          this.viewingConnection.nextSection.departure
                            .departure,
                          this.viewingConnection.nextSection.departure.delay,
                          false
                        )
                      }}
                      from
                      {{
                        this.viewingConnection.nextSection.departure.station
                          .name
                      }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle
                      v-if="
                        this.viewingConnection.nextSection.departure.platform
                      "
                    >
                      Platform
                      {{
                        this.viewingConnection.nextSection.departure.platform
                      }}
                    </v-list-item-subtitle>
                  </div>
                  <div v-else>walk you bitch</div>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <v-subheader>Connection Info</v-subheader>
        <div
          v-for="section in this.viewingConnection.sections.filter(
            (section) => section.journey
          )"
          :key="section.departure.station.name"
          class="sectionOverview"
        >
          <div class="sectionTitle">
            <div class="sectionTitleTransport">
              <div>
                <v-icon color="black">{{
                  getTransportIcon(section.journey.category)
                }}</v-icon>
              </div>
              <div class="sectionTitleText">
                <b
                  >{{ section.journey.category }}{{ section.journey.number }}</b
                >
                --> {{ section.journey.to }}
              </div>
            </div>
            <div
              v-if="isCurrentSection(section)"
              class="sectionBar blinking"
              :style="{ color: '#00b16a' }"
            >
              <b>In Transit</b>
            </div>
            <div
              v-else-if="isFutureSection(section)"
              class="sectionBar"
              :style="{ color: '#10a0e8' }"
            >
              <b>Scheduled</b>
            </div>
            <div v-else class="sectionBar" :style="{ color: '#919090' }">
              <b>Arrived</b>
            </div>
          </div>
          <v-timeline align-top dense>
            <v-timeline-item color="grey" small>
              <v-row class="pt-1">
                <v-col cols="3">
                  <strong>
                    <span
                      >{{ getProperTime(section.departure.departure) }}<br />
                      <span class="delayNum" v-if="section.departure.delay"
                        >+ {{ section.departure.delay }}</span
                      ></span
                    >
                  </strong>
                </v-col>
                <v-col>
                  <strong>{{ section.departure.station.name }}</strong>
                  <div v-if="section.departure.platform" class="text-caption">
                    Platform: {{ section.departure.platform.replace('!', '') }}
                    <div
                      v-if="section.departure.platform.includes('!')"
                      class="delayNum"
                    >
                      (Platform changed)
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-timeline-item>
            <v-timeline-item color="grey" small>
              <v-row class="pt-1">
                <v-col cols="3">
                  <strong>
                    <span
                      >{{ getProperTime(section.arrival.arrival) }}<br />
                      <span class="delayNum" v-if="section.arrival.delay"
                        >+ {{ section.arrival.delay }}</span
                      ></span
                    ></strong
                  >
                </v-col>
                <v-col>
                  <strong>{{ section.arrival.station.name }}</strong>
                  <div v-if="section.arrival.platform" class="text-caption">
                    Platform: {{ section.arrival.platform.replace('!', '') }}
                    <div
                      v-if="section.arrival.platform.includes('!')"
                      class="delayNum"
                    >
                      (Platform changed)
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
          <v-divider></v-divider>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'SavedConnections',
  data() {
    return {
      dialog: false,
      viewingConnection: undefined,
    };
  },
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
        const currentSection = connection.sections.filter((section) => {
          return this.isCurrentSection(section);
        })[0];
        return { ...connection, currentSection, nextSection };
      });
    },
  },
  methods: {
    openDialog(connection) {
      document.getElementsByClassName('homeView')[0].style.overflow = 'hidden';
      this.viewingConnection = connection;
      this.dialog = true;
    },
    closeDialog() {
      document.getElementsByClassName('homeView')[0].style.overflow = 'scroll';
      this.dialog = false;
    },
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
    getRemainingTime(time, delay, pasttime) {
      const now = new Date();
      const departure = new Date(time);
      if (delay) departure.setMinutes(departure.getMinutes() + parseInt(delay));
      const diff = departure - now;
      const minutes = Math.floor(diff / 1000 / 60) + 1;
      let hours = Math.floor(minutes / 60);
      let remainingMinutes = minutes % 60;
      if (pasttime) {
        hours = hours * -1 - 1;
        remainingMinutes = remainingMinutes * -1;
      }

      if (hours === 0 && remainingMinutes === 0) {
        return 'now';
      }

      let timeString = '';

      if (hours !== 0) {
        timeString += `${hours} hour${hours === 1 ? '' : 's'}`;
      }

      if (remainingMinutes !== 0) {
        if (hours !== 0) {
          timeString += ' and';
        }
        timeString += ` ${remainingMinutes} minute${
          remainingMinutes === 1 ? '' : 's'
        }`;
      }
      if (delay)
        timeString += ` (delayed by ${delay} ${
          delay === 1 ? 'minute' : 'minutes'
        })`;

      return `in ${timeString}`;
    },
    isRemainingTimeAhead(time) {
      const now = new Date();
      const departure = new Date(time);
      const diff = departure - now;
      const minutes = Math.floor(diff / 1000 / 60);
      return minutes > 0;
    },
    isTransitNow(connection) {
      const now = new Date();
      const departure = new Date(connection.from.departure);
      const arrival = new Date(connection.to.arrival);
      if (connection.to.arrival.delay) {
        arrival.setMinutes(
          arrival.getMinutes() + parseInt(connection.to.arrival.delay)
        );
      }
      return now > departure && now < arrival;
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
      let stillExists = false;
      sections.forEach((section) => {
        if (!section.journey) return;
        let departure = new Date(section.departure.departure);
        if (section.departure.delay) {
          departure.setMinutes(
            departure.getMinutes() + section.departure.delay
          );
        }
        if (departure > now) {
          stillExists = true;
          nextSection ? null : (nextSection = section);
        }
      });

      if (!stillExists) return null;
      return nextSection;
    },
    isCurrentSection(section) {
      let now = new Date();
      if (!section.journey) return false;
      let departure = new Date(section.departure.departure);
      let arrival = new Date(section.arrival.arrival);
      if (section.departure.delay) {
        departure.setMinutes(departure.getMinutes() + section.departure.delay);
      }
      if (section.arrival.delay) {
        arrival.setMinutes(
          arrival.getMinutes() + parseInt(section.arrival.delay)
        );
      }
      if (departure < now && now < arrival) {
        return true;
      }
      return false;
    },
    isFutureSection(section) {
      let now = new Date();
      if (!section.journey) return false;
      let departure = new Date(section.departure.departure);
      if (section.departure.delay) {
        departure.setMinutes(departure.getMinutes() + section.departure.delay);
      }
      if (departure > now) {
        return true;
      }
      return false;
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
  padding: 0rem 1rem 1rem 1rem;
}

.cardTitle {
  padding-top: 1rem;
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

.detailLineTimeline {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.cardTimeline .line {
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  gap: 1rem;
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

.nextSectionInfo {
  margin-top: 0.2rem;
}
.detailLineOverview {
  padding: 0 16px;
}

.detailLine {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  gap: 0.5rem;
}

.toolbarTitleSmall {
  font-size: 0.7rem;
  font-weight: 500;
}

.toolbarTitleSmall::after {
  content: '\a';
  white-space: pre;
}

.toolbarTitleContainer {
  line-height: 100%;
  height: 100%;
}

.sections {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.sectionItem {
  width: 100%;
  border: 1px solid #262626;
}

.detailLineOverview .detailLineTimeline .departure {
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

.detailLineOverview .detailLineTimeline .arrival {
  margin-left: 1rem;
  display: flex;
  align-items: center;
}

.pulsing {
  animation: pulsing 1s infinite;
}

.sectionTitle {
  display: flex;
  padding: 1rem 2rem;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
}

.sectionTitleTransport {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
}

.sectionOverview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.blinking {
  animation: blinker 1s linear infinite !important;
}

.delayNum {
  color: red;
}

.sectionBar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sectionHeader {
  box-shadow: 0px 0.5px 15px 0px #111;
}

.detailDialogHeader {
  overflow-x: hidden !important;
}

#connectionDetailDialog {
  padding-bottom: 5rem !important;
}

@keyframes pulsing {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
