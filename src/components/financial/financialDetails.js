import React from "react";
import Header from "../common/header";
import Footer from "./../common/footer";
import {connect} from 'react-redux';
import {FinancialDetailsCharts} from "./../../tools/chartsConfig";
import safeguard from './../../../public/img/safeguard.png';
import recharge from './../../../public/img/recharge.png';
import address from './../../../public/img/address.png';
import auth from './../../../public/img/auth.png';
import { initNumber } from "../../tools/utils";
import {FinancialDetailsInfo, FinancialDetailETH, FinancialDetailsCouponList, GetUserUid} from './../../actions/financial';
import echarts from 'echarts/lib/echarts';    //必须
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/line';
import {Popover, Icon, Modal, Spin, Checkbox, message} from 'antd';
import {AccountHighStatus} from "./../../actions/account";
import {portfolioBuy, checkMessage} from './../../actions/portfolio';
import {ROOT_SHARE} from './../../actions/types';
import {withRouter} from "react-router-dom";
import {bindActionCreators} from "redux";
import moment from 'moment';
import NA from 'number-accuracy';
import cooperation from './../../../public/img/cooperation.png';
import weChat from './../../../public/img/service_wechat.jpg';
import customerService from './../../../public/img/customer-service.png';
import purchase from './../../../public/img/purchase.jpg';
import { accountValue } from "./../../tools/config";

import QrCode from 'qrcode.react';

let myCharts;
let timer;
let re = /([0-9]+\.[0-9]{6})[0-9]*/;
const content_1 = (
    <div>
        <img src={weChat} alt=""/>
    </div>
);

class FinancialDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            visible: false,
            visible1: false,
            visible2: false,
            visible4: false,
            leftTime: 1,
            value: 0,
            flag: true,
            singleTradeMax: '', //单笔最大金额
            singleTradeMin: '', //单笔最小金额
            totalAmount: '', //总金额
            totalSell: '', //已售出金额
            currencyId: '', //币种ID
            assets: '', //用户资产
            currency: '', //币种
            ethPrice: '', //兑换eth
            couponCode: '', //满减码
            couponID: '', //满减码ID
            discountedAmount: '', //满减金额
            couponFlag: true, //查看更多
            isAcceptInputChecked: false, //勾选
        };
    }

    getPortfolioCode() {
        let arr = window.location.href.split('/');
        return arr[arr.length - 1];
    }

    handleCancel(id) {
        this.setState({
            visible: false,
            visible1: false,
            visible2: false,
            visible4: false,
            couponCode: ''
        });
        //购买的弹框
        if(id === 1) {
            let arr = this.refs.coupon.children;
            for (let i = 0; i < arr.length; i++) {
                arr[i].children[2].className = 'anticon anticon-check support-check-circle hide';
            }
        }

    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    showModal1 = () => {
        this.setState({
            visible1: true,
        });
    };
    showModal2 = () => {
        this.setState({
            visible2: true,
        });
    };
    showModal4 = () => {
        this.setState({
            visible4: true,
        });
    };

    onChangeValue() {
    }

    loginFunc() {
        this.props.history.push('/user/signin');
    }

    registerFunc() {
        this.props.history.push('/user/signup');
    }

    componentDidMount() {
        const self = this;
        const {type} = this.props.financialDetailsInfo.data;
        let portfolioCode = this.getPortfolioCode();
        let init = {
            portfolioCode: portfolioCode,
        };
        if (this.props.authenticated) {
            this.props.GetUserUid();
        }
        this.props.FinancialDetailsInfo(init, (response) => {
                const endTime = response.openDate;
                if (endTime) {
                    let startTime = new Date();
                    let leftTime = endTime - startTime; //计算剩余的毫秒数
                    if (leftTime > 0) {
                        timer = setInterval(function () {
                            startTime = new Date();
                            let leftTime = endTime - startTime; //计算剩余的毫秒数
                            self.setState({leftTime: leftTime});
                            let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
                            let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
                            let minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
                            let seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
                            days = self.checkTime(days);
                            hours = self.checkTime(hours);
                            minutes = self.checkTime(minutes);
                            seconds = self.checkTime(seconds);
                            // console.log(days, hours, minutes, seconds);
                            document.getElementById("timer").innerHTML = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
                            if (leftTime <= 0) {
                                clearInterval(timer);
                                document.getElementById("timer").innerHTML = "0天0小时0分0秒";
                            }
                        }, 1000);
                    }
                }
            }
        );
        if (parseInt(type) === 4 || parseInt(type) === 6 || parseInt(type) === 7) return false;
        if (this.props.getPortfolioLoading) return false;
        const {series, xaxis} = this.props.financialDetailsInfo.data.echart;
        let charts = this.refs.chart;
        myCharts = echarts.init(charts);
        myCharts.setOption(FinancialDetailsCharts(series, xaxis));
    }

    handleBuy = () => {
        const {currencyId} = this.state;
        const {currenciesList} = this.props.financialDetailsInfo.data;
        let currencyType = currencyId === '' ? currenciesList[0].currencyId : currencyId;
        let portfolioCode = this.getPortfolioCode();
        const {portfolioName} = this.props.financialDetailsInfo.data;
        let amountValue = this.refs.portfolio.value;
        let couponCode = this.state.couponCode;
        let id = this.state.couponID;
        let re = /([0-9]+\.[0-9]{6})[0-9]*/;
        let amount = amountValue.replace(re, "$1");
        if (parseInt(currencyType) == 22){
            if (!this.state.isAcceptInputChecked) {
                return message.error('请勾选我同意');
            }
        }
        if (this.state.flag) {
            this.setState({
                flag: false,
            });
            this.props.portfolioBuy({portfolioCode, amount, currencyType, couponCode, id}, (response) => {
                this.setState({
                    flag: true,
                    visible: false,
                });
                if (response.status === 1) {
                    this.props.history.push({
                        pathname: '/portfolio/success',
                        state:{
                            purchasedAmount:response.data.purchasedAmount,
                            productName:response.data.productName,
                            closedDateStart:response.data.closedDateStart,
                            closedDateEnd:response.data.closedDateEnd,
                            predictedProfit:response.data.predictedProfit,
                            productType:response.data.productType,
                            currencyType:response.data.currencyType,
                            profitCurrencyType:response.data.profitCurrencyType,
                            discountedAmount:response.data.discountedAmount
                        }
                    });
                }
                else if (response.status === 3) {
                    //实名认证
                    this.showModal4();
                }
                else if (response.status === 2) {
                    //激活地址
                    this.showModal2();
                }
                else if (response.status === 4) {
                    //购买错误
                    this.setState({error: response.message});
                }
                else {
                    this.setState({error: response.message});
                }
            });
        }

    };

    handleBuyCheck() {
        const {singleTradeMax, singleTradeMin, totalAmount, totalSell, assets, currency, currencyId} = this.state;
        const {currenciesList} = this.props.financialDetailsInfo.data;
        const { dispatch } = this.props;
        let min = singleTradeMin === '' ? currenciesList[0].singleTradeMin : singleTradeMin;
        let max = singleTradeMax === '' ? currenciesList[0].singleTradeMax : singleTradeMax;
        let allMoney = totalAmount === '' ? currenciesList[0].totalAmount : totalAmount;
        let sell = totalSell === '' ? currenciesList[0].totalSell : totalSell;
        let balance = assets === '' ? Number(currenciesList[0].availableAssets) : assets;
        let unit = currency === '' ? currenciesList[0].currency : currency;
        let currencyType = currencyId === '' ? currenciesList[0].currencyId : currencyId;
        let amountValue = this.refs.portfolio.value.trim();
        let portfolioCode = this.getPortfolioCode();
        let re = /([0-9]+\.[0-9]{6})[0-9]*/;
        let amount = amountValue.replace(re, "$1");
        let init = {
            amount: amount,
            currencyType: currencyType,
            portfolioCode: portfolioCode,
        };
        if (this.props.authenticated) {
            if (balance >= min) {
                if (amount) {
                    if (amount >= min && amount <= max) {
                        if (balance >= amount) {
                            if (amount <= (allMoney - sell)) {
                                this.setState({
                                    value: amount
                                }, () => {
                                    dispatch(FinancialDetailsCouponList(init));
                                    this.showModal();
                                    dispatch(FinancialDetailETH(currencyType));
                                });
                            } else {
                                this.setState({error: "购买金额超过可购买余额"});
                            }
                        } else {
                            this.showModal1();
                        }
                    } else {
                        this.setState({error: `输入金额不足${min} ${unit}或超过最大值${max} ${unit}，请重新输入`});
                    }
                } else {
                    this.setState({error: "输入金额不正确，请重新输入"});

                }
            } else {
                this.showModal1();
            }
        } else {
            this.props.history.push("/user/signin");
        }
    }

    componentDidUpdate() {
        const {type, runningStatus} = this.props.financialDetailsInfo.data;
        if (parseInt(runningStatus) !== 1) {
            clearInterval(timer);
        }
        if (this.props.getPortfolioLoading) return false;
        if (parseInt(type) === 4 || parseInt(type) === 6 || parseInt(type) === 7) return false;
        let charts = this.refs.chart;
        const {series, xaxis} = this.props.financialDetailsInfo.data.echart;
        myCharts = echarts.init(charts);
        myCharts.setOption(FinancialDetailsCharts(series, xaxis));
    }

    componentWillUnmount() {
        clearInterval(timer);
    }

    checkAuth() {
        const {currencyId} = this.state;
        const {currenciesList} = this.props.financialDetailsInfo.data;
        let currencyType = currencyId === '' ? currenciesList[0].currencyId : currencyId;
        this.props.checkMessage({currencyType}, (response) => {
            if (response.QIC === -1) {
                //如果未认证
                this.showModal4();
            } else {
                localStorage.setItem("defaultActiveKey", 1);
                this.props.history.push('/user/account');
            }

        });
    }

    checkAddress = () => {
        const {currencyId} = this.state;
        const {currenciesList} = this.props.financialDetailsInfo.data;
        let currencyType = currencyId === '' ? currenciesList[0].currencyId : currencyId;
        this.props.checkMessage({currencyType}, (response) => {
            if (response.ADDRESS === -1) {
                //未激活地址
                this.showModal2();
            } else {
                localStorage.setItem("defaultActiveKey", 1);
                this.props.history.push('/user/account');
            }
        });
    };

    addEvent(id, singleTradeMax, singleTradeMin, totalAmount, totalSell, currencyId, assets, currency) {
        let arr = this.refs.type.children;
        this.setState({
            singleTradeMax: singleTradeMax,
            singleTradeMin: singleTradeMin,
            totalAmount: totalAmount,
            totalSell: totalSell,
            currencyId: currencyId,
            assets: assets,
            currency: currency
        }, () => {
            for (let i = 0; i < arr.length; i++) {
                arr[i].style.border = '1px solid #D2D2D2';
                arr[i].style.color = '#A7A7A7';
                arr[i].children[1].className = 'anticon anticon-check support-check-circle hide';
                arr[id].style.border = '1px solid #167AFF';
                arr[id].style.color = '#167AFF';
                arr[id].children[1].className = 'anticon anticon-check support-check-circle show';
            }
        });
    }
    changeCoupon (id, couponCode, discountedAmount, couponID) {
        let arr = this.refs.coupon.children;
        this.setState({
            couponCode: couponCode,
            discountedAmount: discountedAmount,
            couponID: couponID
        }, () => {
            for (let i = 0; i < arr.length; i++) {
                arr[i].children[2].className = 'anticon anticon-check support-check-circle hide';
                arr[id].children[2].className = 'anticon anticon-check support-check-circle show';
            }
        });
    }

    checkTime = (i) => { //将0-9的数字前面加上0，例1变为01
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };

    currencies(data) {
        let arr = [];
        data.map(cur => {
            return arr.push(cur.currency);
        });
        return arr.slice(0, 3).join('/');
    }

    currenciesList(data) {
        let arr = [];
        data.map(cur => {
            return arr.push(cur.currency);
        });
        return arr.join('/');
    }

    setAccept() {
        this.setState({
            isAcceptInputChecked: !this.state.isAcceptInputChecked,
        });
    }

    render() {
        const {portfolioTags, portfolioName, annualProfit, closedPeriod, type, currenciesList, idtInsurance, runningStatus, closedPeriodEndDate, fixedAnnualProfit, minAnnualProfit, totalAmount, activityCodes} = this.props.financialDetailsInfo.data;
        const {buyingDesc, holdingDesc, redemptionDesc, productionDesc, teamDesc, platformDesc, productionAdvatage, botDesc, earningsDesc} = this.props.financialDetailsInfo.data.portfolioDetail;
        const {applyFee, bonus, checkoutPeroid, depositFeel, managementFee, managmentPeriod, maxDrawdown, redemptionPeriod, lastYearProfit, depositFee, redemptionFee, remark, remarkVOList} = this.props.financialDetailsInfo.data.portfolioFee;
        const { fullReductionDtoList, currenyTypeStr } = this.props.financialCouponList.data;
        const { userUid } = this.props;
        let item = portfolioTags && portfolioTags.map((cur, index, arr) => {
            return <span className="fl" key={index.toString()}>
                {cur.description}
            </span>;
        });
        let list = currenciesList && currenciesList.map((cur, index, arr) => {
            return <span className="show fl" style={index === 0 ? {border: '1px solid #167AFF', color: '#167AFF'} : {}}
                         onClick={this.addEvent.bind(this, index, cur.singleTradeMax, cur.singleTradeMin, cur.totalAmount, cur.totalSell, cur.currencyId, cur.assets, cur.currency)}
                         key={index.toString()}>
                <span>{cur.currency}</span>
                <Icon type="check" className={index === 0 ? "support-check-circle show" : "support-check-circle hide"}/>
            </span>;
        });
        let coupon_true = fullReductionDtoList.slice(0, 3) && fullReductionDtoList.slice(0, 3).map((cur, index, arr) => {
            return <div className="buy-coupon-main-center-item" onClick={this.changeCoupon.bind(this, index, cur.couponCode, cur.discountedAmount, cur.id)} key={index.toString()}>
                <p>{cur.couponDesc}</p>
                <p>{`满${cur.requiredAmount}${currenyTypeStr}减${cur.discountedAmount}`}</p>
                <Icon type="check" className="support-check-circle hide"/>
                <b className="buy-coupon-main-item-bgc"></b>
            </div>;
        });
        let coupon_false = fullReductionDtoList && fullReductionDtoList.map((cur, index, arr) => {
            return <div className="buy-coupon-main-center-item" onClick={this.changeCoupon.bind(this, index, cur.couponCode, cur.discountedAmount, cur.id)} key={index.toString()}>
                <p>{cur.couponDesc}</p>
                <p>{`满${cur.requiredAmount}${currenyTypeStr}减${cur.discountedAmount}`}</p>
                <Icon type="check" className="support-check-circle hide"/>
                <b className="buy-coupon-main-item-bgc"></b>
            </div>;
        });
        if (this.props.getPortfolioLoading) {
            return <div className="text-center h3 col-sm-12 g-pt-120 g-pb-30">
                <Spin tip="玩命加载中..."/>
            </div>;
        }
        return (
            <div className="financial-details">
                <Header/>
                <div className="financial-details-center">
                    <div className="container">
                        <div className="financial-details-top">
                            <div className="financial-details-top-info clear">
                                <div className="fl clear financial-details-top-info-left">
                                    <p className="fl">{portfolioName}</p>
                                    <div className="fl">
                                        {item}
                                    </div>
                                </div>
                                <div className="fr financial-details-top-info-right clear">
                                    <span className={minAnnualProfit == null ? "fl hide" : "fl show"}>
                                        <i className="show">保底年化收益</i>
                                        <i className="show" style={{color: '#167aff'}}>{`${minAnnualProfit}%`}</i>
                                    </span>
                                    <span className={fixedAnnualProfit == null ? "fl hide" : "fl show"}>
                                        <i className="show">固定年化收益</i>
                                        <i className="show" style={{color: '#167aff'}}>{`${fixedAnnualProfit}%`}</i>
                                    </span>
                                    <span className={annualProfit == null ? "fl hide" : "fl show"}>
                                        <i className="show">预计年化收益</i>
                                        <i className="show" style={{color: '#167aff'}}>{`${annualProfit}%`}</i>
                                    </span>
                                    <span className="fl">
                                        <i className="show">封闭期限</i>
                                        <i className="show" style={{color: '#167aff'}}>{`${managmentPeriod}`}</i>
                                    </span>
                                    <span className="fl">
                                        <i className="show">申购币种</i>
                                        {currenciesList.length > 2 ?
                                            <Popover placement="top" content={this.currenciesList(currenciesList)}
                                                     trigger="hover">
                                                <em className="show" style={{
                                                    fontWeight: 'bold',
                                                    color: '#167aff'
                                                }}>{this.currencies(currenciesList)}</em>
                                            </Popover> : <em className="show" style={{
                                                fontWeight: 'bold',
                                                color: '#167aff'
                                            }}>{this.currenciesList(currenciesList)}</em>}
                                    </span>
                                </div>
                            </div>
                            <div
                                className={parseInt(type) === 4 || parseInt(type) === 6 || parseInt(type) === 7 ? "financial-details-top-chart hide" : "financial-details-top-chart show"}
                                ref="chart">

                            </div>
                        </div>
                        {parseInt(runningStatus) === 1 || parseInt(runningStatus) === 2 ?
                            <div className="financial-details-middle clear">
                                <div className="financial-details-middle-letter fl">
                                    <p>
                                        <b className="show">买入说明：</b>
                                        <span className="show">{buyingDesc}</span>
                                        {/*<Popover placement="topLeft" content={content} trigger="hover">*/}
                                        {/*<i className="show financial-item-color" style={{*/}
                                        {/*cursor: 'pointer',*/}
                                        {/*textDecoration: 'underline'*/}
                                        {/*}}>什么是USDT？</i>*/}
                                        {/*</Popover>*/}
                                    </p>
                                    <p>
                                        <b className="show">持仓说明：</b>
                                        <span className="show">{holdingDesc}</span>
                                    </p>
                                    <p>
                                        <b className="show">赎回说明：</b>
                                        <span className="show">{redemptionDesc}</span>
                                    </p>
                                </div>
                                <div className="financial-details-middle-plan fl">
                                    <div className="financial-details-middle-plan-wrap">
                                        {!this.props.authenticated ? <p className="financial-details-middle-none-login">
                                            <span>请</span>
                                            <span onClick={this.loginFunc.bind(this)}> 登录 </span>
                                            <span>或 </span>
                                            <span onClick={this.registerFunc.bind(this)}>注册</span>
                                        </p> : <div>
                                            <p className="financial-details-middle-account clear">
                                                <span>可用余额：</span>
                                                <span>{this.state.assets === '' ? currenciesList[0].availableAssets : this.state.assets}</span>
                                                <span style={{marginLeft: '5px'}}>{this.state.currency === '' ? currenciesList[0].currency : this.state.currency}</span>
                                                <span
                                                    className={parseInt(currenciesList[0].currencyId) === 2 || parseInt(currenciesList[0].currencyId) === 22 ? "show" : (parseInt(this.state.currencyId) === 2 || parseInt(this.state.currencyId) === 22 ? "show" : "hide")}>
                                                    <span style={{
                                                        margin: '0 5px',
                                                        fontWeight: 'bold',
                                                        color: '#000'
                                                    }}>⇌</span>
                                                    {/*<span style={{margin:'0 5px'}}><i className="fa fa-exchange fa-fw"></i></span>*/}
                                                    <span>{this.state.ethPrice === '' ? currenciesList[0].ethPrice : this.state.ethPrice}</span>
                                                    <span style={{marginLeft: '5px'}}>ETH</span>
                                                </span>
                                            </p>
                                            <p className="financial-details-middle-support clear">
                                                <i className="fl">支持币种：</i>
                                                <span className="fl clear financial-details-middle-support-item"
                                                      ref="type">
                                                {list}
                                                </span>
                                            </p>
                                        </div>}
                                        <input ref="portfolio"
                                               style={!this.props.authenticated ? {margin: '35px 0 0 0'} : {}}
                                               className="financial-details-middle-input"
                                               onChange={this.onChangeValue.bind(this)} type="text"
                                               placeholder={`输入购买金额，最小${this.state.singleTradeMin === '' ? currenciesList[0].singleTradeMin : this.state.singleTradeMin} ${this.state.currency === '' ? currenciesList[0].currency : this.state.currency}，最大${this.state.singleTradeMax === '' ? currenciesList[0].singleTradeMax : this.state.singleTradeMax} ${this.state.currency === '' ? currenciesList[0].currency : this.state.currency}`}/>
                                        {!this.state.error ? <p className="financial-details-middle-buy-error"></p> :
                                            <p className="financial-details-middle-buy-error">{this.state.error}</p>}
                                        {parseInt(runningStatus) === 2 || this.state.leftTime <= 0 ?
                                            <button className="financial-details-middle-buy"
                                                    style={{
                                                        background: '#ccc',
                                                        boxShadow: 'none',
                                                        cursor: "no-drop"
                                                    }}>已封闭
                                            </button> :
                                            <button className="financial-details-middle-buy button-active-blue"
                                                    onClick={this.handleBuyCheck.bind(this)}>立即购买
                                            </button>}
                                        <div className="financial-details-middle-time clear">
                                            {parseInt(runningStatus) === 2 || this.state.leftTime <= 0 ?
                                                <div className="fl">
                                                    <span>封闭结束日期：</span><span>{moment(closedPeriodEndDate).format('YYYY-MM-DD HH:mm:ss')}</span>
                                                </div> : <div className="fl">
                                                    <span>结束购买倒计时：</span><span id="timer">0天0小时0分0秒</span>
                                                </div>}
                                            {parseInt(idtInsurance) === 1 ? <div className="fr">
                                                <Popover placement="top" content={(<div>
                                                    <p>每售出一份产品，平台和基金管理人将合计抵押相应比例的IDT，</p>
                                                    <p>用以保障用户权益，降低因不可抗力导致的损失。</p>
                                                </div>)} trigger="hover">
                                                    <p className="financial-details-middle-plan-box"><img
                                                        src={safeguard}
                                                        alt=""/><span>IDT权益保障计划</span>
                                                    </p>
                                                </Popover>
                                            </div> : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="financial-details-middle-share fl">
                                    <div className="financial-details-middle-share-center">
                                        <span className="show">{this.props.authenticated ? (activityCodes.length == 0 || activityCodes.length == null ? "" : "分享即送6.66 USDT") : "登录后可查看奖励金二维码"}</span>
                                        {this.props.authenticated ? (activityCodes.length == 0 || activityCodes.length == null ? <div style={{width:' 127px', height:'127px', margin: '0 auto'}}>
                                            <img src="/public/img/service_wechat.jpg" alt=""/>
                                        </div> : <QrCode size={127}
                                                value={`${ROOT_SHARE}/financial/share?coin=${this.currenciesList(currenciesList)}&uid=${userUid}&code=${activityCodes[0]}`}/>) : <div style={{width:' 127px', height:'127px', margin: '0 auto', fontSize:"14px"}}>
                                            每邀请一位好友成功购买理财产品，邀请人可获得6.66USDT现金券，被邀请人可获得6.66USDT满减券，多邀多得。
                                        </div>}
                                        {this.props.authenticated ? (activityCodes.length == 0 || activityCodes.length == null ? <span className="show" style={{lineHeight:' 48px', textDecoration: 'none', color: '#313131'}}>微信咨询</span> : <Popover placement="top" content={(<div style={{width: '200px'}}>
                                            <p>1.每邀请一位好友成功购买理财产品，邀请人可获得6.66USDT现金券，被邀请人可获得6.66USDT满减券。多邀多得，奖励实时发放。</p>
                                            <p>2.若邀请人邀请多位好友成功购买产品，现金券可多次领取，上不封顶。</p>
                                            <p>3.若同一被邀请人购买产品，对应的现金券只可领取1次，不可叠加。</p>
                                            <p>4.满减券只可领取1次，不可叠加。</p>
                                        </div>)} trigger="hover">
                                            <span className="show" style={{lineHeight:' 48px'}}>奖励金说明</span>
                                        </Popover>) : <Popover placement="top" content={(<div style={{width: '200px'}}>
                                            <p>1.每邀请一位好友成功购买理财产品，邀请人可获得6.66USDT现金券，被邀请人可获得6.66USDT满减券。多邀多得，奖励实时发放。</p>
                                            <p>2.若邀请人邀请多位好友成功购买产品，现金券可多次领取，上不封顶。</p>
                                            <p>3.若同一被邀请人购买产品，对应的现金券只可领取1次，不可叠加。</p>
                                            <p>4.满减券只可领取1次，不可叠加。</p>
                                        </div>)} trigger="hover">
                                            <span className="show" style={{lineHeight:' 48px'}}>奖励金说明</span>
                                        </Popover>}
                                    </div>
                                </div>
                            </div> : <div className="financial-details-middle-other clear">
                                <div className="financial-details-middle-letter-other fl">
                                    <p>
                                        <b className="show">买入说明：</b>
                                        <span className="show">{buyingDesc}</span>
                                        {/*<Popover placement="topLeft" content={content} trigger="hover">*/}
                                        {/*<i className="show financial-item-color" style={{*/}
                                        {/*cursor: 'pointer',*/}
                                        {/*textDecoration: 'underline'*/}
                                        {/*}}>什么是USDT？</i>*/}
                                        {/*</Popover>*/}
                                    </p>
                                    <p>
                                        <b className="show">持仓说明：</b>
                                        <span className="show">{holdingDesc}</span>
                                    </p>
                                    <p>
                                        <b className="show">赎回说明：</b>
                                        <span className="show">{redemptionDesc}</span>
                                    </p>
                                </div>
                                <div className="financial-details-middle-plan-other fl">
                                    <div className="financial-details-middle-plan-wrap-other">
                                        <Popover placement="top" content={(<div>
                                            <p>每售出一份产品，平台和基金管理人将合计抵押相应比例的IDT，</p>
                                            <p>用以保障用户权益，降低因不可抗力导致的损失。</p>
                                        </div>)} trigger="hover">
                                            <p><img src={safeguard} alt=""/><span>IDT权益保障计划</span></p>
                                        </Popover>
                                        <p>
                                            <span>总额：等值</span>
                                            <span className="financial-item-color">{totalAmount}</span>
                                            <span>USDT，售完即止</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="financial-details-middle-chat-other fl">
                                    <div className="financial-details-middle-chat-wrap-other">
                                        <div className="clear" style={{padding: '0 20px'}}>
                                            <img src={customerService} alt="" className="fl"/>
                                            <p className="fl">
                                                <span className="show">在线咨询</span>
                                                <span className="show financial-details-middle-chat-way">
                                                <a target="_blank"
                                                   href='http://wpa.qq.com/msgrd?v=3&uin=2439480365&site=qq&menu=yes'>
                                                    <i className="fa fa-qq fa-fw" aria-hidden="true"></i>
                                                </a>
                                                <Popover placement="bottom" content={content_1} trigger="hover">
                                                    <a href="javascript:;">
                                                        <i className="fa fa-wechat fa-fw" aria-hidden="true"></i>
                                                    </a>
                                                </Popover>
                                                <a target="_blank" href="https://t.me/InvestDigitalOfficial">
                                                    <i className="fa fa-telegram fa-fw" aria-hidden="true"></i>
                                                </a>
                                            </span>
                                            </p>
                                        </div>
                                        <div className="financial-details-middle-chat-button">
                                            <a target="_blank"
                                               href='http://wpa.qq.com/msgrd?v=3&uin=2439480365&site=qq&menu=yes'
                                               className="button-active-blue">购买产品请联系客服</a>
                                        </div>
                                        <div className="g-pt-40">
                                            <a style={{color: "#167aff", fontSize: '18px'}} target="_blank"
                                               href="http://cn.mikecrm.com/T0xxkXR">
                                                <img className="g-pr-10" style={{verticalAlign: 'middle'}}
                                                     src={purchase} alt=""/>
                                                填表预约申购</a>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        <div className="financial-details-bottom">
                            <div className="financial-details-bottom-list col-sm-12 col-lg-6">
                                <b className="show">核心指标</b>
                                <div className="financial-details-common-line"></div>
                                <div className="financial-details-bottom-info-list clear">
                                    <div className="fl">
                                        <div className={fixedAnnualProfit == null ? "hide" : "show"}>固定年化收益</div>
                                        <div className={minAnnualProfit == null ? "hide" : "show"}>保底年化收益</div>
                                        <div className={annualProfit == null ? "hide" : "show"}>预期年化收益</div>
                                        <div className={!currenciesList ? "hide" : "show"}>申购币种</div>
                                        <div className={lastYearProfit == null ? "hide" : "show"}>2017年年化收益</div>
                                        <div className={maxDrawdown == null ? "hide" : "show"}>最大回撤控制</div>
                                        <div className={managmentPeriod == null ? "hide" : "show"}>产品管理周期</div>
                                        <div className={checkoutPeroid == null ? "hide" : "show"}>计息核算周期</div>
                                        <div className={redemptionPeriod == null ? "hide" : "show"}>赎回时间</div>
                                        <div className={depositFee == null ? "hide" : "show"}>充币手续费</div>
                                        <div className={applyFee == null ? "hide" : "show"}>申购费率</div>
                                        <div className={redemptionFee == null ? "hide" : "show"}>赎回费率</div>
                                        <div className={managementFee == null ? "hide" : "show"}>管理费率</div>
                                        <div className={remark == null ? "hide" : "show"}>备注</div>
                                        <div
                                            className={remarkVOList == null ? "hide" : "show"}>{remarkVOList == null ? "" : remarkVOList.name}</div>
                                    </div>
                                    <div className="fl">
                                        <div
                                            className={fixedAnnualProfit == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{`${fixedAnnualProfit}%`}</div>
                                        <div
                                            className={minAnnualProfit == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{`${minAnnualProfit}%`}</div>
                                        <div
                                            className={annualProfit == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{`${annualProfit}%`}</div>
                                        {currenciesList.length > 2 ?
                                            <Popover placement="top" content={this.currenciesList(currenciesList)}
                                                     trigger="hover">
                                                <div
                                                    className={!currenciesList ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{this.currenciesList(currenciesList)}</div>
                                            </Popover> : <div
                                                className={!currenciesList ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{this.currenciesList(currenciesList)}</div>}
                                        <div
                                            className={lastYearProfit == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{`${lastYearProfit}%`}</div>
                                        <Popover placement="top" content={maxDrawdown} trigger="hover">
                                            <div
                                                className={maxDrawdown == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{`${maxDrawdown}%`}</div>
                                        </Popover>
                                        <Popover placement="top" content={managmentPeriod} trigger="hover">
                                            <div
                                                className={managmentPeriod == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{managmentPeriod}</div>
                                        </Popover>
                                        <Popover placement="top" content={checkoutPeroid} trigger="hover">
                                            <div
                                                className={checkoutPeroid == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{checkoutPeroid}</div>
                                        </Popover>
                                        <Popover placement="top" content={redemptionPeriod} trigger="hover">
                                            <div
                                                className={redemptionPeriod == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{redemptionPeriod}</div>
                                        </Popover>
                                        <Popover placement="top" content={depositFee} trigger="hover">
                                            <div
                                                className={depositFee == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{depositFee}</div>
                                        </Popover>
                                        <Popover placement="top" content={applyFee} trigger="hover">
                                            <div
                                                className={applyFee == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{applyFee}</div>
                                        </Popover>
                                        <Popover placement="top" content={redemptionFee} trigger="hover">
                                            <div
                                                className={redemptionFee == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{redemptionFee}</div>
                                        </Popover>
                                        <Popover placement="top" content={managementFee} trigger="hover">
                                            <div
                                                className={managementFee == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{managementFee}</div>
                                        </Popover>
                                        <Popover placement="top" content={remark} trigger="hover">
                                            <div
                                                className={remark == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{remark}</div>
                                        </Popover>
                                        <Popover placement="top"
                                                 content={remarkVOList == null ? "" : remarkVOList.value}
                                                 trigger="hover">
                                            <div
                                                className={remarkVOList == null ? "hide financial-details-currency-list" : "show financial-details-currency-list"}>{remarkVOList == null ? "" : remarkVOList.value}</div>
                                        </Popover>
                                    </div>
                                </div>
                                <b className={!productionDesc ? "hide" : "show"}
                                   style={{marginTop: '60px'}}>产品介绍</b>
                                <div
                                    className={!productionDesc ? "hide financial-details-common-line" : "show financial-details-common-line"}></div>
                                <p style={{marginTop: '20px'}} className={!productionDesc ? "hide" : "show"}
                                   dangerouslySetInnerHTML={{__html: productionDesc}}>
                                </p>
                                <b className="show" style={{marginTop: '40px'}}>与主流交易所深度合作</b>
                                <div className="financial-details-common-line"></div>
                                <img src={cooperation} alt=""/>
                            </div>
                            <div className="financial-details-bottom-introduce col-sm-12 col-lg-6">
                                <b className={!productionAdvatage ? "hide" : "show"}>产品优势</b>
                                <p style={{marginTop: '20px'}} className={!productionAdvatage ? "hide" : "show"}
                                   dangerouslySetInnerHTML={{__html: productionAdvatage}}>
                                </p>
                                <b style={!productionAdvatage ? {} : {marginTop: '55px'}}
                                   className={!earningsDesc ? "hide" : "show"}>收益说明</b>
                                <p style={{marginTop: '20px'}} dangerouslySetInnerHTML={{__html: earningsDesc}}>
                                </p>
                                <b style={!earningsDesc ? {} : {marginTop: '55px'}}
                                   className={!platformDesc ? "hide" : "show"}>平台介绍</b>
                                <p style={{marginTop: '20px'}} dangerouslySetInnerHTML={{__html: platformDesc}}>
                                </p>
                                <b style={{marginTop: '55px'}} className={!teamDesc ? "hide" : "show"}>管理团队介绍</b>
                                <p style={{marginTop: '20px'}} dangerouslySetInnerHTML={{__html: teamDesc}}>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/*是否确认购买弹窗*/}
                <Modal
                    // visible={true}
                    visible={this.state.visible}
                    title={null}
                    onCancel={this.handleCancel.bind(this, 1)}
                    maskStyle={{background: 'rgba(255, 255, 255, .9)'}}
                    width={480}
                    footer={[
                        <div key="back1" className="clearfix">
                            <div key="back" className="text-center modal-btn-cancel g-ml-20 g-my-10"
                                 style={{width: "70px", float: "right"}} onClick={this.handleCancel.bind(this, 1)}>取消
                            </div>
                            <div key="submit" className="button-active-blue text-center modal-btn-color g-my-10"
                                 style={{width: "70px", float: "right"}} type="primary"
                                 onClick={this.handleBuy.bind(this)}>确定
                            </div>
                        </div>

                    ]}
                    >
                    <div className="pop-box g-pt-50 g-pb-50">
                        {parseInt(currenciesList[0].currencyId) === 22 ? <p className="clear">
                            <span className="fl">投资金额为：</span>
                            <span className="color1 fl">{this.state.value}</span>
                            <span
                                className="fl">{`${this.state.currency === '' ? currenciesList[0].currency : this.state.currency}`}</span>
                            <span className={this.state.couponCode == "" ? "fl hide" : "fl show"} style={{lineHeight:"30px"}}>
                                <span> - </span>
                                <span style={{color: "#167aff", fontWeight: "400"}}>{`${this.state.discountedAmount}`}</span>
                                <span>{`${this.state.currency === '' ? currenciesList[0].currency : this.state.currency}`}</span>
                            </span>
                            <span className={parseInt(currenciesList[0].currencyId) === 22 ? "fl show clear" : (parseInt(this.state.currencyId) === 22 ? "fl show clear" : "fl hide clear")} style={{margin: '0 10px'}}>
                                <span className="show fl" style={{position: 'relative', width: '50px'}}>
                                    <span style={{
                                        width: '40px',
                                        height: '1px',
                                        backgroundColor: '#666',
                                        position: 'absolute',
                                        top: '15px'
                                    }}></span>
                                    <span style={{position: 'absolute', top: '0px', left: '30px'}}>丶</span>
                                    <span style={{
                                        position: 'absolute',
                                        fontSize: '12px',
                                        top: '-6px',
                                        left: '8px'
                                    }}>闪兑</span>
                                </span>
                                <span className="fl" style={{marginLeft: '50px'}}>
                                    <span className="color1">{initNumber(NA.times(this.state.value, this.props.financialDetailETH.data), 6)}</span>
                                    <span>ETH</span>
                                </span>
                            </span>
                        </p> : (parseInt(this.state.currencyId) === 22 ? <p className="clear">
                            <span className="fl">投资金额为：</span>
                            <span className="color1 fl">{this.state.value}</span>
                            <span
                                className="fl">{`${this.state.currency === '' ? currenciesList[0].currency : this.state.currency}`}</span>
                            <span className={this.state.couponCode == "" ? "fl hide" : "fl show"} style={{lineHeight:"30px"}}>
                                <span> - </span>
                                <span style={{color: "#167aff", fontWeight: "400"}}>{`${this.state.discountedAmount}`}</span>
                                <span>{`${this.state.currency === '' ? currenciesList[0].currency : this.state.currency}`}</span>
                            </span>
                            <span className={parseInt(currenciesList[0].currencyId) === 22 ? "fl show clear" : (parseInt(this.state.currencyId) === 22 ? "fl show clear" : "fl hide clear")} style={{margin: '0 10px'}}>
                                <span className="show fl" style={{position: 'relative', width: '50px'}}>
                                    <span style={{
                                        width: '40px',
                                        height: '1px',
                                        backgroundColor: '#666',
                                        position: 'absolute',
                                        top: '15px'
                                    }}></span>
                                    <span style={{position: 'absolute', top: '0px', left: '30px'}}>丶</span>
                                    <span style={{
                                        position: 'absolute',
                                        fontSize: '12px',
                                        top: '-6px',
                                        left: '8px'
                                    }}>闪兑</span>
                                </span>
                                <span className="fl" style={{marginLeft: '50px'}}>
                                    <span className="color1">{initNumber(NA.times(this.state.value, this.props.financialDetailETH.data), 6)}</span>
                                    <span>ETH</span>
                                </span>
                            </span>
                        </p> : <p className="clear" style={{marginTop:'10px'}}>
                            <span className="fl">投资金额为 </span>
                            <span className="color1 fl">{this.state.value}</span>
                            <span className="fl">{`${this.state.currency === '' ? currenciesList[0].currency : this.state.currency}`}</span>
                            <span className={this.state.couponCode == "" ? "fl hide" : "fl show"} style={{lineHeight:"30px"}}>
                                <span> - </span>
                                <span style={{color: "#167aff", fontWeight: "400"}}>{`${this.state.discountedAmount}`}</span>
                                <span>{`${this.state.currency === '' ? currenciesList[0].currency : this.state.currency}`}</span>
                            </span>
                        </p>)}
                        <p>
                            <span>您确定购买</span>
                            <span className="color2">{portfolioName}</span>
                            <span>投资组合产品</span>
                        </p>
                        <div className={parseInt(currenciesList[0].currencyId) === 22 ? "show g-pt-10 g-pb-10" : (parseInt(this.state.currencyId) === 22 ? "show g-pt-10 g-pb-10" : "hide g-pt-10 g-pb-10")}>
                            <Checkbox
                                checked={this.state.isAcceptInputChecked}
                                onChange={this.setAccept.bind(this)}
                            >
                                我已同意使用闪兑功能，一经兑换，不可逆转
                            </Checkbox>
                        </div>
                        <div className="buy-coupon-note">{fullReductionDtoList == null || fullReductionDtoList.length == 0 ? "您账户暂无优惠券可使用" : "您账户有优惠券可使用"}</div>
                        <div className={fullReductionDtoList == null || fullReductionDtoList.length == 0 ? "buy-coupon-main show" : "buy-coupon-main show"}>
                            <div className="buy-coupon-main-center clear" ref="coupon">
                                {this.state.couponFlag ? coupon_true : coupon_false}
                            </div>
                            {fullReductionDtoList.length > 3 ? <div className={fullReductionDtoList == null || fullReductionDtoList.length == 0 ? "buy-coupon-main-center-more hide" : "buy-coupon-main-center-more show"}>
                                <span onClick={() => {this.setState({couponFlag: false});}}>
                                    <span>展开更多</span>
                                    <Icon type="down" />
                                </span>
                            </div> : ""}
                        </div>
                        <div className={parseInt(currenciesList[0].currencyId) === 22 ? "show text-left" : (parseInt(this.state.currencyId) === 22 ? "show text-left" : "hide text-left")} style={{
                            margin: '20px auto 0',
                            padding: '10px',
                            backgroundColor: '#ffffcd',
                            fontSize: '12px'
                        }}>
                            <p style={{lineHeight: '20px'}}>
                                1、闪兑盯住火币Hadax价格，实际兑换比例以成交价格为准
                            </p>
                            <p style={{lineHeight: '20px'}}>
                                2、该操作不可逆，一经闪兑成ETH，无法重新兑换成原有币种
                            </p>
                            <p style={{lineHeight: '20px'}}>
                                3、闪兑后，用户权益转化为ETH，购买理财后，用户获得的本金和收益均为ETH
                            </p>
                        </div>
                    </div>
                </Modal>
                {/*提示充值弹窗*/}
                <Modal
                    visible={this.state.visible1}
                    title={null}
                    onCancel={this.handleCancel.bind(this, 2)}
                    maskStyle={{background: 'rgba(255, 255, 255, .9)'}}
                    width={480}
                    footer={[
                        <div className="text-center" key="footer1">
                            <div className="button-active-blue text-center modal-btn-color g-my-10"
                                 style={{width: "120px", margin: 'auto'}} onClick={this.checkAddress.bind(this)}>立即充值
                            </div>
                        </div>
                    ]}
                >
                    <div className="pop-box g-pt-100 g-pb-10 text-center">
                        <img style={{width: "90px", height: "90px", marginBottom: "40px"}}
                             src={recharge} alt=""/>
                        <p>您当前账户余额为{this.state.assets === '' ? currenciesList[0].availableAssets : this.state.assets}，请完成充币后再进行购买</p>
                    </div>
                </Modal>
                {/*提示激活地址弹窗*/}
                <Modal
                    visible={this.state.visible2}
                    title={null}
                    onCancel={this.handleCancel.bind(this, 3)}
                    maskStyle={{background: 'rgba(255, 255, 255, .9)'}}
                    width={480}
                    footer={[
                        <div className="text-center" key="footer2"
                             style={{display: 'flex', justifyContent: 'space-around'}}>
                            <div className="button-active-blue text-center modal-btn-color g-my-10"
                                 style={{width: "125px"}}
                                 onClick={this.checkAuth.bind(this)}>立即激活
                            </div>
                            <div className="text-center modal-btn-cancel g-my-10" style={{width: "125px"}}
                                 onClick={this.handleCancel.bind(this, 3)}>取消
                            </div>
                        </div>
                    ]}
                >
                    <div className="pop-box g-pt-100 g-pb-10 text-center">
                        <img style={{width: "90px", height: "90px", marginBottom: "40px"}} src={address}
                             alt=""/>
                        <p>您尚未激活充币地址，请先激活</p>
                    </div>
                </Modal>
                {/*提示实名认证弹窗*/}
                <Modal
                    visible={this.state.visible4}
                    title={null}
                    onCancel={this.handleCancel.bind(this, 4)}
                    maskStyle={{background: 'rgba(255, 255, 255, .9)'}}
                    width={480}
                    footer={[
                        <div className="text-center" key="footer4"
                             style={{display: 'flex', justifyContent: 'space-around'}}>
                            <div className="button-active-blue text-center modal-btn-color g-my-10"
                                 style={{width: "125px"}}
                                 onClick={() => {
                                     let init = {
                                         phoneNum: 0,
                                         emailNum: 0,
                                         authNum: 0,
                                         nameAuthNum: 4,
                                         openGa: 0,
                                         closeGa: 0,
                                         changeGa: 0,
                                         accountFlag: false
                                     };
                                     this.props.history.push('/user/account');
                                     localStorage.setItem("defaultActiveKey", accountValue);
                                     this.props.AccountHighStatus(init);
                                 }}>立即认证
                            </div>
                            <div className="text-center modal-btn-cancel g-my-10" style={{width: "125px"}}
                                 onClick={this.handleCancel.bind(this, 4)}>取消
                            </div>
                        </div>
                    ]}
                >
                    <div className="pop-box g-pt-100 g-pb-10 text-center">
                        <img style={{width: "90px", height: "90px", marginBottom: "40px"}} src={auth}
                             alt=""/>
                        <p>您尚未完成实名认证，请先通过认证</p>
                    </div>
                </Modal>
                <Footer/>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        portfolioBuy: bindActionCreators(portfolioBuy, dispatch),
        AccountHighStatus: bindActionCreators(AccountHighStatus, dispatch),
        checkMessage: bindActionCreators(checkMessage, dispatch),
        FinancialDetailsInfo: bindActionCreators(FinancialDetailsInfo, dispatch),
        FinancialDetailsCouponList: bindActionCreators(FinancialDetailsCouponList, dispatch),
        FinancialDetailETH: bindActionCreators(FinancialDetailETH, dispatch),
        GetUserUid: bindActionCreators(GetUserUid, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        authenticated: state.auth.authenticated,
        financialDetailsInfo: state.financial.financialDetailsInfo,
        getPortfolioLoading: state.financial.getPortfolioLoading,
        financialCouponList: state.financial.financialCouponList,
        financialDetailETH: state.financial.financialDetailETH,
        userUid: state.financial.userUid
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FinancialDetails));
