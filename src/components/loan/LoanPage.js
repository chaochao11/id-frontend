import React from "react";
import "./LoanPage.css";

const STEP_IMAGES = [
  require("./../../../public/img/loan-page-section3-bg1.png"),
  require("./../../../public/img/loan-page-section3-bg2.png"),
  require("./../../../public/img/loan-page-section3-bg3.png"),
  require("./../../../public/img/loan-page-section3-bg4.png"),
];

class LoanPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stepKey: 0,
      processImage: STEP_IMAGES[0],
    };

    this.jumpToLoanApplyPage = this.jumpToLoanApplyPage.bind(this);
    this.setStepKey = this.setStepKey.bind(this);
  }

  setStepKey(key) {
    this.setState({ stepKey: key, processImage: STEP_IMAGES[key] });
  }

  /**
   * 跳转到借款交互页面 非登录状态下 不跳转
   */
  jumpToLoanApplyPage() {
    const { authenticated } = this.props;
    if (!authenticated) {
      this.props.history.push("/user/signin");
      return;
    }
    this.props.history.push("/loan/loanApply");
  }

  render() {
    const { stepKey, processImage } = this.state;

    return (
      <div className="loan-page">
        <div className="loan-page-section loan-page-section-banner">
          <div className="loan-page-section-banner-container loan-page-section-container">
            <div className="banner-text">
              <h2>最强币币借款</h2>
              <p>只为满足你的需求</p>
              <button onClick={this.jumpToLoanApplyPage}>我要借款</button>
            </div>
          </div>
        </div>

        <div className="loan-page-section loan-page-section-feature">
          <div className="loan-page-section-feature-container loan-page-section-container">
            <h3>身心便捷，值得信赖</h3>
            <div className="feature-group">
              <div className="feature-item">
                <img
                  src={require("./../../../public/img/loan-page-section2-icon1.png")}
                  alt="大数据审批"
                  title="大数据审批"
                />
                <strong>大数据审批</strong>
                <p>在线完成审批</p>
              </div>
              <div className="feature-item">
                <img
                  src={require("./../../../public/img/loan-page-section2-icon2.png")}
                  alt="多种额度"
                  title="多种额度"
                />
                <strong>多种额度</strong>
                <p>满足不同借款需求</p>
              </div>
              <div className="feature-item">
                <img
                  src={require("./../../../public/img/loan-page-section2-icon3.png")}
                  alt="优享利率"
                  title="优享利率"
                />
                <strong>优享利率</strong>
                <p>费率低至0.07%每天</p>
              </div>
              <div className="feature-item">
                <img
                  src={require("./../../../public/img/loan-page-section2-icon4.png")}
                  alt="信息安全"
                  title="信息安全"
                />
                <strong>信息安全</strong>
                <p>借款全程受法律保护</p>
              </div>
            </div>
          </div>
        </div>

        <div className="loan-page-section loan-page-section-process">
          <div className="loan-page-section-process-container loan-page-section-container">
            <h3>仅需四步，轻松借款</h3>
            <div className="process-wrapper">
              <div className="process-img">
                <img
                  src={processImage}
                  alt="仅需四步，轻松借款"
                  title="仅需四步，轻松借款"
                />
              </div>
              <div className="process-group">
                <div
                  className={
                    stepKey === 0 ? "process-item activity" : "process-item"
                  }
                  onClick={() => this.setStepKey(0)}
                >
                  <strong>网站注册</strong>
                  <p>填写注册信息 提交信息完成注册 输入用户名登录</p>
                </div>
                <div
                  className={
                    stepKey === 1 ? "process-item activity" : "process-item"
                  }
                  onClick={() => this.setStepKey(1)}
                >
                  <strong>资格审核</strong>
                  <p>填写实名认证信息 资格审核 平台审核并给予结果</p>
                </div>
                <div
                  className={
                    stepKey === 2 ? "process-item activity" : "process-item"
                  }
                  onClick={() => this.setStepKey(2)}
                >
                  <strong>提交申请</strong>
                  <p>选择借款数量 充值要质押的币种</p>
                </div>
                <div
                  className={
                    stepKey === 3 ? "process-item activity" : "process-item"
                  }
                  onClick={() => this.setStepKey(3)}
                >
                  <strong>高效审批</strong>
                  <p>线上快速审批 及时反馈审核结果</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="loan-page-section loan-page-section-question">
          <div className="loan-page-section-question-container loan-page-section-container">
            <h4>常见问题</h4>
            <div className="question-item">
              <strong className="question">
                在Investdigital平台借款，需要支付哪些费用？
              </strong>
              <p className="answer">
                借款成功后，需支付借款产生的利息、平台手续服务费等，具体收费明细根据不同产品而定。具体费用以借款交易发生时公示披露为准。
              </p>
            </div>
            <div className="question-item">
              <strong className="question">请问还款逾期的罚息规定？</strong>
              <p className="answer">
                从逾期还款当日开始按照逾期本息总额计算每天千分之一（实际罚息以借款协议为准）的罚息:罚息总额
                = 逾期本息 × 对应罚息利率 ×
                逾期天数；如果借款人超过借款协议约定的宽限期（一般为3天）后仍未还款的，则平台会强制平仓。
              </p>
            </div>
            <div className="question-item">
              <strong className="question">
                平台在什么情况下会进行强制平仓操作？
              </strong>
              <p className="answer">
                Investdigital平台会在逾期3天或风险比率高于90%时进行强制平仓操作（售卖用户质押的币种），
                在平仓后所得款项会对用户的欠款进行偿还，并把多余的款项返还给用户账户。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoanPage;
