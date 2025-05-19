import { RenderChartEventArgs } from '@syncfusion/ej2-grids';
import {
    Chart, BarSeries, ChartSeriesType, StackingBarSeries, LineSeries,
    StackingLineSeries, AreaSeries, Legend, Category, StackingColumnSeries,
    ColumnSeries, SeriesModel, StackingAreaSeries, ScatterSeries, PieSeries, AccumulationChart,
    AccumulationLegend, AxisModel, AccumulationDataLabel, AccumulationTooltip, Tooltip,
    DataLabel, Export, ExportType
} from '@syncfusion/ej2-charts';

Chart.Inject(Legend, Category, BarSeries, StackingBarSeries, ColumnSeries, StackingColumnSeries,
    LineSeries, StackingLineSeries,
    AreaSeries, StackingAreaSeries, ScatterSeries,
    Tooltip, DataLabel, Export
);
AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip, Export);

let chartElement: HTMLElement;
let chart: Chart;
let accumulationChartElement: HTMLElement;
let accumulationChart: AccumulationChart;
let chartVisible: boolean;

const renderChart = (args: RenderChartEventArgs) => {
    if (args.action === 'Export') { // for exporting the chart
        let currentChart = chartVisible ? chart : accumulationChart;
        if (args.exportOption.text === 'Print') {
            currentChart.print();
        } else {
            currentChart.exportModule.export(args.exportOption.text as ExportType, 'Chart');
        }
    }
    if ((args.action === 'Render' || args.action === 'Update') && args.chartSettings) { // for rendering and updating the chart
        if (args.action === 'Render') { // creating chart element
            args.targetElement.style.display = 'flex';
            args.targetElement.style.justifyContent = 'center';
            chartElement = document.createElement('div');
            chartElement.style.display = 'none';
            accumulationChartElement = document.createElement('div');
            accumulationChartElement.style.display = 'none';
            args.targetElement.append(chartElement);
            args.targetElement.append(accumulationChartElement);
        }
        if (
            [
                'Bar', 'StackingBar', 'StackingBar100',
                'Column', 'StackingColumn', 'StackingColumn100',
                'Line', 'StackingLine', 'StackingLine100',
                'Area', 'StackingArea', 'StackingArea100',
                'Scatter'
            ].indexOf(args.chartType) !== -1
        ) {
            chartVisible = true;
            let chartFlag = false;
            if (!chart) {
                chartFlag = true;
                chart = new Chart({
                    height: '290px',
                    width: '450px',
                });
            }
            let chartXAxis: AxisModel;
            if (args.chartSettings.categoryAxis === 'Year') { // generate primaryXAxis based on categoryAxis
                chartXAxis = {
                    minimum: 100, // provide minimum value
                    maximum: 1000, // provide maximum value
                    interval: 50, // provide interval value
                    valueType: 'Double'
                };
            } else if (args.chartSettings.categoryAxis === 'Name') {
                chartXAxis = {
                    interval: null, // reset to initial value
                    minimum: null, // reset to initial value
                    maximum: null, // reset to initial value
                    valueType: 'Category',
                };
            }
            chart.primaryXAxis = chartXAxis; // generate primaryYAxis based on series
            chart.primaryYAxis = {
                minimum: 0,
                maximum: 200,
                interval: 20,
                valueType: 'Double'
            };
            if (args.chartSettings.axes === 'Category Axis') { // change the title, it's style and label style for Category Axis
                chart.primaryXAxis.isInversed = args.chartSettings.axesInversed;
                chart.primaryXAxis.title = args.chartSettings.axesTitle;
                chart.primaryXAxis.titleStyle.fontFamily = args.chartSettings.axesTitleFont;
                chart.primaryXAxis.titleStyle.size = args.chartSettings.axesTitleSize + 'px';
                chart.primaryXAxis.titleStyle.color = args.chartSettings.axesTitleColor;
                chart.primaryXAxis.labelStyle.fontFamily = args.chartSettings.axesLabelFont;
                chart.primaryXAxis.labelStyle.size = args.chartSettings.axesLabelSize + 'px';
                chart.primaryXAxis.labelStyle.color = args.chartSettings.axesLabelColor;
                chart.primaryXAxis.labelRotation = args.chartSettings.axesLabelRotation;
            } else if (args.chartSettings.axes === 'Value Axis') { // change the title, it's style and label style for Value Axis
                chart.primaryYAxis.isInversed = args.chartSettings.axesInversed;
                chart.primaryYAxis.title = args.chartSettings.axesTitle;
                chart.primaryYAxis.titleStyle.fontFamily = args.chartSettings.axesTitleFont;
                chart.primaryYAxis.titleStyle.size = args.chartSettings.axesTitleSize + 'px';
                chart.primaryYAxis.titleStyle.color = args.chartSettings.axesTitleColor;
                chart.primaryYAxis.labelStyle.fontFamily = args.chartSettings.axesLabelFont;
                chart.primaryYAxis.labelStyle.size = args.chartSettings.axesLabelSize + 'px';
                chart.primaryYAxis.labelStyle.color = args.chartSettings.axesLabelColor;
                chart.primaryYAxis.labelRotation = args.chartSettings.axesLabelRotation;
            }
            const chartSeries: SeriesModel[] = [];
            for (let index = 0; index < args.chartSettings.series.length; index++) { // create the series with the provide chart settings
                const tempSeries: SeriesModel = {
                    dataSource: args.selectedRecords,
                    xName: args.chartSettings.categoryAxis,
                    yName: args.chartSettings.series[index],
                    type: args.chartType as ChartSeriesType,
                    name: args.chartSettings.series[index]
                };
                if (args.chartSettings.stylingSeries === 'All'
                    || args.chartSettings.stylingSeries === args.chartSettings.series[index]) {
                    tempSeries.fill = args.chartSettings.seriesColor;
                    tempSeries.marker = { dataLabel: { visible: args.chartSettings.seriesDataLabel } }
                }
                chartSeries.push(tempSeries);
            }
            chart.series = chartSeries;
            chart.tooltip = { enable: args.chartSettings.tooltip }; // for chart tooltip
            chart.margin = { // for chart mergin
                top: args.chartSettings.marginTop,
                bottom: args.chartSettings.marginBottom,
                left: args.chartSettings.marginLeft,
                right: args.chartSettings.marginRight,
            };
            chart.background = args.chartSettings.background; // for chart background color
            if (args.chartSettings.titleSection === 'Title') { // for chart title and subtitle
                chart.title = args.chartSettings.title;
                chart.titleStyle.fontFamily = args.chartSettings.titleFont;
                chart.titleStyle.size = args.chartSettings.titleSize + 'px';
                chart.titleStyle.color = args.chartSettings.titleColor;
            } else if (args.chartSettings.titleSection === 'Subtitle') {
                chart.subTitle = args.chartSettings.title;
                chart.subTitleStyle.fontFamily = args.chartSettings.titleFont;
                chart.subTitleStyle.size = args.chartSettings.titleSize + 'px';
                chart.subTitleStyle.color = args.chartSettings.titleColor;
            }
            chart.legendSettings = { // for chart legend
                visible: args.chartSettings.legend,
                position: args.chartSettings.legendPosition,
                textStyle: {
                    color: args.chartSettings.legendColor,
                    size: args.chartSettings.legendSize,
                    fontFamily: args.chartSettings.legendFont
                }
            }
            accumulationChartElement.style.display = 'none';
            chartElement.style.display = '';
            chartFlag ? chart.appendTo(chartElement) : chart.refresh(); // render or update the chart
        }
        if (args.chartType === 'Pie') { // for rendering and updating the AccumulationChart
            chartVisible = false;
            let accumulationChartFlag = false;
            if (!accumulationChart) {
                accumulationChartFlag = true;
                accumulationChart = new AccumulationChart({
                    height: '290px',
                    width: '450px',
                });
            }
            accumulationChart.series = [ // create the series with the provide chart settings
                {
                    dataSource: args.selectedRecords,
                    xName: args.chartSettings.categoryAxis,
                    yName: args.chartSettings.accumulationValueAxis,
                    type: args.chartType,
                    dataLabel: { visible: args.chartSettings.seriesDataLabel }
                }
            ];
            accumulationChart.tooltip = { enable: args.chartSettings.tooltip } // for accumulationChart tooltip
            accumulationChart.margin = { // for accumulationChart margin
                top: args.chartSettings.marginTop,
                bottom: args.chartSettings.marginBottom,
                left: args.chartSettings.marginLeft,
                right: args.chartSettings.marginRight,
            };
            accumulationChart.background = args.chartSettings.background; // for accumulationChart background color
            if (args.chartSettings.titleSection === 'Title') { // for accumulationChart title and subtitle
                accumulationChart.title = args.chartSettings.title;
                accumulationChart.titleStyle.fontFamily = args.chartSettings.titleFont;
                accumulationChart.titleStyle.size = args.chartSettings.titleSize + 'px';
                accumulationChart.titleStyle.color = args.chartSettings.titleColor;
            } else if (args.chartSettings.titleSection === 'Subtitle') {
                accumulationChart.subTitle = args.chartSettings.title;
                accumulationChart.subTitleStyle.fontFamily = args.chartSettings.titleFont;
                accumulationChart.subTitleStyle.size = args.chartSettings.titleSize + 'px';
                accumulationChart.subTitleStyle.color = args.chartSettings.titleColor;
            }
            accumulationChart.legendSettings = { // for accumulationChart legend
                visible: args.chartSettings.legend,
                position: args.chartSettings.legendPosition,
                textStyle: {
                    color: args.chartSettings.legendColor,
                    size: args.chartSettings.legendSize,
                    fontFamily: args.chartSettings.legendFont
                }
            }
            chartElement.style.display = 'none';
            accumulationChartElement.style.display = '';
            accumulationChartFlag ? accumulationChart.appendTo(accumulationChartElement) : accumulationChart.refresh(); // render or update the accumulationChart
        }
    }
};
