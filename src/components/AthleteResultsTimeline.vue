<template>
  <div>
    <h3>{{ $t("result.chart_timeline") }}</h3>
    <b-form-group :label="$tc('competition.type', 1)">
      <b-form-select v-model="selectedType" :options="typeOptions" />
    </b-form-group>
    <div v-if="hasData">
      <LineChart :chart-data="chartData" :chart-options="chartOptions" />
    </div>
    <b-alert v-else variant="info" show>
      {{ $t("search.error") }}
    </b-alert>
  </div>
</template>

<script>
import { Line as LineChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale
);

export default {
  name: "AthleteResultsTimeline",
  components: {
    LineChart
  },
  props: {
    results: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedType: null
    };
  },
  computed: {
    validResults() {
      return this.results.filter(
        (r) => r.result != null && r.competition && r.competition.date_start
      );
    },
    competitionTypes() {
      const types = {};
      this.validResults.forEach((r) => {
        if (r.competition.type_info) {
          types[r.competition.type_info.abbreviation] =
            r.competition.type_info.name;
        }
      });
      return types;
    },
    typeOptions() {
      const options = [{ value: null, text: this.$t("result.all_types") }];
      Object.entries(this.competitionTypes).forEach(([abbr, name]) => {
        options.push({ value: abbr, text: name });
      });
      return options;
    },
    filteredResults() {
      if (!this.selectedType) {
        return this.validResults;
      }
      return this.validResults.filter(
        (r) =>
          r.competition.type_info &&
          r.competition.type_info.abbreviation === this.selectedType
      );
    },
    hasData() {
      return this.filteredResults.length > 0;
    },
    chartData() {
      const sorted = [...this.filteredResults].sort(
        (a, b) =>
          new Date(a.competition.date_start) -
          new Date(b.competition.date_start)
      );
      return {
        labels: sorted.map((r) => r.competition.date_start),
        datasets: [
          {
            label: this.$tc("result.result", 1),
            data: sorted.map((r) => r.result),
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.1)",
            tension: 0.1,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      };
    },
    chartOptions() {
      return {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              title: (items) => {
                if (!items.length) return "";
                const idx = items[0].dataIndex;
                const sorted = [...this.filteredResults].sort(
                  (a, b) =>
                    new Date(a.competition.date_start) -
                    new Date(b.competition.date_start)
                );
                const r = sorted[idx];
                return r.competition.date_start + " - " + r.competition.name;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: this.$t("date")
            }
          },
          y: {
            title: {
              display: true,
              text: this.$tc("result.result", 1)
            }
          }
        }
      };
    }
  }
};
</script>

<style scoped></style>
