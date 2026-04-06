# CLAUDE.md - SAL Kiti Frontend

SAL Kiti is the Finnish Shooting Sport Federation's (SAL) results and statistics management SPA, built with Vue 2 and BootstrapVue.

## Quick Reference

```bash
npm install          # Install dependencies
npm run serve        # Dev server (localhost:8080)
npm run build        # Production build
npm run lint         # ESLint + Prettier (auto-fix)
npm run test:unit    # Jest unit tests with coverage
```

## Tech Stack

- **Vue 2.7** with Vue Router 3, Vuex 3, vue-i18n 8
- **BootstrapVue 2.23** for UI components
- **Axios 1.6** for HTTP (configured in `src/api/BaseApi.js`)
- **Sass** for styling (custom theme in `src/assets/scss/`)
- **Jest** + `@vue/test-utils` for testing
- **ESLint** + **Prettier** for code quality
- **Vue CLI 5** (Webpack-based build)

## Project Structure

```
src/
  api/           # Axios instance and HTTP config (BaseApi.js)
  assets/        # SCSS stylesheets and images
  components/    # Vue SFC components (~40+ files)
  locales/       # i18n translations (en.json, fi.json)
  mixins/        # Shared logic (ApiGet.js, ResultLayout.js, ResultImport.js)
  utils/         # Pure utility functions (ErrorParser, parsers, formatters)
  views/         # Page-level layout components
  App.vue        # Root component
  main.js        # App entry point
  router.js      # Vue Router setup
  routes.js      # Route definitions (30+ routes, lazy-loaded)
  store.js       # Vuex store (user auth, CSRF, editMode, SPA version)
tests/
  unit/          # Jest spec files (*.spec.js)
__mocks__/       # Jest mocks (axios.js)
```

## Architecture Patterns

### API Communication
- Single Axios instance in `src/api/BaseApi.js` with CSRF, credentials, locale header
- Import as `import { HTTP } from "@/api/BaseApi.js"` and call directly in components
- No service layer - components make HTTP calls directly
- Response interceptor auto-reloads page when API version changes

### State Management
- Vuex is minimal: global user info, CSRF token, editMode, SPA version
- Components manage their own local state (forms, lists, loading flags)

### Code Reuse via Mixins
- `ApiGet.js` - ~20 shared async data-fetching methods (getAthlete, getCompetition, etc.)
- `ResultLayout.js` - Dynamic table field/column generation from competition layout
- `ResultImport.js` - Shared file import logic

### Error Handling
- `src/utils/ErrorParser.js` - Centralized parser with methods: `generic()`, `form()`, `result()`, `partialResult()`
- Components store errors in `this.errors` and display via BootstrapVue alerts

### Internationalization
- Two locales: Finnish (fi, default fallback) and English (en)
- Usage: `this.$t("key")` and `this.$tc("key", count)`
- Locale persisted in `localStorage.locale`
- Browser language auto-detected on first visit

### Component Conventions
- Standard Options API (`data`, `computed`, `watch`, `methods`, `mounted`/`created`)
- Loading state pattern: `loadingXxx: false` flag toggled around API calls
- Form data in `this.form` object, errors in `this.errors`
- BootstrapVue components for layout (`b-row`, `b-col`, `b-table`, `b-form-*`)

## Code Style

- **ESLint**: `plugin:vue/essential` + `plugin:prettier/recommended`
- **Prettier**: No trailing commas
- **No console.log** in production (enforced by ESLint rule)
- **`@/` alias** maps to `src/` in imports
- Single quotes are not enforced; follow existing file conventions

## CI/CD

GitHub Actions (`.github/workflows/main.yml`) runs on every push and PR:
1. `npm run lint`
2. `npm run test:unit`

Matrix: Node.js 18 and 22.

## Testing

- Test files: `tests/unit/*.spec.js`
- Setup: `tests/unit/TestSetup.js` mocks i18n (`$t`, `$tc`)
- Axios mocked globally via `__mocks__/axios.js`
- Snapshot testing with `jest-serializer-vue`
- Coverage collected from `src/**/*.{js,vue}` (excludes main.js, router/index.js)

## Environment Variables

Defined in `.env.development`:
- `VUE_APP_BASE_URL` - Backend API base URL
- `VUE_APP_ADMIN_URL` - Django admin URL
- `VUE_APP_LOGIN_URL` - Authentication URL
- `VUE_APP_PELIAS_API_URL` - Geocoding service URL
- `VUE_APP_I18N_FALLBACK_LOCALE` - Fallback locale (fi)

## Key Conventions for AI Assistants

1. **Always run `npm run lint` before committing** - CI will fail on lint errors
2. **Run `npm run test:unit` to verify changes** - CI runs tests on Node 18 and 22
3. **Use BootstrapVue components** for UI, not raw Bootstrap HTML
4. **Follow the existing Options API style** - do not introduce Composition API
5. **Add translations to both `en.json` and `fi.json`** when adding user-facing text
6. **Use `import { HTTP } from "@/api/BaseApi.js"`** for API calls
7. **Use ErrorParser** for consistent error handling
8. **Lazy-load route components** with `() => import(/* webpackChunkName */ "...")`
9. **Keep Vuex minimal** - only global state belongs there; use component-local state for forms/lists
10. **Match existing patterns** - look at similar components before creating new ones

## Known Issues

- **xlsx dependency**: `xlsx` is fetched from a CDN (`cdn.sheetjs.com`) that may return 403. Workaround: temporarily remove `xlsx` from `package.json`, run `npm install`, then restore the line. The xlsx package is only used in import components (`ResultImport.vue`, `AthleteImport.vue`), not in the statistics/charting side.
- **Pre-existing test failures**: 3 test suites fail because of the missing xlsx module. These are not regressions — all 85 actual tests pass.

## Current Work in Progress

**Branch**: `claude/add-claude-documentation-zG8TN`

### What was done

1. **CLAUDE.md** — Created this file documenting the codebase.

2. **Athlete result charts** — Added two filterable line charts to the athlete results page (`/athlete/:athlete_id`):
   - `src/components/AthleteResultsTimeline.vue` — All results plotted over time (date vs result value). Filterable by competition type (Tyyppi) dropdown.
   - `src/components/AthleteResultsBestDevelopment.vue` — Running personal best progression over time. Stepped line that only plots new PB points. Also filterable by type.
   - Both are wired into `src/components/AthleteResults.vue` in a side-by-side `b-row` above the results table.
   - Added `chart.js@^3.9.1` and `vue-chartjs@^4.1.2` as dependencies.
   - Added translations (`chart_timeline`, `chart_best`, `all_types`) to both `en.json` and `fi.json` under the `result` key.
   - Added canvas mock in `tests/unit/TestSetup.js` for chart.js in jsdom.
   - Updated `AthleteResults.spec.js` snapshot.

### What to do next

- **Test the charts visually** against a real backend (production API or local). The charts need athlete result data to render — navigate to `/athlete/<id>` for an athlete with multiple results.
- If CORS is an issue with the production API, set up a CORS proxy and point `VUE_APP_BASE_URL` at it.
- The statistics side of the app (routes under `/statistics/`, `/records/`, `/divari/`) uses read-only GET endpoints that do not require authentication. Only `.env.production` with the correct `VUE_APP_BASE_URL` is needed to build for production.
- Consider adding more chart types or filters (e.g., filter by category/series, or group by year).
