import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Input, Select, Spin } from "antd";
import { BASIC_ACCOUNT, PLEDGE_ACCOUNT } from "./constant.js";
import { isNumber } from "./../../tools/utils.js";
import {
  fetchSupportedCurrencyOfTransferMoney,
  postAccountExchange,
  fetchAvailableAmountOfAccount,
  setTransferMoneyInfoToStore,
} from "./../../actions/loan.js";

import "./LoanForm.css";
import "./TransferMoneyForm.css";

const InputGroup = Input.Group;
const Option = Select.Option;

class TransferMoneyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 币种名称
      currencyName: "比特币(BTC)",

      // 币种
      currency: "BTC",

      // 划转账户
      transferAccount: BASIC_ACCOUNT,

      // 目标账户
      targetAccount: PLEDGE_ACCOUNT,

      // 借款数量
      borrowAmount: "",

      checkBorrowAmountTip: "",
    };

    this.isDecimalReg = /^\d+\.\d+$/;

    // 默认币种 BTC
    this.defaultCurrencyType = 3;

    this.borrowAmountChecked = false;

    this.setCurrencyChange = this.setCurrencyChange.bind(this);
    this.setBorrowAmount = this.setBorrowAmount.bind(this);
    this.setTargetAccount = this.setTargetAccount.bind(this);
    this.setTransferAccount = this.setTransferAccount.bind(this);
    this.handleTransferConfirm = this.handleTransferConfirm.bind(this);
    this.checkBorrowAmount = this.checkBorrowAmount.bind(this);
    this.handleCheckOnBorrowAmountInputBlur = this.handleCheckOnBorrowAmountInputBlur.bind(
      this,
    );
    this.setAllAvailableAmountToBorrowAmount = this.setAllAvailableAmountToBorrowAmount.bind(
      this,
    );
    this.jumpToChargeMoneyPage = this.jumpToChargeMoneyPage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      fetchSupportedCurrencyOfTransferMoney,
      fetchAvailableAmountOfAccount,
      supportedCurrencyOfTransferMoney,
    } = this.props;
    const { visible } = nextProps;

    // 每次模态框打开时，清空提示，清空输入，重置账户，并重新获取用户账户可用数量
    if (visible && !this.props.visible) {
      this.setState({
        currencyName: "比特币(BTC)",
        currency: "BTC",
        borrowAmount: "",
        checkBorrowAmountTip: "",
        transferAccount: BASIC_ACCOUNT,
        targetAccount: PLEDGE_ACCOUNT,
      });
      fetchAvailableAmountOfAccount(
        this.defaultCurrencyType,
        BASIC_ACCOUNT,
      );
    }
    // 同时获取资金划转所支持的币种
    if (
      visible &&
      !this.props.visible &&
      supportedCurrencyOfTransferMoney.length === 0
    ) {
      fetchSupportedCurrencyOfTransferMoney();
    }
  }

  /**
   * @description 设置币种
   * @param {number} currency 币种类型
   */
  setCurrencyChange(currencyType) {
    const { transferAccount } = this.state;
    const {
      supportedCurrencyOfTransferMoney,
      fetchAvailableAmountOfAccount,
    } = this.props;
    const {
      symbol: currency,
      symbolInChinese,
    } = supportedCurrencyOfTransferMoney.find(
      (item) => item.id == currencyType,
    );
    fetchAvailableAmountOfAccount(currencyType, transferAccount);
    this.setState({
      currency,
      currencyName: `${symbolInChinese}(${currency})`,
      borrowAmount: "",
      checkBorrowAmountTip: "",
    });
  }

  /**
   * 设置划款账户
   * @param {number} account
   */
  setTransferAccount(transferAccount) {
    transferAccount = Number.parseInt(transferAccount);
    const { targetAccount, currency } = this.state;
    const {
      supportedCurrencyOfTransferMoney,
      fetchAvailableAmountOfAccount,
    } = this.props;
    const { id: currencyType } = supportedCurrencyOfTransferMoney.find(
      (item) => {
        return item.symbol == currency;
      },
    );
    if (targetAccount === transferAccount) {
      this.setState({
        targetAccount: transferAccount === 1 ? PLEDGE_ACCOUNT : BASIC_ACCOUNT,
      });
    }

    this.setState({
      transferAccount,
      borrowAmount: "",
      checkBorrowAmountTip: "",
    });
    fetchAvailableAmountOfAccount(currencyType, transferAccount);
  }

  /**
   * 设置目标账户
   * @param {number} account
   */
  setTargetAccount(targetAccount) {
    targetAccount = Number.parseInt(targetAccount);
    const { transferAccount, currency } = this.state;
    const {
      supportedCurrencyOfTransferMoney,
      fetchAvailableAmountOfAccount,
    } = this.props;
    const { id: currencyType } = supportedCurrencyOfTransferMoney.find(
      (item) => {
        return item.symbol == currency;
      },
    );
    if (targetAccount === transferAccount) {
      this.setState({
        transferAccount: targetAccount === 1 ? PLEDGE_ACCOUNT : BASIC_ACCOUNT,
      });
    }

    this.setState({
      targetAccount,
      borrowAmount: "",
      checkBorrowAmountTip: "",
    });
    fetchAvailableAmountOfAccount(
      currencyType,
      targetAccount === 1 ? BASIC_ACCOUNT : PLEDGE_ACCOUNT,
    );
  }

  /**
   *
   * @param {Event} event
   */
  setBorrowAmount(event) {
    let { value: borrowAmount } = event.target;
    borrowAmount = borrowAmount.length === 0 ? "" : borrowAmount;

    // 判断用户的输入是否是小数 如果是小数 小数位不能超过 8 位, 超过 8 位不能输入
    if (this.isDecimalReg.test(borrowAmount)) {
      if (borrowAmount.split(".")[1].length > 8) {
        return false;
      }
    }

    this.setState({ borrowAmount, checkBorrowAmountTip: "" });
  }

  handleCheckOnBorrowAmountInputBlur(event) {
    const { value } = event.target;
    this.checkBorrowAmount(value);
  }

  /**
   * @description 检查用户输入的借款数量是否符合预期
   * @param {string} value
   */
  checkBorrowAmount(value) {
    if (value.length === 0) {
      this.setState({ checkBorrowAmountTip: "借款数量不能为空" });
      return false;
    }
    if (!isNumber(value)) {
      this.setState({ checkBorrowAmountTip: "请输入有效的借款数量" });
      return false;
    }

    const { availableAmountOfAccount } = this.props;

    if (Number(value) > availableAmountOfAccount) {
      this.setState({ checkBorrowAmountTip: "数量不足" });
      return false;
    }
    if (Number(value) <= 0) {
      this.setState({ checkBorrowAmountTip: "数量不能为0或者小于0" });
      return false;
    }
    this.setState({ checkBorrowAmountTip: "" });
    return true;
  }

  /**
   * 点击「全部」将用户账户剩余数量填入借款输入框
   */
  setAllAvailableAmountToBorrowAmount() {
    const {
      availableAmountOfAccount,
      fetchAvailableAmountOfAccountLoading,
    } = this.props;
    if (fetchAvailableAmountOfAccountLoading) {
      return false;
    }
    this.setState({
      borrowAmount: availableAmountOfAccount,
      checkBorrowAmountTip: "",
    });
  }

  /**
   * 划转确认处理
   */
  handleTransferConfirm() {
    const {
      currency,
      transferAccount,
      targetAccount,
      borrowAmount,
    } = this.state;

    if (!this.checkBorrowAmount(borrowAmount)) {
      return;
    }

    const {
      handleConfirm,
      supportedCurrencyOfTransferMoney,
      setTransferMoneyInfoToStore,
    } = this.props;
    const { id: currencyType } = supportedCurrencyOfTransferMoney.find(
      (item) => {
        return item.symbol == currency;
      },
    );

    // 将划款的信息存入 store 将会在 TransferSuccessModal 组件中用到这些信息
    setTransferMoneyInfoToStore({
      currency,
      amount: borrowAmount,
      transferAccount: transferAccount === 1 ? "基本账户" : "质押账户",
      targetAccount: targetAccount === 2 ? "质押账户" : "基本账户",
    });

    // 用户id 币种 划款账户 目标账户 借款数量
    handleConfirm({
      targetAccount,
      currencyType,
      initAccount: transferAccount,
      amount: borrowAmount,
    });
  }

  /**
   * 跳转到充币页面
   */
  jumpToChargeMoneyPage() {
    const { history } = this.props;
    localStorage.setItem("defaultActiveKey", 1);
    history.push("/user/account");
  }

  render() {
    const {
      borrowAmount,
      transferAccount,
      targetAccount,
      currency,
      currencyName,
      checkBorrowAmountTip,
    } = this.state;
    const {
      visible,
      handleCancel,
      fetchSupportedCurrencyOfTransferMoneyLoading,
      supportedCurrencyOfTransferMoney,
      availableAmountOfAccount,
      postingAccountExchange,
      fetchAvailableAmountOfAccountLoading,
    } = this.props;

    // 获取账户可用数量时，以及划款进行中 输入框禁止输入
    const inputDisabled =
      fetchAvailableAmountOfAccountLoading || postingAccountExchange;

    const transferMoneyModalFooter = (
      <div className="transfer-money-modal-footer">
        <button onClick={this.handleTransferConfirm}>
          {postingAccountExchange ? "划转中..." : "立即划转"}
        </button>
      </div>
    );

    return (
      <Modal
        width={"600px"}
        visible={visible}
        onCancel={handleCancel}
        footer={transferMoneyModalFooter}
      >
        <div className="transfer-money-form-container form-container">
          <h5 className="title">账户资金划转</h5>
          <div className="form-group pledge-currency">
            <span className="label">币种</span>
            <div className="input-container">
              <InputGroup compact>
                {fetchSupportedCurrencyOfTransferMoneyLoading ? (
                  <div className="loading-container">
                    <Spin size="small" />
                  </div>
                ) : (
                  <Select
                    defaultValue="比特币(BTC)"
                    value={currencyName}
                    onChange={this.setCurrencyChange}
                  >
                    {supportedCurrencyOfTransferMoney.map((item) => {
                      return (
                        <Option key={item.id} value={item.id.toString()}>
                          {item.symbolInChinese}({item.symbol})
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </InputGroup>
            </div>
          </div>

          <div className="form-group transfer-target">
            <span className="label">从</span>
            <div className="input-container">
              <div className="transfer-target-input-group">
                <InputGroup compact>
                  <Select
                    defaultValue="2"
                    onChange={this.setTransferAccount}
                    value={transferAccount.toString()}
                  >
                    <Option value="1">基本账户</Option>
                    <Option value="2">质押账户</Option>
                  </Select>
                </InputGroup>
                <span className="label target-label">划转到</span>
                <InputGroup compact>
                  <Select
                    defaultValue="2"
                    onChange={this.setTargetAccount}
                    value={targetAccount.toString()}
                  >
                    <Option value="1">基本账户</Option>
                    <Option value="2">质押账户</Option>
                  </Select>
                </InputGroup>
              </div>

              <span className="balance-tip tip">
                <i>
                  可转数量{" "}
                  {fetchAvailableAmountOfAccountLoading ? (
                    <Spin size="small" />
                  ) : (
                    availableAmountOfAccount
                  )}{" "}
                  {currency}{" "}
                </i>
                &nbsp;
                <a
                  className="charge-money-btn"
                  onClick={this.jumpToChargeMoneyPage}
                >
                  充币
                </a>
              </span>
            </div>
          </div>

          <div className="form-group borrow-amount">
            <span className="label">划款数量</span>
            <div className="input-container">
              <Input
                className={checkBorrowAmountTip ? "warn" : "safe"}
                disabled={inputDisabled}
                onChange={this.setBorrowAmount}
                onBlur={this.handleCheckOnBorrowAmountInputBlur}
                value={borrowAmount}
                placeholder="输入划款数量"
              />
              <span
                className="unit borrow-amount-unit"
                onClick={this.setAllAvailableAmountToBorrowAmount}
              >
                全部
              </span>
              {checkBorrowAmountTip && (
                <span className="check-tip tip">{checkBorrowAmountTip}</span>
              )}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    supportedCurrencyOfTransferMoney:
      state.loan.supportedCurrencyOfTransferMoney,

    fetchSupportedCurrencyOfTransferMoneyLoading:
      state.loan.fetchSupportedCurrencyOfTransferMoneyLoading,
    fetchSupportedCurrencyOfTransferMoneyError:
      state.loan.fetchSupportedCurrencyOfTransferMoneyError,
    availableAmountOfAccount: state.loan.availableAmountOfAccount,
    postingAccountExchange: state.loan.postingAccountExchange,
    postAccountExchangeError: state.loan.postAccountExchangeError,
    fetchAvailableAmountOfAccountLoading:
      state.loan.fetchAvailableAmountOfAccountLoading,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchSupportedCurrencyOfTransferMoney,
    postAccountExchange,
    fetchAvailableAmountOfAccount,
    setTransferMoneyInfoToStore,
  },
)(TransferMoneyForm);
