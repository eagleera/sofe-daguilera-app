import Controller from "@ember/controller";

export default class CountryController extends Controller {
  queryParams = ["name"];
  name = null;
}
