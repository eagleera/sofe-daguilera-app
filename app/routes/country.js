import Route from "@ember/routing/route";
import fetch from "fetch";

export default class CountryRoute extends Route {
  queryParams = {
    name: {
      refreshModel: true,
    },
  };
  async model(params) {
    const responsestats = await fetch(
      "https://api.coronastatistics.live/countries/" + params.name
    );
    const stats = await responsestats.json();
    let name;
    params.name = params.name.toLowerCase();
    switch (params.name) {
        case "usa":
        case "u.s. virgin islands":
        case "puerto rico":
            name = "us";
            break;
        case "taiwan":
            name = "taiwan*";
            break;
        case "isle of man":
        case "montserrat":
        case "cayman islands":
        case "bermuda":
        case "gibraltar":
        case "channel islands":
        case "uk":
            name = "united kingdom";
            break;
        case "aruba":
        case "sint maarten":
        case "curaçao":
            name = "netherlands";
            break;
        case "st. vincent grenadines":
            name = "saint vincent and the grenadines";
            break;
        case "timor-leste":
            name = "East Timor";
            break;
        case "gambia":
            name = "gambia, the";
            break;
        case "greenland":
        case "faeroe islands":
            name = "denmark"
            break;
        case "st. barth":
            name = "saint barthelemy";
            break;
        case "congo":
            name = "congo (brazzaville)";
            break;
        case "saint martin":
        case "mayotte":
        case "french guiana":
        case "french polynesia":
        case "réunion":
        case "guadeloupe":
            name = "france";
            break;
        case "bahamas":
            name = "bahamas, the";
            break;
        case "ivory coast":
            name = "Cote d'Ivoire";
            break;
        case "macao":
        case "hong kong":
            name = "china";
            break;
        case "drc":
            name = "congo (kinshasa)";
            break;
        case "uae":
            name = "United Arab Emirates";
            break;
        case "diamond princess":
            name = "australia";
            break;
        case "car":
            name = "central african republic";
            break;
        default:
            name = params.name;
            break;
    }
    // } else if (nameTimeline == "faeroe islands") {
    //   nameTimeline = "Denmark";
    const responsetimeline = await fetch(
      "https://api.coronastatistics.live/timeline/" + name.toLowerCase()
    );
    const timeline = await responsetimeline.json();
    return { stats, timeline, name };
  }
}
