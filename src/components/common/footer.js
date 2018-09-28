/**
 * Created by fengxiaoli on 2017/12/12.
 */

import React, {Component} from 'react';
import { Link, withRouter} from 'react-router-dom';
import icon_1 from './../../../public/img/icon_1.png';
import icon_2 from './../../../public/img/icon_2.png';
import icon_3 from './../../../public/img/icon_3.png';
import icon_4 from './../../../public/img/icon_4.png';
import icon_5 from './../../../public/img/icon_5.png';
import icon_6 from './../../../public/img/icon_6.png';
import icon_7 from './../../../public/img/icon_7.png';
import icon_8 from './../../../public/img/icon_8.png';
import icon_9 from './../../../public/img/icon_9.png';
import icon_10 from './../../../public/img/icon_10.png';
import icon_11 from './../../../public/img/icon_11.png';
import icon_12 from './../../../public/img/icon_12.png';
import id_weChat from './../../../public/img/id-weChat.png';
import id_qq from './../../../public/img/id-qq.png';
import securityAuth from './../../../public/img/security-auth.png';

let data_1 = [{
    icon: icon_1
}, {
    icon: icon_2
}, {
    icon: icon_3
}, {
    icon: icon_4
}, {
    icon: icon_5
}, {
    icon: icon_6
}];

let data_2 = [{
    icon: icon_7
}, {
    icon: icon_8
}, {
    icon: icon_9
}, {
    icon: icon_10
}, {
    icon: icon_11
}, {
    icon: icon_12
}];

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        if(location.pathname === '/'){
            document.title="investdigital大德数字资产官网 - 投资服务平台 | InvestDigital Platform";
        }else{
            document.title="数字资产、虚拟资产、数字产品、数字基金、投资组合、IDT、大德币";
        }
    }

    render() {
        const username = localStorage.getItem('username');
        let item_1 = data_1 && data_1.map((cur, index) => {
            return <a href="javascript:;" className="col-xs-6 col-sm-4 col-lg-2" key={index.toString()}>
                    <img src={cur.icon} alt=""/>
            </a>;
        });
        let item_2 = data_2 && data_2.map((cur, index) => {
            return <a href="javascript:;" className="col-xs-6 col-sm-4 col-lg-2" key={index.toString()}>
                <img src={cur.icon} alt=""/>
            </a>;
        });
        return (
            <div className="footer">
                <div className="footer-center container">
                    <div className="footer-slogan">
                        InvestDigital——打造EOS上的基金工厂
                    </div>
                    <div className="footer-icon">
                        <div className="row text-center">
                            {item_1}
                        </div>
                        <div className="row text-center">
                            {item_2}
                        </div>
                    </div>
                    <div className="footer-main row">
                        <div className="footer-main-left col-xs-12 col-lg-6 text-center">
                            <div className="col-xs-12 col-lg-6">
                                <div className="col-xs-6 col-lg-6"><img src={id_weChat} alt=""/></div>
                                <div className="col-xs-6 col-lg-6">
                                    <div>微信公众号</div>
                                    <div>InvestDigital_ID</div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-lg-6">
                                <div className="col-xs-6 col-lg-6"><img src={id_qq} alt=""/></div>
                                <div className="col-xs-6 col-lg-6">
                                    <div>QQ群</div>
                                    <div>630658996</div>
                                </div>
                            </div>
                        </div>

                        <div className="footer-main-right col-xs-12 col-sm-12 col-lg-6 text-center">
                            <div className="col-xs-6 col-lg-3">
                                {/*<div>关于我们</div>*/}
                                {/*<div>团队介绍</div>*/}
                                {/*<div style={{margsinTop:'5px'}}>项目周报</div>*/}
                                {/*<div style={{marginTop:'5px'}}>加入我们</div>*/}
                                {/*<div style={{marginTop:'5px'}}>媒体报道</div>*/}
                            </div>
                            <div className="col-xs-6 col-lg-3">
                                {/*<div>关于我们</div>*/}
                                {/*<div>APP下载</div>*/}
                                {/*<div style={{marginTop:'5px'}}>API文档</div>*/}
                                {/*<div style={{marginTop:'5px'}}>白皮书</div>*/}
                            </div>
                            <div className="col-xs-6 col-lg-3">
                                <div>帮助中心</div>
                                <div>
                                    <Link to="/FAQ">常见问题</Link>
                                </div>
                                <div style={{marginTop:'5px'}}>
                                    <Link to="/fees">费用说明</Link>
                                </div>
                            </div>
                            <div className="col-xs-6 col-lg-3">
                                <div>官方社群</div>
                                <div><a target="_blank" href="https://t.me/InvestDigitalOfficial"><i className="fa fa-telegram fa-fw" aria-hidden="true"></i><span>Telegram</span></a></div>
                                {/*<div style={{marginTop:'5px'}}><i className="fa fa-wechat fa-fw" aria-hidden="true"></i><span>微信</span></div>*/}
                                {/*<div style={{marginTop:'5px'}}><i className="fa fa-qq fa-fw" aria-hidden="true"></i><span>QQ</span></div>*/}
                            </div>

                        </div>
                    </div>
                </div>
                <div className="footer-security-auth-png">
                    <img src={securityAuth}/>
                </div>
                <div className="footer-bottom">
                    @ 2018-InvestDigital&nbsp;&nbsp;&nbsp;投资有风险，购买需谨慎
                </div>
            </div>
        );
    }

}

export default Footer;
