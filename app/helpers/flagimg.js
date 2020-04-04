import { helper } from "@ember/component/helper";

function flagimg([countrycodes, country]) {
  if (countrycodes[country]) {
    return countrycodes[country].toLowerCase();
  } else {
    return "unknown";
  }
}

export default helper(flagimg);
