import React, { Component } from "react";
import { connect } from "react-redux";
import LoanForm from "./LoanForm.js";
import PledgeProtocolModal from "./PledgeProtocolModal.js";
import TransferMoneyForm from "./TransferMoneyForm.js";
import TransferSuccessModal from "./TransferSuccessModal.js";
import Service from "../common/service.js";
import {
  fetchAvailableAmountOfAccount,
  postAccountExchange,
  resetState,
} from "../../actions/loan.js";
import "./LoanApplyPage.css";

class LoanApplyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pledgeProtocolModalVisible: false,
      pledgeProtocolChecked: true,
      transferMoneyFormVisible: false,
      transferSuccessModalVisible: false,
    };

    this.togglePledgeProtocolModalVisible = this.togglePledgeProtocolModalVisible.bind(
      this,
    );
    this.handlePledgeProtocolConfirm = this.handlePledgeProtocolConfirm.bind(
      this,
    );
    this.handlePledgeProtocolChange = this.handlePledgeProtocolChange.bind(
      this,
    );
    this.handlePledgeProtocolCancel = this.handlePledgeProtocolCancel.bind(
      this,
    );
    this.toggleTransferMoneyFormVisible = this.toggleTransferMoneyFormVisible.bind(
      this,
    );
    this.handleTransferMoneyFormCancel = this.handleTransferMoneyFormCancel.bind(
      this,
    );
    this.handleTransferSuccessModalCancel = this.handleTransferSuccessModalCancel.bind(
      this,
    );
    this.handleTransferSuccessModalConfirm = this.handleTransferSuccessModalConfirm.bind(
      this,
    );
    this.handleTransferMoneyConfirm = this.handleTransferMoneyConfirm.bind(
      this,
    );
  }

  componentWillReceiveProps(nextProps) {
    const { resetState } = this.props;
    const { postAccountExchangeSuccess } = nextProps;
    if (postAccountExchangeSuccess) {
      this.setState({
        transferMoneyFormVisible: false,
        transferSuccessModalVisible: true,
      });
      resetState();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      transferMoneyFormVisible,
      pledgeProtocolModalVisible,
      pledgeProtocolChecked,
    } = nextState;
    const { fetchAvailableAmountOfAccount, pledgeCurrencyType } = this.props;

    // 资金划转窗口关闭 并且质押币种没有改变(排除质押协议模态框打开关闭/质押协议选择框选中)
    if (
      !transferMoneyFormVisible &&
      !this.state.transferSuccessModalVisible &&
      !pledgeProtocolModalVisible &&
      !this.state.pledgeProtocolModalVisible &&
      pledgeProtocolChecked === this.state.pledgeProtocolChecked &&
      nextProps.pledgeCurrencyType === pledgeCurrencyType
    ) {
      fetchAvailableAmountOfAccount(pledgeCurrencyType);
    }
  }

  /**
   * @description 同意确认质押协议处理
   */
  handlePledgeProtocolConfirm() {
    const { pledgeProtocolChecked } = this.state;
    this.setState({
      pledgeProtocolModalVisible: false,
      pledgeProtocolChecked: pledgeProtocolChecked || true,
    });
  }

  /**
   * @description 质押协议模态框关闭处理
   */
  handlePledgeProtocolCancel() {
    this.setState({ pledgeProtocolModalVisible: false });
  }

  /**
   * @description 质押协议选择框选中处理
   * @param {boolean} flag event.target.checked
   */
  handlePledgeProtocolChange(flag) {
    this.setState({ pledgeProtocolChecked: flag });
  }

  /**
   * @description 切换质押协议模态框显示或者隐藏
   * @param {boolean} flag
   */
  togglePledgeProtocolModalVisible(flag) {
    this.setState({ pledgeProtocolModalVisible: !!flag });
  }

  /**
   * 资金划转确认操作处理
   * @param {Object} fields
   */
  handleTransferMoneyConfirm(fields) {
    const { postAccountExchange } = this.props;
    postAccountExchange(fields);
  }

  /**
   * 资金划转模态框关闭处理
   */
  handleTransferMoneyFormCancel() {
    this.setState({ transferMoneyFormVisible: false });
  }

  /**
   * 切换资金划转模态框显示或者隐藏
   * @param {boolean} flag
   */
  toggleTransferMoneyFormVisible(flag) {
    this.setState({ transferMoneyFormVisible: !!flag });
  }

  /**
   * 资金划转模态框关闭处理
   */
  handleTransferSuccessModalCancel() {
    const { fetchAvailableAmountOfAccount, pledgeCurrencyType } = this.props;
    fetchAvailableAmountOfAccount(pledgeCurrencyType);
    this.setState({ transferSuccessModalVisible: false });
  }

  /**
   * 资金划转模态框确认处理
   */
  handleTransferSuccessModalConfirm() {
    const { fetchAvailableAmountOfAccount, pledgeCurrencyType } = this.props;
    fetchAvailableAmountOfAccount(pledgeCurrencyType);
    this.setState({ transferSuccessModalVisible: false });
  }

  renderTipContainer() {
    return (
      <div className="tip-container">
        <h4>温馨提示</h4>
        <ul>
          <li>风险指数 = (本金 + 利息) / 质押物总市值；</li>
          <li>借款申请，风险指数需小于70%；</li>
          <li>风险指数 ≥ 80%，系统会提醒您追加质押物；</li>
          <li>风险指数 ≥ 90%，系统会自动强制平仓；</li>
          <li>逾期收取0.1%/天的罚息，超过3天系统自动强制平仓；</li>
          <li>借款不足3天按最低0.3%收取利息，超过按实际利率收取。</li>
        </ul>
      </div>
    );
  }

  render() {
    const {
      pledgeProtocolModalVisible,
      pledgeProtocolChecked,
      transferMoneyFormVisible,
      transferSuccessModalVisible,
    } = this.state;
    const { history } = this.props;

    return (
      <div className="loan-interact-page">
        <div className="loan-interact-page-container">
          <LoanForm
            pledgeProtocolChecked={pledgeProtocolChecked}
            handlePledgeProtocolChange={this.handlePledgeProtocolChange}
            togglePledgeProtocolModalVisible={
              this.togglePledgeProtocolModalVisible
            }
            toggleTransferMoneyFormVisible={this.toggleTransferMoneyFormVisible}
            history={history}
            transferMoneyFormVisible={transferMoneyFormVisible}
          />
          {this.renderTipContainer()}
        </div>
        <Service />
        <PledgeProtocolModal
          visible={pledgeProtocolModalVisible}
          handleConfirm={this.handlePledgeProtocolConfirm}
          handleCancel={this.handlePledgeProtocolCancel}
        />
        <TransferMoneyForm
          visible={transferMoneyFormVisible}
          handleCancel={this.handleTransferMoneyFormCancel}
          handleConfirm={this.handleTransferMoneyConfirm}
          history={history}
        />
        <TransferSuccessModal
          visible={transferSuccessModalVisible}
          handelCancel={this.handleTransferSuccessModalCancel}
          handleConfirm={this.handleTransferSuccessModalConfirm}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    postAccountExchangeSuccess: state.loan.postAccountExchangeSuccess,
    pledgeCurrencyType: state.loan.pledgeCurrencyType,
  };
};

export default connect(
  mapStateToProps,
  { fetchAvailableAmountOfAccount, postAccountExchange, resetState },
)(LoanApplyPage);
