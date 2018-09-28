import React from "react";
import AccountBindEmail from './bindEmail/accountBindEmail';
import AccountBindPhone from './bindPhone/accountBindPhone';
import AccountCertification from './certification/accountCertification';
import RealNameAuthPage from './realName/real_name_auth_page';
import OpenGA from './googleAuth/openGA';
import CloseGA from './googleAuth/closeGA';
import ChangeGA from './googleAuth/changeGA';
import {AccountSecurityInfo, AccountPrimaryStatus, AccountHighStatus} from './../../../actions/account';
import {OpenGaAuth} from "../../../actions/account";
import {message} from 'antd';

export default class AccountSecurity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    bindEmail() {
        const {dispatch} = this.props;
        let init = {
            phoneNum: 0,
            emailNum: 1,
            authNum: 0,
            nameAuthNum: 0,
            openGa: 0,
            closeGa: 0,
            changeGa: 0,
            accountFlag: false
        };
        dispatch(AccountHighStatus(init));
    }

    bindPhone() {
        const {dispatch} = this.props;
        let init = {
            phoneNum: 2,
            emailNum: 0,
            authNum: 0,
            nameAuthNum: 0,
            openGa: 0,
            closeGa: 0,
            changeGa: 0,
            accountFlag: false
        };
        dispatch(AccountHighStatus(init));
    }

    bindAuth() {
        const {dispatch} = this.props;
        const authState = localStorage.getItem("authState");
        if (parseInt(authState) === 2) {
            dispatch(AccountPrimaryStatus(true));
            return false;
        }
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
        dispatch(AccountHighStatus(init));
    }

    bindPrimaryStatus() {
        const {dispatch} = this.props;
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
        dispatch(AccountHighStatus(init));
    }

    bindGaAuth() {
        const {mobilephone} = this.props.accountSecurityInfo.data;
        if (!mobilephone) {
            message.warning('请先绑定手机号');
            return false;
        }
        const {dispatch} = this.props;
        let init = {
            phoneNum: 0,
            emailNum: 0,
            authNum: 0,
            nameAuthNum: 0,
            openGa: 5,
            closeGa: 0,
            changeGa: 0,
            accountFlag: false
        };
        dispatch(OpenGaAuth());
        dispatch(AccountHighStatus(init));
    }

    changeGaAuth() {
        const {dispatch} = this.props;
        let init = {
            phoneNum: 0,
            emailNum: 0,
            authNum: 0,
            nameAuthNum: 0,
            openGa: 0,
            closeGa: 0,
            changeGa: 6,
            accountFlag: false
        };
        dispatch(OpenGaAuth());
        dispatch(AccountHighStatus(init));
    }

    closeGaAuth() {
        const {dispatch} = this.props;
        let init = {
            phoneNum: 0,
            emailNum: 0,
            authNum: 0,
            nameAuthNum: 0,
            openGa: 0,
            closeGa: 7,
            changeGa: 0,
            accountFlag: false
        };
        dispatch(AccountHighStatus(init));
    }

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(AccountSecurityInfo());
    }

    render() {
        const {email, mobilephone, uid, loginname, highQICStatus, googleSecretStatus} = this.props.accountSecurityInfo.data;
        const {accountFlag} = this.props.accountHighStatus;
        const authState = localStorage.getItem("authState");
        return (
            <div className="account-security">
                <div className={`account-security-top ${accountFlag ? "show" : 'hide'}`}>
                    <div className="account-security-title">
                        基本信息
                    </div>
                    <div className="account-security-info clear" style={{margin: '20px 0'}}>
                        <div>
                            <span style={{color: '#a7a7a7', marginRight: '10px'}}>账号</span>
                            <span>{loginname}</span>
                        </div>
                        <div>
                            <span style={{color: '#a7a7a7', marginRight: '10px'}}>UID</span>
                            <span>{uid}</span>
                        </div>
                    </div>
                </div>
                <div className={`account-security-bottom ${accountFlag ? "show" : "hide"}`}>
                    <div className="account-security-title">
                        安全认证
                    </div>
                    <div className="account-security-set" style={{margin: '20px 0'}}>
                        <div className="clear account-security-set-fir">
                            <div>
                                <span style={{marginRight: '10px', color: '#a7a7a7'}}>邮箱</span>
                                <span style={!email ? {color: '#ff9933'} : {}}>{!email ? "未绑定" : email}</span>
                            </div>
                            <div style={{color: '#a7a7a7'}}>
                                【用于提币，找回密码】
                            </div>
                            <div>
                                {!email ?
                                    <span style={{color: '#167aff', textDecoration: 'underline', cursor: 'pointer'}}
                                          onClick={this.bindEmail.bind(this)}>绑定</span> : <span></span>}
                            </div>
                        </div>
                        <div className="clear account-security-set-sec">
                            <div>
                                <span style={{marginRight: '10px', color: '#a7a7a7'}}>手机</span>
                                <span
                                    style={!mobilephone ? {color: '#ff9933'} : {}}>{!mobilephone ? "未绑定" : "已绑定"}</span>
                            </div>
                            <div style={{color: '#a7a7a7'}}>
                                【用于提币，找回密码】
                            </div>
                            <div>
                                <span style={{color: '#167aff', textDecoration: 'underline', cursor: 'pointer'}}
                                      onClick={this.bindPhone.bind(this)}>{!mobilephone ? '绑定' : '修改'}</span>
                            </div>
                        </div>
                        <div className="clear account-security-set-four">
                            <div>
                                <span style={{marginRight: '10px', color: '#a7a7a7'}}>实名认证</span>
                                <span
                                    style={parseInt(authState) === 2 ? {color: '#ff9933'} : {}}>{parseInt(authState) === 2 ? "未认证" : "已认证"}</span>
                            </div>
                            <div style={{color: '#a7a7a7'}}>
                                【用于提币】
                            </div>
                            <div>
                                <span style={{color: '#167aff', textDecoration: 'underline', cursor: 'pointer'}}
                                      onClick={parseInt(authState) === 2 ? this.bindPrimaryStatus.bind(this) : () => {
                                      }}>{parseInt(authState) === 2 ? '未认证' : '已认证'}</span>
                            </div>
                        </div>
                        <div className="clear account-security-set-thr">
                            <div>
                                <span style={{marginRight: '10px', color: '#a7a7a7'}}>高级认证</span>
                                <span
                                    style={parseInt(highQICStatus) === 0 ? {color: '#ff9933'} : {}}>{parseInt(highQICStatus) === 0 ? "未认证" : parseInt(highQICStatus) === 1 ? "待审核" : parseInt(highQICStatus) === 2 ? "认证失败" : parseInt(highQICStatus) === 3 ? "已认证" : "未认证"}</span>
                            </div>
                            <div style={{color: '#a7a7a7'}}>
                                【用于提币】
                            </div>
                            <div>
                                <span style={{color: '#167aff', textDecoration: 'underline', cursor: 'pointer'}}
                                      onClick={this.bindAuth.bind(this)}>{parseInt(highQICStatus) === 0 ? "未认证" : parseInt(highQICStatus) === 1 ? "待审核" : parseInt(highQICStatus) === 2 ? "认证失败" : parseInt(highQICStatus) === 3 ? "已认证" : "未认证"}</span>
                            </div>
                        </div>
                        <div className="clear account-security-set-five">
                            <div>
                                <span style={{marginRight: '10px', color: '#a7a7a7'}}>谷歌认证</span>
                                <span
                                    style={parseInt(googleSecretStatus) === 2 ? {} : {color: '#ff9933'}}>{parseInt(googleSecretStatus) === 1 ? '未绑定' : parseInt(googleSecretStatus) === 2 ? '已绑定' : parseInt(googleSecretStatus) === 3 ? '已关闭' : ''}</span>
                            </div>
                            <div style={{color: '#a7a7a7'}}>
                                【用于登录、提币、找回密码、修改安全设置】
                            </div>
                            {parseInt(googleSecretStatus) === 1 || parseInt(googleSecretStatus) === 3 ? <div>
                                <span style={{color: '#167aff', textDecoration: 'underline', cursor: 'pointer'}}
                                      onClick={this.bindGaAuth.bind(this)}>开启</span>
                            </div> : <div>
                                <span style={{
                                    color: '#167aff',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                                      onClick={this.changeGaAuth.bind(this)}>更换</span>
                                <span style={{color: '#167aff', textDecoration: 'underline', cursor: 'pointer'}}
                                      onClick={this.closeGaAuth.bind(this)}>关闭</span>
                            </div>}
                        </div>
                    </div>
                </div>
                <AccountBindEmail {...this.props} />
                <AccountBindPhone {...this.props} />
                <AccountCertification {...this.props}/>
                <RealNameAuthPage {...this.props}/>
                <OpenGA {...this.props}/>
                <CloseGA {...this.props}/>
                <ChangeGA {...this.props}/>
            </div>
        );
    }
}


