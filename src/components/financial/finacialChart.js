import React from "react";
import { FinancialCenterCharts } from "./../../tools/chartsConfig";
import echarts from 'echarts/lib/echarts';    //必须
import'echarts/lib/component/tooltip';
import'echarts/lib/chart/line';

let myCharts;
export default class Financial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        const { series, xaxis } = this.props.chartInfo;
        let charts = this.refs.chart;
        myCharts = echarts.init(charts);
        myCharts.setOption(FinancialCenterCharts(series, xaxis));
    }
    componentDidUpdate() {
        const { series, xaxis } = this.props.chartInfo;
        let charts = this.refs.chart;
        myCharts = echarts.init(charts);
        myCharts.setOption(FinancialCenterCharts(series, xaxis));
    }
    render() {
        return (
            <div className="financial-item-chart-left" ref="chart">
            </div>
        );
    }
}


