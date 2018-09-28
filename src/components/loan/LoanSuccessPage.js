import React from "react";
import { Redirect } from "react-router";
import Service from "./../common/service.js";
import "./LoanSuccessPage.css";

const LoanSuccessPage = ({ location, history }) => {
  const { state } = location;
  if (state === undefined) {
    return <Redirect to="/loan/loanApply" />;
  }

  const { money, currency, pledgeDay } = state;
  if (!money || !currency || !pledgeDay) {
    return <Redirect to="/loan/loanApply" />;
  }

  return (
    <div className="loan-success-page">
      <div className="loan-success-page-container">
        <img
          src={require("./../../../public/img/loan-success-icon.png")}
          alt="借款申请成功"
          title="借款申请成功"
        />
        <p className="loan-success-text">
          您已成功提交借款申请，数量&nbsp;
          <strong>{money}</strong>
          &nbsp;
          <span>{currency}</span>
          ，借款期限&nbsp;
          <strong>{pledgeDay}</strong>
          &nbsp;天
        </p>
        {/* <p className="tip">
          借款申请审核时间为1~2天，请耐心等待 IDT 客服人员的审核
        </p> */}
        <div className="operation-btn-group">
          <button
            className="btn continue-btn"
            onClick={() => {
              history.push("/loan/loanApply");
            }}
          >
            继续借款
          </button>
          <button
            className="btn mine-btn"
            onClick={() => {
              localStorage.setItem('defaultActiveKey', 3);
              history.push("/user/account");
            }}
          >
            我的借款
          </button>
        </div>
      </div>
      <Service />
    </div>
  );
};

export default LoanSuccessPage;
