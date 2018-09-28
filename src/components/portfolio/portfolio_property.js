/**
 * Created by zhangxiaojing on 2018/05/26.
 */

import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { PieChartsConfig } from './../../tools/chartsConfig';
import { fetchPortfolioProperty} from '../../actions/portfolio';
import echarts from 'echarts/lib/echarts';    //必须
import'echarts/lib/component/tooltip';
import'echarts/lib/chart/pie';
class PortfolioProperty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index:0
        };
    }
    componentDidMount(){
        let portfolioCode = this.props.portfolioCode;
        if(this.props.authenticated){
            this.props.fetchPortfolioProperty({portfolioCode});
        }
    }
    componentDidUpdate() {
        const property = this.props.property || [];
        const {positions} = property;
        const portfolioPieChart= echarts.init(document.getElementById('pie'));
        portfolioPieChart.setOption(PieChartsConfig(positions));
    }
    render() {
        const { totalAmount, totalValue, revenue} = this.props.property ||[];
        return (
            <div className="col-xs-12 portfolio-detail-my-property box">
                <div>
                    <div className="portfolio-name line">我的资产</div>
                    <div className="main clearfix">
                        <ul className="item1">
                            <li className="col-xs-6 text-left">持仓总量</li>
                            <li className="col-xs-6 text-right"> <span className="up">{ totalAmount ?totalAmount :'--'}</span> 份</li>
                        </ul>
                        <ul>
                            <li className="col-xs-6 text-left">持仓估值</li>
                            <li className="col-xs-6 text-right"><span className="up" style={{fontSize:"14px"}}>{ totalValue ? totalValue:'--'}</span> USDT</li>
                        </ul>
                        <ul>
                            <li className="col-xs-6 text-left">收益估值</li>
                            <li className="col-xs-6 text-right"><span className={revenue > 0 ? "up": "down"} style={{fontSize:"14px"}}>{revenue > 0 ? '+' : ""}{ revenue === 0 || revenue ? revenue:'--'}</span> USDT</li>
                        </ul>
                    </div>
                    <div>
                        <div className="item1">资产配置</div>
                        { totalAmount ? <div className="randar" id="pie" style={{height:"230px"}}></div> :
                            <div className="text-center g-font-size-20" style={{lineHeight:"230px"}}>暂无数据</div> }
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        property:state.portfolio.property,
        authenticated: state.auth.authenticated,
    };
}
export default withRouter(connect(mapStateToProps, {fetchPortfolioProperty})(PortfolioProperty));

