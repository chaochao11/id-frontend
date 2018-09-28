import React from "react";
import { Modal } from 'antd';
import success from './../../../../../public/img/transfer-money-success-icon.png';

export default class SuccessAlertModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    handleCancelFunc(){
        const { dispatch } = this.props;
        dispatch({type: 'CLOSE_SUCCESS_ALERT_MODAL_FLAG'});
    }
    sureFunc() {
        const { dispatch } = this.props;
        dispatch({type: 'CLOSE_SUCCESS_ALERT_MODAL_FLAG'});
    }
    render() {
        const { successAlertFlag, addOrRepay } = this.props;
        const { data } = this.props.successModalInfo;
        return (
            <div>
                <Modal
                    visible={successAlertFlag}
                    onCancel={this.handleCancelFunc.bind(this)}
                    footer={null}
                    width={587}
                >
                    <div className="pressure-success-modal">
                        <img src={success} alt="" style={{marginTop:'81px'}}/>
                        {addOrRepay === 1 ? <div className="pressure-success-alert-modal-text" style={{marginTop:'59px'}}>
                            <span>您已成功还款</span>
                            <span className="color-blue1">{`${data} USDT`}</span>
                        </div> : <div className="pressure-success-alert-modal-text" style={{marginTop:'59px'}}>
                            <span>您已成功追加质押资金：</span>
                            <span className="color-blue1">{`${data}`}</span>
                            <span>，已被自动冻结质押</span>
                        </div>}
                        <div className="pressure-return-modal-submit" style={{marginTop:'92px'}}>
                            <button className="button-active-blue" onClick={this.sureFunc.bind(this)}>确定</button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}