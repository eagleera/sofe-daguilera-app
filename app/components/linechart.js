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
    this.totalCases = this.get("totalcases");
    this.totalRecoveries = this.get("totalrecoveries");
    this.totalDeaths = this.get("totaldeaths");
  },

  didInsertElement() {
    this._super(...arguments);
    let chart = am4core.create("linechart", am4charts.XYChart);
    chart.paddingRight = 20;
    let caseData = [];
    Object.keys(this.chartdata).forEach((key) => {
      caseData.push({
        date: new Date(key),
        cases: this.chartdata[key].cases,
        recoveries: this.chartdata[key].recovered,
        deaths: this.chartdata[key].deaths,
      });
    });
    caseData.push({
      date: new Date().getTime(),
      cases: this.totalCases,
      recoveries: this.totalRecoveries,
      deaths: this.totalDeaths,
    });

    chart.numberFormatter.numberFormat = "#a";
    chart.numberFormatter.bigNumberPrefixes = [
      { number: 1e3, suffix: "K" },
      { number: 1e6, suffix: "M" },
      { number: 1e9, suffix: "B" },
    ];
    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fill = am4core.color("#adb5bd");
    dateAxis.renderer.labels.template.fill = am4core.color("#adb5bd");

    chart = this.createSeriesLine(chart, "#21AFDD", "cases");
    chart = this.createSeriesLine(chart, "#10c469", "recoveries");
    chart = this.createSeriesLine(chart, "#ff5b5b", "deaths");
    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.fill = am4core.color("#adb5bd");
    chart.cursor = new am4charts.XYCursor();
    chart.data = caseData;
    this.chart = chart;
  },

  createSeriesLine(chart, color, type) {
    let name = type.charAt(0).toUpperCase() + type.slice(1);
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = type;
    series.fill = am4core.color(color);
    series.dataFields.dateX = "date";
    series.strokeWidth = 2;
    series.minBulletDistance = 10;
    series.tooltipText = "{valueY} " + name;
    series.tooltip.pointerOrientation = "vertical";

    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.fillOpacity = 0.5;

    series.stroke = am4core.color(color);
    series.legendSettings.labelText = name;
    series.tooltip.autoTextColor = false;
    series.tooltip.label.fill = am4core.color("#282e38");
    return chart
  },

  willDestroyElement() {
    if (this.chart) {
      this.chart.dispose();
    }
    this._super(...arguments);
  },
});
