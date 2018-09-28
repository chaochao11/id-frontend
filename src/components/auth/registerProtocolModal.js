import React from "react";
import { Modal } from "antd";
import { getLocalValue } from "../common/language";
import "./registerProtocolModal.css";

const registerProtocolModalBodyStyle = {
  height: "600px",
  overflowY: "scroll",
  marginBottom: "20px",
  paddingBottom: "0",
};
const footer = (handleConfirm) => {
  return (
    <div className="agreement-btn">
      <button onClick={handleConfirm}>我已阅读并同意</button>
    </div>
  );
};

const registerProtocolModal = ({ visible, handleConfirm, handleCancel }) => {
  return (
    <Modal
      title="InvestDigital用户手册及相关法律"
      visible={visible}
      width="90%"
      onCancel={handleCancel}
      footer={footer(handleConfirm)}
      bodyStyle={registerProtocolModalBodyStyle}
    >
      <div className="register-protocol-container">
        <h1 className="g-pt-30">{getLocalValue("agreement")}</h1>
        <div>
          <h3>{getLocalValue("agreement_item1")}</h3>
          <p>{getLocalValue("agreement_item1_content1")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item2")}</h3>
          <p>{getLocalValue("agreement_item2_content1")}</p>
          <p>{getLocalValue("agreement_item2_content2")}</p>
          <p>{getLocalValue("agreement_item2_content3")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item3")}</h3>
          <p>{getLocalValue("agreement_item3_content1")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item4")}</h3>
          <p>{getLocalValue("agreement_item4_content1")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item5")}</h3>
          <p>{getLocalValue("agreement_item5_contentP")}</p>
          <p>{getLocalValue("agreement_item5_content1")}</p>
          <p>{getLocalValue("agreement_item5_content2")}</p>
          <p>{getLocalValue("agreement_item5_content3")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item6")}</h3>
          <p>{getLocalValue("agreement_item6_contentP")}</p>
          <p>{getLocalValue("agreement_item6_content1")}</p>
          <p>{getLocalValue("agreement_item6_content2")}</p>
          <p>{getLocalValue("agreement_item6_content3")}</p>
          <p>{getLocalValue("agreement_item6_content4")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item7")}</h3>
          <p>{getLocalValue("agreement_item7_content1")}</p>
          <p>{getLocalValue("agreement_item7_content2")}</p>
          <p>{getLocalValue("agreement_item7_content3")}</p>
          <p>{getLocalValue("agreement_item7_content4")}</p>
          <p>{getLocalValue("agreement_item7_content5")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item8")}</h3>
          <p>{getLocalValue("agreement_item8_content1")}</p>
          <p>{getLocalValue("agreement_item8_content2")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item9")}</h3>
          <p>{getLocalValue("agreement_item9_content1")}</p>
          <p>{getLocalValue("agreement_item9_content2")}</p>
          <p>{getLocalValue("agreement_item9_content3")}</p>
          <p>{getLocalValue("agreement_item9_content4")}</p>
          <p>{getLocalValue("agreement_item9_content5")}</p>
          <p>{getLocalValue("agreement_item9_content6")}</p>
          <p>{getLocalValue("agreement_item9_content7")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item10")}</h3>
          <p>{getLocalValue("agreement_item10_content1")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item11")}</h3>
          <p>{getLocalValue("agreement_item11_content1")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item12")}</h3>
          <p>{getLocalValue("agreement_item12_content1")}</p>
        </div>
        <div>
          <h3>{getLocalValue("agreement_item13")}</h3>
          <p>{getLocalValue("agreement_item13_content1")}</p>
        </div>
      </div>
    </Modal>
  );
};

export default registerProtocolModal;
