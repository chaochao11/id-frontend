import React from "react";
import {Icon, message} from 'antd';
import {AccountHighStatus, AgainOpenGaAuth, AccountSecuritySendPhone, BindGaAuth} from './../../../../actions/account';
import googleImg from './../../../../../public/img/google-play.png';

const base = 'data:image/png;base64,';
export default class OpenGA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: true,
            ga: true,
            again: true
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

    bindGaFunc() {
        let phone = this.refs.phone.value.trim();
        let auth = this.refs.auth.value.trim();
        const {dispatch} = this.props;
        const {secretKey} = this.props.openGaAuthInfo.data;
        const {mobilephone} = this.props.accountSecurityInfo.data;
        if (!phone) {
            this.setState({
                phone: false
            });
            return false;
        }
        if (!auth) {
            this.setState({
                ga: false
            });
            return false;
        }
        let init = {
            secretKey: secretKey,
            googleCode: auth,
            phoneCode: phone,
            phone: mobilephone
        };
        dispatch(BindGaAuth(init));
    }
    openAgainGaFunc () {
        let again = this.refs.again.value.trim();
        const {dispatch} = this.props;
        if (!again) {
            this.setState({
                again: false
            });
            return false;
        }
        let init = {
            googleCode: again
        };
        dispatch(AgainOpenGaAuth(init));
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
        const { accountFlag, openGa } = this.props.accountHighStatus;
        const { googleSecretStatus } = this.props.accountSecurityInfo.data;
        const { secretKey, secretKeyBase64 } = this.props.openGaAuthInfo.data;

        return (
            <div className={`account-open-ga ${!accountFlag && openGa === 5 ? "show" : "hide"}`}>
                <div className="account-ga-title clear">
                    <span className="fl" style={{
                        fontWeight: 'bold',
                        fontSize: '16px'
                    }}>{parseInt(googleSecretStatus) === 1 ? '绑定谷歌验证器' : '开启谷歌验证器'}</span>
                    <span className="fr" style={{lineHeight: '24px', color: '#a7a7a7', cursor: 'pointer'}}
                          onClick={this.offChange.bind(this)}><Icon type="left"/>返回账户安全</span>
                </div>
                {parseInt(googleSecretStatus) === 1 ? <div className="account-ga-center">
                    <div className="account-ga-center-top">
                        <p>
                            <span>1、下载谷歌验证器APP</span><span style={{
                            marginLeft: '20px',
                            textDecoration: 'underline',
                            color: '#167aff',
                            cursor: 'pointer'
                        }}>什么是谷歌验证器？</span>
                        </p>
                        <p style={{textIndent: '22px'}}>iOS用户登录App Store搜索“Authenticator”下载。</p>
                        <p style={{textIndent: '22px'}}>安卓用户登录应用商店或使用手机浏览器搜索“谷歌验证器”下载。</p>
                        <div className="account-ga-center-download clear">
                            <a target="_blank"
                               href="https://itunes.apple.com/cn/app/google-authenticator/id388497605?mt=8"><Icon
                                type="apple"/><span>APP Store</span></a>
                            <a target="_blank"
                               href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"><img
                                src={googleImg} alt=""/><span>Google Play</span></a>
                        </div>
                    </div>
                    <div className="account-ga-center-middle">
                        <p>2、在谷歌验证器中添加密钥并备份</p>
                        <p style={{textIndent: '22px'}}>打开谷歌验证器，扫描下方二维码或手动输入下述密钥添加验证令牌。</p>
                        <p style={{textIndent: '22px', color: '#d8565d'}}>密钥用于手机更换或遗失时找回谷歌验证器，绑定前请务必将下述密钥备份保存</p>
                        <div className="clear account-ga-center-middle-img">
                            <div className="fl">
                                <img src={base + secretKeyBase64} alt=""/>
                            </div>
                            <div className="fl">
                                <span>秘钥</span>
                                <input type="text" ref="address" onChange={() => {
                                }} value={secretKey}/>
                                <button onClick={this.copyFunc.bind(this)}>复制</button>
                            </div>
                        </div>
                    </div>
                    <div className="account-ga-center-bottom">
                        <p>3、绑定</p>
                        <div className="account-ga-center-bottom-wrap">
                            <div className="account-ga-center-bottom-wrap-one clear">
                                <span className="fl">手机验证码</span>
                                <input className={this.state.phone ? "fl" : "fl account-input-border"} ref="phone"
                                       type="text"/>
                                <span className="fl" ref="captcha" style={{color: '#167aff', cursor: 'pointer'}}
                                      onClick={this.sendPhone.bind(this)}>获取验证码</span>
                            </div>
                            <div className="account-ga-center-bottom-wrap-two clear">
                                <span className="fl">谷歌验证码</span>
                                <input className={this.state.ga ? "fl" : "fl account-input-border"} ref="auth"
                                       type="text"/>
                            </div>
                            <button style={{display: 'block', margin: '0 auto'}}
                                    onClick={this.bindGaFunc.bind(this)}>绑定
                            </button>
                        </div>
                    </div>
                </div> : <div className="account-ga-again-center">
                    <div className="account-ga-center-bottom-wrap-two clear">
                        <span className="fl">谷歌验证码</span>
                        <input className={this.state.again ? "fl" : "fl account-input-border"} ref="again" type="text"/>
                    </div>
                    <button style={{display: 'block', margin: '0 auto'}}
                            onClick={this.openAgainGaFunc.bind(this)}>开启
                    </button>
                </div>}
            </div>

        );
    }
}


