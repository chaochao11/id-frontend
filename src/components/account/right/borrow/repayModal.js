import React from "react";
import { Modal, Select } from 'antd';
const Option = Select.Option;
import { AccountRepaySubmit } from './../../../../actions/account';
import SuccessAlertModal from './successAlertModal';
import NA from 'number-accuracy';

export default class RepayModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    handleCancelFunc(){
        this.props.cancelFunc();
    }
    fullFunc () {
        this.props.cancelFunc();
        localStorage.setItem('defaultActiveKey', 1);
        this.props.history.push('/user/account');
    }
    highFunc(){
        const { dispatch, id, pageNumber } = this.props;
        let init = {
            recordId: id
        };
        let par = {
            pageNum: pageNumber,
            pageSize: 10,
            status: 2
        };
        dispatch(AccountRepaySubmit(init, par, () => {this.props.cancelFunc();}));
    }
    render() {
        const { repayModal } = this.props;
        const {
            actualLoanPeriod,
            initAmount,
            currentAmout,
            interestAmount,
            interestRate,
            penlityInterestAmount,
            serviceFee,
            totalAmount
        } = this.props.accountRepayInfo.data;
        return (
            <div>
                <Modal
                    visible={repayModal}
                    onCancel={this.handleCancelFunc.bind(this)}
                    footer={null}
                    width={587}
                >
                    <div className="repay-modal">
                        <p className="pressure-return-modal-title headline" style={{marginTop:'34px'}}>还款</p>
                        <div className="repay-modal-center" style={{marginTop:'28px'}}>
                            <div className="clear" style={{marginTop:'16px'}}>
                                <span>本金数量</span>
                                <div className="clear">
                                    <span className="fl third-title">{initAmount}</span>
                                    <span className="fr headline">USDT</span>
                                </div>
                            </div>
                            <div className="clear" style={{marginTop:'16px'}}>
                                <span>利息数量</span>
                                <div className="clear">
                                    <span className="fl third-title">{interestAmount}</span>
                                    <span className="fr headline">USDT</span>
                                </div>
                            </div>
                            <div className="clear" style={{marginTop:'16px'}}>
                                <span>借款利率</span>
                                <div className="clear">
                                    <span className="fl third-title">{NA.times(interestRate, 100) === 0.1 ? '0.1%/天(最低收取0.3%的利息)' : NA.times(interestRate, 100)}</span>
                                    <span className="fr headline">%</span>
                                </div>
                            </div>
                            <div className="clear" style={{marginTop:'16px'}}>
                                <span>实际借款期限</span>
                                <div className="clear">
                                    <span className="fl third-title">{actualLoanPeriod}</span>
                                    <span className="fr headline">天</span>
                                </div>
                            </div>
                            <div className="clear" style={{marginTop:'16px'}}>
                                <span>罚息数量</span>
                                <div className="clear">
                                    <span className="fl third-title">{penlityInterestAmount}</span>
                                    <span className="fr headline">USDT</span>
                                </div>
                            </div>
                            <div className="clear" style={{marginTop:'16px'}}>
                                <span>服务费</span>
                                <div className="clear">
                                    <span className="fl third-title">{serviceFee}</span>
                                    <span className="fr headline">USDT</span>
                                </div>
                            </div>
                            <div className="clear" style={{marginTop:'16px'}}>
                                <span>合计总数量</span>
                                <div className="clear">
                                    <span className="fl third-title">{totalAmount}</span>
                                    <span className="fr headline">USDT</span>
                                </div>
                            </div>
                            <div className="clear repay-modal-center-number" style={{marginTop:'28px'}}>
                                <span style={{height:'24px'}}></span>
                                <p>
                                    <span className="headline">{`基本账户可用数量 ${currentAmout} USDT`}</span>
                                    <span className="color-blue1" style={{marginLeft: '17px', cursor: 'pointer'}} onClick={this.fullFunc.bind(this)}>充币</span>
                                </p>
                            </div>
                            <div className="repay-modal-center-info" style={{marginTop:'26px'}}>
                                <b className="color-blue1">温馨提示</b>
                                <p>• 风险指数 = (本金 + 利息) / 质押物总市值；</p>
                                <p>• 借款申请，风险指数需小于70%；</p>
                                <p>• 风险指数 ≥ 80%，系统会提醒您追加质押物；</p>
                                <p>• 风险指数 ≥ 90%，系统会自动强制平仓；</p>
                                <p>• 逾期收取0.1%/天的罚息，超过3天系统自动强制平仓；</p>
                                <p>• 借款不足3天按最低0.3%收取利息，超过按实际利率收取。</p>
                            </div>
                        </div>
                    </div>
                    <div className="pressure-return-modal-submit" style={{marginTop:'25px'}}>
                        <button className="button-active-blue" onClick={this.highFunc.bind(this)}>立即还款</button>
                    </div>
                </Modal>
                <SuccessAlertModal addOrRepay={this.props.addOrRepay} {...this.props}/>
            </div>
        );
    }
}