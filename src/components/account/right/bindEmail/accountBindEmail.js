import React from "react";
import {Icon, message} from 'antd';
import {AccountSecurityBindEmail, AccountSecuritySendEmail, AccountHighStatus} from './../../../../actions/account';

let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
export default class AccountBindEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: true,
            email: true,
            code: true
        };
    }

    sendEmail() {
        let btn = this.refs.captcha;
        let time = 60;
        let email = this.refs.email.value.trim();
        const {dispatch} = this.props;
        if (!email) {
            this.setState({
                email: false
            });
            return false;
        }
        if (!this.state.email) {
            this.setState({
                email: false
            });
            return false;
        }
        btn.setAttribute('disabled', 'disabled');
        let timer = setInterval(function () {
            time--;
            if (time < 0) {
                reButton();
            } else {
                btn.innerText = `${time}s后重新发送`;
            }
        }, 1000);
        const reButton = () => {
            clearInterval(timer);
            btn.removeAttribute('disabled', 'disabled');
            btn.innerText = `获取验证码`;
        };
        let init = {
            email: email
        };
        dispatch(AccountSecuritySendEmail(init));
    }

    offChange() {
        const {dispatch} = this.props;
        let init = {
            phoneNum:0,
            emailNum:0,
            authNum:0,
            nameAuthNum:0,
            openGa:0,
            closeGa:0,
            changeGa:0,
            accountFlag:true
        };
        dispatch(AccountHighStatus(init));
    }

    emailInput() {
        let email = this.refs.email.value.trim();
        if (!reg.test(email)) {
            this.setState({
                email: false
            });
        } else {
            this.setState({
                email: true
            });
        }
    }

    bindEmailHandler() {
        const {dispatch} = this.props;
        let email = this.refs.email.value.trim();
        let vCode = this.refs.vCode.value.trim();
        let sendBtn = this.refs.sendBtn;
        if (!email) {
            this.setState({
                email: false
            });
            return false;
        }
        if (!this.state.email) {
            this.setState({
                email: false
            });
            return false;
        }
        if (!vCode) {
            this.setState({
                code: false
            });
            return false;
        }
        sendBtn.setAttribute('disabled', 'disabled');
        let init = {
            email: email,
            vcode: vCode
        };
        dispatch(AccountSecurityBindEmail(init, this.refs.email, this.refs.vCode, sendBtn));
    }

    render() {
        const { accountFlag, emailNum } = this.props.accountHighStatus;
        return (
            <div
                className={`account-bind-email ${!accountFlag && emailNum === 1 ? "show" : "hide"}`}>
                <div className="account-bind-email-title clear">
                    <span className="fl" style={{fontWeight: 'bold', fontSize: '16px'}}>邮箱绑定</span>
                    <span className="fr" style={{lineHeight: '24px', color: '#a7a7a7', cursor: 'pointer'}}
                          onClick={this.offChange.bind(this)}><Icon type="left"/>返回账户安全</span>
                </div>
                <div className="account-bind-email-center">
                    <div className="account-bind-email-main">
                        <div className="clear account-bind-email-main-fir">
                            <div className="fl">
                                邮箱
                            </div>
                            <input className={this.state.email ? "fl" : "fl account-input-border"}
                                   onInput={this.emailInput.bind(this)} ref='email' placeholder="请输入您的邮箱" type="text"/>
                        </div>
                        {this.state.email ? <p></p> : <p>*邮箱格式有误</p>}
                        <div className="clear account-bind-email-main-sec">
                            <div className="fl">
                                邮箱验证码
                            </div>
                            <div className={this.state.code ? "fl clear" : "fl clear account-input-border"}>
                                <input className="fl" ref="vCode" type="text"/>
                                <button className="fr" ref="captcha" onClick={this.sendEmail.bind(this)}>获取验证码</button>
                            </div>
                        </div>
                        {this.state.code ? <p></p> : <p>*请输入邮箱验证码</p>}
                        <div className="clear account-bind-email-main-thd">
                            <div className="fl">

                            </div>
                            <button className="fl" ref='sendBtn' onClick={this.bindEmailHandler.bind(this)}>绑定</button>
                        </div>
                    </div>
                </div>
                <div className="account-bind-email-info">
                    <p>温馨提示 </p>
                    <p>• 邮箱绑定后不可更换。</p>
                </div>
            </div>
        );
    }
}


