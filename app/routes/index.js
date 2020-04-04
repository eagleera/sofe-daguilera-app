import Route from "@ember/routing/route";
import fetch from "fetch";

export default class IndexRoute extends Route {
  async model() {
    const responsestats = await fetch("http://api.coronastatistics.live/all");
    const stats = await responsestats.json();
    const responsecountries = await fetch("http://api.coronastatistics.live/countries");
    const countries = await responsecountries.json();
    return { stats, countries };
  }
}
