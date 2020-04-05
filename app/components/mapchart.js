import Component from "@ember/component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

am4core.useTheme(am4themes_animated);

export default Component.extend({
  init() {
    this._super(...arguments);
    this.chart = null;
    this.chartdata = this.get("data");
    this.countryCodes = this.get("countryCodes");
    this.option = this.get("option");
  },

  didInsertElement() {
    this._super(...arguments);
    // this.isLoadingMap = true;
    if (this.chart) {
      this.chart.dispose();
    }
    let color;
    let mapData = [];
    switch (this.option) {
      case "recovered":
        color = "#10c469";
        this.chartdata.forEach((country) => {
          if (country.recovered != 0) {
            mapData.push({
              id: this.countryCodes[country.country],
              name: country.country,
              value: country.recovered,
              color: am4core.color(color),
            });
          }
        });
        break;
      case "critical":
        color = "#f9c851";
        this.chartdata.forEach((country) => {
          if (country.critical != 0) {
            mapData.push({
              id: this.countryCodes[country.country],
              name: country.country,
              value: country.critical,
              color: am4core.color(color),
            });
          }
        });
        break;
      case "deaths":
        color = "#ff5b5b";
        this.chartdata.forEach((country) => {
          if (country.critical != 0) {
            mapData.push({
              id: this.countryCodes[country.country],
              name: country.country,
              value: country.deaths,
              color: am4core.color(color),
            });
          }
        });
        break;
      default:
        color = "#21AFDD";
        this.chartdata.forEach((country) => {
            if (country.critical != 0) {
              mapData.push({
                id: this.countryCodes[country.country],
                name: country.country,
                value: country.cases,
                color: am4core.color(color),
              });
            }
          });
        break;
    }
    let chartMap = am4core.create("mapchart", am4maps.MapChart);
    // Set map definition
    chartMap.geodata = am4geodata_worldLow;

    // Set projection
    chartMap.projection = new am4maps.projections.Miller();

    // Create map polygon series
    let polygonSeries = chartMap.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.exclude = ["AQ"];
    polygonSeries.useGeodata = true;
    polygonSeries.nonScalingStroke = true;
    polygonSeries.strokeWidth = 0.5;
    polygonSeries.calculateVisualCenter = true;

    let imageSeries = chartMap.series.push(new am4maps.MapImageSeries());
    imageSeries.data = mapData;
    imageSeries.dataFields.value = "value";

    let imageTemplate = imageSeries.mapImages.template;
    imageTemplate.nonScaling = true;

    let circle = imageTemplate.createChild(am4core.Circle);
    circle.fillOpacity = 0.7;
    circle.propertyFields.fill = "color";
    circle.tooltipText = "{name}: [bold]{value}[/]";

    chartMap.events.on("ready", () => {
      //   this.isLoadingMap = false;
    });

    imageSeries.heatRules.push({
      target: circle,
      property: "radius",
      min: 4,
      max: 30,
      dataField: "value",
    });

    imageTemplate.adapter.add("latitude", function (latitude, target) {
      let polygon = polygonSeries.getPolygonById(
        target.dataItem.dataContext["id"]
      );
      if (polygon) {
        return polygon.visualLatitude;
      }
      return latitude;
    });

    imageTemplate.adapter.add("longitude", function (longitude, target) {
      let polygon = polygonSeries.getPolygonById(
        target.dataItem.dataContext["id"]
      );
      if (polygon) {
        return polygon.visualLongitude;
      }
      return longitude;
    });
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#e1e6ee");
    polygonTemplate.stroke = am4core.color("#cdd1d9");
    // polygonTemplate.stroke = am4core.color("#e1e6ee");
    this.chart = chartMap;
  },

  willDestroyElement() {
    if (this.chart) {
      this.chart.dispose();
    }
    this._super(...arguments);
  },
});
