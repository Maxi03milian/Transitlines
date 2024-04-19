<template>
  <div class="homeView">
    <Header />
    <div class="content container">
      <div class="title">
        <h2>Transit</h2>
      </div>
      <p>Quick navigation</p>
      <Navcard
        title="Connections"
        text="Look up connections between 2 Stations"
        link="/connections"
      />
      <Navcard
        title="Stationboard"
        text="Look up all upcoming connections on a specific station"
        link="/stationboard"
      />
      <div v-if="!noSavedConnections" class="savedJourneys">
        <div class="title">
          <h2>Journeys</h2>
        </div>
        <p>Saved Trips</p>
        <div v-if="!loadingSaved">
          <SavedConnections :connections="savedConnectionEntities" />
        </div>
        <div v-else class="loadingSaved">
          <v-progress-circular
            indeterminate
            color="black"
          ></v-progress-circular>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header';
import Navcard from '../components/Navcard';
import SavedConnections from '../components/SavedConnections';

export default {
  name: 'Home',
  data() {
    return {
      loadingSaved: false,
      noSavedConnections: false,
      savedConnectionEntities: [],
    };
  },
  mounted() {
    if (localStorage.getItem('savedConnections') == null) {
      this.noSavedConnections = true;
      return;
    }
    this.loadingSaved = true;
    const connections = JSON.parse(
      localStorage.getItem('savedConnections').split(',')
    );
    connections.forEach((element) => {
      const params = element.split('&');
      params.shift();
      const newParams = params.join('&');
      fetch('https://transport.opendata.ch/v1/connections?' + newParams)
        .then((res) => res.json())
        .then((data) => {
          this.savedConnectionEntities.push(
            data.connections[element.split('&')[0].split('=')[1]]
          );
          if (connections.length === this.savedConnectionEntities.length) {
            this.loadingSaved = false;
          }
        });
    });
    this.startTimer();
  },
  components: {
    Header,
    Navcard,
    SavedConnections,
  },
  computed: {
    state() {
      return this.$store.state;
    },
    savedConnections() {
      return localStorage.getItem('savedConnections');
    },
  },
  methods: {
    startTimer() {
      const now = new Date();
      const remainingMilliseconds = (60 - now.getSeconds()) * 1000;

      const executeFunction = () => {
        this.updateData();
        // Schedule the next execution
        setTimeout(executeFunction, 60000);
      };

      setTimeout(executeFunction, remainingMilliseconds);
    },
    updateData() {
      const connections = JSON.parse(
        localStorage.getItem('savedConnections').split(',')
      );
      const promises = connections.map((element) => {
        const params = element.split('&');
        params.shift();
        const newParams = params.join('&');
        return fetch(
          'https://transport.opendata.ch/v1/connections?' + newParams
        )
          .then((res) => res.json())
          .then(
            (data) => data.connections[element.split('&')[0].split('=')[1]]
          );
      });

      Promise.all(promises)
        .then((results) => {
          this.savedConnectionEntities = results;
        })
        .catch((error) => {
          // Handle any errors that occurred during fetch requests
          console.error(error);
        });
    },
  },
};
</script>

<style>
.content {
  padding-left: 20px;
  padding-right: 20px;
}
.container {
  margin-top: 4rem;
}

.savedJourneys {
  margin-top: 2rem;
}

.loadingSaved {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
</style>
