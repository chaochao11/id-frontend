import React from "react";
import { connect } from "react-redux";
import { Modal } from "antd";

import "./TransferSuccessModal.css";

const TransferSuccessModal = ({
  visible,
  transferMoneyInfo,
  handleConfirm,
  handelCancel,
}) => {
  const transferSuccessModalFooter = (
    <div className="transfer-success-modal-footer">
      <button onClick={handleConfirm}>确定</button>
    </div>
  );
  const {
    targetAccount,
    transferAccount,
    currency,
    amount,
  } = transferMoneyInfo;

  return (
    <Modal
      visible={visible}
      onCancel={handelCancel}
      footer={transferSuccessModalFooter}
    >
      <div className="transfer-success-container">
        <img
          src={require("./../../../public/img/transfer-money-success-icon.png")}
          alt="划款成功"
          title="划款成功"
        />
        <p>
          您已成功从 &nbsp;
          <strong>{transferAccount}</strong>
          &nbsp; 划转资金到 &nbsp;
          <strong>{targetAccount}</strong>：
          <i>
            {amount}
            &nbsp;
            {currency}
          </i>
        </p>
      </div>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    transferMoneyInfo: state.loan.transferMoneyInfo,
  };
};

export default connect(mapStateToProps)(TransferSuccessModal);
