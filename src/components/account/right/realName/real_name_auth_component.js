import React, {Component} from "react";
import { connect } from 'react-redux';
import {Icon, message} from "antd";
import axios from "axios";
import {withRouter} from 'react-router-dom';
import {ROOT_USER, getAuthorizedHeader} from "./../../../../actions/types";
import './real_name_auth_component.css';
import { AccountHighStatus } from './../../../../actions/account';
import success from './../../../../../public/img/real_name_auth_success.png';
import fail from './../../../../../public/img/real_name_auth_fail.png';



/**
 * @description 将用户姓名转换为省略形式
 * @param {String} name 用户姓名
 */
function convertRealName(name) {
    if (typeof name !== "string") {
        return "";
    }
    return name
        .split("")
        .map((char, index) => {
            return index === 0 ? char : "*";
        })
        .join("");
}

/**
 * @description 将身份证号码转换为省略形式
 * @param {String} idNumber 身份证号码
 */
function convertedIDNumber(idNumber) {
    if (typeof name !== "string") {
        return "";
    }
    let reg = /^(\d{4})(\d+)((\d{3}$)|(\d{2}(\d|X|x)$))/;
    return idNumber.replace(reg, (p0, p1, p2, p3) => {
        return p1 + "********" + p3;
    });
}

/**
 * @description 用户实名认证状态
 * @see state.authState
 */
const AUTH_SUCCESS = "AUTH_SUCCESS";
const AUTH_INIT = "AUTH_INIT";
const AUTH_FAIL = "AUTH_FAIL";

class RealNameAuthComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            /**
             * @description 用户输入的真实姓名
             */
            name: "",
            /**
             * @description 用户身份证号码
             */
            idNumber: "",
            /**
             * @description 用户输入的身份证号码是否符合格式
             */
            isIDNumberInvalid: false,

            /**
             * @description 用户输入的姓名是否符合格式
             */
            isUserNameInvalid: false,

            /**
             * @description 认证状态
             * AUTH_INIT 表示用户输入认证信息 显示用户信息输入界面 点击「重新认证」按钮将回到这一状态
             * AUTH_SUCCESS 表示成功 显示认证成功界面
             * AUTH_FAIL 表示失败 显示认证失败界面
             */
            authState: AUTH_INIT,

            /**
             * @description 请求服务端认证之后进过转化的用户姓名和身份证号码
             * 尹*
             * 3211************431x
             */
            authedName: "",
            authedIDNumber: "",

            authing: false,

            /**
             * @description 用户输入的姓名和身份证号码已经实名认证过
             */
            IDHasAlreadyAuthed: false,
        };

        this.handleIDChange = this.handleIDChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAuth = this.handleAuth.bind(this);
        this.handleAuth = this.handleAuth.bind(this);
        this.checkIDNumber = this.checkIDNumber.bind(this);
        this.authAgain = this.authAgain.bind(this);
        this.backToUserAccount = this.backToUserAccount.bind(this);
        this.checkUserName = this.checkUserName.bind(this);
    }

    /**
     * @description 身份证输入框 change 事件监听函数 记录用户输入的身份证
     * @param {Object} event 事件对象
     */
    handleIDChange(event) {
        this.setState({idNumber: event.target.value.trim()});
    }

    /**
     * @description 用户姓名输入框 change 事件监听函数 记录用户输入的姓名
     * @param {Object} event 事件对象
     */
    handleNameChange(event) {
        this.setState({name: event.target.value.trim()});
    }

    /**
     * @description 提交认证信息
     */
    handleAuth() {
        if (!this.state.name) {
            message.warning("请填写姓名");
            this.nameInput.focus();
            return;
        }
        if (!this.state.idNumber) {
            message.warning("请填写身份证号码");
            this.IDInput.focus();
            return;
        }
        if (this.state.isUserNameInvalid) {
            message.warning("姓名不符合格式！请重新输入");
            this.nameInput.focus();
            return;
        }
        if (this.state.isIDNumberInvalid) {
            message.warning("身份证号码不符合格式！请重新输入");
            this.IDInput.focus();
            return;
        }

        this.postAuthInfo();
    }

    /**
     * @description 向服务端发送认证信息 请求认证
     */
    postAuthInfo() {
        this.setState({authing: true});
        const POST_AUTH_URL = `${ROOT_USER}/user/qic`;

        const params = {
            uid: localStorage.getItem("userId"),
            realName: this.state.name,
            idNumber: this.state.idNumber,
        };

        axios
            .post(POST_AUTH_URL, params, {headers: getAuthorizedHeader()})
            .then((response) => {
                if (response.status === 200 && response.data.status === 1) {
                    this.setState({
                        authedName: convertRealName(response.data.data.realName),
                        authedIDNumber: convertedIDNumber(response.data.data.idNumber),
                        authState: AUTH_SUCCESS,
                        authing: false,
                    });
                    localStorage.setItem("authState", 1);
                    message.success("恭喜您已获得66IDT，请在账户我的奖励中领取，交易资料请关注微信公众号领取");
                } else {
                    this.setState({
                        authedName: convertRealName(response.data.data.realName),
                        authedIDNumber: convertedIDNumber(response.data.data.idNumber),
                        authState: AUTH_FAIL,
                        authing: false,
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    authedName: convertRealName(this.state.name),
                    authedIDNumber: convertedIDNumber(this.state.idNumber),
                    authState: AUTH_FAIL,
                    authing: false,
                });
            });
    }

    /**
     * @description 校验身份证号是否符合格式
     */
    checkIDNumber() {
        if (!this.state.idNumber) {
            return;
        }
        const IDReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!IDReg.test(this.state.idNumber)) {
            this.setState({isIDNumberInvalid: true});
        } else {
            this.setState({isIDNumberInvalid: false});
        }
    }

    /**
     * @description 检验用户姓名是否符合格式
     */
    checkUserName() {
        if (!this.state.name) {
            return;
        }
        const nameReg = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/;
        if (!nameReg.test(this.state.name)) {
            this.setState({isUserNameInvalid: true});
        } else {
            this.setState({isUserNameInvalid: false});
        }
    }

    /**
     * @description 重新认证
     */
    authAgain() {
        this.setState({authState: AUTH_INIT});
    }

    /**
     * @description 回到用户账户界面
     */
    backToUserAccount() {
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
        this.props.AccountHighStatus(init);
    }

    render() {
        return (
            <div
                className="real-name-auth-container"
            >
                <div className="title-section clear">
                    <h3 className="title">实名认证</h3>
                    <span className="back-link" onClick={this.backToUserAccount}>
            <Icon type="left"/>
            返回账户安全
          </span>
                </div>

                {/* 用户信息输入区域 开始 */}
                {this.state.authState === AUTH_INIT && (
                    <div className="input-container">
                        <div className="name-group input-group clear">
              <span>
                <i>*</i>真实姓名
              </span>
                            <input
                                type="text"
                                placeholder="请输入姓名"
                                onChange={this.handleNameChange}
                                onBlur={this.checkUserName}
                                ref={(input) => (this.nameInput = input)}
                            />
                        </div>
                        <div className="id-number-group input-group clear">
              <span>
                <i>*</i>身份证号码
              </span>
                            <input
                                type="text"
                                placeholder="请输入身份证号码"
                                onChange={this.handleIDChange}
                                onBlur={this.checkIDNumber}
                                ref={(input) => (this.IDInput = input)}
                            />
                        </div>
                        {this.state.IDHasAlreadyAuthed && (
                            <div className="auth-tip-group input-group clear">
                                <span/>
                                <p>
                                    <Icon type="exclamation-circle-o"/>身份信息已经实名认证！
                                </p>
                            </div>
                        )}

                        <div className="auth-btn-group input-group clear">
                            <span/>
                            <button id="auth" className="auth-btn" onClick={this.handleAuth}>
                                {this.state.authing ? "认证中..." : "认证"}
                            </button>
                        </div>
                    </div>
                )}
                {/* 用户信息输入区域 结束 */}

                {/* 认证状态区域 开始 */}
                {this.state.authState !== AUTH_INIT && (
                    <div className="auth-state-container">
                        <div className="auth-state-picture">
                            <img
                                src={
                                    this.state.authState === AUTH_SUCCESS
                                        ? success
                                        : fail
                                }
                                width="100px"
                                height="100px"
                                alt="实名认证"
                            />
                            <p
                                style={{
                                    color: this.state.authState === AUTH_SUCCESS ? "#58ac75" : "#d86666",
                                }}
                            >
                                {this.state.authState === AUTH_SUCCESS ? "实名认证成功" : "实名认证失败"}
                            </p>
                        </div>
                        <div className="auth-state-result">
                            <p>姓名：{this.state.authedName}</p>
                            <p>身份证号码：{this.state.authedIDNumber}</p>
                            {this.state.authState === AUTH_FAIL && (
                                <button className="auth-again-btn" onClick={this.authAgain}>
                                    重新认证
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {/* 认证状态区域 结束 */}
            </div>
        );
    }
}


export default withRouter(connect(null, { AccountHighStatus })(RealNameAuthComponent));
