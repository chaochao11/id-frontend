import React from "react";
import { Icon, message } from 'antd';
import { AccountHighStatus, AccountSecuritySendPhone, ChangeGaAuth } from './../../../../actions/account';

const base = 'data:image/png;base64,';
export default class ChangeGA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone:true,
            ga:true
        };
    }

    offChange() {
        const {dispatch} = this.props;
        let init = {
            phoneNum: 0,
            emailNum: 0,
            authNum: 0,
            nameAuthNum: 0,
            openGa: 0,
            closeGa: 0,
            changeGa: 0,
            accountFlag: true
        };
        dispatch(AccountHighStatus(init));
    }

    copyFunc() {
        let address = this.refs.address;
        address.focus();
        address.setSelectionRange(0, address.value.length);
        document.execCommand("Copy", true);
        message.success('复制成功');
    }

    changeGaFunc() {
        let phone = this.refs.phone.value.trim();
        let auth = this.refs.auth.value.trim();
        const {dispatch} = this.props;
        const { secretKey } = this.props.openGaAuthInfo.data;
        const { mobilephone } = this.props.accountSecurityInfo.data;
        if (!phone) {
            this.setState({
                phone:false
            });
            return false;
        }
        if (!auth) {
            this.setState({
                ga:false
            });
            return false;
        }
        let init = {
            secretKey: secretKey,
            googleCode: auth,
            phoneCode: phone,
            phone: mobilephone
        };
        dispatch(ChangeGaAuth(init));
    }

    sendPhone() {
        let btn = this.refs.captcha;
        let time = 60;
        const {dispatch} = this.props;
        const {mobilephone} = this.props.accountSecurityInfo.data;
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
            phone: mobilephone
        };
        dispatch(AccountSecuritySendPhone(init));
    }

    render() {
        const {accountFlag, changeGa} = this.props.accountHighStatus;
        const {secretKey, secretKeyBase64} = this.props.openGaAuthInfo.data;
        return (
            <div className={`account-change-ga ${!accountFlag && changeGa === 6 ? "show" : "hide"}`}>
                <div className="account-ga-title clear">
                    <span className="fl" style={{fontWeight: 'bold', fontSize: '16px'}}>更换谷歌验证器</span>
                    <span className="fr" style={{lineHeight: '24px', color: '#a7a7a7', cursor: 'pointer'}}
                          onClick={this.offChange.bind(this)}><Icon type="left"/>返回账户安全</span>
                </div>
                <div className="account-ga-center">
                    <div className="account-change-ga-top clear">
                        <div className="fl">
                            <img src={base + secretKeyBase64} alt=""/>
                        </div>
                        <div className="fl">
                            <span>密钥 用于找回谷歌验证器，请妥善保存</span>
                            <input type="text" ref="address" onChange={() => {
                            }} value={secretKey}/>
                            <button onClick={this.copyFunc.bind(this)}>复制</button>
                        </div>
                    </div>
                    <div className="account-change-ga-bottom">
                        <div className="account-change-ga-bottom-wrap-one clear">
                            <span className="fl">手机验证码</span>
                            <input className={this.state.phone ? "fl" : "fl account-input-border"} ref="phone" type="text"/>
                            <span className="fl" ref="captcha" style={{color: '#167aff', cursor: 'pointer'}}
                                  onClick={this.sendPhone.bind(this)}>获取验证码</span>
                        </div>
                        <div className="account-change-ga-bottom-wrap-two clear">
                            <span className="fl">谷歌验证码</span>
                            <input className={this.state.ga ? "fl" : "fl account-input-border"} ref="auth" type="text"/>
                        </div>
                        <button style={{display: 'block', margin: '0 auto'}} onClick={this.changeGaFunc.bind(this)}>更换
                        </button>

                    </div>
                </div>
            </div>

        );
    }
}


