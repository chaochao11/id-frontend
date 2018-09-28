import React from "react";
import { Modal } from 'antd';
import success from './../../../public/img/transfer-money-success-icon.png';

export default class SuccessModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    handleCancelFunc(){
        const { dispatch } = this.props;
        this.props.resetStatusFunc();
        dispatch({type: 'CLOSE_SUCCESS_MODAL'});
    }
    sureFunc() {
        const { dispatch } = this.props;
        this.props.resetStatusFunc();
        dispatch({type: 'CLOSE_SUCCESS_MODAL'});
    }
    render() {
        const { type1, type2, coin, amount, successModal } = this.props;
        return (
            <div>
                <Modal
                    visible={successModal}
                    onCancel={this.handleCancelFunc.bind(this)}
                    footer={null}
                    width={587}
                >
                    <div className="pressure-success-modal">
                        <img src={success} alt="" style={{marginTop:'81px'}}/>
                        <div className="pressure-success-modal-text" style={{marginTop:'59px'}}>
                            <span className="headline">您已成功从</span>
                            <span>{type1 === "1" ? "基本账户" : "质押账户"}</span>
                            <span className="headline">划转资金到</span>
                            <span>{type2 === "2" ? "质押账户：" : "基本账户："}</span>
                            <span className="color-blue1">{`${amount} ${coin}`}</span>
                        </div>
                        <div className="pressure-return-modal-submit" style={{marginTop:'92px'}}>
                            <button className="button-active-blue" onClick={this.sureFunc.bind(this)}>确定</button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}