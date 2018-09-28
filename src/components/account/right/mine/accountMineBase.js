import React from "react";
import {Popover, Modal, Icon, message, InputNumber} from 'antd';
import location from './../../../../../public/img/location.png';
import authImg from './../../../../../public/img/auth.png';
import {
    MineAccount,
    AccountActivation,
    AccountSecurityInfo,
    AccountPrimaryStatus,
    AccountHighStatus,
    AccountExChnage
} from './../../../../actions/account';
import AccountWithDrawal from './../payOrWithdrawal/accountWithDrawal';
import AccountPay from './../payOrWithdrawal/accountPay';
import {removeClass, addPayOrWithdrawalClass} from './../../../../tools/utils';
import NA from 'number-accuracy';
import { accountValue } from "./../../../../tools/config";

export default class AccountMineBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencyType: '',
            flag: false,
            exChange: false,
            defaultMoney: '',
            accountMoney: '',
            numFlag: true
        };
    }

    callback() {

    }

    copyFunc() {
        let address = this.refs.address;
        address.focus();
        address.setSelectionRange(0, address.value.length);
        document.execCommand("Copy", true);
    }

    handleCancel() {
        const {dispatch} = this.props;
        document.body.style.overflow = 'auto';
        dispatch({type: 'ACTIVATION_STATUS', activationStatus: false});
        dispatch(AccountPrimaryStatus(false));
    }

    handleCancelFunc() {
        this.setState({
            flag: false
        });
    }

    showFunc(currencyType) {
        this.setState({
            currencyType: currencyType
        });
    }

    addFunc() {
        const {dispatch} = this.props;
        const {currencyType} = this.state;
        dispatch(AccountPrimaryStatus(false));
        dispatch(AccountActivation(currencyType));
    }

    highFunc() {
        this.setState({
            flag: false
        }, () => {
            const {dispatch} = this.props;
            let init = {
                phoneNum: 0,
                emailNum: 0,
                authNum: 3,
                nameAuthNum: 0,
                openGa: 0,
                closeGa: 0,
                changeGa: 0,
                accountFlag: false
            };
            this.props.history.push('/user/account');
            localStorage.setItem("defaultActiveKey", accountValue);
            dispatch(AccountHighStatus(init));
        });
    }

    changeFunc() {

    }

    payCurrency(id, idx) {
        const {dispatch} = this.props;
        let list = this.refs.list;
        //充值
        let payDom = list.children[idx].children[1];
        let payClass = list.children[idx].children[1].className;
        //提现
        let withDrawalDom = list.children[idx].children[2];
        let withDrawalClass = list.children[idx].children[2].className;
        const {userAccountVoList} = this.props.account.data;
        userAccountVoList.map((cur, index, arr) => {
            let otherDom = list.children[index].children[2];
            let otherDomClass = list.children[index].children[2].className;
            let payOtherDom = list.children[index].children[1];
            let payOtherClass = list.children[index].children[1].className;

            if (index === idx) {
                //点击充值让充值出来
                if (payClass.trim() === 'account-pay-item hide') {
                    //充值
                    removeClass(payDom, "account-pay-item hide");
                    addPayOrWithdrawalClass(payDom, "account-pay-item show");
                    //提现
                    removeClass(withDrawalDom, "account-with-list show");
                    addPayOrWithdrawalClass(withDrawalDom, "account-with-list hide");
                } else {
                    //点击第二次关闭
                    removeClass(payDom, "account-pay-item show");
                    addPayOrWithdrawalClass(payDom, "account-pay-item hide");
                }

            } else {
                //关闭其他充币
                if (payOtherClass.trim() === "account-pay-item show") {
                    removeClass(payOtherDom, "account-pay-item show");
                    addPayOrWithdrawalClass(payOtherDom, "account-pay-item hide");
                }
                //关闭其他提币
                if (otherDomClass.trim() === "account-with-list show") {
                    removeClass(otherDom, "account-with-list show");
                    addPayOrWithdrawalClass(otherDom, "account-with-list hide");
                }
            }
        });
    }

    withDrawalCurrency(id, idx) {
        const {dispatch} = this.props;
        const authState = localStorage.getItem("authState");
        const {highQICStatus} = this.props.accountSecurityInfo.data;
        if (parseInt(authState) === 2) {
            dispatch(AccountPrimaryStatus(true));
            return false;
        }
        if (parseInt(highQICStatus) <= 2) {
            this.setState({
                flag: true
            });
            return false;
        }
        let list = this.refs.list;
        //充值
        let payDom = list.children[idx].children[1];
        let payClass = list.children[idx].children[1].className;
        //提现
        let withDrawalDom = list.children[idx].children[2];
        let withDrawalClass = list.children[idx].children[2].className;
        const {userAccountVoList} = this.props.account.data;
        userAccountVoList.map((cur, index, arr) => {
            let otherDom = list.children[index].children[2];
            let otherDomClass = list.children[index].children[2].className;
            let payOtherDom = list.children[index].children[1];
            let payOtherClass = list.children[index].children[1].className;

            if (index === idx) {
                //点击充值让充值出来
                if (withDrawalClass.trim() === 'account-with-list hide') {
                    //提现
                    removeClass(withDrawalDom, "account-with-list hide");
                    addPayOrWithdrawalClass(withDrawalDom, "account-with-list show");
                    //充值
                    removeClass(payDom, "account-pay-item show");
                    addPayOrWithdrawalClass(payDom, "account-pay-item hide");
                } else {
                    //点击第二次关闭
                    removeClass(withDrawalDom, "account-with-list show");
                    addPayOrWithdrawalClass(withDrawalDom, "account-with-list hide");
                }
            } else {
                //关闭其他充币
                if (payOtherClass.trim() === "account-pay-item show") {
                    removeClass(payOtherDom, "account-pay-item show");
                    addPayOrWithdrawalClass(payOtherDom, "account-pay-item hide");
                }
                //关闭其他提币
                if (otherDomClass.trim() === "account-with-list show") {
                    removeClass(otherDom, "account-with-list show");
                    addPayOrWithdrawalClass(otherDom, "account-with-list hide");
                }
            }
        });

    }

    exChangeFunc() {
        this.setState({
            exChange: true
        });
    }

    exChangeCancelFunc() {
        this.setState({
            exChange: false
        });
    }

    onChangeNumber(value) {
        const {idtRate} = this.props.account.data;
        this.setState({
            accountMoney: isNaN(NA.divide(value, idtRate)) ? '' : NA.divide(value, idtRate),
            defaultMoney: value
        });
    }

    exChangeSend() {
        const {dispatch} = this.props;
        if (!this.state.defaultMoney) {
            this.setState({
                numFlag: false
            });
            return false;
        } else {
            this.setState({
                numFlag: true
            });
        }
        let init = {
            amount: this.state.defaultMoney
        };
        dispatch(AccountExChnage(init, () => {
            this.setState({
                exChange: false,
                accountMoney: '',
                defaultMoney: ''
            });
        }));
    }

    allFunc() {
        const {assets, idtRate} = this.props.account.data;
        this.setState({
            defaultMoney: assets,
            accountMoney: isNaN(NA.divide(assets, idtRate)) ? '' : NA.divide(assets, idtRate),
        });
    }

    payFunc() {
        this.props.history.push('/user/account/buy');
    }

    addAuthFunc() {
        const {dispatch} = this.props;
        const {accountPrimaryStatus} = this.props;
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
        AccountPrimaryStatus(false)(dispatch)
            .then(() => {
                dispatch(AccountHighStatus(init));
                localStorage.setItem("defaultActiveKey", accountValue);
                this.props.history.push('/user/account');
            });
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(MineAccount());
        dispatch(AccountSecurityInfo());
    }

    render() {
        const {activationStatus, accountPrimaryStatus} = this.props;
        const authState = localStorage.getItem("authState");
        const {assets, currentReturn, currentReturnPer, totalAsset, totalReturn, userAccountVoList, idtRate} = this.props.account.data;
        const { IDT, USDT, BTC, ETH } = this.props.account.data.assets;
        let item = userAccountVoList && userAccountVoList.map((cur, index, add) => {
            return <div className="account-mine-bottom-list-main" key={index.toString()}>
                <ul className="clear">
                    <li>{cur.currencyName}</li>
                    <li style={{textAlign:"right", paddingRight:'10px'}}>{cur.availableAssets}</li>
                    <li style={{textAlign:"right", paddingRight:'10px'}}>{cur.frozenAssets}</li>
                    <li style={{textAlign:"right", paddingRight:'10px'}}>{cur.cnyValuation}</li>
                    <li>
                        <button onClick={this.payCurrency.bind(this, cur.currencyType, index)}>充币</button>
                        <button onClick={this.withDrawalCurrency.bind(this, cur.currencyType, index)}>提币</button>
                    </li>
                </ul>
                <AccountPay currencyName={cur.currencyName} currencyType={cur.currencyType} addressBase64={cur.addressBase64} address={cur.address}
                            isBindAddress={cur.isBindAddress} onAccountPay={this.showFunc.bind(this)} {...this.props}/>
                <AccountWithDrawal fee={cur.fee} currencyType={cur.currencyType}
                                   currencyName={cur.currencyName} {...this.props}/>
            </div>;
        });
        return (
            <div className="account-mine">
                <div className="account-mine-center">
                    {/*<div className="clear">*/}
                        {/*<div className="clear fl">*/}
                            {/*<div className="fl account-common-color">余额：</div>*/}
                            {/*<div className="fl" style={{fontWeight: 'bold'}}>{`${USDT} USDT`}</div>*/}
                        {/*</div>*/}
                        {/*<div className="clear fl">*/}
                            {/*<div className="fl" style={{fontWeight: 'bold', marginLeft:'15px'}}>{`${IDT} IDT`}</div>*/}
                        {/*</div>*/}
                        {/*<div className="clear fl">*/}
                            {/*<div className="fl" style={{fontWeight: 'bold', marginLeft:'15px'}}>{`${ETH} ETH`}</div>*/}
                        {/*</div>*/}
                        {/*<div className="clear fl">*/}
                            {/*<div className="fl" style={{fontWeight: 'bold', marginLeft:'15px'}}>{`${BTC} BTC`}</div>*/}
                            {/*/!*<div className="fl" style={{*!/*/}
                            {/*/!*cursor: 'pointer',*!/*/}
                            {/*/!*marginLeft: '10px',*!/*/}
                            {/*/!*color: '#167aff',*!/*/}
                            {/*/!*textDecoration: 'underline'*!/*/}
                            {/*/!*}} onClick={this.exChangeFunc.bind(this)}>*!/*/}
                            {/*/!*一键闪换*!/*/}
                            {/*/!*</div>*!/*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    <div className="clear">
                        <div className="fl">
                            <span className="account-common-color">总资产估值：</span>
                            <span className="headline">{`${totalAsset} USDT`}</span>
                        </div>
                        <div className="fl">
                            <span className="account-common-color">累计收益：</span>
                            <span className="headline">{`${totalReturn} USDT`}</span>
                        </div>
                    </div>
                    <div className="clear" style={{marginBottom:'30px'}}>
                        <div className="fl">
                            <span className="account-common-color">收益盈亏：</span>
                            <span className="headline">{`${currentReturn} USDT`}</span>
                        </div>
                        {/*<div className="fl">*/}
                        {/*<span className="account-common-color">收益率：</span>*/}
                        {/*<span>{`${currentReturnPer} %`}</span>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="account-mine-middle text-right">
                    <a href={'/user/account/buy'} target="_blank">如何充币？</a>
                </div>
                <div className="account-mine-bottom">
                    <div className="account-mine-bottom-list">
                        <div className="account-mine-bottom-list-top clear">
                            <div>币种</div>
                            <div style={{textAlign:"right", paddingRight:'10px'}}>可用</div>
                            <div style={{textAlign:"right", paddingRight:'10px'}}>冻结</div>
                            <div style={{textAlign:"right", paddingRight:'10px'}}>CNY估值</div>
                            <div></div>
                        </div>
                        <div className="account-mine-bottom-list-center" ref="list">
                            {item}
                        </div>
                    </div>
                    <Modal
                        visible={accountPrimaryStatus}
                        onCancel={this.handleCancel.bind(this)}
                        footer={null}
                        width={420}
                    >
                        <div className="account-mine-activation">
                            {parseInt(authState) === 2 ? <div className="account-mine-activation-img">
                                <img src={authImg} alt=""/>
                            </div> : activationStatus ? <div className="account-mine-activation-iocn">
                                    <Icon type="check"/>
                                </div> :
                                <div className="account-mine-activation-img">
                                    <img src={location} alt=""/>
                                </div>}
                            <div style={{fontSize: '18px'}}>
                                {parseInt(authState) === 2 ? "您尚未完成实名认证，请先通过认证" : activationStatus ? '恭喜充币地址已激活成功！' : '您尚未激活充币地址，请先激活'}
                            </div>
                            {parseInt(authState) === 2 ? <div style={{justifyContent: 'space-between'}}>
                                <button onClick={this.addAuthFunc.bind(this)}>立即认证</button>
                                <button onClick={this.handleCancel.bind(this)}>取消</button>
                            </div> : activationStatus ? <div style={{justifyContent: 'center'}}>
                                    <button onClick={this.handleCancel.bind(this)}>立即充币</button>
                                </div> :
                                <div style={{justifyContent: 'space-between'}}>
                                    <button onClick={this.addFunc.bind(this)}>立即激活</button>
                                    <button onClick={this.handleCancel.bind(this)}>取消</button>
                                </div>}
                        </div>
                    </Modal>
                    <Modal
                        visible={this.state.flag}
                        onCancel={this.handleCancelFunc.bind(this)}
                        footer={null}
                        width={420}
                    >
                        <div className="account-auth-high-box">
                            <p>您尚未完成IDT高级认证，请完成高级认证才能提币</p>
                            <button onClick={this.highFunc.bind(this)}>立即高级认证</button>
                        </div>
                    </Modal>
                    <Modal
                        visible={this.state.exChange}
                        onCancel={this.exChangeCancelFunc.bind(this)}
                        footer={null}
                        width={420}
                    >
                        <div className="account-exchange-box">
                            <p><span>可用余额：</span><span>{`${assets} USDT`}</span></p>
                            <div
                                className={this.state.numFlag ? "account-exchange-all-button clear" : "account-exchange-all-button clear account-input-border"}>
                                <InputNumber className="fl" width={"100%"} min={10}
                                             value={this.state.defaultMoney === '' ? '' : this.state.defaultMoney}
                                             onChange={this.onChangeNumber.bind(this)}/>
                                <button className="fl" onClick={this.allFunc.bind(this)}>全部</button>
                            </div>
                            {this.state.numFlag ? <i></i> : <i>输入有误</i>}
                            <p><span>IDT实时价格：</span><span>{`${idtRate} USDT`}</span></p>
                            <input ref="money" type="text" disabled="disabled" value={this.state.accountMoney}
                                   className="account-exchange-box-input"/>
                            <div className="account-exchange-box-button">
                                <button onClick={this.exChangeSend.bind(this)}>确认兑换</button>
                            </div>
                            <div className="account-exchange-info">
                                <p>温馨提示</p>
                                <p>• 最小兑换数量为：10 USDT。</p>
                                <p>• 为保障资金安全，暂时不支持IDT兑换USDT，请用户谨慎操作</p>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>

        );
    }
}