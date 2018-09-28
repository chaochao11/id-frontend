import React from "react";
import {Icon, Rate, Pagination, Popover, Spin} from 'antd';
import safety from './../../../public/img/safety-service.png';
import money from './../../../public/img/money.png';
import {FinancialDetailsList} from './../../actions/financial';
import FinancialChart from './finacialChart';
import Service from './../common/service';
import { ROOT_AVATAR } from "./../../actions/types";


export default class FinancialCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
    }
    onChange(page) {
        const {dispatch} = this.props;
        this.setState({
            page: page
        });
        let init = {
            pageNum: page,
            pageSize: 10
        };
        dispatch(FinancialDetailsList(init));
    }
    tagList(list, portfolioType) {
        return list && list.map((cur, index, arr) => {
                return <i className={portfolioType === 4 ? "fl financial-item-right-top-blue-title" : portfolioType === 5 ? "fl financial-item-right-top-purple-title" : portfolioType === 6 ? "fl financial-item-right-top-orange-title" : portfolioType === 7 ? "fl financial-item-right-top-yellow-title" : "fl financial-item-right-top-blue-title"} key={index.toString()}>
                    {cur.description}
                </i>;
            }
        );
    }
    detailsFunc(portfolioCode, runningStatus) {
        const { dispatch } = this.props;
        dispatch({
            type: 'GET_PORTFOLIO_LOADING',
            getPortfolioLoading: true
        });
        if(parseInt(runningStatus) === 0) {
            this.props.history.push(`/portfolio/${portfolioCode}`);
            return false;
        }
        this.props.history.push(`/financial/details/${portfolioCode}`);
    }
    componentDidMount() {
        const {dispatch} = this.props;
        let init = {
            pageNum: 1,
            pageSize: 10
        };
        dispatch(FinancialDetailsList(init));
    }
    render() {
        const {list, total} = this.props.financialDetailsList.data;
        let item = list && list.map((cur, index, arr) => {
            return <div className="financial-item" key={index.toString()}
                        onClick={this.detailsFunc.bind(this, cur.portfolio.portfolioCode, cur.portfolio.productType)}>
                {parseInt(cur.portfolio.portfolioType) === 4 || parseInt(cur.portfolio.portfolioType) === 5 || parseInt(cur.portfolio.portfolioType) === 6 || parseInt(cur.portfolio.portfolioType) === 7 ?
                    <div className="financial-item-slogan-left col-lg-5 col-sm-12">
                        <img src={`${ROOT_AVATAR}/${cur.portfolio.imageUrl}`} alt=""/>
                    </div> : <div className="financial-item-chart-left col-lg-5 col-sm-12">
                        <FinancialChart chartInfo={cur.info}/>
                    </div>}
                <div className="financial-item-right col-lg-7 col-sm-12">
                    <div className="financial-item-right-top">
                        <div className="clear financial-item-right-top-title">
                            <span className="fl">{cur.portfolio.portfolioName}</span>
                            {this.tagList(cur.tags, parseInt(cur.portfolio.portfolioType))}
                        </div>
                        <div className="financial-item-right-top-risk">
                            <span>抗风险指数：</span><Rate disabled defaultValue={cur.portfolio.riskIndex}/>
                        </div>
                    </div>
                    <div className="financial-item-right-middle clear">
                        {parseInt(cur.portfolio.productType) === 1 ? <div className="fl">
                            <span className={parseInt(cur.portfolio.portfolioType) === 4 ? "show financial-item-right-top-blue-color" : parseInt(cur.portfolio.portfolioType) === 5 ? "show financial-item-right-top-purple-color" : parseInt(cur.portfolio.portfolioType) === 6 ? "show financial-item-right-top-orange-color" : parseInt(cur.portfolio.portfolioType) === 7 ? "show financial-item-right-top-yellow-color" : "show financial-item-right-top-blue-color"} style={{fontWeight:'bold'}}>{`${cur.profit}`}</span>
                            <span className="show">{cur.profitRateDesc}</span>
                        </div> : <div className="fl">
                            <span className={parseInt(cur.portfolio.portfolioType) === 4 ? "show financial-item-right-top-blue-color" : parseInt(cur.portfolio.portfolioType) === 5 ? "show financial-item-right-top-purple-color" : parseInt(cur.portfolio.portfolioType) === 6 ? "show financial-item-right-top-orange-color" : parseInt(cur.portfolio.portfolioType) === 7 ? "show financial-item-right-top-yellow-color" : "show financial-item-right-top-blue-color"} style={{fontWeight:'bold', wordBreak: 'break-all'}}>{`${cur.portfolioReturn.netValue}`}USDT</span>
                            <span className="show">最新净值</span>
                        </div> }
                        <div className="fl">
                            <span className={parseInt(cur.portfolio.portfolioType) === 4 ? "show financial-item-right-top-blue-color" : parseInt(cur.portfolio.portfolioType) === 5 ? "show financial-item-right-top-purple-color" : parseInt(cur.portfolio.portfolioType) === 6 ? "show financial-item-right-top-orange-color" : parseInt(cur.portfolio.portfolioType) === 7 ? "show financial-item-right-top-yellow-color" : "show financial-item-right-top-blue-color"} style={{fontWeight:'bold'}}>
                                {!cur.closedPeriod ? '--' : cur.closedPeriod}
                            </span>
                            <span className="show">产品封闭期</span>
                        </div>
                        {parseInt(cur.portfolio.productType) === 1 ? <div className="fl">
                            {cur.currency.length > 2 ? <Popover placement="top" content={(cur.currency.join('/'))} trigger="hover">
                                <span className={parseInt(cur.portfolio.portfolioType) === 4 ? "show financial-item-right-top-blue-color" : parseInt(cur.portfolio.portfolioType) === 5 ? "show financial-item-right-top-purple-color" : parseInt(cur.portfolio.portfolioType) === 6 ? "show financial-item-right-top-orange-color" : parseInt(cur.portfolio.portfolioType) === 7 ? "show financial-item-right-top-yellow-color" : "show financial-item-right-top-blue-color"} style={{fontWeight:'bold'}}>
                                    {cur.currency.slice(0, 3).join('/')}
                                </span>
                            </Popover> : <span className={parseInt(cur.portfolio.portfolioType) === 4 ? "show financial-item-right-top-blue-color" : parseInt(cur.portfolio.portfolioType) === 5 ? "show financial-item-right-top-purple-color" : parseInt(cur.portfolio.portfolioType) === 6 ? "show financial-item-right-top-orange-color" : parseInt(cur.portfolio.portfolioType) === 7 ? "show financial-item-right-top-yellow-color" : "show financial-item-right-top-blue-color"} style={{fontWeight:'bold'}}>
                                    {cur.currency.slice(0, 3).join('/')}
                                </span>}
                            <span className="show">申购币种</span>
                        </div> : <div className="fl">
                                    <span className="show" style={{fontWeight:'bold'}}>
                                    <i className="financial-item-color">
                                        {`${cur.portfolio.totalRaiseAmount/10000}万 `}
                                    </i>
                                    <i>
                                        USDT
                                    </i>
                                </span>
                            <span className="show">总金额</span>
                        </div>}
                    </div>
                    <div className="financial-item-right-bottom">
                        <button className={ parseInt(cur.portfolio.runningStatus) === 2 || parseInt(cur.portfolio.runningStatus) === 4 ? "financial-item-right-top-btn-ccc" : parseInt(cur.portfolio.runningStatus) === 1 ? (parseInt(cur.portfolio.portfolioType) === 4 ? "financial-item-right-top-btn-blue slideShine" : parseInt(cur.portfolio.portfolioType) === 5 ? "financial-item-right-top-btn-purple slideShine" : parseInt(cur.portfolio.portfolioType) === 6 ? "financial-item-right-top-btn-orange slideShine" : parseInt(cur.portfolio.portfolioType) === 7 ? "financial-item-right-top-btn-yellow slideShine" : "financial-item-right-top-btn-blue slideShine") : (parseInt(cur.portfolio.portfolioType) === 4 ? "financial-item-right-top-btn-blue" : parseInt(cur.portfolio.portfolioType) === 5 ? "financial-item-right-top-btn-purple" : parseInt(cur.portfolio.portfolioType) === 6 ? "financial-item-right-top-btn-orange" : "financial-item-right-top-btn-blue")}>{parseInt(cur.portfolio.runningStatus) === 0 ? '产品预告' : parseInt(cur.portfolio.runningStatus) === 1 ? '立即购买' : parseInt(cur.portfolio.runningStatus) === 2 ? '已封闭' : parseInt(cur.portfolio.runningStatus) === 3 ? '立即赎回' : parseInt(cur.portfolio.runningStatus) === 4 ? '已清算' : '产品预告'}</button>
                    </div>
                </div>
            </div>;
        });
        return (
            <div className="financial-main container">
                {item}
                {!parseInt(total) ? <div className="financial-pagination-none">
                    <Spin />
                </div> : <div className="financial-pagination">
                    <Pagination defaultCurrent={1} size="small" total={parseInt(total)}
                                onChange={this.onChange.bind(this)}/>
                </div>}
                <Service/>
            </div>
        );
    }
}


