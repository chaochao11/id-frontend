import React from "react";
import { Icon } from 'antd';
import { AccountSecurityBindPhone, AccountSecuritySendPhone, AccountHighStatus } from './../../../../actions/account';

let reg = /^((1[3-8][0-9])+\d{8})$/;
export default class AccountChangePhone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPhone:true,
            code:true
        };
    }
    sendPhone () {
        let btn = this.refs.captcha;
        let time = 60;
        let old = this.refs.old.value.trim();
        const { dispatch } = this.props;
        if (!old) {
            this.setState({
                oldPhone:false
            });
            return false;
        }
        if(!this.state.oldPhone) {
            this.setState({
                oldPhone: false
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
            phone:old
        };
        dispatch(AccountSecuritySendPhone(init));
    }
    oldInputFunc () {
        let old = this.refs.old.value.trim();
        if(!reg.test(old)) {
            this.setState({
                oldPhone: false
            });
        }else{
            this.setState({
                oldPhone: true
            });
        }
    }
    codeBlurFunc () {
        let code = this.refs.vCode.value.trim();
        if(!code) {
            this.setState({
                code: false
            });
        }else{
            this.setState({
                code: true
            });
        }
    }
    sendPhoneFunc () {
        let old = this.refs.old.value.trim();
        let code = this.refs.vCode.value.trim();
        const { dispatch } = this.props;
        let sendBtn = this.refs.sendBtn;
        if(!old) {
            this.setState({
                oldPhone:false
            });
            return false;
        }
        if(!this.state.oldPhone) {
            this.setState({
                oldPhone: false
            });
            return false;
        }
        if(!code) {
            this.setState({
                code:false
            });
            return false;
        }
        sendBtn.setAttribute('disabled', 'disabled');
        let init = {
            mobilephone: old,
            vcode: code
        };
        dispatch(AccountSecurityBindPhone(init, this.refs.old, this.refs.vCode, sendBtn));
    }
    offChange () {
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
    render() {
        const { accountFlag, phoneNum } = this.props.accountHighStatus;
        return (
            <div className={`account-change-phone ${!accountFlag && phoneNum === 2 ? "show" : "hide"}`}>
                <div className="account-change-phone-title clear">
                    <span className="fl" style={{fontWeight:'bold', fontSize:'16px'}}>绑定手机号</span>
                    <span className="fr" style={{lineHeight:'24px', color:'#a7a7a7', cursor:'pointer'}} onClick={this.offChange.bind(this)}><Icon type="left" />返回账户安全</span>
                </div>
                <div className="account-change-phone-center">
                    <div className="account-change-phone-main">
                        <div className="clear account-change-phone-main-fir">
                            <div className="fl">
                                手机号
                            </div>
                            <input ref="old" className={this.state.oldPhone ? "fl" : "fl account-input-border"} onInput={this.oldInputFunc.bind(this)} placeholder="请输入手机号" type="text"/>
                        </div>
                        {this.state.oldPhone ? <p> </p> : <p>*手机号格式有误</p>}
                        <div className="clear account-change-phone-main-sec">
                            <div className="fl">
                                手机验证码
                            </div>
                            <div className={this.state.code ? "fl clear" : "fl clear account-input-border" }>
                                <input ref="vCode" onBlur={this.codeBlurFunc.bind(this)} className="fl" type="text"/>
                                <button className="fr" ref="captcha" onClick={this.sendPhone.bind(this)}>获取验证码</button>
                            </div>
                        </div>
                        {this.state.code ? <p> </p> : <p>*手机号验证码有误</p>}
                        <div className="clear account-chnage-phone-main-thr">
                            <div className="fl">

                            </div>
                            <button className="fl" ref='sendBtn' onClick={this.sendPhoneFunc.bind(this)}>绑定</button>
                        </div>
                    </div>
                </div>
                <div className="account-change-phone-info">
                    <p>温馨提示</p>
                    <p>• 绑定手机号后24小时内禁止提币。</p>
                </div>
            </div>
        );
    }
}


