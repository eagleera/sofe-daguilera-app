import { helper } from "@ember/component/helper";

function number([number]) {
  return number.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,").split(".")[0];
}

export default helper(number);
