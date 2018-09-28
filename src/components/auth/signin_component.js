import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { setUserInfoToLocalStorage, automaticLogin } from "../../actions/auth";
import { ROOT_USER } from "../../actions/types";
import { AccountHighStatus } from "./../../actions/account.js";
import initGeetest from "./gt";
import "./signin&signup.css";
import { accountValue } from "./../../tools/config";

class SigninComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 手机号码或者邮箱提示
      accountTip: "",

      // 密码提示
      passwordTip: "",

      // 滑块验证提示
      behaviorVerificationTip: "",

      // 谷歌验证提示
      googleVerifyTip: "",

      // 用户登录手机号
      account: "",

      // 用户登录密码
      password: "",

      // 用户输入的谷歌验证码
      googleVerifyCode: "",

      fetchingBehaviorVerificationInfo: false,

      fetchBehaviorVerificationInfoError: false,

      // 正在登录中
      logining: false,

      // 检查用户输入的谷歌验证码中
      checkingGoogleVerifyCode: false,

      // 服务端登录提示
      serverTip: "",

      isGoogleVerifyDisplay: false,
    };

    this.behaviorVerificationPassed = false;

    this.from = this.props.from || "";

    this.setAccount = this.setAccount.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.postSignin = this.postSignin.bind(this);
    this.handleSigninSubmit = this.handleSigninSubmit.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.checkAccount = this.checkAccount.bind(this);
    this.showLeadUserToAuthConfirm = this.showLeadUserToAuthConfirm.bind(this);
    this.fetchBehaviorVerificationInfo = this.fetchBehaviorVerificationInfo.bind(this);
    this.setGoogleVerifyCode = this.setGoogleVerifyCode.bind(this);
    this.postCheckGoogleVerifyCode = this.postCheckGoogleVerifyCode.bind(this);
    this.checkGoogleVerifyCode = this.checkGoogleVerifyCode.bind(this);
    this.signinSuccessHandle = this.signinSuccessHandle.bind(this);
    this.secondVerifyStep = this.secondVerifyStep.bind(this);
    this.handleConfirmGoogleVerifyCode = this.handleConfirmGoogleVerifyCode.bind(this);
    this.onGoogleVerifyCodeInputBlur = this.onGoogleVerifyCodeInputBlur.bind(this);
  }

  componentDidMount() {
    this.fetchBehaviorVerificationInfo();
  }

  /**
   * @description 第一步验证 获取行为验证信息
   */
  fetchBehaviorVerificationInfo() {
    this.setState({
      fetchingBehaviorVerificationInfo: true,
      fetchBehaviorVerificationInfoError: false,
    });
    const firstStepURL = `${ROOT_USER}/geetest/geetestStepOne`;

    axios
      .get(firstStepURL)
      .then((response) => {
        if (response.status === 200 && response.data.status === 1) {
          initGeetest(
            {
              gt: response.data.data.gt,
              challenge: response.data.data.challenge,
              offline: response.data.data.offline,
              new_captcha: response.data.data.new_captcha,
              product: "popup",
              width: "100%",
              height: "100%",
            },
            (captchaObj) => this.secondVerifyStep(captchaObj, this),
          );
          this.setState({ fetchingBehaviorVerificationInfo: false });
        } else {
          this.setState({
            fetchingBehaviorVerificationInfo: false,
            fetchBehaviorVerificationInfoError: true,
          });
        }
      })
      .catch(() => {
        this.setState({
          fetchingBehaviorVerificationInfo: false,
          fetchBehaviorVerificationInfoError: true,
        });
      });
  }

  /**
   * @description 第二步验证处理
   * @param {Object} captchaObj 验证实例 包含验证结果信息
   * @param {Object} self 组件实例
   */
  secondVerifyStep(captchaObj, self) {
    self.captchaObj = captchaObj;

    const verifyContainer = document.getElementById("verify_container");
    if (!verifyContainer) {
      return;
    }
    captchaObj.appendTo(verifyContainer);
    captchaObj.onReady(function() {
      self.setState({ fetchingBehaviorVerificationInfo: false });
    });

    captchaObj.onSuccess(function() {
      const result = captchaObj.getValidate();

      // 验证不通过
      if (!result) {
        return;
      } else {
        self.setState({ behaviorVerificationTip: "" });
        self.behaviorVerificationPassed = true;
      }

      // 将验证结果信息挂载到组件实例 在登录时传递给服务端
      self.verifyParams = {
        gt_server_status: 1,
        geetest_challenge: result.geetest_challenge,
        geetest_validate: result.geetest_validate,
        geetest_seccode: result.geetest_seccode,
      };
    });
  }

  /**
   * @description 设置用户登录手机号码或者邮箱
   * @param {Event}} event 事件对象
   */
  setAccount(event) {
    let { value: account } = event.target;
    account = account.trim();
    this.setState({ account, accountTip: "" });
  }

   /**
   * @description 账号输入框失去焦点检查账户输入是否符合预期
   * @param {Event}} event 事件对象
   */
  onAccountInputBlur(event) {
    let { value: account } = event.target;
    account = account.trim();
    this.checkAccount(account);
  }

  /**
   * @description 检查账号是否符合预期
   * @param {string} account
   */
  checkAccount(account) {
    if (!account) {
      this.setState({ accountTip: "请输入手机号或者邮箱" });
      return false;
    }

    this.setState({ accountTip: "" });
    return true;
  }

  /**
   * @description 设置用户密码
   * @param {Event} event 事件对象
   */
  setPassword(event) {
    let { value: password } = event.target;
    password = password.trim();
    this.setState({ password, passwordTip: "" });
  }

  /**
   * @description 密码输入框失去焦点检查密码是否符合预期
   * @param {Event} event 事件对象
   */
  onPasswordInputBlur(event) {
    let { value: password } = event.target;
    password = password.trim();
    this.checkPassword(password);
  }

  /**
   * @description 检查密码是否符合预期
   * @param {string} password
   */
  checkPassword(password) {
    if (!password) {
      this.setState({ passwordTip: "请输入密码" });
      return false;
    }

    this.setState({ passwordTip: "" });
    return true;
  }

  /**
   * @description 设置谷歌验证器验证码
   * @param {Event} event 事件对象
   */
  setGoogleVerifyCode(event) {
    let { value: googleVerifyCode } = event.target;
    googleVerifyCode = googleVerifyCode.trim();
    this.setState({ googleVerifyCode });
  }

  /**
   * @description 谷歌验证码输入框失去焦点检查谷歌验证码是否符合预期，同时请求服务端检查验证码是否正确
   * @param {Event} event 事件对象
   */
  onGoogleVerifyCodeInputBlur(event) {
    let { value: googleVerifyCode } = event.target;
    googleVerifyCode = googleVerifyCode.trim();
    if (this.checkGoogleVerifyCode(googleVerifyCode)) {
      this.postCheckGoogleVerifyCode(googleVerifyCode);
    }
  }

  /**
   * @description 检查谷歌验证码是否符合预期
   * @param {string} googleVerifyCode
   */
  checkGoogleVerifyCode(googleVerifyCode) {
    if (!googleVerifyCode) {
      this.setState({ googleVerifyTip: "请输入谷歌验证码" });
      return false;
    }

    this.setState({ googleVerifyTip: "" });
    return true;
  }

  /**
   * @description 谷歌验证码确认处理
   */
  handleConfirmGoogleVerifyCode() {
    const { googleVerifyCode } = this.state;
    if (this.checkGoogleVerifyCode(googleVerifyCode)) {
      this.postCheckGoogleVerifyCode(googleVerifyCode);
    }
  }

  /**
   * @description 请求服务端检查谷歌验证码是否正确
   * @param {string} googleVerifyCode
   */
  postCheckGoogleVerifyCode(googleVerifyCode) {
    this.setState({ checkingGoogleVerifyCode: true });

    const { password } = this.state;

    const URL = `${ROOT_USER}/user/signin`;
    const params = {
      loginAccount: this.loginAccount,
      googleCode: googleVerifyCode,
      password: password,
    };

    axios
      .post(URL, params)
      .then((response) => {
        if (response.status === 200 && response.data.status === 1) {
          this.signinSuccessHandle(response);
          this.setState({
            isGoogleVerifyDisplay: false,
            checkingGoogleVerifyCode: false,
          });
        } else {
          this.setState({
            googleVerifyTip: response.data.message,
            checkingGoogleVerifyCode: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ checkingGoogleVerifyCode: false });
      });

  }

  /**
   * @description 登录处理
   */
  handleSigninSubmit() {
    const { account, password } = this.state;
    if (!this.checkAccount(account)) {
      return;
    }

    if (!this.checkPassword(password)) {
      return;
    }

    if (!this.behaviorVerificationPassed) {
      this.setState({ behaviorVerificationTip: "请完成验证" });
      return;
    }

    this.setState({
      behaviorVerificationTip: "",
      accountTip: "",
      passwordTip: "",
      logining: true,
    });

    this.postSignin();
  }

  /**
   * @description 请求服务端进行登录
   */
  postSignin() {
    const URL = `${ROOT_USER}/user/signin`;

    const params = {
      ...this.verifyParams,
      loginAccount: this.state.account,
      password: this.state.password,
    };

    axios
      .post(URL, params)
      .then((response) => {
        if (response.status === 200 && response.data.status === 1) {
          // 用户没有绑定谷歌验证 直接登录
          this.signinSuccessHandle(response);
        } else if (response.status === 200 && response.data.status === 2) {
          // 用户账号绑定了谷歌验证
          // 在后续的校验验证码是否正确的接口中将用户名和验证码传递给服务端
          this.loginAccount = response.data.data.loginAccount;
          this.setState({ isGoogleVerifyDisplay: true });
        } else if (
          response.status === 200 &&
          (response.data.status >= -10016 && response.data.status <= -10000)
        ) {
          this.captchaObj.reset();
          message.warning(response.data.message);
          this.setState({
            serverTip: response.data.message,
            logining: false,
            secondStepSuccess: false,
          });
          this.behaviorVerificationPassed = false;
        } else if (response.status === 200 && response.data.status === -10017) {
          this.captchaObj.reset();
          this.setState({
            accountTip: response.data.message,
            logining: false,
            secondStepSuccess: false,
          });
          this.behaviorVerificationPassed = false;
        } else if (response.status === 200 && response.data.status === -10018) {
          this.captchaObj.reset();
          this.setState({
            passwordTip: response.data.message,
            logining: false,
            secondStepSuccess: false,
          });
          this.behaviorVerificationPassed = false;
        }
      })
      .catch((error) => {
        this.setState({ logining: false, secondStepSuccess: false });
        if (error.response) {
          this.captchaObj.reset();
          this.behaviorVerificationPassed = false;
          message.warning("登录失败");
          this.setState({ serverTip: "登录失败" });
        }
        console.log(error);
      });
  }

  /**
   * @description 登录成功处理
   * @param {Object} response 服务端响应内容
   */
  signinSuccessHandle(response) {
    const { automaticLogin } = this.props;
    setUserInfoToLocalStorage(response.data.data);

    /* eslint-disable-next-line */
    response.data.data.discuzSyncScript && $("body").append(response.data.data.discuzSyncScript);

    automaticLogin();
    this.setState({ logining: false });

    this.props.history.push(this.from);

    // 弹出引导用户实名认证模态框
    if (response.data.data.isQIC == 2) {
      this.showLeadUserToAuthConfirm();
    }
  }

  /**
   * @description 弹出引导用户进行实名认证的模态框
   */
  showLeadUserToAuthConfirm() {
    const { AccountHighStatus, history } = this.props;
    const init = {
      phoneNum: 0,
      emailNum: 0,
      authNum: 0,
      nameAuthNum: 4,
      openGa: 0,
      closeGa: 0,
      changeGa: 0,
      accountFlag: false,
    };
    Modal.confirm({
      title: "您还没有实名认证，通过实名认证可领取 66 IDT",
      cancelText: "不了，财大气粗",
      okText: "认证领 66 IDT",
      onOk() {
        AccountHighStatus(init);
        localStorage.setItem("defaultActiveKey", accountValue);

        // 跳转至实名认证页面或者弹出实名认证模态框
        history.push("/user/account");
      },
      onCancel() {},
    });
  }

  render() {
    return (
      <div className="signin-container auth-container">
        <Modal
          visible={this.state.isGoogleVerifyDisplay}
          footer={false}
          onCancel={() => {
            this.setState({
              isGoogleVerifyDisplay: false,
              logining: false,
              secondStepSuccess: false,
            });
            this.captchaObj.reset();
          }}
        >
          <div className="google-verify-container">
            <h3>谷歌验证器安全验证</h3>
            <div className="input-group verify-input-group">
              <p>请输入谷歌验证器中的验证码</p>
              <input
                className={this.state.googleVerifyTip && "warning"}
                type="text"
                placeholder="请输入谷歌验证码"
                onBlur={this.onGoogleVerifyCodeInputBlur}
                onChange={this.setGoogleVerifyCode}
              />
              {this.state.googleVerifyTip && <i>{this.state.googleVerifyTip}</i>}
              <button onClick={this.handleConfirmGoogleVerifyCode}>
                {this.state.checkingGoogleVerifyCode ? "校验中..." : "确定"}
              </button>
            </div>
          </div>
        </Modal>

        <div className="signin-title auth-title">登录</div>

        <div className="input-group name-input-group">
          <input
            className={this.state.accountTip && "warning"}
            type="text"
            placeholder="请输入手机号/邮箱"
            ref={(input) => (this.phoneOrEmailInput = input)}
            onBlur={this.checkUserPhoneOrEmail}
            onChange={this.setAccount}
          />
          {this.state.accountTip && <i>{this.state.accountTip}</i>}
        </div>

        <div className="input-group password-input-group">
          <input
            className={this.state.passwordTip && "warning"}
            type="password"
            placeholder="请输入密码"
            ref={(input) => (this.passwordInput = input)}
            onBlur={this.checkUserPassword}
            onChange={this.setPassword}
          />
          {this.state.passwordTip && <i>{this.state.passwordTip}</i>}
        </div>

        <div className="verify-container input-group">
          {!this.state.fetchingBehaviorVerificationInfo &&
            !this.state.fetchBehaviorVerificationInfoError && (
              <div id="verify_container" style={{ height: "inherit" }} />
            )}
          {this.state.fetchingBehaviorVerificationInfo && (
            <div style={{ textIndent: "1rem" }}>验证码正在跑来的路上...</div>
          )}
          {this.state.fetchBehaviorVerificationInfoError &&
            !this.state.fetchingBehaviorVerificationInfo && (
              <div style={{ textIndent: "1rem" }}>
                验证码迷路了-_-
                <a
                  style={{ float: "right", marginRight: "20px" }}
                  onClick={this.fetchBehaviorVerificationInfo}
                >
                  点击重试
                </a>
              </div>
            )}
          {this.state.behaviorVerificationTip && <i>{this.state.behaviorVerificationTip}</i>}
        </div>

        <div className="submit-btn-group input-group">
          <button
            className="signin-btn"
            onClick={this.handleSigninSubmit}
            disabled={this.state.logining}
          >
            {this.state.logining ? "登录中..." : "登录"}
          </button>
        </div>

        <div className="jump-link-group">
          <span className="signup-link">
            未有账号，
            <Link
              to={{
                pathname: "/user/signup",
                state: { from: this.from },
              }}
            >
              立即注册
            </Link>
          </span>
          <span className="forget-password-link">
            <Link to="/user/forget_password">忘记密码？</Link>
          </span>
        </div>
      </div>
    );
  }
}

export default  connect(
    null,
    { AccountHighStatus, automaticLogin },
  )(SigninComponent);
