import Component from "@ember/component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default Component.extend({
  init() {
    this._super(...arguments);
    this.chart = null;
    this.chartdata = this.get("data");
  },

  didInsertElement() {
    this._super(...arguments);
    let chart = am4core.create("countryradarchart", am4charts.RadarChart);
    chart.data = [{
      "category": "Critical",
      "value": this.chartdata.critical / this.chartdata.active * 100,
      "full": 100
    }, {
      "category": "Death",
      "value": this.chartdata.deaths / (this.chartdata.deaths + this.chartdata.recovered ) * 100,
      "full": 100
    }, {
      "category": "Recovered",
      "value": this.chartdata.recovered / (this.chartdata.deaths + this.chartdata.recovered ) * 100,
      "full": 100
    }, {
      "category": "Active",
      "value": 100 - (this.chartdata.critical / this.chartdata.active * 100),
      "full": 100
    }];

    // Make chart not full circle
    chart.startAngle = -90;
    chart.endAngle = 180;
    chart.innerRadius = am4core.percent(20);

    // Set number format
    chart.numberFormatter.numberFormat = "#.#'%'";

    // Create axes
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.adapter.add("fill", function (fill, target) {
      if (target.dataItem.index == 0) {
        return am4core.color("#f9c851");
      }
      if (target.dataItem.index == 1) {
        return am4core.color("#ff5b5b");
      }
      if (target.dataItem.index == 2) {
        return am4core.color("#10c469");
      }
      return am4core.color("#21AFDD");
    });
    categoryAxis.renderer.minGridDistance = 10;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;

    valueAxis.renderer.labels.template.fill = am4core.color("#adb5bd");

    // Create series
    let series1 = chart.series.push(new am4charts.RadarColumnSeries());
    series1.dataFields.valueX = "full";
    series1.dataFields.categoryY = "category";
    series1.clustered = false;
    series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    series1.columns.template.fillOpacity = 0.08;
    series1.columns.template["cornerRadiusTopLeft"] = 20;
    series1.columns.template.strokeWidth = 0;
    series1.columns.template.radarColumn.cornerRadius = 20;

    let series2 = chart.series.push(new am4charts.RadarColumnSeries());
    series2.dataFields.valueX = "value";
    series2.dataFields.categoryY = "category";
    series2.clustered = false;
    series2.columns.template.strokeWidth = 0;
    series2.columns.template.tooltipText = "{category}: [bold]{value}[/]";
    series2.columns.template.radarColumn.cornerRadius = 20;

    series2.columns.template.adapter.add("fill", function (fill, target) {
      //return chart.colors.getIndex(target.dataItem.index);
      if (target.dataItem.index == 0) {
        return am4core.color("#f9c851");
      }
      if (target.dataItem.index == 1) {
        return am4core.color("#ff5b5b");
      }
      if (target.dataItem.index == 2) {
        return am4core.color("#10c469");
      }
      return am4core.color("#21AFDD");
    });

    // Add cursor
    chart.cursor = new am4charts.RadarCursor();
    chart.cursor.fill = am4core.color("#282e38");
    chart.tooltip.label.fill = am4core.color("#282e38");

    this.chart = chart;
  },

  willDestroyElement() {
    if (this.chart) {
      this.chart.dispose();
    }
    this._super(...arguments);
  }
});