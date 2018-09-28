import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Select, Radio, Checkbox, Icon, Popover, Spin } from "antd";
import NA from "number-accuracy";
import { isNumber } from "./../../tools/utils.js";
import { RISK_INDEX } from "./constant.js";
import {
  fetchAvailableAmountOfAccount,
  fetchCurrencyExchangeRate,
  postLoanApply,
  resetState,
  initRequest,
  changePledgeCurrencyType,
} from "./../../actions/loan.js";
import "./LoanForm.css";

const InputGroup = Input.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class LoanForm extends Component {
  // 默认质押币种类型 3: BTC
  // 币种类型会在币种变化时更新
  static pledgeCurrencyType = 3;

  constructor(props) {
    super(props);

    this.state = {
      // 质押币种
      pledgeCurrency: "BTC",

      // 质押数量
      pledgeAmount: "",

      // 借款数量
      borrowAmount: "",

      // 质押期限
      pledgeDay: 30,

      // 借款利率
      borrowInterestRate: 0.001,

      // 预估利息
      estimateInterest: 0.0,

      checkPledgeAmountTip: "",
      checkBorrowAmountTip: "",
    };

    this.isDecimalReg = /^\d+\.\d+$/;

    this.handlePledgeProtocolChange = this.handlePledgeProtocolChange.bind(
      this,
    );
    this.handlePledgeCurrencyChange = this.handlePledgeCurrencyChange.bind(
      this,
    );
    this.handleBorrowAmountChange = this.handleBorrowAmountChange.bind(this);
    this.handlePledgeAmountChange = this.handlePledgeAmountChange.bind(this);
    this.handlePledgeDayChange = this.handlePledgeDayChange.bind(this);
    this.checkBorrowAmount = this.checkBorrowAmount.bind(this);
    this.checkPledgeAmount = this.checkPledgeAmount.bind(this);
    this.handleLoanConfirm = this.handleLoanConfirm.bind(this);
    this.refreshExchangeRate = this.refreshExchangeRate.bind(this);
    this.handleCheckOnBorrowAmountInputBlur = this.handleCheckOnBorrowAmountInputBlur.bind(
      this,
    );
    this.handleCheckOnPledgeAmountInputBlur = this.handleCheckOnPledgeAmountInputBlur.bind(
      this,
    );
  }

  componentDidMount() {
    const { initRequest, resetState } = this.props;
    resetState();
    initRequest();
  }

  componentWillReceiveProps(nextProps) {
    const { postLoanApplySuccess } = nextProps;
    const { history } = this.props;
    const { borrowAmount, pledgeDay } = this.state;
    if (postLoanApplySuccess) {
      history.push("/loan/loanSuccess", {
        pledgeDay,
        money: borrowAmount,
        currency: "USDT",
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { transferMoneyFormVisible } = nextProps;
    if (transferMoneyFormVisible) {
      return false;
    }
    return true;
  }

  /**
   * @description 质押协议选择框选中处理
   * @param {Event} event
   */
  handlePledgeProtocolChange(event) {
    const { checked } = event.target;
    const { handlePledgeProtocolChange } = this.props;
    handlePledgeProtocolChange(checked);
  }

  /**
   * @description 质押币种改变 设置质押币种以及改变相应的汇率
   * 并且清空用户输入 重置数据
   * @param {number} pledgeCurrencyType 质押币种
   */
  handlePledgeCurrencyChange(pledgeCurrencyType) {
    const {
      fetchCurrencyExchangeRate,
      supportPledgeCurrency,
      fetchAvailableAmountOfAccount,
      changePledgeCurrencyType,
    } = this.props;
    fetchCurrencyExchangeRate(pledgeCurrencyType);
    fetchAvailableAmountOfAccount(pledgeCurrencyType);
    changePledgeCurrencyType(Number(pledgeCurrencyType));

    const { symbol: pledgeCurrency } = supportPledgeCurrency.find(
      (item) => item.id == pledgeCurrencyType,
    );

    // 将质押币种类型挂载到实例对象上，在提交借款申请时作为参数传给服务端
    LoanForm.pledgeCurrencyType = pledgeCurrencyType;

    this.setState({
      pledgeCurrency,
      pledgeAmount: "",
      borrowAmount: "",
      pledgeDay: 30,
      borrowInterestRate: 0.001,
      estimateInterest: 0.0,
      checkBorrowAmountTip: "",
      checkPledgeAmountTip: "",
    });
  }

  /**
   * @description 设置质押数量
   * 质押数量改变 同时计算借款数量 继而计算出预估利息
   * @param {Event} event
   */
  handlePledgeAmountChange(event) {
    const { exchangeRate } = this.props;
    const { pledgeDay, borrowInterestRate } = this.state;
    let { value: pledgeAmount } = event.target;

    pledgeAmount = pledgeAmount === 0 ? "" : pledgeAmount;

    // 判断用户的输入是否是小数 如果是小数 小数位不能超过 6 位, 超过 6 位不能输入
    if (this.isDecimalReg.test(pledgeAmount)) {
      if (pledgeAmount.split(".")[1].length > 6) {
        return false;
      }
    }

    let borrowAmount = this.computeBorrowAmount(
      pledgeDay,
      borrowInterestRate,
      pledgeAmount,
      exchangeRate,
    );
    const estimateInterest = this.computeEstimateInterest(
      borrowAmount,
      borrowInterestRate,
      pledgeDay,
    );

    if (borrowAmount < 500 || borrowAmount > 100000) {
      this.setState({ checkBorrowAmountTip: "请输入符合范围之内的借款数量" });
    } else {
      this.setState({ checkBorrowAmountTip: "" });
    }

    borrowAmount = borrowAmount === 0 ? "" : borrowAmount;

    this.setState({ pledgeAmount, borrowAmount, estimateInterest });
  }

  /**
   * 质押数量输入框失去焦点事件处理
   * @param {Event} event
   */
  handleCheckOnPledgeAmountInputBlur(event) {
    const { value } = event.target;
    this.checkPledgeAmount(value);
  }

  /**
   * @description 检查用户输入的质押数量是否符合预期
   * @param {string} value
   */
  checkPledgeAmount(value) {
    if (value.trim().length === 0) {
      this.setState({ checkPledgeAmountTip: "质押数量不能为空" });
      return false;
    }
    if (!isNumber(value)) {
      this.setState({ checkPledgeAmountTip: "请输入有效的质押数量" });
      return false;
    }

    const { availableAmountOfAccount } = this.props;
    if (value > availableAmountOfAccount) {
      this.setState({
        checkPledgeAmountTip: "输入的质押数量超过账户可用的质押数量",
      });
      return false;
    }

    this.setState({ checkPledgeAmountTip: "" });
    return true;
  }

  /**
   * @description 设置借款数量和预估利息
   * 借款数量改变 根据质押期限、借款利率算出预估利息
   * @param {Event} event
   */
  handleBorrowAmountChange(event) {
    const { exchangeRate } = this.props;
    const { borrowInterestRate, pledgeDay } = this.state;
    let { value: borrowAmount } = event.target;

    // 判断用户的输入是否是小数 如果是小数 小数位不能超过 6 位, 超过 6 位不能输入
    if (this.isDecimalReg.test(borrowAmount)) {
      if (borrowAmount.split(".")[1].length > 6) {
        return false;
      }
    }

    borrowAmount = borrowAmount.length === 0 ? "" : borrowAmount;

    let pledgeAmount = this.computePledgeAmount(
      borrowAmount,
      pledgeDay,
      borrowInterestRate,
      exchangeRate,
    );

    const estimateInterest = this.computeEstimateInterest(
      borrowAmount,
      borrowInterestRate,
      pledgeDay,
    );

    pledgeAmount = pledgeAmount === 0 ? "" : pledgeAmount;

    this.setState({ borrowAmount, pledgeAmount, estimateInterest });
  }

  /**
   * 借款数量输入框失去焦点事件处理
   * @param {Event} event
   */
  handleCheckOnBorrowAmountInputBlur(event) {
    const { value } = event.target;
    this.checkBorrowAmount(value);
  }

  /**
   * @description 检查用户输入的借款数量是否符合预期
   * @param {string} value
   */
  checkBorrowAmount(value) {
    if (value.trim().length === 0) {
      this.setState({ checkBorrowAmountTip: "借款数量不能为空" });
      return false;
    }
    if (!isNumber(value)) {
      this.setState({ checkBorrowAmountTip: "请输入有效的借款数量" });
      return false;
    }

    const { minApplyAmount, maxApplyAmount } = this.props;
    if (Number(value) < minApplyAmount || Number(value) > maxApplyAmount) {
      this.setState({ checkBorrowAmountTip: "请输入符合范围之内的借款数量" });
      return false;
    }
    this.setState({ checkBorrowAmountTip: "" });
    return true;
  }

  /**
   * @description 质押期限改变 设置质押期限和借款利率以及预估利息
   * 并且重新计算借款数量(borrowAmount) 此时质押数量(pledgeAmount)不变
   * @param {Event} event
   */
  handlePledgeDayChange(event) {
    const { loanInterestList, exchangeRate } = this.props;
    const { pledgeAmount } = this.state;
    let { value: pledgeDay } = event.target;
    pledgeDay = Number.parseInt(pledgeDay, 10);
    let { interestRate } = loanInterestList.find(
      (item) => pledgeDay >= item.startDate && pledgeDay <= item.endDate,
    );
    pledgeDay || 30;

    if (pledgeAmount.length === 0) {
      this.setState({ checkPledgeAmountTip: "请输入质押数量" });
    } else {
      this.setState({ checkPledgeAmountTip: "" });
    }

    let borrowAmount = this.computeBorrowAmount(
      pledgeDay,
      interestRate,
      pledgeAmount,
      exchangeRate,
    );

    const estimateInterest = this.computeEstimateInterest(
      borrowAmount,
      interestRate,
      pledgeDay,
    );

    if (borrowAmount === 0) {
      this.setState({ checkBorrowAmountTip: "请输入借款数量" });
    } else if (borrowAmount < 500 || borrowAmount > 100000) {
      this.setState({ checkBorrowAmountTip: "请输入符合范围之内的借款数量" });
    } else {
      this.setState({ checkBorrowAmountTip: "" });
    }

    borrowAmount = borrowAmount === 0 ? "" : borrowAmount;

    this.setState({
      pledgeDay,
      borrowAmount,
      estimateInterest,
      borrowInterestRate: interestRate,
    });
  }

  /**
   *  @description 计算预估利息
   * 预估利息 = 借款数量 * 利率 * 质押期限
   * @param {number} value pledgeDay
   */
  computeEstimateInterest(borrowAmount, rate, pledgeDay) {
    if (Number.isNaN(Number(borrowAmount))) {
      return 0;
    }

    return NA.times(borrowAmount, rate, pledgeDay);
  }

  // 风险指数(0.7) = (本金 + 利息) / 质押物总市值
  // 风险指数(0.7) = (借款数量 + 借款数量 * 质押天数 * 借款利率) / (质押数量 * 汇率);
  // 借款数量 = ((质押数量 * 汇率) * 风险指数) / (1 + 质押天数 * 借款利率)
  // 质押数量 = (借款数量 * (1 + 质押天数 * 借款利率)) / (风险指数 * 汇率)

  /**
   * 借款数量 = ((质押数量 * 汇率) * 风险指数) / (1 + 质押天数 * 借款利率)
   * @param {number} pledgeDay 质押期限
   * @param {number} borrowInterestRate 借款利率
   * @param {string} pledgeAmount 质押数量
   * @param {number} exchangeRate 汇率
   */
  computeBorrowAmount(
    pledgeDay,
    borrowInterestRate,
    pledgeAmount,
    exchangeRate,
  ) {
    if (Number.isNaN(Number(pledgeAmount))) {
      return 0;
    }
    if (Number(pledgeAmount) === 0) {
      return 0;
    }
    return (
      (Number(pledgeAmount) * exchangeRate * RISK_INDEX) /
      (1 + pledgeDay * borrowInterestRate)
    ).toFixed(6);
  }

  /**
   * 质押数量 = (借款数量 * (1 + 质押天数 * 借款利率)) / (风险指数 * 汇率)
   * @param {string} borrowAmount 借款数量
   * @param {number} pledgeDay 质押期限
   * @param {number} borrowInterestRate 借款利率
   * @param {number} exchangeRate 汇率
   */
  computePledgeAmount(
    borrowAmount,
    pledgeDay,
    borrowInterestRate,
    exchangeRate,
  ) {
    if (Number.isNaN(Number(borrowAmount))) {
      return 0;
    }
    if (Number(borrowAmount) === 0) {
      return 0;
    }
    return (
      (Number(borrowAmount) * (1 + pledgeDay * borrowInterestRate)) /
      (RISK_INDEX * exchangeRate)
    ).toFixed(6);
  }

  /**
   * 刷新汇率
   */
  refreshExchangeRate() {
    const { fetchCurrencyExchangeRate, supportPledgeCurrency } = this.props;
    const { pledgeCurrency } = this.state;
    const { id: pledgeCurrencyType } = supportPledgeCurrency.find(
      (item) => item.symbol === pledgeCurrency,
    );
    fetchCurrencyExchangeRate(pledgeCurrencyType);
  }

  /**
   * 借款确认处理
   */
  handleLoanConfirm() {
    const { pledgeAmount, borrowAmount, pledgeDay } = this.state;
    if (!this.checkPledgeAmount(pledgeAmount)) {
      return;
    }
    if (!this.checkBorrowAmount(borrowAmount)) {
      return;
    }

    const { postLoanApply } = this.props;
    const param = {
      currencyType: LoanForm.pledgeCurrencyType,
      depositAmount: pledgeAmount,
      depositPeriod: pledgeDay,
      loanAmount: borrowAmount,
    };

    postLoanApply(param);
  }

  render() {
    const {
      pledgeCurrency,
      borrowInterestRate,
      estimateInterest,
      borrowAmount,
      pledgeAmount,
      pledgeDay,
      checkPledgeAmountTip,
      checkBorrowAmountTip,
    } = this.state;
    const {
      togglePledgeProtocolModalVisible,
      pledgeProtocolChecked,
      toggleTransferMoneyFormVisible,
      supportPledgeCurrency,
      fetchLoanOptionsLoading,
      exchangeRate,
      availableAmountOfAccount,
      loanInterestList,
      fetchCurrencyExchangeRateLoading,
      fetchAvailableAmountOfAccountLoading,
      postingLoanApply,
      minApplyAmount,
      maxApplyAmount,
    } = this.props;

    // 参数更新未完成以及借款申请进行中 输入框禁止输入
    const inputDisabled =
      fetchLoanOptionsLoading ||
      fetchAvailableAmountOfAccountLoading ||
      fetchCurrencyExchangeRateLoading ||
      postingLoanApply;

    // 借款利率的 tip
    const borrowInterestRateTip = (
      <ul
        style={{ lineHeight: "24px", paddingLeft: "10px", listStyle: "disc" }}
      >
        {loanInterestList.map((item) => {
          return (
            <li key={item.id}>
              {item.startDate}
              天~
              {item.endDate}天{NA.times(item.interestRate, 100)}%
            </li>
          );
        })}
        <li>自借款审核通过时起算，不足24小时按24小时计息</li>
        <li>最低还款利息0.3%（借款3天以内，均收取0.3%利息）</li>
        <li>以每日0:00（北京时间）为计息时点，超过计息点即按1天计算</li>
      </ul>
    );

    // 预估利息的 tip
    const estimateInterestTip = (
      <ul
        style={{ lineHeight: "24px", paddingLeft: "10px", listStyle: "disc" }}
      >
        <li>预估利息 = 申请借贷的资金 × 利率 × 天数</li>
      </ul>
    );

    // 汇率的 tip
    const exchangeTip = (
      <ul
        style={{ lineHeight: "24px", paddingLeft: "10px", listStyle: "disc" }}
      >
        <li>计算价格参考火币最近5分钟的价格</li>
        <li>刷新网站后币价格会发生变动</li>
      </ul>
    );

    return (
      <div id="loan_form" className="form-container">
        <div className="form-group pledge-currency">
          <span className="label">质押币种</span>
          <div className="input-container">
            <InputGroup compact>
              {fetchLoanOptionsLoading ? (
                <div className="loading-container">
                  <Spin size="small" />
                </div>
              ) : (
                <Select
                  defaultValue="比特币(BTC)"
                  onChange={this.handlePledgeCurrencyChange}
                >
                  {supportPledgeCurrency.map((item) => {
                    return (
                      <Option key={item.id} value={item.id.toString()}>
                        {item.symbolInChinese}({item.symbol})
                      </Option>
                    );
                  })}
                </Select>
              )}
            </InputGroup>
            <span className="exchange-tip tip">
              1 {pledgeCurrency} ={" "}
              {fetchCurrencyExchangeRateLoading ? (
                <Spin size="small" />
              ) : (
                exchangeRate
              )}{" "}
              USDT &nbsp;
              <a onClick={this.refreshExchangeRate}>刷新</a>
              &nbsp;
              <Popover content={exchangeTip}>
                <Icon type="exclamation-circle" style={{ color: "#d9d9d9" }} />
              </Popover>
            </span>
          </div>
        </div>

        <div className="form-group pledge-amount">
          <span className="label">质押数量</span>
          <div className="input-container">
            <Input
              className={checkPledgeAmountTip ? "warn" : "safe"}
              disabled={inputDisabled}
              placeholder="请输入质押数量"
              value={pledgeAmount}
              onChange={this.handlePledgeAmountChange}
              onBlur={this.handleCheckOnPledgeAmountInputBlur}
            />
            <span className="unit pledge-amount-unit">{pledgeCurrency}</span>
            <span className="exchange-tip tip">
              <Icon type="swap" />
              质押账户可用数量{" "}
              {fetchAvailableAmountOfAccountLoading ? (
                <Spin size="small" />
              ) : (
                availableAmountOfAccount
              )}{" "}
              {pledgeCurrency}{" "}
              <a
                className="transfer-money-btn"
                onClick={toggleTransferMoneyFormVisible}
              >
                资金划转
              </a>
            </span>
            {checkPledgeAmountTip && (
              <span className="check-tip tip">{checkPledgeAmountTip}</span>
            )}
          </div>
        </div>

        <div className="form-group borrow-amount">
          <span className="label">借款数量</span>
          <div className="input-container">
            <Input
              className={checkBorrowAmountTip ? "warn" : "safe"}
              disabled={inputDisabled}
              placeholder={`最小${minApplyAmount}，最大${maxApplyAmount}`}
              value={borrowAmount}
              onChange={this.handleBorrowAmountChange}
              onBlur={this.handleCheckOnBorrowAmountInputBlur}
            />
            <span className="unit borrow-amount-unit">USDT</span>
            {checkBorrowAmountTip && (
              <span className="check-tip tip">{checkBorrowAmountTip}</span>
            )}
          </div>
        </div>

        <div className="form-group pledge-day">
          <span className="label">质押期限</span>
          <div className="input-container">
            <RadioGroup
              value={pledgeDay.toString()}
              defaultValue="30"
              onChange={this.handlePledgeDayChange}
            >
              <RadioButton value="30">30</RadioButton>
              <RadioButton value="60">60</RadioButton>
              <RadioButton value="180">180</RadioButton>
              <RadioButton value="360">360</RadioButton>
            </RadioGroup>
          </div>
        </div>
        <div className="form-group borrow-interest-rate">
          <span className="label">借款利率</span>
          <div className="input-container">
            <p>
              {NA.times(borrowInterestRate, 100)}
              %/天 &nbsp;
              <Popover content={borrowInterestRateTip}>
                <Icon type="exclamation-circle" style={{ color: "#d9d9d9" }} />
              </Popover>
            </p>
          </div>
        </div>

        <div className="form-group estimate-interest">
          <span className="label">预估利息</span>
          <div className="input-container">
            <p>
              <strong>{estimateInterest}</strong> USDT &nbsp;
              <Popover content={estimateInterestTip}>
                <Icon type="exclamation-circle" style={{ color: "#d9d9d9" }} />
              </Popover>
            </p>
          </div>
        </div>

        <div className="form-group submit">
          <span className="label">submit</span>
          <div className="input-container">
            <div className="submit-btn">
              <button onClick={this.handleLoanConfirm}>
                {postingLoanApply ? "申请中..." : "立即借款"}
              </button>
              <p>
                <Checkbox
                  defaultChecked={true}
                  checked={pledgeProtocolChecked}
                  onChange={this.handlePledgeProtocolChange}
                >
                  我已阅读并同意
                </Checkbox>
                <a onClick={togglePledgeProtocolModalVisible}>
                  《数字资产融通及质押担保协议》
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    supportPledgeCurrency: state.loan.supportPledgeCurrency,
    minApplyAmount: state.loan.minApplyAmount,
    maxApplyAmount: state.loan.maxApplyAmount,
    loanInterestList: state.loan.loanInterestList,
    exchangeRate: state.loan.exchangeRate,
    availableAmountOfAccount: state.loan.availableAmountOfAccount,
    fetchLoanOptionsLoading: state.loan.fetchLoanOptionsLoading,
    fetchCurrencyExchangeRateLoading:
      state.loan.fetchCurrencyExchangeRateLoading,
    fetchCurrencyExchangeRateError: state.loan.fetchCurrencyExchangeRateError,
    fetchAvailableAmountOfAccountLoading:
      state.loan.fetchAvailableAmountOfAccountLoading,
    postingLoanApply: state.loan.postingLoanApply,
    postLoanApplySuccess: state.loan.postLoanApplySuccess,
    postLoanApplyError: state.loan.postLoanApplyError,
  };
};

export default connect(
  mapStateToProps,
  {
    resetState,
    fetchAvailableAmountOfAccount,
    fetchCurrencyExchangeRate,
    postLoanApply,
    initRequest,
    changePledgeCurrencyType,
  },
)(LoanForm);
