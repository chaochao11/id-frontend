import React from "react";
import Header from "../../common/header";
import Footer from "./../../common/footer";
import buy_1 from './../../../../public/img/buy_1.jpg';
import buy_2 from './../../../../public/img/buy_2.jpg';
import buy_3 from './../../../../public/img/buy_3.jpg';
import pc_1 from './../../../../public/img/PC_1.jpg';
import pc_2 from './../../../../public/img/PC_2.jpg';

import ph_1 from './../../../../public/img/PH_1.jpg';
import ph_2 from './../../../../public/img/PH_2.jpg';
import ph_3 from './../../../../public/img/PH_3.jpg';

import turn_1 from './../../../../public/img/turn_1.jpg';
import turn_2 from './../../../../public/img/turn_2.jpg';
import turn_3 from './../../../../public/img/turn_3.jpg';
import turn_4 from './../../../../public/img/turn_4.jpg';
import turn_5 from './../../../../public/img/turn_5.jpg';
import turn_6 from './../../../../public/img/turn_6.jpg';

export default class AccountPay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="account-pay">
                <Header/>
                <div className="account-pay-center">
                    <div className="account-buy-center container">
                        <h1 className="text-center">实名认证</h1>
                        <p>实名认证方式（PC版）：</p>
                        <p>点击个人用户名，选择我的账户</p>
                        <img src={pc_1} alt=""/>
                        <p>点击实名认证</p>
                        <p>完成后66 IDT会自动进入我的账户</p>
                        <img src={pc_2} alt=""/>
                        <p>实名认证方式（手机版）:</p>
                        <p>点击右上角下拉菜单，点击我的账户</p>
                        <img style={{width:'300px'}} src={ph_2} alt=""/>
                        <p>点击实名认证</p>
                        <p>完成后66 IDT会自动进入我的账户。</p>
                        <img style={{width:'300px'}} src={ph_1} alt=""/>
                    </div>
                    <div className="account-buy-center container">
                        <h1 className="text-center">获取充币地址</h1>
                        <p>点击我的资产——我的账户</p>
                        <img style={{width:'300px'}} src={ph_2} alt=""/>
                        <p>然后点击“待激活”</p>
                        <img style={{width:'300px'}} src={ph_3} alt=""/>
                        <p>即可获取充币地址，该地址专属于您</p>
                    </div>
                    <div className="account-buy-center container">
                        <h1 className="text-center">如何购买USDT？</h1>
                        <p>可以购买USDT的交易所有很多，这里以排行靠前的火币pro为例。</p>
                        <p><span style={{fontWeight:'bold'}}>步骤1、</span>登录网址 otc.huobipro.com。</p>
                        <p>点击左上角【法币交易】点USDT，选择一个认证的商家买币</p>
                        <img src={buy_1} alt=""/>
                        <p><span style={{fontWeight:'bold'}}>步骤2、</span>输入想买入的数字（CNY就是对应的人民币），点击确定之后就出来对方的付款银行和支付宝。</p>
                        <img src={buy_2} alt=""/>
                        <p><span style={{fontWeight:'bold'}}>步骤3、</span>付款完成之后点击【我已付款】,等USDT到账之后，您就可以在右上角【资产】中查看了。</p>
                        <img src={buy_3} alt=""/>
                        <p>如有不明之处，请联系客服（微信号：InvestDigital）</p>
                    </div>
                    <div className="account-turn-center container">
                        <h1 className="text-center">如何转账USDT？</h1>
                        <p><span style={{fontWeight:'bold'}}>步骤1、</span>进入火币pro（可选地址huobi.pro，备选地址www.huobi.br.com），点击【充值&提币】，再点击【提币地址管理】。</p>
                        <img src={turn_1} alt=""/>
                        <img src={turn_2} alt=""/>
                        <p><span style={{fontWeight:'bold'}}>步骤2、</span>添加新的提币地址，选中USDT。</p>
                        <img src={turn_3} alt=""/>
                        <p><span style={{fontWeight:'bold'}}>步骤3、</span>添加新的币种地址后，输入验证码进行安全验证，点击确定后提币地址即可添加成功。</p>
                        <img src={turn_4} alt=""/>
                        <p><span style={{fontWeight:'bold'}}>步骤4、</span>添加完提币地址后，进入资金管理页面，点击提币即可进入提币页面。</p>
                        <img src={turn_5} alt=""/>
                        <p><span style={{fontWeight:'bold'}}>步骤5、</span>输入提取的数量，点击确定即可提币</p>
                        <p>备注：实际到账的数量=提币数量-提币手续费</p>
                        <img src={turn_6} alt=""/>
                        <p>如有不明之处，请联系客服（微信号：InvestDigital）</p>
                    </div>
                </div>
                <Footer/>
            </div>

        );
    }
}


