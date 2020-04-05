import Controller from "@ember/controller";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";

export default class CountryController extends Controller {
  queryParams = ["name"];
  name = null;

  @service("outbreak-clock")
  clock;

  @computed("model")
  get deathPercentage() {
    let percentage = (this.model.stats.deaths / (this.model.stats.deaths + this.model.stats.recovered) * 100).toFixed(2) + "%";
    if(percentage == "NaN%"){
      percentage = "N/A";
    }
    return percentage;
  }
  @computed("model")
  get recoveredPercentage() {
    let percentage = (this.model.stats.recovered / (this.model.stats.deaths + this.model.stats.recovered) * 100).toFixed(2) + "%";
    if(percentage == "NaN%"){
      percentage = "N/A";
    }
    return percentage;
  }
  @computed("model")
  get criticalPercentage() {
    let percentage = (this.model.stats.critical / (this.model.stats.active) * 100).toFixed(2) + "%";
    if (percentage == "NaN%") {
      percentage = "N/A";
    }
    return percentage;
  }
  @computed("model")
  get mildCases() {
    let percentage = (100 - (this.model.stats.critical / (this.model.stats.active) * 100)).toFixed(2);
    if(percentage == "NaN%") {
      percentage = "N/A";
    }
    return percentage;
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
}
