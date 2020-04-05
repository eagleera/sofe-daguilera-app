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
    let chart = am4core.create("countrypiechart", am4charts.PieChart);
    chart.data.push({
      type: "Recoveries",
      number: this.piedata.recovered,
      color: am4core.color("#10c469"),
    });
    chart.data.push({
      type: "Deaths",
      number: this.piedata.deaths,
      color: am4core.color("#ff5b5b"),
    });
    chart.data.push({
      type: "Critical",
      number: this.piedata.critical,
      color: am4core.color("#f9c851"),
    });
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "number";
    pieSeries.dataFields.category = "type";
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    pieSeries.slices.template.propertyFields.fill = "color";
    // pieSeries.slices.template.stroke = am4core.color("#313a46");
    // pieSeries.slices.template.strokeWidth = 1;
    // pieSeries.slices.template.strokeOpacity = 1;
    this.chart = chart;
  },

  willDestroyElement() {
    if (this.chart) {
      this.chart.dispose();
    }
    this._super(...arguments);
  },
});
