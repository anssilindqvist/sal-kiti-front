<template>
  <div>
    <b-row>
      <b-col>
        <b-alert v-if="errors.main" variant="danger" show>
          <ul>
            <li v-for="e in errors.main" v-bind:key="e">{{ e }}</li>
          </ul>
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" xl="6">
        <AthletePersonalBestList v-if="results.length > 0" :results="results" />
      </b-col>
      <b-col cols="12" xl="6">
        <AthleteRecordsList v-if="results.length > 0" :results="results" />
      </b-col>
    </b-row>
    <b-row v-if="results.length > 0">
      <b-col cols="12" lg="6">
        <AthleteResultsTimeline :results="results" />
      </b-col>
      <b-col cols="12" lg="6">
        <AthleteResultsBestDevelopment :results="results" />
      </b-col>
    </b-row>
    <b-row v-if="results">
      <b-col>
        <AthleteResultsList :results="results" />
        <div v-show="loadingResults">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Loads results for a single athlete and displays components listing:
 * - results list
 * - best results
 * - records
 */
import { HTTP } from "../api/BaseApi.js";
import errorParser from "../utils/ErrorParser";

import AthletePersonalBestList from "./AthletePersonalBestList";
import AthleteRecordsList from "./AthleteRecordsList";
import AthleteResultsList from "./AthleteResultsList";
import AthleteResultsTimeline from "./AthleteResultsTimeline";
import AthleteResultsBestDevelopment from "./AthleteResultsBestDevelopment";

export default {
  name: "AthleteResults",
  components: {
    AthletePersonalBestList,
    AthleteRecordsList,
    AthleteResultsList,
    AthleteResultsTimeline,
    AthleteResultsBestDevelopment
  },
  data() {
    return {
      errors: {},
      loadingResults: true,
      results: [],
      selectMode: "single"
    };
  },
  mounted() {
    this.getResults(this.$route.params.athlete_id);
  },
  methods: {
    /**
     * Fetch athlete results from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getResults(id) {
      this.$set(this.errors, "main", null);
      this.results = [];
      this.loadingResults = true;
      await HTTP.get(
        "resultlist/?athlete&ordering=competition__start_date&athlete=" + id
      )
        .then((response) => {
          this.results = response.data;
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingResults = false));
    }
  }
};
</script>

<style scoped></style>
