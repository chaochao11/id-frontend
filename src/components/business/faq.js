/**
 * Created by lijun on 2018/3/30.
 */
import React, { Component } from 'react';
import Header from "../common/header";
import Footer from "../common/footer";
export default class FAQ extends Component{
    constructor (props) {
        super(props);
        this.state = {
        };
    }
    render () {
        return(
            <div>
                <Header/>
                <div className="container g-py-120 faq">
                    <h1 className="g-pb-20">常见问题</h1>
                    <hr/>
                    <p className="title g-py-10 g-pt-20">1.IDT投资组合超市 是什么？交易过程是怎样的？</p>
                    <p>IDT投资组合超市是数字货币一站式投资服务平台，连接普通投资者和专业投资者，帮助普通投资者发现专业的资管服务，帮助专业投资者建立并发行自己的数字货币基金，用户可进行购买并得到基金收益回报。</p>
                    <p>用户注册账户，完成实名认证，对账户进行充币（币种：USDT）对基金进行购买，购买后进入基金封闭期，封闭期结束后由基金经理统一结算收益。</p>
                    <p className="title g-py-10 g-pt-20">2.如何进行实名验证？实名验证需要多长时间审核？实名验证没通过怎么办？</p>
                    <p>实名验证由系统自动审核，通常在您提交个人身份证和视频验证资料后，只需 1 分钟左右系统就可以完成审核，请在我的帐户里刷新页面查看结果。如果验证没通过，请按照系统的提示重新提交合格的验证资料；如果仍无法通过，请联系在线客服协助排查失败原因</p>
                    <p className="title g-py-10 g-pt-20 ">3.提币需要什么验证？提币如何操作？提币费用是多少？提币多久到账？</p>
                    <p>提币需要完成高级认证，用户需提交身份证的正反面照片、手持身份证并含有IDT名称和时间戳的照片。高级认证通过后，方可提币。</p>
                    <p>提币的手续费是由系统自动计算出来，每个不同币种对应的手续费不一样。</p>
                    <p>提币到账时间取决于当前交易区块链网路的交易速度，请您耐心等待。到账后您将会收到系统发出的邮件通知。</p>
                </div>
                <Footer/>
            </div>
        );
    }
}