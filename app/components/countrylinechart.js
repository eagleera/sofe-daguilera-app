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
    this.stats = this.get("stats");
  },

  didInsertElement() {
    this._super(...arguments);
    let caseData = [];
    console.log(this.chartdata);
    console.log(this.stats);
    if (!this.chartdata.multiple) {
      caseData = this.chartdata.data.timeline;
    } else {
      let data = {};
      this.chartdata.data.forEach(async element => {
        element.timeline.forEach(async o => {
          if(!data.hasOwnProperty(o.date)){
            data[o.date] = {};
            data[o.date]["cases"] = 0;
            data[o.date]["deaths"] = 0;
            data[o.date]["recovered"] = 0;
          }
          data[o.date].cases += parseInt(o.cases);
          data[o.date].deaths += parseInt(o.deaths);
          data[o.date].recovered += parseInt(o.recovered);
        });
      });
      Object.keys(data).forEach(key => {
        caseData.push({
          date: new Date(key),
          cases: data[key].cases,
          recovered: data[key].recovered,
          deaths: data[key].deaths
        });
      });
    }
    caseData.push({
      date: new Date().getTime(),
      cases: this.stats.cases,
      recovered: this.stats.recovered,
      deaths: this.stats.deaths
    });
    let chart = am4core.create("countrylinechart", am4charts.XYChart);
    chart.numberFormatter.numberFormat = "#a";
    chart.numberFormatter.bigNumberPrefixes = [
      { "number": 1e+3, "suffix": "K" },
      { "number": 1e+6, "suffix": "M" },
      { "number": 1e+9, "suffix": "B" }
    ];
    
    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    
    valueAxis.renderer.labels.template.fill = am4core.color("#adb5bd");
    dateAxis.renderer.labels.template.fill = am4core.color("#adb5bd");

    chart = this.createSeriesLine(chart, "#21AFDD", "cases");
    chart = this.createSeriesLine(chart, "#10c469", "recovered");
    chart = this.createSeriesLine(chart, "#ff5b5b", "deaths");

    chart.data = caseData;

    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.fill = am4core.color("#adb5bd");

    chart.cursor = new am4charts.XYCursor();
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
