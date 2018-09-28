import React from "react";
import Header from "../common/header";
import Footer from "./../common/footer";
import "./product_feature.css";

const ProductFeaturePage = () => {
  return (
    <div>
      <Header />
      <div className="product-feature-page">
        {/* 平台介绍 开始 */}
        <div className="platform-introduce section">
          <div className="platform-introduce-container section-container">
            <h2>InvestDigital平台</h2>
            <h3>打造数字资产一站式投资服务平台</h3>
            <div className="platform-feature-group">
              <div className="platform-feature-item">
                <div className="item-background">
                  <p>建立交易员与投资人之间的链接</p>
                </div>
                <div className="item-foreground">
                  <img
                    src={require("./../../../public/img/intr-community-icon.png")}
                    alt="数字资产投资社区"
                    title="数字资产投资社区"
                  />
                  <p>数字资产投资社区</p>
                </div>
              </div>
              <div className="platform-feature-item">
                <div className="item-background">
                  <p>数字资产基金工具与服务</p>
                </div>
                <div className="item-foreground">
                  <img
                    src={require("./../../../public/img/intr-factory-icon.png")}
                    alt="数字资产基金工厂"
                    title="数字资产基金工厂"
                  />
                  <p>数字资产基金工厂</p>
                </div>
              </div>
              <div className="platform-feature-item">
                <div className="item-background">
                  <p>打通数字资产市场投资通道</p>
                </div>
                <div className="item-foreground">
                  <img
                    src={require("./../../../public/img/intr-marker-icon.png")}
                    alt="数字资产基金市场"
                    title="数字资产基金市场"
                  />
                  <p>数字资产基金市场</p>
                </div>
              </div>
            </div>
            <div className="white-paper-download-link">
              <a
                href="https://img.investdigital.info/v1/tfs/T1ytJTByxT1RCvBVdK"
                download="white_paper.pdf"
                target="_blank"
              >
                『白皮书』下载
              </a>
            </div>
          </div>
        </div>
        {/* 平台介绍 结束 */}

        {/* IDT 介绍 开始 */}
        <div className="idt-introduce section">
          <div className="idt-introduce-container section-container">
            <h2>大德币（IDT）是什么</h2>
            <p>
              大德币（InvestDigital
              Token，简称IDT），是InvestDigital平台发行代币，
              以激励并维护生态健康发展，通过大德币（IDT）使社区多个参与方之间形成有机流转。
              大德币（IDT）是 InvestDigital 生态系统的Token。
              目前，大德币（IDT）已经在火币Hadax、BigONE、AEX.com、KKEX.com等平台流通，
              后续将上线更多优质流通平台。
            </p>
            <div className="participator">
              <h4>IDT 参与者</h4>
              <div className="histogram">
                <img
                  src={require("./../../../public/img/participator-histogram.png")}
                  alt="IDT 参与者"
                  title="IDT 参与者"
                />
              </div>
            </div>
          </div>
        </div>
        {/* IDT 介绍 结束 */}

        {/* 业务模式  开始*/}
        <div className="business-pattern section">
          <div className="business-pattern-container section-container">
            <h2>资管产品运作结构</h2>
            <ul>
              <li>
                <span />基金只能通过智能合约创建。
                基金经理只能对智能合约进行分配指令，指令与执行过程分离。
              </li>
              <li>
                <span />所有投资在资金到期时自动赎回，不受任何外部力量限制。
                即使本网站无法打开，您的资金和智能合约仍会保留。
              </li>
              <li>
                <span />记录的所有投资活动均保存在区块链上，并且不能被篡改。
              </li>
            </ul>
            <img
              src={require("./../../../public/img/business-pattern.png")}
              alt="投资组合运作结构"
              title="投资组合运作结构"
            />
          </div>
        </div>
        {/* 业务模式 结束 */}

        {/* 未来规划 开始 */}
        <div className="future-plan section">
          <div className="future-plan-container section-container">
            <h2>IDT将如何勾勒未来</h2>
            <p className="future-des">重构投资世界信任关系</p>
            <div className="future-timeline">
              <div className="timeline-top timeline">
                <div className="timeline-item">
                  <div className="des-img">
                    <img
                      src={require("./../../../public/img/future-icon01.png")}
                      alt="2017"
                      title="2017"
                    />
                  </div>
                </div>
                <div className="timeline-item">
                  <p className="year">2018</p>
                  <div className="todo-list">
                    <p>网站正式上线</p>
                    <p>投资组合测试</p>
                    <p>交易员大赛落幕</p>
                    <p>大德系列资管产品发布</p>
                    <p>聚合交易工具上线</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="des-img">
                    <img
                      src={require("./../../../public/img/future-icon03.png")}
                      alt="2019"
                      title="2019"
                    />
                  </div>
                </div>
                <div className="timeline-item">
                  <p className="year">2020</p>
                  <div className="todo-list">
                    <p>建立顶级的数字资产数据库</p>
                    <p>形成丰富的量化策略库</p>
                    <p>建立顶级的量化交易平台</p>
                    <p>数字资产管理规模突破百亿</p>
                  </div>
                </div>
              </div>
              <div className="timeline-middle timeline">
                <div className="timeline-line 2017" />
                <div className="timeline-line 2018" />
                <div className="timeline-line 2019" />
                <div className="timeline-line 2020" />
              </div>
              <div className="timeline-bottom timeline">
                <div className="timeline-item">
                  <p className="year">2017</p>
                  <div className="todo-list">
                    <p>智能合约建立</p>
                    <p>超级信息账本</p>
                    <p>风控体系建立</p>
                    <p>策略模型建立</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="des-img">
                    <img
                      src={require("./../../../public/img/future-icon02.png")}
                      alt="2018"
                      title="2018"
                    />
                  </div>
                </div>
                <div className="timeline-item">
                  <p className="year">2019</p>
                  <div className="todo-list">
                    <p>成为数字资产资管领军企业</p>
                    <p>构建AI智能风险控制体系</p>
                    <p>丰富的数字资产管理生态</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="des-img">
                    <img
                      src={require("./../../../public/img/future-icon04.png")}
                      alt="2020"
                      title="2020"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 未来规划 结束 */}
      </div>
      <Footer />
    </div>
  );
};

export default ProductFeaturePage;
