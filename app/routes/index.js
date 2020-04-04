import Route from "@ember/routing/route";
import fetch from "fetch";

export default class IndexRoute extends Route {
  async model() {
    const responsestats = await fetch("http://api.coronastatistics.live/all");
    const stats = await responsestats.json();
    const responsecountries = await fetch(
      "http://api.coronastatistics.live/countries"
    );
    const countries = await responsecountries.json();
    const responsetimeline = await fetch(
      "http://api.coronastatistics.live/timeline/global"
    );
    const timeline = await responsetimeline.json();
    return { stats, countries, timeline };
  }
}
