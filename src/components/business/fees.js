/**
 * Created by lijun on 2018/3/30.
 */
import React, { Component } from 'react';
import Header from "../common/header";
import Footer from "../common/footer";
export default class FEES extends Component{
    constructor (props) {
        super(props);
        this.state = {
        };
    }
    render () {
        return(
            <div>
                <Header/>
                <div className="container g-py-120 fees">
                    <h1  className="g-pb-20">IDT 费率说明</h1>
                    <hr/>
                    <p className="title g-py-10 g-pt-20">充币费率</p>
                    <p>充币免费。</p>
                    <p className="title g-py-10 g-pt-20">提币费率</p>
                    <p>单笔提币不论数额大小，均消耗固定矿工费。提出USDT需要每笔10 USDT。</p>
                    <p>每日提币限额暂无</p>
                    <p className="title g-py-10 g-pt-20">基金费率</p>
                    <p>认购/申购费：0%</p>
                    <p>管理费：0%</p>
                    <p>托管费：0%</p>
                    <p>超额业绩提成：保固定收益月化2%，超额部分归投资管理人</p>
                </div>
                <Footer/>
            </div>
        );
    }
}