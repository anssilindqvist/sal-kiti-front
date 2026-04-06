<template>
  <div>
    <h3>{{ $t("result.chart_best") }}</h3>
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
  Filler
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

export default {
  name: "AthleteResultsBestDevelopment",
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
    bestResults() {
      const sorted = [...this.filteredResults].sort(
        (a, b) =>
          new Date(a.competition.date_start) -
          new Date(b.competition.date_start)
      );
      let best = null;
      const timeline = [];
      sorted.forEach((r) => {
        if (best === null || r.result > best) {
          best = r.result;
          timeline.push({
            date: r.competition.date_start,
            result: r.result,
            competition: r.competition.name
          });
        }
      });
      return timeline;
    },
    hasData() {
      return this.bestResults.length > 0;
    },
    chartData() {
      return {
        labels: this.bestResults.map((r) => r.date),
        datasets: [
          {
            label: this.$t("result.personal_best"),
            data: this.bestResults.map((r) => r.result),
            borderColor: "#28a745",
            backgroundColor: "rgba(40, 167, 69, 0.1)",
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
            stepped: "after"
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
                const r = this.bestResults[idx];
                return r.date + " - " + r.competition;
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
              text: this.$t("result.personal_best")
            }
          }
        }
      };
    }
  }
};
</script>

<style scoped></style>
