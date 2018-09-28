import React from "react";
import {InputNumber} from 'antd';
import NA from 'number-accuracy';
import {AccountSecurityWithDrawalurrency} from './../../../../actions/account';

export default class AccountWithDrawal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: true,
            number: true,
            ga: true,
            num: '',
            money: ''
        };
    }

    onChange(value) {
        const {fee} = this.props;
        this.setState({
            num: value,
            money: NA.minus(value, fee) < 0 ? '' : NA.minus(value, fee)
        });
    }

    addressBlur() {
        let address = this.refs.address.value.trim();
        if (!address) {
            this.setState({
                address: false
            });
        } else {
            this.setState({
                address: true
            });
        }
    }

    numBlur() {
        let num = this.state.num;
        if (!num) {
            this.setState({
                number: false
            });
        } else {
            this.setState({
                number: true
            });
        }
    }
    gaBlurFunc () {
        let ga = this.refs.ga.value.trim();
        if (!ga) {
            this.setState({
                ga: false
            });
        } else {
            this.setState({
                ga: true
            });
        }
    }

    withFunc() {
        let address = this.refs.address.value.trim();
        let ga = this.refs.ga.value.trim();
        let num = this.state.num;
        const {currencyType} = this.props;
        const {googleSecretStatus} = this.props.accountSecurityInfo.data;
        const {dispatch} = this.props;
        if (!address) {
            this.setState({
                address: false
            });
        }
        if (!num) {
            this.setState({
                number: false
            });
        }
        if (parseInt(googleSecretStatus) === 2) {
            if (!ga) {
                this.setState({
                    ga: false
                });
            }
        }
        if (parseInt(googleSecretStatus) === 1 || parseInt(googleSecretStatus) === 3) {
            if (!address || !num) {
                return false;
            }
        } else {
            if (!address || !num || !ga) {
                return false;
            }
        }

        let init = {
            address: address,
            amount: num,
            currencyType: currencyType,
            googleCode: parseInt(googleSecretStatus) === 2 ? ga : ''
        };
        dispatch(AccountSecurityWithDrawalurrency(init, this.refs.address, this.refs.ga, () => {
            this.setState({
                num: '',
                money: '',
            });
        }));
    }

    render() {
        const {currencyName, fee, currencyType} = this.props;
        const {googleSecretStatus} = this.props.accountSecurityInfo.data;
        return (
            <div className="account-with-list hide">
                <div className="account-with-commit">
                    <div className="account-with-commit-center">
                        <div className="clear">
                            <div className="fl">提币地址</div>
                            <input onBlur={this.addressBlur.bind(this)}
                                   className={this.state.address ? "fl" : "fl account-input-border"} ref="address"
                                   type="text"/>
                        </div>
                        {this.state.address ? <p></p> : <p>*请输入提币地址</p>}
                        <div className="clear">
                            <div className="fl">数量</div>
                            <InputNumber value={this.state.num} onBlur={this.numBlur.bind(this)}
                                         className={this.state.number ? "fl" : "fl account-input-border"} min={0}
                                         onChange={this.onChange.bind(this)}/>
                            <label>{currencyName}</label>
                        </div>
                        {this.state.number ? <p></p> : <p>*请输入数量</p>}
                        <div className={parseInt(googleSecretStatus) === 2 ? 'show clear' : 'hide clear'}>
                            <div className="fl">谷歌验证码</div>
                            <input onBlur={this.gaBlurFunc.bind(this)} className={this.state.ga ? "fl" : "fl account-input-border"} ref="ga" type="text"/>
                        </div>
                        {parseInt(googleSecretStatus) === 2 ? (this.state.ga ? <p></p> : <p>*请输入谷歌验证码</p>) : ''}
                        <div className="clear">
                            <div className="fl">手续费</div>
                            <input className="fl" disabled="disabled" placeholder={`${fee}`} type="text"/>
                            <label>{currencyName}</label>
                        </div>
                        <div style={{marginTop: '20px'}} className="clear">
                            <div className="fl">实际到账</div>
                            <input className="fl" disabled="disabled" value={this.state.money} ref="arrive" type="text"/>
                            <label>{currencyName}</label>
                        </div>
                        <div style={{marginTop: '25px'}} className="clear">
                            <div className="fl"></div>
                            <button className="fl" onClick={this.withFunc.bind(this)}>提币</button>
                        </div>
                    </div>
                </div>
                {parseInt(currencyType) === 1 ? <div className='account-mine-info'>
                    <p>温馨提示</p>
                    <p>• 最小提币数量为：200 USDT。</p>
                    <p>• 为保障资金安全，当您账户安全策略变更、密码修改、使用新地址提币，我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。</p>
                    <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
                </div> : parseInt(currencyType) === 2 ? <div className='account-mine-info'>
                    <p>温馨提示</p>
                    <p>• 最小提币数量为：200 IDT。</p>
                    <p>• 为保障资金安全，当您账户安全策略变更、密码修改、使用新地址提币，我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。</p>
                    <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
                </div> : parseInt(currencyType) === 3 ? <div className='account-mine-info'>
                    <p>温馨提示</p>
                    <p>• 最小提币数量为：0.01 BTC。</p>
                    <p>• 为保障资金安全，当您账户安全策略变更、密码修改、使用新地址提币，我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。</p>
                    <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
                </div> : parseInt(currencyType) === 4 ? <div className='account-mine-info'>
                    <p>温馨提示</p>
                    <p>• 最小提币数量为：0.015ETH。</p>
                    <p>• 请不要直接提币到ICO的众筹地址，这会导致您无法收取众筹到的数字资产。</p>
                    <p>• 提币到合约地址可能会发生合约执行失败，将导致转账失败，资产将退回到火币。火币会人工处理退回到原账户，处理时间较长，请您谅解。</p>
                    <p>• 网络转账费用是不固定的，取决于转账时合约执行需要消耗的算力。当前火币为提币支付的Gas Limit为90000，用于执行转账或合约执行。如果此次交易消耗超过90000 gas，将导致转账失败，资产将退回到火币。火币会人工处理退回到原账户，请您谅解。</p>
                    <p>• 为保障资金安全，当您账户安全策略变更、密码修改、使用新地址提币，我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。</p>
                    <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
                </div> : <div className='account-mine-info'>
                    <p>温馨提示</p>
                    <p>• 最小提币数量为：40 GET。</p>
                    <p>• 为保障资金安全，当您账户安全策略变更、密码修改、使用新地址提币，我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。</p>
                    <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
                </div>}
            </div>
        );
    }
}


