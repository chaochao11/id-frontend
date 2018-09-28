import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Icon, message, Popover } from "antd";
import axios from "axios";
import Header from "../common/header";
import Footer from "../common/footer";
import { ROOT_USER } from "../../actions/types";
import { checkAccountIsPhoneOrEmail, checkAccountIsPassMuster } from "./utils.js";
import { throttle } from "./../../tools/utils.js";
import "./auth.css";

class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 验证码发送倒计时 60s
      countdown: 60,

      sendingVerificationCode: false,

      sendVerificationCodeState: null,

      // 手机号码/邮箱提示
      accountTip: "",

      // 验证码提示
      verificationCodeTip: "",

      // 密码提示
      passwordTip: "",

      // 用户输入的注册手机号/邮箱
      account: "",

      // 验证码
      verificationCode: "",

      // 用户密码
      password: "",

      // 初始密码校验状态
      // false 表示用户正在输入密码且密码不为空
      // true 表示用户正在输入密码但是密码为空 或者 还没有输入密码
      meetConditionInit: true,

      // 用户输入的密码的三个满足条件
      meetConditionOne: false,

      meetConditionTwo: false,

      meetConditionThree: false,

      // 密码是否可见
      isPasswordVisible: false,

      // 提交信息中
      submiting: false,
    };

    this.setAccount = this.setAccount.bind(this);
    this.onAccountInputBlur = this.onAccountInputBlur.bind(this);
    this.checkAccount = this.checkAccount.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.onPasswordInputBlur = this.onPasswordInputBlur.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.setVerificationCode = this.setVerificationCode.bind(this);
    this.onVerificationCodeInputBlur = this.onVerificationCodeInputBlur.bind(this);
    this.checkVerificationCode = this.checkVerificationCode.bind(this);
    this.postSubmit = this.postSubmit.bind(this);
    this.togglePasswordVisible = this.togglePasswordVisible.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendVerificationCodeWrapper = this.sendVerificationCodeWrapper.bind(this);
    this.sendVerificationCode = this.sendVerificationCode.bind(this);
    this.handleCountdown = this.handleCountdown.bind(this);
    this.handleSendVerificationCode = this.handleSendVerificationCode.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.countdownTimer);
  }

  /**
   * @description 设置用户输入手机号码/邮箱
   * @param {Event} event 事件对象
   */
  setAccount(event) {
    let { value: account } = event.target;
    account = account.trim();
    this.setState({ account });
  }

  /**
   * @description 手机号码/邮箱输入框失去焦点检查账户是否符合预期
   * @param {Event} event 事件对象
   */
  onAccountInputBlur(event) {
    let { value: account } = event.target;
    account = account.trim();
    this.checkAccount(account);
  }

  /**
   * @description 账户检查是否符合预期
   * @param {string} account
   */
  checkAccount(account) {
    // 检查账号是否为空
    if (!account) {
      this.setState({ accountTip: "手机号码/邮箱不能为空" });
      return false;
    }
    // 检查账号(手机/邮箱))是否符合格式
    if (!checkAccountIsPassMuster(account)) {
      this.setState({ accountTip: "手机号码/邮箱格式不正确不能为空" });
    }

    this.setState({ accountTip: "" });
    return true;
  }

  /**
   * @description 设置用户输入的验证码
   * @param {Event} event 事件对象
   */
  setVerificationCode(event) {
    let { value: verificationCode } = event.target;
    verificationCode = verificationCode.trim();
    this.setState({ verificationCode });
  }

  /**
   * @description 验证码输入框失去焦点检查用书输入的验证码是否符合预期
   * @param {Event} event 事件对象
   */
  onVerificationCodeInputBlur(event) {
    let { value: verificationCode } = event.target;
    verificationCode = verificationCode.trim();
    this.checkVerificationCode(verificationCode);
  }

  /**
   * @description 验证码检查
   * @param {string} verificationCode
   */
  checkVerificationCode(verificationCode) {
    if (!verificationCode) {
      this.setState({ verificationCodeTip: "验证码不能为空" });
      return false;
    }

    if (verificationCode.length !== 4) {
      this.setState({ verificationCodeTip: "验证码位数不正确" });
      return false;
    }

    this.setState({ verificationCodeTip: "" });
    return true;
  }

  /**
   * @description 设置用户密码
   * @param {Event} event 事件对象
   */
  setPassword(event) {
    const { account } = this.state;
    let { value: password } = event.target;
    password = password.trim();

    this.setState({ password });

    if (!password) {
      this.setState({ meetConditionInit: true });
      return;
    } else {
      this.setState({ meetConditionInit: false });
    }

    // 同时包含大写字母、小写字母和数字 不能包含空白符
    const passwordConditionOneReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\S])/;

    // 满足 6 -32 位
    const passwordConditionTwo = password.length > 5 && password.length < 33;

    // 不能包含账户信息
    const passwordConditionThreeReg = new RegExp(`(${account})`);

    if (passwordConditionOneReg.test(password)) {
      this.setState({ meetConditionOne: true });
    } else {
      this.setState({ meetConditionOne: false });
    }
    if (passwordConditionTwo) {
      this.setState({ meetConditionTwo: true });
    } else {
      this.setState({ meetConditionTwo: false });
    }
    if (!passwordConditionThreeReg.test(password)) {
      this.setState({ meetConditionThree: true });
    } else {
      this.setState({ meetConditionThree: false });
    }
  }

  /**
   * @description 密码输入框失去焦点检查密码是否符合格式
   * @param {Event} event
   */
  onPasswordInputBlur(event) {
    let { value: password } = event.target;
    password = password.trim();
    this.checkPassword(password);
  }

  /**
   * @description 密码输入框失去焦点事件监听函数 校验密码是否符合规则
   * @param {string} password
   */
  checkPassword(password) {
    if (!password) {
      this.setState({ passwordTip: "密码不能为空！" });
      return false;
    }

    const { meetConditionOne, meetConditionTwo, meetConditionThree } = this.state;

    if (!meetConditionOne || !meetConditionTwo || !meetConditionThree) {
      this.setState({ passwordTip: "密码格式不正确，请重新输入" });
      return false;
    }

    this.setState({ passwordTip: "" });
    return true;
  }

  /**
   * @description 检查表单各项输入是否符合预期
   */
  checkForgetPasswordForm() {
    const { account, password, verificationCode } = this.state;
    if (!this.checkAccount(account)) {
      return false;
    }
    if (!this.checkVerificationCode(verificationCode)) {
      return false;
    }
    if (!this.checkPassword(password)) {
      return false;
    }

    return true;
  }

  /**
   * @description 提交处理
   */
  handleSubmit() {
    if (!this.checkForgetPasswordForm()) {
      return;
    }

    this.setState({
      accountTip: "",
      verificationCodeTip: "",
      passwordTip: "",
      submiting: true,
    });

    this.postSubmit();
  }

  /**
   * @description 请求服务端进行忘记密码处理
   */
  postSubmit() {
    const forgetPasswordURL = `${ROOT_USER}/user/reset/password`;
    const { account, password, verificationCode } = this.state;

    const forgetPasswordParams = {
      loginAccount: account,
      newPassword: password,
      vcode: verificationCode,
    };

    axios
      .post(forgetPasswordURL, forgetPasswordParams)
      .then((response) => {
        if (response.status === 200 && response.data.status === 1) {
          message.success("密码修改成功");
          this.props.history.push("/user/signin", {
            from: this.props.location.pathname,
          });
        } else if (response.status === 200 && response.data.status === -1) {
          message.warning(response.data.message);
        }
        this.setState({ submiting: false });
      })
      .catch((error) => {
        message.error("密码修改失败");
        this.setState({ submiting: false });
      });
  }

  /**
   * 判断是否满足发送验证码的条件
   * @returns {boolean}
   */
  isMeetSendVerificationCodeCondition() {
    const { account, sendingVerificationCode, sendVerificationCodeState } = this.state;
    // 未输入手机号码
    if (!this.checkAccount(account)) {
      return false;
    }
    // 请求发送验证码中
    if (sendingVerificationCode) {
      return false;
    }
    // 验证码已发送 验证码未发送情况下为 null, 已经发送或者发送失败为布尔值
    if (typeof sendVerificationCodeState === "boolean" && sendVerificationCodeState) {
      return false;
    }
    return true;
  }

  sendVerificationCodeWrapper() {
    const { account } = this.state;
    if (!checkAccountIsPassMuster(account)) {
      return false;
    }
    if (!this.isMeetSendVerificationCodeCondition()) {
      return false;
    }
    throttle(this.handleSendVerificationCode, this, 300);
  }

  handleSendVerificationCode() {
    const { account } = this.state;
    const isPhone = !checkAccountIsPhoneOrEmail(account);
    this.sendVerificationCode(account, isPhone);
  }

  handleCountdown() {
    this.countdownTimer = setInterval(
      function() {
        let { countdown } = this.state;
        countdown -= 1;
        if (countdown < 1) {
          countdown = 60;
          this.setState({ sendingVerificationCode: false, sendVerificationCodeState: null });
          clearInterval(this.countdownTimer);
        }
        this.setState({ countdown });
      }.bind(this),
      1000,
    );
  }

  /**
   * @description 发送验证码
   */
  sendVerificationCode(account, isPhone) {
    const URL = isPhone
      ? `${ROOT_USER}/vcode/phone_v1/${account}`
      : `${ROOT_USER}/vcode/mail_v1/${account}`;

    // 请求服务端发送验证码
    axios
      .get(URL)
      .then((response) => {
        if (response.status === 200 && response.data.status === 1) {
          this.setState({ sendVerificationCodeState: true });
          this.handleCountdown();
          message.success("验证码已经发送，请查收");
        } else {
          this.setState({
            sendingVerificationCode: false,
            sendVerificationCodeState: false,
          });
          message.error("验证码发送失败");
        }
      })
      .catch((error) => {
        this.setState({
          sendingVerificationCode: false,
          sendVerificationCodeState: false,
        });
        message.error("验证码发送失败");
      });
  }

  /**
   * @description 切换密码可见或者不可见
   */
  togglePasswordVisible() {
    this.setState({ isPasswordVisible: !this.state.isPasswordVisible });
  }

  render() {
    const {
      account,
      isPasswordVisible,
      countdown,
      sendVerificationCodeState,
      meetConditionInit,
      meetConditionOne,
      meetConditionTwo,
      meetConditionThree,
      accountTip,
      passwordTip,
      verificationCodeTip,
      submiting,
    } = this.state;
    let sendText = "发送验证码";
    if (sendVerificationCodeState) {
      sendText = countdown + "s 后重新发送";
    }

    const passwordTipContent = (
      <div className="password-tip-content">
        <h4 style={{ marginBottom: "10px" }}>密码需要满足以下需求</h4>
        <p style={{ marginBottom: "5px" }}>
          <Icon
            type="exclamation-circle"
            style={{
              marginRight: "3px",
              color: meetConditionInit ? "#a7a7a7" : meetConditionOne ? "#3cbc6c" : "#d8565d",
            }}
          />
          同时包含大写字母、小写字母和数字，不能包含空格
        </p>
        <p style={{ marginBottom: "5px" }}>
          <Icon
            type="exclamation-circle"
            style={{
              marginRight: "3px",
              color: meetConditionInit ? "#a7a7a7" : meetConditionTwo ? "#3cbc6c" : "#d8565d",
            }}
          />
          密码长度为6 ~ 32 位
        </p>
        <p style={{ marginBottom: "5px" }}>
          <Icon
            type="exclamation-circle"
            style={{
              marginRight: "3px",
              color: meetConditionInit ? "#a7a7a7" : meetConditionThree ? "#3cbc6c" : "#d8565d",
            }}
          />
          不能包含账户信息
        </p>
      </div>
    );

    return (
      <div>
        <Header />

        <div className="signup-page auth-page">
          <div className="signup-wrapper auth-wrapper">
            <div className="signup-container auth-container">
              <div className="signup-title auth-title">忘记密码</div>
              <div className="name-input-group input-group">
                <input
                  className={accountTip && "warning"}
                  type="text"
                  placeholder="请输入手机号码/邮箱"
                  autoFocus
                  onBlur={this.onAccountInputBlur}
                  onChange={this.setAccount}
                />
                {accountTip && <i>{accountTip}</i>}
              </div>
              <div className="verify-input-group input-group">
                <input
                  className={verificationCodeTip && "warning"}
                  type="text"
                  placeholder="请输入验证码"
                  onBlur={this.onVerificationCodeInputBlur}
                  onChange={this.setVerificationCode}
                />
                <span className="send-verify-btn" onClick={this.sendVerificationCodeWrapper}>
                  {sendText}
                </span>
                {verificationCodeTip && <i>{verificationCodeTip}</i>}
              </div>
              <div className="password-input-group input-group">
                <Popover trigger="focus" content={passwordTipContent} placement="bottomLeft">
                  <input
                    className={passwordTip && "warning"}
                    disabled={account ? false : true}
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="请输入密码"
                    onBlur={this.onPasswordInputBlur}
                    onChange={this.setPassword}
                  />
                </Popover>
                <span
                  className={`password-toggle-visible-btn ${
                    isPasswordVisible ? "visible-btn" : "invisible-btn"
                  }`}
                  onClick={this.togglePasswordVisible}
                />
                {passwordTip && <i>{passwordTip}</i>}
              </div>
              <div className="submit-btn-group input-group">
                <button className="signin-btn" onClick={this.handleSubmit} disabled={submiting}>
                  {submiting ? "提交中..." : "提交"}
                </button>
              </div>
              <div className="jump-link-group input-group">
                <span className="signup-link">
                  我想起密码了
                  <Link
                    to={{
                      pathname: "/user/signin",
                      state: { from: this.props.location.pathname },
                    }}
                  >
                    &nbsp;&nbsp;立即登录
                  </Link>
                </span>
              </div>
            </div>
            <div className="banner-container" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default ForgetPassword;
