/**
 * Created by zhangxiaojing on 2018/07/02.
 */

import React, { Component } from 'react';
import QQ from './../../../public/img/QQ-5@2x.png';
import QQActive from './../../../public/img/QQ-active.png';
import Wechat from './../../../public/img/service-wechat.png';
import WechatActive from './../../../public/img/wechat-2@2x.png';
import Telegram from './../../../public/img/telegram-4@2x.png';
import TelegramActive from './../../../public/img/telegram-active.png';
import Back from './../../../public/img/back.png';
import BackActive from './../../../public/img/back-active.png';
import weChatModal from './../../../public/img/service_wechat.jpg';
import service1 from './../../../public/img/service1.png';
import idWeChat from './../../../public/img/id-weChat.png';
import Opinion from './../../../public/img/opinion.png';
import OpinionActive from './../../../public/img/opinion-active.png';
import OpinionModal from './opinionModal';


export default  class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opinionFlag: false
        };
    }
    scrollToTop = () => {
        window.scrollTo(0, 0);
    };
    showOpinion () {
        this.setState({
            opinionFlag: true
        });
    }
    hideOpinion () {
        this.setState({
            opinionFlag: false
        });
    }
    render() {
        return (
            <div>
                <div className="service-pc">
                    <div className="box" style={{padding:0}}>
                        {/*<div className="text-center g-py-20 title">在线咨询</div>*/}
                        <div className="items">
                            <ul>
                                <li>
                                    <a target="_blank" href="http://wpa.qq.com/msgrd?v=1&uin=2439480365&site=qq&menu=yes">
                                        <img className="icon qq" src={QQ} alt=""/>
                                        <img className="icon qq-active" src={QQActive} alt=""/>
                                        <div>QQ在线咨询</div>
                                    </a>
                                </li>
                                <li>
                                    <a className="wechat-btn" href="#">
                                        <img className="icon wechat" src={Wechat} alt=""/>
                                        <img className="icon wechat-active" src={WechatActive} alt=""/>
                                        <div>微信咨询</div>
                                        <img className="service-wechat" src={weChatModal} alt=""/>
                                    </a>
                                </li>
                                <li>
                                    <a target="_blank" href="https://t.me/InvestDigitalOfficial">
                                        <img className="icon telegram" src={Telegram} alt=""/>
                                        <img className="icon telegram-active" src={TelegramActive} alt=""/>
                                        <div>Telegram电报群</div>
                                    </a>
                                </li>
                                <li>
                                    <div onClick={this.showOpinion.bind(this)}>
                                        <img className="icon back" src={Opinion} alt=""/>
                                        <img className="icon back-active" src={OpinionActive} alt=""/>
                                        <div>意见反馈</div>
                                    </div>
                                </li>
                                <li>
                                    <div onClick={this.scrollToTop}>
                                        <img className="icon back" src={Back} alt=""/>
                                        <img className="icon back-active" src={BackActive} alt=""/>
                                        <div>返回顶部</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="service-mobile">
                    <img src={service1} alt=""/>
                    <div className="service-mobile-box" style={{padding:0}}>
                        <div className="text-center g-py-20 title">在线咨询</div>
                        <div className="items">
                            <a target="_blank" href="http://wpa.qq.com/msgrd?v=1&uin=2439480365&site=qq&menu=yes">
                                <i className="fa fa-qq fa-2x"></i>
                            </a>
                            <span className="wechat-btn"    >
                            <i className="fa fa-wechat fa-2x"></i>
                            <img className="service-wechat" src={idWeChat} alt=""/>
                        </span>
                            <a target="_blank" href="https://t.me/InvestDigitalOfficial">
                                <i className="fa fa-telegram fa-2x"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <OpinionModal {...this.props} opinionFlag={this.state.opinionFlag} onCancleModal={this.hideOpinion.bind(this)}/>
            </div>
        );
    }
}
