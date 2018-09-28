/**
 * Created by zhangxiaojing on 2018/05/22.
 */

import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import { Steps } from 'antd';
import moment from 'moment';
import Header from '../common/header';
import Footer from '../common/footer';
import NA from 'number-accuracy';
import success from './../../../public/img/success.png';
const Step = Steps.Step;
class BuySuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index:0
        };
    }
    investmentFunc (num) {
        localStorage.setItem("defaultActiveKey", num);
    }
    render() {
        const {purchasedAmount, productName, closedDateStart, closedDateEnd, predictedProfit, productType, profitCurrencyType, currencyType, discountedAmount}= this.props.location.state ||[];
        return (
            <div style={{background:"#f5f5f5"}}>
                <Header/>
                <div className="container text-center buy-success g-py-200">
                    <img style={{width:"100px"}} src={success} alt=""/>
                    <p className="g-pt-40" style={{fontSize:"18px"}}>您已成功购买<span className="color2">{productName ? productName :'--'}</span>投资组合，金额 <span className="color1"> {purchasedAmount}</span> <span>{currencyType}</span></p>
                    <p className={discountedAmount ? "g-pt-10 show" : "g-pt-10 hide"}><span>实际投资金额：</span><span className="color1">{NA.minus(purchasedAmount, discountedAmount)}</span><span>{currencyType}</span><span>，您已使用满减券，优惠金额：</span><span className="color1">{discountedAmount}</span><span>{currencyType}</span></p>
                    {productType===0 ? <p>{closedDateEnd ? moment(closedDateEnd).format('YYYY-MM-DD'):"--"} 公布 <span>{productName ? productName:'--'}</span>净值与建仓情况</p> : ''}
                    <div className="g-pt-30 g-pb-50" style={{marginLeft:"-18px"}}>
                        {productType===0?
                            <Steps progressDot current={1}>
                                <Step title="申购"  />
                                <Step title="确认申购份额" />
                                <Step title={`${closedDateEnd ? moment(closedDateEnd).format('YYYY-MM-DD'):'--'} 投资组合完成建仓`} />
                            </Steps>
                            :
                            <Steps progressDot current={1}>
                                <Step title="购买"  />
                                <Step title={`${closedDateStart? moment(closedDateStart).format('YYYY-MM-DD'):"--"} 开始计算收益`} />
                                <Step title={`${closedDateEnd ? moment(closedDateEnd).format('YYYY-MM-DD'):'--'} 返还，预计收益${predictedProfit ? predictedProfit:'--'} ${profitCurrencyType ? profitCurrencyType : '--'}`} />
                            </Steps>
                        }
                    </div>
                    <div className="buy-success">
                        <Link to="/financial" className="button-active-blue">继续购买</Link>
                        <Link to="/user/account" className="button-active-blue"  onClick={this.investmentFunc.bind(this, 2)}>我的投资</Link>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default BuySuccess;
