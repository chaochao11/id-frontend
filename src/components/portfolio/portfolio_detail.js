/**
 * Created by zhangxiaojing on 2018/05/23.
 */

import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Spin, Rate, Modal, Button, Checkbox, Popover, Progress} from 'antd';
import { Link, withRouter } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';
import Agreement from './agreement';
import { PortfolioChartsConfig} from './../../tools/chartsConfig';
// import {leftTimer, checkTime} from './../../tools/utils';
import PortfolioProperty from './portfolio_property';
import  Service from '../common/service';
import safeguard from './../../../public/img/safeguard.png';
import recharge from './../../../public/img/recharge.png';
import address from './../../../public/img/address.png';
import auth from './../../../public/img/auth.png';

import { fetchPortfolioListDetail, portfolioBuyList, portfolioBuy, fetchPortfolioBalance, checkMessage} from '../../actions/portfolio';
import { AccountHighStatus } from "./../../actions/account";
import {ROOT_AVATAR} from '../../actions/types';
import echarts from 'echarts/lib/echarts';    //必须
import'echarts/lib/component/tooltip';
import'echarts/lib/chart/line';
import { bindActionCreators } from 'redux';
import { accountValue } from "./../../tools/config";


class PortfolioDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            index:0,
            visible:false,
            visible1:false,
            visible2:false,
            visible4:false,
            visible5:false,
            checked:true,
            error:'',
            value:0,
            days:0,
            hours:0,
            minutes:0,
            seconds:0,
            timer1:null,
            flag:true,
            leftTime:1
        };
    }
    componentDidMount(){
        const self=this;
        let portfolioCode = this.props.match.params.portfolioCode;
        this.props.fetchPortfolioListDetail({portfolioCode}, (response)=>{
            const endTime = response.portfolio.closedDate;
            if(endTime){
                let startTime = new Date();
                let leftTime = endTime-startTime; //计算剩余的毫秒数
                if(leftTime>0){
                    this.state.timer1 = setInterval(function(){
                        startTime = new Date();
                        let leftTime = endTime-startTime; //计算剩余的毫秒数
                        self.setState({leftTime:leftTime});
                        let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
                        let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
                        let minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
                        let seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
                        days = self.checkTime(days);
                        hours = self.checkTime(hours);
                        minutes = self.checkTime(minutes);
                        seconds = self.checkTime(seconds);
                        // console.log(days, hours, minutes, seconds);
                        document.getElementById("timer").innerHTML = days+"天" + hours+"小时" + minutes+"分"+seconds+"秒";
                        if(leftTime<0){
                            clearInterval(self.state.timer1);
                            document.getElementById("timer").innerHTML = "0天0小时0分0秒";
                        }
                    }, 1000);
                }
            }
        }
        );
        if(this.props.authenticated){
            this.props.fetchPortfolioBalance();
        }
        this.props.portfolioBuyList({portfolioCode});

    }
    checkTime=(i)=> { //将0-9的数字前面加上0，例1变为01
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };
    componentDidUpdate() {
        const portfolio = this.props.portfolio||[];
        const {info} = portfolio;
        const grid={left:"5%", top:"10%", right:"10%", bottom:"10%"};
        const type=1;
        const portfolioChart3= echarts.init(document.getElementById('chart-detail'));
        portfolioChart3.setOption(PortfolioChartsConfig(info, grid, type));
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
    showModal5 = () => {
        this.setState({
            visible5: true,
        });
    };
    handleCancel = () => {
        this.setState({ visible: false, visible1: false, visible2:false, visible4:false, visible5:false});
    };
    onChange(e) {
        if(e.target.checked){
            this.setState({
                error:'',
            });
        }
        this.setState({
            checked:e.target.checked,
        });
    }
    onChangeValue=(event)=>{
        this.setState({error:"", value:event.target.value});
    };
    handleBuyCheck=()=>{
        const {USDT}=this.props.balance||[];
        const { portfolio, alreadySell} = this.props.portfolio||[];
        let amount=this.refs.portfolio.value;
        if(this.props.authenticated){
            if(USDT >= 200){
                if(amount){
                    if (amount>=200 && amount<=200000) {
                        if(USDT >= amount){
                            if(amount <= (portfolio.totalRaiseAmount-alreadySell)){
                                if(this.state.checked){
                                    this.setState({value:amount}, ()=>{
                                        this.showModal();
                                    });
                                }else{
                                    this.setState({error:"请勾选同意《申购协议》"});
                                }
                            }else{
                                this.setState({error:"购买金额超过可购买余额"});
                            }
                        }else{
                            this.showModal1();
                        }

                    }else{
                        this.setState({error:"输入金额不足200或超过最大值20万，请重新输入"});
                    }
                }else{
                    this.setState({error:"输入金额不正确，请重新输入"});

                }
            }else{
                this.showModal1();
            }
        }else{
            this.props.history.push("/user/signin");
        }
    };
    handleBuy=()=>{
        const { portfolio} = this.props.portfolio||[];
        let portfolioCode = this.props.match.params.portfolioCode;
        let userId=localStorage.getItem('userId');
        let amount=this.refs.portfolio.value;
        if(this.state.flag){
            this.setState({
                flag:false,
            });
            this.props.portfolioBuy({portfolioCode, userId, amount}, (response)=>{
                this.setState({
                    flag:true,
                    visible: false,
                });
                if(response.status === 1){
                    this.props.history.push({
                        pathname:'/portfolio/success',
                        state:{
                            purchasedAmount:response.data.purchasedAmount,
                            productName:response.data.productName,
                            closedDateStart:response.data.closedDateStart,
                            closedDateEnd:response.data.closedDateEnd,
                            predictedProfit:response.data.predictedProfit,
                            productType:response.data.productType,
                            currencyType:response.data.currencyType,
                            profitCurrencyType:response.data.profitCurrencyType
                        }
                    });
                }
                else if(response.status === 3){
                    //实名认证
                    this.showModal4();
                }
                else if(response.status === 2){
                    //激活地址
                    this.showModal2();
                }
                else if(response.status === 4){
                    //购买错误
                    this.setState({error:response.message});
                }
                else{
                    this.setState({error:response.message});
                }
            });
        }

    };
    checkAddress=()=>{
        let userId=localStorage.getItem('userId');
        this.props.checkMessage({userId}, (response)=>{
            if(response.ADDRESS === -1){
                //未激活地址
                this.showModal2();
            }else{
                localStorage.setItem("defaultActiveKey", 1);
                this.props.history.push('/user/account');
            }
        });
    };
    checkAuth=()=>{
        let userId=localStorage.getItem('userId');
        this.props.checkMessage({userId}, (response)=>{
            if(response.QIC === -1){
                //如果未认证
                this.showModal4();
            }else{
                localStorage.setItem("defaultActiveKey", 1);
                this.props.history.push('/user/account');
            }

        });
    };
    allBalance(){
        const {USDT}=this.props.balance||[];
        const { portfolio, alreadySell} = this.props.portfolio||[];
        if(USDT<=portfolio.totalRaiseAmount-alreadySell){
            this.refs.portfolio.value = USDT;
        }else{
            let all=portfolio.totalRaiseAmount-alreadySell;
            this.refs.portfolio.value = all;
        }
    }
    renderTags(){
        return this.props.portfolio.tags.map((items, index)=>{
            return(
                <li key={index}>{items.description}</li>
            );
        });
    }
    componentWillUnmount(){
        clearInterval(this.state.timer1);
    }
    render() {
        if(!this.props.portfolio){
            return (
                <div className="text-center h3 col-sm-12 g-pt-120 g-pb-30" >
                    <Spin tip="玩命加载中..." />
                </div>
            );
        }
        const { portfolio, restDays, portfolioReturn, alreadySellRatio, redemptionDateStr, reportList, portfolioDetail} = this.props.portfolio||[];
        const authenticated =this.props.authenticated;
        const {USDT}=this.props.balance||[];
        const {count}=this.props.portfolio_buy_list||[];
        const { visible, loading, visible1, visible2, visible4, visible5, error, checked, value, days, hours, minutes, seconds} = this.state;
        const content1 = (
            <div>
                <p>USDT是Tether公司推出的基于稳定价值货币美元的代币</p>
            </div>
        );
        const content2 = (
            <div>
                <p>{portfolio.portfolioName}是InvestDigital原创首推的数字资产投资组合产品，</p>
                <p>该组合中包含了多种市值靠前币种以及少量潜力币，</p>
                <p>并按照币种历史表现配置比例，有效保护资金获得稳定收益。</p>
            </div>
        );
        const content3 = (
            <div>
                <p>每售出一份产品，平台和基金管理人将合计抵押相应比例的IDT</p>
                <p>用以保障用户权益，降低因不可抗力导致的损失。</p>
            </div>
        );
        return (
            <div className="portfolio-detail">
                <Header/>
                <div className="container g-mt-60">
                    <div className="row">
                        <div className="col-xs-12 portfolio-detail-top g-pt-45">
                            <div className="col-xs-12 portfolio-detail-top box">
                                <div className="title">
                                    <div className="clearfix">
                                        <div className="portfolio-name g-pb-10" style={{"float":"left", marginRight: '70px'}}>{portfolio.portfolioName ? portfolio.portfolioName : '--'}</div>
                                        <ul className="portfolio-detail-tags">
                                            {this.renderTags()}
                                        </ul>
                                        <ul className="portfolio-detail-value g-pb-10">
                                            <li>
                                                <div>最新净值</div>
                                                <div><span className="up" style={{fontSize:"18px"}}>{portfolioReturn.netValue|| portfolioReturn.netValue===0 ? portfolioReturn.netValue : "--"}</span>{portfolio.currencyType===1 ? 'USDT' : 'IDT'}</div>
                                            </li>
                                            <li>
                                                <div>单日涨幅</div>
                                                <div><span style={{fontSize:"18px"}} className={portfolioReturn.netValueSwing > 0 ? "up": "down"}>{portfolioReturn.netValueSwing > 0 ? '+' : ""}{portfolioReturn.netValueSwing || portfolioReturn.netValueSwing===0 ? portfolioReturn.netValueSwing :'--'}%</span></div>
                                            </li>
                                            <li>
                                                <div>
                                                    历史最高涨幅
                                                </div>
                                                <div>
                                                    <span style={{fontSize:"18px"}} className={portfolioReturn.historicalMaxNetValue > 0 ? "up": "down"}>{portfolioReturn.historicalMaxNetValue > 0 ? '+' : ""}{portfolioReturn.historicalMaxNetValue|| portfolioReturn.historicalMaxNetValue===0 ? portfolioReturn.historicalMaxNetValue : "--"}%</span>
                                                </div>
                                            </li>
                                        </ul>
                                        <Popover content={content2} >
                                            <div className="portfolio-detail-qustion g-py-10">什么是IDT投资组合？</div>
                                        </Popover>

                                    </div>
                                    <div style={{fontSize:"14px"}}>抗风险指数：<Rate allowHalf disabled defaultValue={portfolio.riskIndex}/></div>
                                </div>
                                <div className="chart-detail" id="chart-detail"></div>
                            </div>
                        </div>
                        <div className="col-md-8 col-xs-12 portfolio-detail-buy ">
                            <div className="col-xs-12 portfolio-detail-top box">
                                <div className="portfolio-name line">买入 <Link className="portfolio-main-color" target="_blank" style={{ textDecoration:'underline', fontSize:"13px", fontWeight:"400"}} to='/user/account/buy'>如何购买？</Link></div>
                                <div className="col-md-4 col-xs-12 left">
                                    <ul>
                                        <li>
                                            <div className="title">买入说明：</div>
                                            <div className="des">{portfolioDetail.buyingDesc} <Popover content={content1} >
                                                <span className="portfolio-main-color" style={{ textDecoration:'underline'}}>什么是USDT？</span>
                                            </Popover>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="title">持仓说明：</div>
                                            <div className="des">{portfolioDetail.holdingDesc}</div>
                                        </li>
                                        <li style={{marginBottom:"10px"}}>
                                            <div className="title">赎回说明：</div>
                                            <div className="des">{portfolioDetail.redemptionDesc}</div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-8 col-xs-12 right">
                                    <div className="content">
                                        <div className="input-box" style={{position:"relative"}}>
                                            <div>
                                                <div className="col-sm-6 col-xs-12 text-left" style={{padding:0, fontSize:"14px"}}>
                                                    <span>可用余额：</span>
                                                    <span className="portfolio-main-color">{ USDT || USDT===0 ? USDT :'--'}</span> <span>USDT</span>
                                                </div>

                                                <div className="col-sm-6 col-xs-12 text-left-xs" style={{fontSize:"14px", padding:0}}>
                                                    <span>购入价：</span>
                                                    <span style={{fontSize:"14px", padding:0}}>{portfolio.unit ? portfolio.unit :'--'}</span><span style={{fontSize:"14px", padding:0}}>{portfolio.currencyType===1 ? 'USDT' : 'IDT'}/份</span>
                                                </div>
                                                <div className="clearfix" style={{borderBottom:"1px dashed #dcdcdc"}}>
                                                    <div className="col-sm-7 col-xs-12" style={{padding:'30px 0 10px 0', fontSize:"14px"}}>
                                                        <div>
                                                            <div className="progress">
                                                                <div className="progress-bar progress-bar-info active" style={{width:`${alreadySellRatio|| alreadySellRatio === 0? alreadySellRatio :0}%` }}>
                                                                    <div className="progress-value">{alreadySellRatio|| alreadySellRatio === 0 ? alreadySellRatio : 0}%</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-5 col-xs-12 text-left-xs" style={{padding:'23px 0 10px 0', fontSize:"14px"}}>
                                                        总额： {portfolio.totalRaiseAmount ? portfolio.totalRaiseAmount : '--'} {portfolio.currencyType===1 ? 'USDT' : 'IDT'}
                                                    </div>
                                                </div>
                                            </div>
                                            {portfolio.runningStatus === 2 || this.state.leftTime<=0 || portfolio.runningStatus === 4 || portfolio.runningStatus === 0? '' :
                                                <div style={{position:"relative"}}>
                                                    <input ref="portfolio"  onChange={this.onChangeValue} type="text" placeholder="输入购买金额，最小200 USDT，最大20万 USDT"/>
                                                    <span className="input-all" onClick={this.allBalance.bind(this)}>全部</span>
                                                    <span className="buy-error">{error}</span>
                                                </div>
                                            }
                                        </div>
                                        {
                                            portfolio.runningStatus ===1 ?  <button className="button-active-blue" id="buy" onClick={this.handleBuyCheck}>立即购买</button> :
                                                <button className="button-disable g-mt-40 g-mb-20">
                                                {portfolio.runningStatus ===0 ? "预告中" : (portfolio.runningStatus ===2 ? "已封闭" : (portfolio.runningStatus ===3  ?  '清算中' : '已清算') )}
                                                </button>
                                        }
                                        {/*{portfolio.runningStatus === 2 || this.state.leftTime<=0 ?*/}
                                            {/*<button className="button-disable g-mt-40 g-mb-20">已封闭</button> :*/}
                                            {/*<button className="button-active-blue" id="buy" onClick={this.handleBuyCheck}>立即购买</button>*/}
                                        {/*}*/}
                                        {authenticated ?
                                            (<div className="text-center g-py-10">
                                                {portfolio.runningStatus === 2 || this.state.leftTime<=0 ? "" :<div> <Checkbox checked={checked} onChange={this.onChange.bind(this)}></Checkbox> <span style={{color:"#dbdbdb", fontSize:"12px"}}>我已阅读并同意</span><span className="portfolio-main-color" style={{cursor:"pointer", fontSize:"12px"}} onClick={this.showModal5}>《申购协议》</span></div>}
                                                </div>) :
                                            <div className="text-center g-py-10" style={{color:"#3e3e3e"}}>请<Link className="portfolio-main-color" to='/user/signin' >登录</Link> 或<Link className="portfolio-main-color" to="/user/signup">注册</Link></div>
                                        }
                                    </div>
                                    <div className="bottom clearfix">
                                        {portfolio.runningStatus === 4 ? '' :
                                            (portfolio.runningStatus === 2|| this.state.leftTime<=0 ? <div>
                                                <div className="count-down">封闭结束日期：<span>{redemptionDateStr? redemptionDateStr:'--'}</span></div>
                                                <div className="blackout-period">剩余：{restDays>0 ? restDays : '--'}天</div>
                                            </div> : <div>
                                                <div className="count-down">结束购买倒计时：<span id="timer">{days}天{hours}小时{minutes}分{seconds}秒</span></div>
                                                <div className="blackout-period">封闭期限：{ portfolio.closedPeriod ? portfolio.closedPeriod :'--'}+1月</div>
                                            </div>)
                                        }
                                    </div>
                                    <div className="text-center">
                                        {portfolio.idtEnsurance ===1 ?
                                            <Popover content={content3} >
                                                <div className="safeguard"><img style={{width:"25px", verticalAlign:'middle', paddingBottom: '3px', paddingRight:"5px"}} src={safeguard} alt=""/> IDT权益保障计划</div>
                                            </Popover>
                                            :''
                                        }
                                    </div>
                                    {/*是否确认购买弹窗*/}
                                    <Modal
                                        visible={visible}
                                        title={null}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                        maskStyle={{background:'rgba(255, 255, 255, .9)'}}
                                        width={480}
                                        footer={[
                                            <div key="back1" className="clearfix">
                                                <div key="back" className="text-center modal-btn-cancel g-ml-20 g-my-10" style={{width:"70px", float:"right"}} onClick={this.handleCancel}>取消</div>
                                                <div key="submit"  className="button-active-blue text-center modal-btn-color g-my-10" style={{width:"70px", float:"right"}} type="primary"  onClick={this.handleBuy}>确定</div>
                                            </div>

                                        ]}
                                        dleCan       >
                                        <div className="pop-box g-pt-100 g-pb-50 text-center">
                                            <p>是否确定金额为 <span className="color1">{value}</span> USDT，购买 <span className="color2">{portfolio.portfolioName}</span> 投资组合产品</p>
                                        </div>
                                    </Modal>
                                    {/*提示充值弹窗*/}
                                    <Modal
                                        visible={visible1}
                                        title={null}
                                        onOk={this.handleOk1}
                                        onCancel={this.handleCancel}
                                        maskStyle={{background:'rgba(255, 255, 255, .9)'}}
                                        width={480}
                                        footer={[
                                            <div className="text-center" key="footer1">
                                                <div className="button-active-blue text-center modal-btn-color g-my-10" style={{width:"120px", margin:'auto'}} onClick={this.checkAddress}>立即充值</div>
                                            </div>
                                        ]}
                                    >
                                        <div className="pop-box g-pt-100 g-pb-10 text-center">
                                            <img style={{width:"90px", height:"90px", marginBottom:"40px"}} src={recharge} alt=""/>
                                            <p>您当前账户余额为{USDT}，请完成充币后再进行购买</p>
                                        </div>
                                    </Modal>
                                    {/*提示激活地址弹窗*/}
                                    <Modal
                                        visible={visible2}
                                        title={null}
                                        onOk={this.handleOk2}
                                        onCancel={this.handleCancel}
                                        maskStyle={{background:'rgba(255, 255, 255, .9)'}}
                                        width={480}
                                        footer={[
                                            <div className="text-center" key="footer2" style={{display:'flex', justifyContent: 'space-around'}}>
                                                <div className="button-active-blue text-center modal-btn-color g-my-10" style={{width:"125px"}} onClick={this.checkAuth}>立即激活</div>
                                                <div className="text-center modal-btn-cancel g-my-10" style={{width:"125px"}} onClick={this.handleCancel}>取消</div>
                                            </div>
                                        ]}
                                    >
                                        <div className="pop-box g-pt-100 g-pb-10 text-center">
                                            <img style={{width:"90px", height:"90px", marginBottom:"40px"}} src={address} alt=""/>
                                            <p>您尚未激活充币地址，请先激活</p>
                                        </div>
                                    </Modal>
                                    {/*提示实名认证弹窗*/}
                                    <Modal
                                        visible={visible4}
                                        title={null}
                                        onOk={this.handleOk4}
                                        onCancel={this.handleCancel}
                                        maskStyle={{background:'rgba(255, 255, 255, .9)'}}
                                        width={480}
                                        footer={[
                                            <div className="text-center" key="footer4" style={{display:'flex', justifyContent: 'space-around'}}>
                                                <div className="button-active-blue text-center modal-btn-color g-my-10" style={{width:"125px"}} onClick={()=>{
                                                    let init = {
                                                        phoneNum:0,
                                                        emailNum:0,
                                                        authNum:0,
                                                        nameAuthNum:4,
                                                        openGa:0,
                                                        closeGa:0,
                                                        changeGa:0,
                                                        accountFlag:false
                                                    };
                                                    this.props.history.push('/user/account');
                                                    localStorage.setItem("defaultActiveKey", accountValue);
                                                    this.props.AccountHighStatus(init);
                                                }}>立即认证</div>
                                                <div className="text-center modal-btn-cancel g-my-10" style={{width:"125px"}} onClick={this.handleCancel}>取消</div>
                                            </div>
                                        ]}
                                    >
                                        <div className="pop-box g-pt-100 g-pb-10 text-center">
                                            <img style={{width:"90px", height:"90px", marginBottom:"40px"}} src={auth} alt=""/>
                                            <p>您尚未完成实名认证，请先通过认证</p>
                                        </div>
                                    </Modal>
                                    {/*提示协议弹窗*/}
                                    <Modal
                                        visible={visible5}
                                        title={null}
                                        onCancel={this.handleCancel}
                                        maskStyle={{background:'rgba(255, 255, 255, .9)'}}
                                        width={1000}
                                        footer={[
                                            <div className="text-center" key="footer4">
                                                <div className="button-active-blue text-center modal-btn-color g-my-10" style={{width:"160px", margin:'auto'}} onClick={() =>{this.setState({checked:true, error:''});this.handleCancel();}}>我已阅读并同意</div>
                                            </div>
                                        ]}
                                    >
                                        <Agreement/>
                                    </Modal>
                                </div>
                            </div>
                            <div className="col-xs-12 visible-xs hidden-sm portfolio-detail-buy-number box">
                                <div>
                                    <span className="portfolio-name g-pr-20">已买入用户</span>
                                    <span className="portfolio-main-color" style={{fontSize:"18px"}}>{count||count===0 ? count :'--'}人</span>
                                </div>
                            </div>
                            <div className="col-xs-12" style={{padding:0}}>
                                <Service/>
                            </div>
                            <div className="col-xs-12 box">
                                <div className="instruction ">
                                    <div className="portfolio-name line">投资组合说明</div>
                                    <div dangerouslySetInnerHTML = {{ __html:portfolioDetail.botDesc }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-xs-12">
                            {this.props.authenticated ? <PortfolioProperty portfolioCode={this.props.match.params.portfolioCode}/> :''}
                            <div className="col-xs-12 hidden-xs visible-sm visible-md visible-lg  portfolio-detail-buy-number box">
                                <div>
                                    <span className="portfolio-name g-pr-20">已买入用户</span>
                                    <span className="portfolio-main-color" style={{fontSize:"18px"}}>{count||count===0 ? count :'--'}人</span>
                                </div>
                            </div>
                            {/*<img style={{width:"100%"}} src="/public/img/bonus.png" alt=""/>*/}
                            <div className="col-xs-12 box">
                                <div className="portfolio-name line">投资组合项目进度报告</div>
                                <div className="g-py-20">
                                    {reportList ?
                                        reportList.map((items, index)=>{
                                            if(items){
                                                return(
                                                    <div key={index}>
                                                        <a target="_blank" href={`${ROOT_AVATAR}/${items.contextUrl}`}>{items.title}</a>
                                                    </div>
                                                );
                                            }
                                        }) :
                                        <div className="text-center">
                                            <h3>暂无数据</h3>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        fetchPortfolioListDetail:bindActionCreators(fetchPortfolioListDetail, dispatch),
        portfolioBuyList:bindActionCreators(portfolioBuyList, dispatch),
        portfolioBuy:bindActionCreators(portfolioBuy, dispatch),
        fetchPortfolioBalance:bindActionCreators(fetchPortfolioBalance, dispatch),
        checkMessage:bindActionCreators(checkMessage, dispatch),
        AccountHighStatus: bindActionCreators(AccountHighStatus, dispatch),
    };
}
function mapStateToProps(state){
    return {
        portfolio: state.portfolio.portfolio,
        authenticated: state.auth.authenticated,
        portfolio_buy_list:state.portfolio.portfolio_buy_list,
        portfolio_buy:state.portfolio.portfolio_buy,
        balance:state.portfolio.balance
    };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PortfolioDetail));

