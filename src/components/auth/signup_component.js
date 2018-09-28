import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Icon, Modal, message, Checkbox, Popover } from "antd";
import { connect } from "react-redux";
import axios from "axios";
import { setUserInfoToLocalStorage, automaticLogin } from "../../actions/auth";
import RegisterProtocolModal from "./registerProtocolModal.js";
import { ROOT_USER } from "../../actions/types";
import { AccountHighStatus } from "./../../actions/account.js";
import { throttle } from "./../../tools/utils.js";
import initGeetest from "./gt";
import { accountValue } from "./../../tools/config";
import "./signin&signup.css";

class SignupComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 验证码发送倒计时 60s
      countdown: 60,

      sendingVerificationCode: false,

      sendVerificationCodeState: null,

      // 手机号码注册提示
      accountTip: "",

      // 验证码提示
      verificationCodeTip: "",

      // 密码提示
      passwordTip: "",

      confirmPasswordTip: "",

      // 注册协议是否被勾选 默认勾选
      isRegisterProtocolChecked: true,

      // 注册协议模态框是否显示 默认不显示
      registerProtocolModalVisible: false,

      // 用户输入的注册手机号
      account: "",

      // 用书手机号码是否已经注册
      isAccountHasAlreadyRegistered: false,

      // 手机验证码
      verificationCode: "",

      // 用户密码
      password: "",

      confirmPassword: "",

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

      // 注册中
      registering: false,

      // 邀请码
      useInviteCode: this.props.useInviteCode,

      sendVerificationCodeModalVisible: false,
    };

    this.from = this.props.from || "";

    this.behaviorVerificationPassed = false;

    this.interval = 1000;

    this.setAccount = this.setAccount.bind(this);
    this.onAccountInputBlur = this.onAccountInputBlur.bind(this);
    this.checkAccount = this.checkAccount.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.onPasswordInputBlur = this.onPasswordInputBlur.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.setConfirmPassword = this.setConfirmPassword.bind(this);
    this.onConfirmPasswordInputBlur = this.onConfirmPasswordInputBlur.bind(this);
    this.checkConfirmPassword = this.checkConfirmPassword.bind(this);
    this.checkAccountIsRegistered = this.checkAccountIsRegistered.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setVerificationCode = this.setVerificationCode.bind(this);
    this.onVerificationCodeBlur = this.onVerificationCodeBlur.bind(this);
    this.postRegister = this.postRegister.bind(this);
    this.togglePasswordVisible = this.togglePasswordVisible.bind(this);
    this.checkVerificationCode = this.checkVerificationCode.bind(this);
    this.setInvitationCode = this.setInvitationCode.bind(this);
    this.showLeadUserToAuthConfirm = this.showLeadUserToAuthConfirm.bind(this);
    this.showVerifyModal = this.showVerifyModal.bind(this);
    this.fetchBehaviorVerificationInfo = this.fetchBehaviorVerificationInfo.bind(this);
    this.handleVerifyCodeOk = this.handleVerifyCodeOk.bind(this);
    this.reset = this.reset.bind(this);
    this.handleCountdown = this.handleCountdown.bind(this);
    this.sendVerificationCode = this.sendVerificationCode.bind(this);
    this.sendVerificationCodeWrapper = this.sendVerificationCodeWrapper.bind(this);
    this.setRegisterProtocolChecked = this.setRegisterProtocolChecked.bind(this);
    this.handleRegisterProtocolConfirm = this.handleRegisterProtocolConfirm.bind(this);
    this.handleRegisterProtocolCancel = this.handleRegisterProtocolCancel.bind(this);
    this.toggleRegisterProtocolModalVisible = this.toggleRegisterProtocolModalVisible.bind(this);
    this.handleSendVerificationCode = this.handleSendVerificationCode.bind(this);
    this.isMeetSendVerificationCodeCondition = this.isMeetSendVerificationCodeCondition.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  // TODO: 打开/关闭验证码输入模态框时应该重置倒计时 清空验证码输入框

  componentWillUnmount() {
    clearInterval(this.countdownTimer);
  }

  /**
   * @description 用户手册和法律单选框选中事件监听函数
   */
  setRegisterProtocolChecked(event) {
    const { checked } = event.target;
    this.setState({ isRegisterProtocolChecked: checked });
  }

  handleRegisterProtocolConfirm() {
    const { registerProtocolChecked } = this.state;
    this.setState({
      registerProtocolModalVisible: false,
      isRegisterProtocolChecked: registerProtocolChecked || true,
    });
  }

  handleRegisterProtocolCancel() {
    this.setState({ registerProtocolModalVisible: false });
  }

  toggleRegisterProtocolModalVisible(flag) {
    this.setState({ registerProtocolModalVisible: !!flag });
  }

  /**
   * @description 设置用户输入手机号码
   * @param {Object} event 事件对象
   */
  setAccount(event) {
    let { value: account } = event.target;
    account = account.trim();
    this.setState({ account });
  }

  /**
   * @description 账号输入框失去焦点检查账号是否符合预期
   * @param {Object} event 事件对象
   */
  onAccountInputBlur(event) {
    let { value: account } = event.target;
    account = account.trim();
    if (this.checkAccount(account)) {
      this.checkAccountIsRegistered(account);
    }
  }

  /**
   * @description 校验用户手机号码是否符合格式
   * @param {string} account
   * @returns {boolean}
   */
  checkAccount(account) {
    if (!account) {
      this.setState({
        accountTip: "手机号码不能为空",
      });
      return false;
    }

    const reg = /^((1[3-8][0-9])+\d{8})$/;
    if (!reg.test(account) || !account) {
      this.setState({
        accountTip: "手机号码不符合格式，请重新输入",
      });
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
    const passwordConditionThreeReg = new RegExp(`(${this.state.account})`);

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
   * @description 密码输入框失去焦点检查密码是否符合预期
   * @param {Event} event 事件对象
   */
  onPasswordInputBlur(event) {
    let { value: password } = event.target;
    password = password.trim();
    this.checkPassword(password);
  }

  checkPassword(password) {
    if (!password) {
      this.setState({ passwordTip: "密码不能为空！" });
      return false;
    }

    const { meetConditionOne, meetConditionTwo, meetConditionThree } = this.state;

    if (!meetConditionOne || !meetConditionTwo || !meetConditionThree) {
      this.setState({ passwordTip: "密码不符合格式，请重新输入" });
      return false;
    }

    this.setState({ passwordTip: "" });
    return true;
  }

  /**
   * @description 设置用户入的确认密码
   */
  setConfirmPassword(event) {
    let { value: confirmPassword } = event.target;
    confirmPassword = confirmPassword.trim();
    this.setState({ confirmPassword });
  }

  onConfirmPasswordInputBlur(event) {
    let { value: confirmPassword } = event.target;
    confirmPassword = confirmPassword.trim();
    const { password } = this.state;
    this.checkConfirmPassword(password, confirmPassword);
  }

  checkConfirmPassword(password, confirmPassword) {
    if (confirmPassword.length === 0) {
      this.setState({ confirmPasswordTip: "请输入确认密码" });
      return false;
    }
    if (password !== confirmPassword) {
      this.setState({ confirmPasswordTip: "两次输入的密码不一致" });
      return false;
    }

    this.setState({ confirmPasswordTip: "" });
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

  onVerificationCodeBlur(event) {
    let { value: verificationCode } = event.target;
    verificationCode = verificationCode.trim();
    this.checkVerificationCode(verificationCode);
  }

  /**
   * @description 检查你验证码是否为空
   */
  checkVerificationCode(verificationCode) {
    if (!verificationCode) {
      this.setState({ verificationCodeTip: "请输入验证码" });
      return false;
    }

    this.setState({ verificationCodeTip: "" });
    return true;
  }

  /**
   * @description 设置用户输入的邀请码
   * @param {Object} event 事件对象
   */
  setInvitationCode(event) {
    let { value: useInviteCode } = event.target;
    useInviteCode = useInviteCode.trim();
    this.setState({ useInviteCode });
  }

  /**
   * @description 请求服务端 检查手机号是否已经被注册
   * @param {string} account 用户输入手机号
   */
  checkAccountIsRegistered(account) {
    const URL = `${ROOT_USER}/user/exist/mobilephone/${account}`;

    // 不对验证失败进行处理 验证如果失败 默认手机号没有被注册过
    axios
      .get(URL)
      .then((response) => {
        if (response.status === 200 && response.data.status === -10015) {
          this.setState({
            isAccountHasAlreadyRegistered: true,
            accountTip: "该手机号码已经被注册，请换一个手机号码",
          });
        } else {
          this.setState({
            isAccountHasAlreadyRegistered: false,
            accountTip: "",
          });
        }
      })
      .catch(() => {
        this.setState({
          isAccountHasAlreadyRegistered: false,
          accountTip: "",
        });
      });
  }

  /**
   * @description 提交处理
   */
  handleSubmit() {
    const {
      account,
      password,
      confirmPassword,
      isAccountHasAlreadyRegistered,
      isRegisterProtocolChecked,
    } = this.state;
    if (isAccountHasAlreadyRegistered) {
      this.setState({ accountTip: "该手机号码已经被注册，请换一个手机号码" });
      return;
    }
    if (!this.checkAccount(account)) {
      return;
    }
    if (!this.checkPassword(password)) {
      return;
    }
    if (!this.checkConfirmPassword(password, confirmPassword)) {
      return;
    }

    if (!isRegisterProtocolChecked) {
      message.warning("您还没有同意《注册协议》");
      return;
    }

    this.setState({
      accountTip: "",
      verificationCodeTip: "",
      passwordTip: "",
      confirmPasswordTip: "",
      registering: true,
    });

    this.showVerifyModal();
  }

  showVerifyModal() {
    this.fetchBehaviorVerificationInfo();
  }

  /**
   * @description 第一步验证
   */
  fetchBehaviorVerificationInfo() {
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
              product: "bind",
            },
            (captchaObj) => this.secondVerifyStep(captchaObj, this),
          );
        } else {
          message.error("验证拉取失败");
        }
      })
      .catch(() => {
        message.error("验证拉取失败");
      });
  }

  /**
   * @description 第二部验证处理
   * @param {Object} captchaObj 验证实例 包含验证结果信息
   * @param {Object} self 组件实例
   */
  secondVerifyStep(captchaObj, self) {
    self.captchaObj = captchaObj;

    captchaObj.onReady(function() {
      captchaObj.verify();
    });

    captchaObj.onClose(function() {
      self.setState({ registering: false });
    });

    captchaObj.onSuccess(function() {
      const result = captchaObj.getValidate();

      // 验证不通过
      if (!result) {
        return;
      } else {
        self.setState({
          verificationCodeTip: "",
          sendVerificationCodeModalVisible: true,
        });
        self.behaviorVerificationPassed = true;
      }

      // 将验证结果信息挂载到组件实例 在登录时传递给服务端
      self.behaviorVerificationInfo = {
        gt_server_status: 1,
        geetest_challenge: result.geetest_challenge,
        geetest_validate: result.geetest_validate,
        geetest_seccode: result.geetest_seccode,
      };
    });
  }

  handleVerifyCodeOk() {
    const { verificationCode } = this.state;
    if (!this.checkVerificationCode(verificationCode)) {
      return;
    }
    this.postRegister();
  }

  resetState() {
    this.setState({
      sendVerificationCodeModalVisible: false,
      registering: false,
      countdown: 60,
      sendingVerificationCode: false,
      sendVerificationCodeState: null,
      verificationCode: "",
    });
    clearInterval(this.countdownTimer);
  }

  reset() {
    this.resetState();
    this.captchaObj.reset();
  }

  /**
   * @description 请求服务端进行用户注册
   * 注册成功同时登录
   */
  postRegister() {
    const signupURL = `${ROOT_USER}/user/signup`;
    const { account, password, verificationCode, useInviteCode } = this.state;

    const signupParams = {
      password,
      useInviteCode,
      mobilephone: account,
      vcode: verificationCode,
    };

    axios
      .post(signupURL, signupParams)
      .then((response) => {
        if (response.status === 200 && response.data.status === 1) {
          setUserInfoToLocalStorage(response.data.data);
          this.setState({ registering: false });
          /* eslint-disable-next-line */
          response.data.data.discuzSyncScript && $("body").append(response.data.data.discuzSyncScript);
          this.props.automaticLogin();

          this.props.history.push(this.from);

          // 弹出引导用户实名认证模态框
          if (response.data.data.isQIC == 2) {
            this.showLeadUserToAuthConfirm();
          }
        } else {
          message.warning(response.data.message);
          this.resetState();
        }
      })
      .catch((error) => {
        message.error("注册失败");
        this.resetState();
      });
  }

  sendVerificationCodeWrapper() {
    if (!this.isMeetSendVerificationCodeCondition()) {
      return false;
    }
    throttle(this.handleSendVerificationCode, this, 200);
  }

  handleSendVerificationCode() {
    const { account } = this.state;
    this.sendVerificationCode(account, this.behaviorVerificationInfo);
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

  /**
   * @description 发送验证码
   */
  sendVerificationCode(account, behaviorVerificationInfo) {
    const URL = `${ROOT_USER}/vcode/phone_v2/${account}`;
    this.setState({ sendingVerificationCode: true });
    // 请求服务端发送验证码
    axios
      .post(URL, behaviorVerificationInfo)
      .then((response) => {
        if (response.status === 200 && response.data.status === 1) {
          this.setState({ sendVerificationCodeState: true });
          this.handleCountdown();
          message.success("验证码已经发送，请查收");
        } else {
          this.resetState();
          message.error("验证码发送失败, 请稍候重试");
        }
      })
      .catch(() => {
        this.resetState();
        message.error("验证码发送失败, 请稍候重试");
      });
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
      registerProtocolModalVisible,
      meetConditionInit,
      meetConditionOne,
      meetConditionTwo,
      meetConditionThree,
      sendVerificationCodeState,
      countdown,
      verificationCodeTip,
      accountTip,
      passwordTip,
      confirmPasswordTip,
      isRegisterProtocolChecked,
      registering,
      useInviteCode,
    } = this.state;
    let sendText = "发送验证码";
    if (sendVerificationCodeState) {
      sendText = countdown + " s后重新发送";
    }

    const passwordTipContent = (
      <div className="password-tip-content">
        <h4 style={{ marginBottom: "10px" }}>密码需要满足以下需求</h4>
        <p style={{ marginBottom: "5px" }}>
          <Icon
            type={
              meetConditionInit
                ? "exclamation-circle"
                : meetConditionOne
                  ? "check-circle"
                  : "exclamation-circle"
            }
            style={{
              marginRight: "3px",
              color: meetConditionInit ? "#a7a7a7" : meetConditionOne ? "#3cbc6c" : "#d8565d",
            }}
          />
          同时包含大写字母、小写字母和数字，不能包含空格
        </p>
        <p style={{ marginBottom: "5px" }}>
          <Icon
            type={
              meetConditionInit
                ? "exclamation-circle"
                : meetConditionOne
                  ? "check-circle"
                  : "exclamation-circle"
            }
            style={{
              marginRight: "3px",
              color: meetConditionInit ? "#a7a7a7" : meetConditionTwo ? "#3cbc6c" : "#d8565d",
            }}
          />
          密码长度为6 ~ 32 位
        </p>
        <p style={{ marginBottom: "5px" }}>
          <Icon
            type={
              meetConditionInit
                ? "exclamation-circle"
                : meetConditionOne
                  ? "check-circle"
                  : "exclamation-circle"
            }
            style={{
              marginRight: "3px",
              color: meetConditionInit ? "#a7a7a7" : meetConditionThree ? "#3cbc6c" : "#d8565d",
            }}
          />
          不能包含账户信息
        </p>
      </div>
    );

    const sendVerificationCodeModalFooter = (
      <div className="send-verification-code-modal-footer">
        <button onClick={this.handleVerifyCodeOk}>完成注册</button>
      </div>
    );

    return (
      <div className="signup-container auth-container">
        {/* 用户手册及协议 模态框 开始 */}
        <RegisterProtocolModal
          visible={registerProtocolModalVisible}
          handleConfirm={this.handleRegisterProtocolConfirm}
          handleCancel={this.handleRegisterProtocolCancel}
        />
        {/* 用户手册及协议 模态框 结束 */}

        {/* 发送验证码模态框 开始 */}
        <Modal
          visible={this.state.sendVerificationCodeModalVisible}
          onCancel={this.reset}
          footer={sendVerificationCodeModalFooter}
        >
          <div className="signup-container auth-container send-password-modal">
            <div className="verify-input-group input-group">
              <input
                className={verificationCodeTip && "warning"}
                type="text"
                placeholder="请输入手机验证码"
                onBlur={this.onVerificationCodeBlur}
                onChange={this.setVerificationCode}
              />
              <span className="send-verify-btn" onClick={this.sendVerificationCodeWrapper}>
                {sendText}
              </span>
              {verificationCodeTip && <i>{verificationCodeTip}</i>}
            </div>
          </div>
        </Modal>
        {/* 发送验证码模态框 结束 */}

        <div className="signup-title auth-title">欢迎注册</div>
        <div className="name-input-group input-group">
          <input
            className={accountTip && "warning"}
            type="text"
            placeholder="请输入手机号码"
            onBlur={this.onAccountInputBlur}
            onChange={this.setAccount}
          />
          {accountTip && <i>{accountTip}</i>}
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
        <div className="input-group password-input-group">
          <input
            className={confirmPasswordTip && "warning"}
            type="password"
            placeholder="请确认密码"
            onBlur={this.onConfirmPasswordInputBlur}
            onChange={this.setConfirmPassword}
          />
          {confirmPasswordTip && <i>{confirmPasswordTip}</i>}
        </div>
        <div className="invitation-input-group input-group">
          <input
            type="text"
            placeholder="请输入邀请码（选填）"
            value={useInviteCode}
            onChange={this.setInvitationCode}
          />
        </div>
        <div className="agreement-container input-group">
          <Checkbox checked={isRegisterProtocolChecked} onChange={this.setRegisterProtocolChecked}>
            我已阅读并同意
          </Checkbox>
          <a onClick={this.toggleRegisterProtocolModalVisible}>《注册协议》</a>
        </div>
        <div className="register-btn submit-btn-group input-group">
          <button className="signin-btn" onClick={this.handleSubmit} disabled={registering}>
            {registering ? "注册中..." : "注册"}
          </button>
        </div>
        <div className="jump-link-group input-group">
          <span className="signup-link">
            已有账号，
            <Link
              to={{
                pathname: "/user/signin",
                state: { from: this.props.location.pathname },
              }}
            >
              立即登录
            </Link>
          </span>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    null,
    { automaticLogin, AccountHighStatus },
  )(SignupComponent),
);
