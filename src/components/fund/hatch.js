/**
 * Created by fengxiaoli on 2017/12/12.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';
import { Icon, Spin, Rate, Popover, Pagination} from 'antd';
import echarts from 'echarts/lib/echarts';    //必须
import'echarts/lib/component/tooltip';
import'echarts/lib/chart/line';
import {fetchFundHatch} from '../../actions/fund';
import { PortfolioChartsConfig } from '../../tools/chartsConfig';
import Service from '../common/service';

class Hatch extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pageNum:1,
            pageSize:10,
        };
    }
    componentWillMount() {
        const{pageNum, pageSize} = this.state;
        this.props.fetchFundHatch({pageNum, pageSize});
    }
    onChange(pageNum){
        const{pageSize} = this.state;
        this.setState({pageNum});
        this.props.fetchFundHatch({pageNum, pageSize});
    }
    componentDidUpdate() {
        const {list, total}=this.props.hatch;
        list.map((item, index)=>{
            const grid={left:"10%", top:"10%", right:"10%", bottom:"15%"};
            const type=1;
            const {info}=item;
            const portfolioChart2= echarts.init(document.getElementById(`top${index}`));
            portfolioChart2.setOption(PortfolioChartsConfig(info, grid, type));
        });
    }
    renderFundFatch(){
        const {list, total}=this.props.hatch;
        return list.map((item, index)=>{
            const {currency, currentNetValue, name}=item;
            const content=(
                <div>{currency.join("/")}</div>
            );
            return(
                <li className="col-xs-12 item" key={index}>
                    <div className="col-xs-12 col-md-5 financial-item-slogan-left">
                        <div className="chart" style={{height:"180px", marginTop:"20px"}} id={`top${index}`}></div>
                    </div>
                    <div className="col-xs-12 col-md-7 right">
                        <div>
                            <h4 style={{"display":"inline-block", marginBottom:'30px'}}>{name ? name : '--'}</h4>
                        </div>
                        <div className="clearfix list">
                            <ul>
                                <li className="col-xs-4" style={{padding: '0'}}>
                                    <div><span className="financial-item-right-top-blue-color">{currentNetValue ? currentNetValue : "--"} BTC</span>
                                    </div>
                                    <div>最新净值</div>
                                </li>
                                {/*<li className="col-xs-4" >*/}
                                    {/*<Popover content={content} placement="top">*/}
                                        {/*<div>*/}
                                            {/*<span className="financial-item-right-top-blue-color">{currency ? (currency).slice(0, 3).join("/") :"--"}</span>*/}
                                        {/*</div>*/}
                                        {/*<div style={{color:"#6c6c6c", fontWeight:'400'}}>支持币种</div>*/}
                                    {/*</Popover>*/}
                                {/*</li>*/}
                            </ul>
                        </div>
                        <div>
                            <div  className={`portfolio-btn financial-item-right-top-btn-blue`}>
                                孵化中
                            </div>
                        </div>
                    </div>
                </li>
            );
        });
    }
    render(){
        const {list, total}=this.props.hatch;
        return(
            <div>
                <Header/>
                <div className="portfolio" ref={node => this.node = node}>
                    <div className="fund-hatch">
                        <div className="container">
                            <div className="portfolio-list-section3">
                                <div className="content row">
                                    <ul className="clearfix">
                                        { !total && typeof(total)!="undefined" && total!=0  ?
                                            <div className="text-center h3 col-sm-12 g-py-50" >
                                                <Spin tip="玩命加载中..." />
                                            </div>: (total==0 ?  <h1 className="text-center" style={{height:"500px", lineHeight:"500px"}}>暂无数据</h1> :this.renderFundFatch())
                                            }
                                    </ul>
                                    <div className="financial-pagination">
                                        {!total ? '': <Pagination defaultCurrent={1} size="small" total={parseInt(total)} onChange={this.onChange.bind(this)}/>}
                                    </div>
                                </div>
                            </div>
                            <Service/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}
function mapStateToProps(state){
    return {
        hatch:state.portfolio.hatch,
    };
}
export default withRouter(connect(mapStateToProps, {fetchFundHatch})(Hatch));
