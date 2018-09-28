
/**
 * Created by fengxiaoli on 2017/12/12.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';
import { Icon, Spin, Rate, Popover} from 'antd';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import echarts from 'echarts/lib/echarts';    //必须
import'echarts/lib/component/tooltip';
import'echarts/lib/chart/line';
import CompanyDynamic from './companyDynamic';
import Service from '../common/service';
import Pagination from './bannerSwipe/Pagination';
import banner_bg1 from '../../../public/img/banner_bg1.jpg';
import banner_bg2 from '../../../public/img/banner_bg2.jpg';
import banner_bg3 from '../../../public/img/banner_bg3.jpg';
import banner_bg4 from '../../../public/img/banner_bg4.jpg';
import banner_bg5 from '../../../public/img/banner_bg5.jpg';
import banner1 from '../../../public/img/banner_bg1@2x.jpg';
import banner2 from '../../../public/img/banner_bg2@2x.jpg';
import banner3 from '../../../public/img/banner_bg3@2x.jpg';
import banner4 from '../../../public/img/banner_bg4@2x.jpg';
import banner5 from '../../../public/img/banner_bg5@2x.jpg';
import box1 from '../../../public/img/section2-right1.png';
import box2 from '../../../public/img/section2-right2.png';
import box3 from '../../../public/img/section2-right3.png';
import trumpet from '../../../public/img/trumpet.png';
import steps from '../../../public/img/step.png';

import { fetchRegisterNumber, fetchListTop} from '../../actions/portfolio';
import { fetchAnnouncementList } from "../../actions/announcement";
import { PortfolioChartsConfig } from '../../tools/chartsConfig';
import { ROOT_AVATAR } from "./../../actions/types";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const styles = {
    root: {
        position: 'relative',
    },
    slide: {
        padding: 15,
        minHeight: 523,
        color: '#fff',
    },
    slide1: {
        background: `url(${banner_bg5}) center/cover no-repeat`,
    },
    slide2: {
        background: `url(${banner_bg2}) left/cover no-repeat`,
    },
    slide3: {
        background: `url(${banner_bg4}) center/cover no-repeat`,
    },
    slide4: {
        background: `url(${banner_bg1}) center/cover no-repeat`,
    },
    bottom:100
};
var sUserAgent = navigator.userAgent.toLowerCase();
var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
var bIsMidp = sUserAgent.match(/midp/i) == "midp";
var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
var bIsAndroid = sUserAgent.match(/android/i) == "android";
var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
if (bIsIpad||bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    //跳转移动端页面
    styles.slide.minHeight=280;
    styles.slide1.background=`url(${banner5}) center/cover no-repeat`;
    styles.slide2.background=`url(${banner2}) center/cover no-repeat`;
    styles.slide3.background=`url(${banner4}) center/cover no-repeat`;
    styles.slide4.background=`url(${banner1}) center/cover no-repeat`;
    styles.bottom=20;
}
if(bIsIpad){
    styles.slide.minHeight=560;
    styles.slide1.background=`url(${banner5}) center/cover no-repeat`;
    styles.slide2.background=`url(${banner2}) center/cover no-repeat`;
    styles.slide3.background=`url(${banner4}) center/cover no-repeat`;
    styles.slide4.background=`url(${banner1}) center/cover no-repeat`;
    styles.bottom=20;
}

let i=1;
    class PortfolioList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            modal2Visible: false,
            authState: Number.parseInt(localStorage.getItem("authState")),
            title:null,
            announcementCode:null,
        };
    }
    componentWillMount() {
        this.props.fetchListTop();
        this.props.fetchRegisterNumber();
    }
    componentDidMount() {
        const { fetchAnnouncementList} = this.props;
        fetchAnnouncementList({ pageSize: 5, pageNum: 1 }, (data)=>{
            const {pageList}=data;
            this.setState({
                title: pageList[0].title,
                announcementCode:pageList[0].announcementCode
            });
            this.interval = setInterval(() => this.tick(pageList), 2500);
        });

    }
    tick = (pageList) => {
        let length=pageList.length;
        this.setState({
            title: pageList[i].title,
            announcementCode:pageList[i].announcementCode
        });
        i=i+1;
        if(i>=length){
            i=0;
        }
    };
    componentDidUpdate() {
        const top=this.props.top||[];
        top.map((item, index)=>{
            const grid={left:"10%", top:"10%", right:"10%", bottom:"15%"};
            const type=1;
            const {info}=item;
            if(item.portfolio.portfolioType ===4|| item.portfolio.portfolioType ===5 || item.portfolio.portfolioType ===6 ||item.portfolio.portfolioType ===7|| !info){
                return false;
            }
            const portfolioChart2= echarts.init(document.getElementById(`top${index}`));
            portfolioChart2.setOption(PortfolioChartsConfig(info, grid, type));
        });
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    handleChangeIndex = index => {
        this.setState({
            index,
        });
    };
    detailsFunc(portfolioCode, runningStatus) {
        if(parseInt(runningStatus) === 0) {
            this.props.history.push(`/portfolio/${portfolioCode}`);
            return false;
        }
        this.props.history.push(`/financial/details/${portfolioCode}`);
    }
    renderPortfolioBoutique(){
        const top=this.props.top||[];
        return top.map((item, index)=>{
            const {portfolio, portfolioReturn, tags, currency, closedPeriod, profitRateDesc, profit}=item;
            let portfolioCode = portfolio.portfolioCode;
            const content=(
                <div>{currency.join("/")}</div>
            );
            return(
                <li className="col-xs-12 item" key={index} style={portfolio.portfolioType ===4 || portfolio.portfolioType ===5 || portfolio.portfolioType === 6 || portfolio.portfolioType === 7 ? {padding:0} : {}} onClick={this.detailsFunc.bind(this, portfolio.portfolioCode, portfolio.productType)}>
                    {/*<Link to={portfolio.runningStatus === 10 ? `/financial/details/${portfolioCode}` : `/portfolio/${portfolioCode}`}>*/}

                    <div className="col-xs-12 col-md-5 financial-item-slogan-left" style={portfolio.portfolioType ===4 ? {padding:0} : {}} >
                        {parseInt(portfolio.portfolioType) === 4 || parseInt(portfolio.portfolioType) === 5 || parseInt(portfolio.portfolioType) === 6 || parseInt(portfolio.portfolioType) === 7 ?
                            <img src={`${ROOT_AVATAR}/${portfolio.imageUrl}`} alt=""/>
                            :
                            <div className="chart" style={{height:"180px", marginTop:"20px"}} id={`top${index}`}></div>
                        }
                    </div>
                    <div className="col-xs-12 col-md-7 right">
                        <div>
                            <h4 style={{"display":"inline-block"}}>{portfolio.portfolioName ? portfolio.portfolioName : '--'}</h4>
                            {tags.map((items, index)=>{
                                return(
                                    <span key={index} className={`portfolio-label portfolio2 ${portfolio.portfolioType === 4 ? "financial-item-right-top-blue-title" : portfolio.portfolioType === 5 ? "financial-item-right-top-purple-title" : portfolio.portfolioType === 6 ? "financial-item-right-top-orange-title" : parseInt(portfolio.portfolioType) === 7 ? "financial-item-right-top-yellow-title" :"financial-item-right-top-blue-title"}`}>{items.description}</span>
                                );
                            })}
                        </div>
                        <div className="rate">抗风险指数：<Rate allowHalf disabled defaultValue={portfolio.riskIndex ? portfolio.riskIndex :'--'}/></div>
                        <hr/>
                        <div className="clearfix list">
                            <ul>
                                {portfolio.productType === 1 ?
                                    <li className="col-xs-4" style={{padding: '0'}}>
                                        <div><span className={parseInt(portfolio.portfolioType) === 4 ? "financial-item-right-top-blue-color" : parseInt(portfolio.portfolioType) === 5 ? "financial-item-right-top-purple-color" : parseInt(portfolio.portfolioType) === 6 ? "financial-item-right-top-orange-color"  : parseInt(portfolio.portfolioType) === 7 ? "financial-item-right-top-yellow-color" : "financial-item-right-top-blue-color"}>{profit ? profit : "--"}</span></div>
                                        <div>{profitRateDesc ? profitRateDesc : '--'}</div>
                                    </li> :
                                    <li className="col-xs-4" style={{padding: '0'}}>
                                        <div><span className={parseInt(portfolio.portfolioType) === 4 ? "financial-item-right-top-blue-color" : parseInt(portfolio.portfolioType) === 5 ? "financial-item-right-top-purple-color" : parseInt(portfolio.portfolioType) === 6 ? "financial-item-right-top-orange-color" : parseInt(portfolio.portfolioType) === 7 ? "financial-item-right-top-yellow-color" : "financial-item-right-top-blue-color"}>{portfolioReturn.netValue ? portfolioReturn.netValue : "--"} USDT</span>
                                        </div>
                                        <div>最新净值</div>
                                    </li>
                                }
                                <li className="col-xs-4">
                                    <div><span className={parseInt(portfolio.portfolioType) === 4 ? "financial-item-right-top-blue-color" : parseInt(portfolio.portfolioType) === 5 ? "financial-item-right-top-purple-color" : parseInt(portfolio.portfolioType) === 6 ? "financial-item-right-top-orange-color" : parseInt(portfolio.portfolioType) === 7 ? "financial-item-right-top-yellow-color" : "financial-item-right-top-blue-color"}>{closedPeriod ? closedPeriod:'--'}</span></div>
                                    <div>产品封闭期</div>
                                </li>
                                <li className="col-xs-4" >
                                    {portfolio.productType === 1 ?
                                        <Popover content={content} placement="top">
                                            <div>
                                                <span className={parseInt(portfolio.portfolioType) === 4 ? "financial-item-right-top-blue-color" : parseInt(portfolio.portfolioType) === 5 ? "financial-item-right-top-purple-color" : parseInt(portfolio.portfolioType) === 6 ? "financial-item-right-top-orange-color" : parseInt(portfolio.portfolioType) === 7 ? "financial-item-right-top-yellow-color" : "financial-item-right-top-blue-color"}>{currency ? (currency).slice(0, 3).join("/") :"--"}</span>
                                            </div>
                                            <div style={{color:"#6c6c6c", fontWeight:'400'}}>支持币种</div>
                                        </Popover>:
                                        <div>
                                            <div className={parseInt(portfolio.portfolioType) === 4 ? "financial-item-right-top-blue-color" : parseInt(portfolio.portfolioType) === 5 ? "financial-item-right-top-purple-color" : parseInt(portfolio.portfolioType) === 6 ? "financial-item-right-top-orange-color" :parseInt(portfolio.portfolioType) === 7 ? "financial-item-right-top-yellow-color" : "financial-item-right-top-blue-color"}><span>{portfolio.totalRaiseAmount ? portfolio.totalRaiseAmount :"--"} USDT</span></div>
                                            <div>总金额</div>
                                        </div>
                                    }
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div  className={`portfolio-btn  ${parseInt(portfolio.runningStatus) === 2 || parseInt(portfolio.runningStatus) === 4 ? "financial-item-right-top-btn-ccc" : (parseInt(portfolio.portfolioType) === 4 ? "financial-item-right-top-btn-blue" : parseInt(portfolio.portfolioType) === 5 ? "financial-item-right-top-btn-purple" : parseInt(portfolio.portfolioType) === 6 ? "financial-item-right-top-btn-orange" : parseInt(portfolio.portfolioType) === 7 ? "financial-item-right-top-btn-yellow" : "financial-item-right-top-btn-blue")} ${ parseInt(portfolio.runningStatus) === 1 ? "slideShine" : ''}`}>
                                {/*<div className="slideShine">*/}
                                {parseInt(portfolio.runningStatus) === 0 ? '产品预告' : parseInt(portfolio.runningStatus) === 1 ? '立即购买' : parseInt(portfolio.runningStatus) === 2 ? '已封闭' : parseInt(portfolio.runningStatus) === 3 ? '立即赎回' : parseInt(portfolio.runningStatus) === 4 ? '已清算' : '产品预告'}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                    {/*</Link>*/}
                </li>
            );
        });
    }
    handlerClick () {
        if(this.props.authenticated){
            localStorage.setItem("defaultActiveKey", 6);
            this.props.history.push("/user/account");
            return false;
        }
        this.props.history.push("/user/signup");
    }
    render(){
        const data2=this.props.top;
        const number=this.props.register;
        const { index, title, announcementCode } = this.state;
        return(
            <div>
                <Header/>
                <div className="portfolio" ref={node => this.node = node}>
                    <div>
                        <div style={styles.root}>
                            <AutoPlaySwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
                                <Link to='/loan'>
                                    <div style={Object.assign({}, styles.slide, styles.slide1)}></div>
                                </Link>
                                <Link to='/financial/details/47563228'>
                                    <div style={Object.assign({}, styles.slide, styles.slide2)}></div>
                                </Link>
                                <Link to='/financial/details/47563225'>
                                    <div style={Object.assign({}, styles.slide, styles.slide3)}></div>
                                </Link>
                                <Link to='/financial/details/47563223'>
                                    <div style={Object.assign({}, styles.slide, styles.slide4)}></div>
                                </Link>
                            </AutoPlaySwipeableViews>
                            <div>
                                <Pagination dots={4} index={index} bottom={styles.bottom} onChangeIndex={this.handleChangeIndex} />
                            </div>
                            <div className="home-guidance text-center">
                                <div className="title">历史年化收益率</div>
                                <div className="value">12%~100%</div>
                                <div className="button-active-blue home-guidance-btn" onClick={this.handlerClick.bind(this)}>
                                    {this.props.authenticated ? "立即领取66 IDT" : "注册领66 IDT"}
                                </div>
                                <div className={this.props.authenticated ? "hide" : "show"} style={{fontSize:'14px'}}>已有账号 ？<Link style={{display:"inline"}} className="color-home" to='/user/signin'>点此登录</Link></div>
                            </div>
                            <div className="portfolio-list-section2 portfolio-list-section2-lg">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-xs-12 col-md-7">
                                            <ul className="left clearfix g-py-20 text-center">
                                                <li className="col-xs-3 g-color-white">
                                                    <div className="title1">累计交易总额</div>
                                                    <div className="title2">400万美元</div>
                                                </li>
                                                <li className="col-xs-3 g-color-white">
                                                    <div className="title1">用户赚取收益 </div>
                                                    <div className="title2">28万美元</div>
                                                </li>
                                                <li className="col-xs-3 g-color-white">
                                                    <div className="title1">资产担保总额</div>
                                                    <div className="title2">820万3532 IDT</div>
                                                </li>
                                                <li className="col-xs-3 g-color-white">
                                                    <div className="title1">注册人数</div>
                                                    <div className="title2">{number ? number : '--'}人</div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-xs-12 col-md-offset-1 col-md-4 text-center">
                                            <ul className="right">
                                                <li className="col-xs-4">
                                                    <div className="right-box">
                                                        <img src={box1} alt=""/>
                                                        <span>优质</span>
                                                    </div>
                                                </li>
                                                <li className="col-xs-4">
                                                    <div className="right-box">
                                                        <img src={box2} alt=""/>
                                                        <span>安全</span>
                                                    </div>
                                                </li>
                                                <li className="col-xs-4">
                                                    <div className="right-box">
                                                        <img src={box3} alt=""/>
                                                        <span>高收益</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="portfolio-list-section2 portfolio-list-section2-md">
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12 col-md-7">
                                    <ul className="left clearfix g-py-20 text-center">
                                        <li className="col-xs-3 g-color-white">
                                            <div className="title1">累计交易总额</div>
                                            <div className="title2">400万美元</div>
                                        </li>
                                        <li className="col-xs-3 g-color-white">
                                            <div className="title1">用户赚取收益 </div>
                                            <div className="title2">28万美元</div>
                                        </li>
                                        <li className="col-xs-3 g-color-white">
                                            <div className="title1">资产担保总额</div>
                                            <div className="title2">820万3532 IDT</div>
                                        </li>
                                        <li className="col-xs-3 g-color-white">
                                            <div className="title1">注册人数</div>
                                            <div className="title2">{number ? number : '--'}人</div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-xs-12 col-md-offset-1 col-md-4 text-center">
                                    <ul className="right">
                                        <li className="col-xs-4">
                                            <div className="right-box">
                                                <img src={box1} alt=""/>
                                                <span>优质</span>
                                            </div>
                                        </li>
                                        <li className="col-xs-4">
                                            <div className="right-box">
                                                <img src={box2} alt=""/>
                                                <span>安全</span>
                                            </div>
                                        </li>
                                        <li className="col-xs-4">
                                            <div className="right-box">
                                                <img src={box3} alt=""/>
                                                <span>高收益</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="trumpet clearfix">
                        <div className="box">
                            <div className="fl">
                                <img style={{verticalAlign: 'middle'}} src={trumpet} alt=""/>
                                <span><Link to={announcementCode ? `/announcement/${announcementCode}`:'#'}>{title || 'loading...'}</Link></span>
                            </div>
                            <span className="fr">
                            <Link to='/announcement' style={{fontSize:'14px'}}>更多></Link>
                        </span>
                        </div>
                    </div>
                    <div className="portfolio-list">
                        <div className="container">
                            <div className="portfolio-list-section3">
                                <div className="clearfix">
                                    <h4 className="fl" style={{margin:"32px 0 36px 0"}}>精品理财</h4>
                                    {/*<div className="idt-button">确实</div>*/}
                                    <span className="fr more" style={{margin:"30px 0"}}>
                                    <Link to='/financial'>查看更多</Link>
                               </span>
                                </div>
                                <div className="content row">
                                    <ul className="clearfix">
                                        { !data2 ?
                                            <div className="text-center h3 col-sm-12 g-py-50" >
                                                <Spin tip="玩命加载中..." />
                                            </div>:
                                            this.renderPortfolioBoutique()}
                                    </ul>
                                    <Service/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="portfolio-list-section4">
                        <div className="container">
                            <div className="steps">
                                <div className="title">五步完成数字资产理财</div>
                                <img src={steps} alt=""/>
                            </div>

                        </div>
                    </div>
                    <div>
                        <CompanyDynamic/>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}
function mapStateToProps(state){
    return {
        register:state.portfolio.register,
        top:state.portfolio.top,
        authenticated: state.auth.authenticated,
        announcementList: state.announcement.announcementList,
    };
}
export default withRouter(connect(mapStateToProps, { fetchRegisterNumber, fetchListTop, fetchAnnouncementList})(PortfolioList));
