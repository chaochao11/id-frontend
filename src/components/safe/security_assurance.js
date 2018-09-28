import React from "react";
import Header from "../common/header";
import Footer from "./../common/footer";

import "./security_assurance.css";

const SecurityAssurancePage = () => {
  return (
    <div>
      <Header />
      <div className="security-assurance-page">
        {/* 账户安全托管 开始 */}
        <div className="efficient-section section">
          <div className="efficient-section-container section-container">
            <div className="text-container">
              <div className="title">
                <h2>账户安全托管</h2>
              </div>
              <div className="text-content">
                <p>
                  IDT平台采用托管账户，有效确保投资用户资金安全，基金经理仅可进行买卖操作，无法完成转币、提币等操作。
                </p>
              </div>
            </div>
            <div className="description-img">
              <img
                src={require("./../../../public/img/safe-page-section1-bg.png")}
                alt="账户安全托管"
                title="账户安全托管"
              />
            </div>
          </div>
          <div />
        </div>
        {/* 账户安全托管 开始 */}

        {/*  量化风控策略 开始 */}
        <div className="safe-section section">
          <div className="safe-section-container section-container">
            <div className="description-img">
              <img
                src={require("./../../../public/img/safe-page-section2-bg.png")}
                alt="量化风控策略"
                title="量化风控策略"
              />
            </div>
            <div className="text-container">
              <div className="title">
                <h2>量化风控策略</h2>
              </div>
              <div className="text-content">
                <p>
                  严格的风控策略，为投资用户设置70%止损线，有效帮助用户进行交易止损，规避数字货币熊市风险。
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* 量化风控策略 结束 */}

        {/* 意外损失先行赔付 开始 */}
        <div className="credible-section section">
          <div className="credible-section-container section-container">
            <div className="text-container">
              <div className="title">
                <h2>意外损失先行赔付</h2>
              </div>
              <div className="text-content">
                <p>
                  提供与基金规模匹配的一定数量IDT作为抵押，意外损失先行赔付。
                </p>
              </div>
            </div>
            <div className="description-img">
              <img
                src={require("./../../../public/img/safe-page-section3-bg.png")}
                alt="意外损失先行赔付"
                title="意外损失先行赔付"
              />
            </div>
          </div>
        </div>
        {/* 意外损失先行赔付 结束 */}

        {/* 大资金设置交易专户 开始 */}
        <div className="risk-control-section section">
          <div className="risk-control-section-container section-container">
            <div className="description-img">
              <img
                src={require("./../../../public/img/safe-page-section4-bg.png")}
                alt="意外损失先行赔付"
                title="意外损失先行赔付"
              />
            </div>
            <div className="text-container">
              <div className="title">
                <h2>大资金设置交易专户</h2>
              </div>
              <div className="text-content">
                <p>
                  针对大客户开设交易所专户，超低手续费，账户资产尽在掌握，安全有保障。
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* 大资金设置交易专户 结束 */}
      </div>
      <Footer />
    </div>
  );
};

export default SecurityAssurancePage;
