import Component from "@ember/component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default Component.extend({
  init() {
    
    this._super(...arguments);
    this.chart = null;
    this.piedata = this.get("data");
  },

  didInsertElement() {
    this._super(...arguments);
    console.log(this.piedata);
    let chart = am4core.create("chartdiv", am4charts.PieChart);
    chart.paddingRight = 20;

    let data = [];
    this.piedata.forEach(country => {
        data.push({
            country: country.country,
            cases: country.cases
        })
    });
    chart.data = data;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "cases";
    pieSeries.dataFields.category = "country";
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    
    this.chart = chart;
  },

  willDestroyElement() {
    if (this.chart) {
      this.chart.dispose();
    }
    this._super(...arguments);
  }
});