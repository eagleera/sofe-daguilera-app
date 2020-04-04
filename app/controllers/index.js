import Controller from "@ember/controller";
import { action, computed } from "@ember/object";
import { alias } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import fetch from "fetch";

export default class IndexController extends Controller {
  search = "";
  countriesFiltered = [];
  countryCodes = {
    Afghanistan: "AF",
    "Aland Islands": "AX",
    Albania: "AL",
    Algeria: "DZ",
    "American Samoa": "AS",
    Andorra: "AD",
    Angola: "AO",
    Anguilla: "AI",
    Antarctica: "AQ",
    "Antigua And Barbuda": "AG",
    Argentina: "AR",
    Armenia: "AM",
    Aruba: "AW",
    Australia: "AU",
    Austria: "AT",
    Azerbaijan: "AZ",
    Bahamas: "BS",
    Bahrain: "BH",
    Bangladesh: "BD",
    Barbados: "BB",
    Belarus: "BY",
    Belgium: "BE",
    Belize: "BZ",
    Benin: "BJ",
    Bermuda: "BM",
    Bhutan: "BT",
    Bolivia: "BO",
    "Bosnia and Herzegovina": "BA",
    Botswana: "BW",
    "Bouvet Island": "BV",
    Brazil: "BR",
    "British Indian Ocean Territory": "IO",
    Brunei: "BN",
    Bulgaria: "BG",
    "Burkina Faso": "BF",
    Burundi: "BI",
    Cambodia: "KH",
    Cameroon: "CM",
    Canada: "CA",
    "Cape Verde": "CV",
    "Cayman Islands": "KY",
    "Central African Republic": "CF",
    Chad: "TD",
    Chile: "CL",
    China: "CN",
    "Christmas Island": "CX",
    "Cocos (Keeling) Islands": "CC",
    Colombia: "CO",
    Comoros: "KM",
    Congo: "CG",
    DRC: "CD",
    "Cook Islands": "CK",
    "Costa Rica": "CR",
    "Ivory Coast": "CI",
    Croatia: "HR",
    Cuba: "CU",
    Cyprus: "CY",
    Czechia: "CZ",
    Denmark: "DK",
    Djibouti: "DJ",
    Dominica: "DM",
    "Dominican Republic": "DO",
    Ecuador: "EC",
    Egypt: "EG",
    "El Salvador": "SV",
    "Equatorial Guinea": "GQ",
    Eritrea: "ER",
    Estonia: "EE",
    Ethiopia: "ET",
    "Falkland Islands": "FK",
    "Faeroe Islands": "FO",
    Fiji: "FJ",
    Finland: "FI",
    France: "FR",
    "French Guiana": "GF",
    "French Polynesia": "PF",
    "French Southern Territories": "TF",
    Gabon: "GA",
    Gambia: "GM",
    Georgia: "GE",
    Germany: "DE",
    Ghana: "GH",
    Gibraltar: "GI",
    Greece: "GR",
    Greenland: "GL",
    Grenada: "GD",
    Guadeloupe: "GP",
    Guam: "GU",
    Guatemala: "GT",
    Guernsey: "GG",
    Guinea: "GN",
    "Guinea-Bissau": "GW",
    Guyana: "GY",
    Haiti: "HT",
    "Heard Island & Mcdonald Islands": "HM",
    "Holy See (Vatican City State)": "VA",
    Honduras: "HN",
    "Hong Kong": "HK",
    Hungary: "HU",
    Iceland: "IS",
    India: "IN",
    Indonesia: "ID",
    Iran: "IR",
    Iraq: "IQ",
    Ireland: "IE",
    "Isle Of Man": "IM",
    Israel: "IL",
    Italy: "IT",
    Jamaica: "JM",
    Japan: "JP",
    "Channel Islands": "JE",
    Jordan: "JO",
    Kazakhstan: "KZ",
    Kenya: "KE",
    Kiribati: "KI",
    Korea: "KR",
    "S. Korea": "KR",
    Kuwait: "KW",
    Kyrgyzstan: "KG",
    "Lao People's Democratic Republic": "LA",
    Latvia: "LV",
    Lebanon: "LB",
    Lesotho: "LS",
    Liberia: "LR",
    "Libyan Arab Jamahiriya": "LY",
    Liechtenstein: "LI",
    Lithuania: "LT",
    Luxembourg: "LU",
    Macao: "MO",
    Macedonia: "MK",
    Madagascar: "MG",
    Malawi: "MW",
    Malaysia: "MY",
    Maldives: "MV",
    Mali: "ML",
    Malta: "MT",
    "Marshall Islands": "MH",
    Martinique: "MQ",
    Mauritania: "MR",
    Mauritius: "MU",
    Mayotte: "YT",
    Mexico: "MX",
    "Micronesia, Federated States Of": "FM",
    Moldova: "MD",
    Monaco: "MC",
    Mongolia: "MN",
    Montenegro: "ME",
    Montserrat: "MS",
    Morocco: "MA",
    Mozambique: "MZ",
    Myanmar: "MM",
    Namibia: "NA",
    Nauru: "NR",
    Nepal: "NP",
    Netherlands: "NL",
    "Netherlands Antilles": "AN",
    "New Caledonia": "NC",
    "New Zealand": "NZ",
    Nicaragua: "NI",
    Niger: "NE",
    Nigeria: "NG",
    Niue: "NU",
    "Norfolk Island": "NF",
    "North Macedonia": "MP",
    Norway: "NO",
    Oman: "OM",
    Pakistan: "PK",
    Palau: "PW",
    Palestine: "PS",
    Panama: "PA",
    "Papua New Guinea": "PG",
    Paraguay: "PY",
    Peru: "PE",
    Philippines: "PH",
    Pitcairn: "PN",
    Poland: "PL",
    Portugal: "PT",
    "Puerto Rico": "PR",
    Qatar: "QA",
    Réunion: "RE",
    Romania: "RO",
    Russia: "RU",
    Rwanda: "RW",
    "Saint Barthelemy": "BL",
    "St. Barth": "BL",
    "Saint Helena": "SH",
    "Saint Kitts And Nevis": "KN",
    "Saint Lucia": "LC",
    "Saint Martin": "MF",
    "Saint Pierre And Miquelon": "PM",
    "St. Vincent Grenadines": "VC",
    Samoa: "WS",
    "San Marino": "SM",
    "Sao Tome And Principe": "ST",
    "Saudi Arabia": "SA",
    Senegal: "SN",
    Serbia: "RS",
    Seychelles: "SC",
    "Sierra Leone": "SL",
    Singapore: "SG",
    Slovakia: "SK",
    Slovenia: "SI",
    "Solomon Islands": "SB",
    Somalia: "SO",
    "South Africa": "ZA",
    "South Georgia And Sandwich Isl.": "GS",
    Spain: "ES",
    "Sri Lanka": "LK",
    Sudan: "SD",
    Suriname: "SR",
    "Svalbard And Jan Mayen": "SJ",
    Swaziland: "SZ",
    Sweden: "SE",
    Switzerland: "CH",
    "Syrian Arab Republic": "SY",
    Taiwan: "TW",
    Tajikistan: "TJ",
    Tanzania: "TZ",
    Thailand: "TH",
    "Timor-Leste": "TL",
    Togo: "TG",
    Tokelau: "TK",
    Tonga: "TO",
    "Trinidad and Tobago": "TT",
    Tunisia: "TN",
    Turkey: "TR",
    Turkmenistan: "TM",
    "Turks And Caicos Islands": "TC",
    Tuvalu: "TV",
    Uganda: "UG",
    Ukraine: "UA",
    UAE: "AE",
    UK: "GB",
    USA: "US",
    "United States Outlying Islands": "UM",
    Uruguay: "UY",
    Uzbekistan: "UZ",
    Vanuatu: "VU",
    Venezuela: "VE",
    Vietnam: "VN",
    "Virgin Islands, British": "VG",
    "U.S. Virgin Islands": "VI",
    "Wallis And Futuna": "WF",
    "Western Sahara": "EH",
    Yemen: "YE",
    Zambia: "ZM",
    Zimbabwe: "ZW",
    Curaçao: "CW",
  };

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
  @computed("model", "countries")
  get deathPercentage() {
    let totalDeaths = 0;
    let totalRecovered = 0;
    this.countries.forEach((country) => {
      totalDeaths = totalDeaths + country.deaths;
      totalRecovered = totalRecovered + country.recovered;
    });
    return ((totalDeaths / (totalDeaths + totalRecovered)) * 100).toFixed(2);
  }
  @computed("model", "countries")
  get recoveredPercentage() {
    let totalDeaths = 0;
    let totalRecovered = 0;
    this.countries.forEach((country) => {
      totalDeaths = totalDeaths + country.deaths;
      totalRecovered = totalRecovered + country.recovered;
    });
    return ((totalRecovered / (totalDeaths + totalRecovered)) * 100).toFixed(2);
  }
  @computed("model", "countries")
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
