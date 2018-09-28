import React from "react";
import { Icon } from 'antd';
import { AccountHighStatus, AccountSecuritySendPhone, CloseGaAuth } from './../../../../actions/account';


export default class CloseGA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone:true,
            ga:true
        };
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
    changeGaFunc () {
        let phone = this.refs.phone.value.trim();
        let auth = this.refs.auth.value.trim();
        const {dispatch} = this.props;
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
            googleCode: auth,
            phoneCode: phone,
            phone: mobilephone
        };
        dispatch(CloseGaAuth(init));
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
        const { accountFlag, closeGa } = this.props.accountHighStatus;

        return (
            <div className={`account-close-ga ${!accountFlag && closeGa === 7 ? "show" : "hide"}`}>
                <div className="account-ga-title clear">
                    <span className="fl" style={{fontWeight: 'bold', fontSize: '16px'}}>关闭谷歌验证器</span>
                    <span className="fr" style={{lineHeight: '24px', color: '#a7a7a7', cursor: 'pointer'}}
                          onClick={this.offChange.bind(this)}><Icon type="left"/>返回账户安全</span>
                </div>
                <div className="account-close-ga-bottom">
                    <div className="account-close-ga-bottom-wrap-one clear">
                        <span className="fl">手机验证码</span>
                        <input className={this.state.phone ? "fl" : "fl account-input-border"} ref="phone" type="text"/>
                        <span className="fl" ref="captcha" style={{color:'#167aff', cursor:'pointer'}} onClick={this.sendPhone.bind(this)}>获取验证码</span>
                    </div>
                    <div className="account-close-ga-bottom-wrap-two clear">
                        <span className="fl">谷歌验证码</span>
                        <input className={this.state.ga ? "fl" : "fl account-input-border"} ref="auth" type="text"/>
                    </div>
                    <button style={{display:'block', margin:'0 auto'}} onClick={this.changeGaFunc.bind(this)}>关闭</button>

                </div>
            </div>

        );
    }
}


