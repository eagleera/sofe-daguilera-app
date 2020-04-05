import Controller from "@ember/controller";
import { action, computed } from "@ember/object";
import { alias } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import fetch from "fetch";

export default class IndexController extends Controller {
  search = "";
  countriesFiltered = [];

  @service("outbreak-clock")
  clock;

  @alias("model.countries")
  countries;

  @action
  query() {
    var query = this.get("search");
    let countries = this.get("countries");
    let countriesFiltered = this.get("countries").filter(
      (option) =>
        option.country
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) >= 0
    );
    this.set("countriesFiltered", countriesFiltered);
  }
  @action
  sortCountries(value) {
    if (value == "active" || value == "critical") {
      this.set(
        "model.countries",
        this.get("model.countries").sort(function (a, b) {
          return a[value] - b[value];
        })
      );
    }
    this.getSortedCountries(value);
  }

  async getSortedCountries(sortby) {
    const countrysorts = await fetch(
      "https://api.coronastatistics.live/countries?sort=" + sortby
    );
    const countries = await countrysorts.json();
    this.set("model.countries", countries);
  }

  @computed("clock.date")
  get outbreakTime() {
    let startDate = new Date("2019-12-01");
    return this.dhms(this.clock.date.getTime() - startDate.getTime());
  }
  
  dhms(difference) {
    var days, hours, mins, secs;
    days = Math.floor((difference / (60 * 60 * 1000 * 24)) * 1);
    hours = Math.floor(
      ((difference % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000)) * 1
    );
    mins = Math.floor(
      (((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) /
        (60 * 1000)) *
        1
    );
    secs = Math.floor(
      ((((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) %
        (60 * 1000)) /
        1000) *
        1
    );

    return {
      days: days,
      hours: hours,
      minutes: mins,
      seconds: secs,
    };
  }

  @computed("countries")
  get critical() {
    let critical = 0;
    this.countries.forEach((country) => {
      critical += country.critical;
    });
    return critical;
  }

  @computed("critical", "activeCases", "model")
  get chartData() {
    let totalDeaths = 0;
    let totalRecovered = 0;
    this.countries.forEach((country) => {
      totalDeaths = totalDeaths + country.deaths;
      totalRecovered = totalRecovered + country.recovered;
    });
    return {
      critical: this.critical,
      active: this.activeCases,
      deaths: totalDeaths,
      recoveries: totalRecovered,
      finished: totalDeaths + totalRecovered,
    }
  }

  @computed("countries")
  get totalCountries() {
    return this.countries.length;
  }

  @computed("countries")
  get todayCases() {
    let todayCases = 0;
    this.countries.forEach((country) => {
      todayCases += country.todayCases;
    });
    return todayCases;
  }
  @computed("countries")
  get todayDeaths() {
    let todayDeath = 0;
    this.countries.forEach((country) => {
      todayDeath += country.todayDeaths;
    });
    return todayDeath;
  }
  @computed("countries")
  get activeCases() {
    let activeCases = 0;
    this.countries.forEach((country) => {
      activeCases += country.active;
    });
    return activeCases;
  }
  @computed("countries")
  get casesPer1M() {
    let cases = 0;
    this.countries.forEach((country) => {
      cases += country.casesPerOneMillion;
    });
    return cases;
  }
  @computed("countries")
  get deathPercentage() {
    let totalDeaths = 0;
    let totalRecovered = 0;
    this.countries.forEach((country) => {
      totalDeaths = totalDeaths + country.deaths;
      totalRecovered = totalRecovered + country.recovered;
    });
    return ((totalDeaths / (totalDeaths + totalRecovered)) * 100).toFixed(2);
  }
  
  @computed("countries")
  get recoveredPercentage() {
    let totalDeaths = 0;
    let totalRecovered = 0;
    this.countries.forEach((country) => {
      totalDeaths = totalDeaths + country.deaths;
      totalRecovered = totalRecovered + country.recovered;
    });
    return ((totalRecovered / (totalDeaths + totalRecovered)) * 100).toFixed(2);
  }
  @computed()
  get criticalPercentage() {
    return ((this.get("critical") / this.get("activeCases")) * 100).toFixed(2);
  }
  @computed("countriesFiltered")
  get filtering() {
    if (this.countriesFiltered.length > 0) {
      return true;
    }
    return false;
  }
}
