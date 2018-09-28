import React from "react";
import { Modal, Select, InputNumber } from 'antd';
const Option = Select.Option;
import NA from 'number-accuracy';
import { AccountAddSubmit, AccountExchangeCurrency, AccountExchangeCurrencyInfo } from './../../../../actions/account';
import SuccessAlertModal from './successAlertModal';
import PressureReturnModal from './../mine/pressureReturnModal';

export default class AddModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addOrRepay: 2, //1还款2追加
            num:'',
            value: '',
            riskMsg: '',
            info: true,
            msg:''
        };
    }
    handleCancelFunc(){
        this.props.returnFunc();
    }
    goFunc () {
        const { dispatch } = this.props;
        this.props.returnFunc();
        let init = {
            currencyType: 3,
            type: 1 //1基本账户2质押账户
        };
        dispatch({type: 'OPEN_ACCOUNT_PRESSURE_MODAL'});
        dispatch(AccountExchangeCurrency());
        dispatch(AccountExchangeCurrencyInfo(init));
    }
    highFunc(){
        const { info, value } = this.state;
        const { id, dispatch, pageNumber } = this.props;
        let par = {
            pageNum: pageNumber,
            pageSize: 10,
            status: 2
        };
        let init = {
            id: id,
            value: value
        };
        if(!info || value === '') {
            this.setState({
                info: false,
                msg: '输入有误'
            });
           return false;
        }else{
            this.setState({
                info: true,
            });
        }
        dispatch(AccountAddSubmit(init, par, () => {this.props.returnFunc();}));
    }
    onChange(value){
        const { currencyUsdPrice, loanNum, targetAmount } = this.props.accountAddInfo.data;
        let sum = NA.plus(loanNum, Number(value));
        let mult_1 = NA.times(currencyUsdPrice, sum);
        let division = NA.divide(targetAmount, mult_1);
        let mult_2 = NA.times(division, 100);
        let result = Math.floor(mult_2);
        this.setState({
            num: result,
            value: value,
            riskMsg: `追加后风险指数：${result}%`
        });
    }
    blurFunc () {
        const { value } = this.state;
        const { currentAmount, currencyStr } = this.props.accountAddInfo.data;
        if (value === undefined || value <= 0 || value === ''){
            this.setState({
                info: false,
                msg: '输入有误'
            });
        }
        else if (Number(value) > Number(currentAmount)) {
            this.setState({
                info: false,
                msg: `可用数量 ${currentAmount}${currencyStr} 数量不足`
            });
        } else{
            this.setState({
                info: true
            });
        }
    }
    limitDecimals(value){
        const reg = /^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/;
        if(typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
        } else {
            return '';
        }
    }
    render() {
        const { addModal } = this.props;
        const {
            currencyStr,
            currentAmount,
            requiredAmount,
        } = this.props.accountAddInfo.data;
        return (
            <div>
                <Modal
                    visible={addModal}
                    onCancel={this.handleCancelFunc.bind(this)}
                    footer={null}
                    width={587}
                >
                    <div className="pressure-return-modal">
                        <p className="pressure-return-modal-title headline">资金追加</p>
                        <div className="clear pressure-return-modal-risk" style={{marginTop:'30px'}}>
                            <span className="fl headline" style={{marginRight:' 23px', width:'80px', textAlign:'right'}}></span>
                            <p className="fl headline">
                                <span>{this.state.num === '' ? '追加后风险指数：70%' : this.state.riskMsg}</span>
                            </p>
                        </div>
                        <div className="clear" style={{marginTop:'10px'}}>
                            <span className="fl headline" style={{marginRight:' 23px', width:'80px', textAlign:'right'}}>币种</span>
                            <Select value={`${currencyStr}`} style={{ width: 430 }} disabled>
                            </Select>
                        </div>
                        <div className="clear pressure-return-modal-account" style={{marginTop:'19px'}}>
                            <span className="fl headline" style={{marginRight:' 23px', width:'80px', textAlign:'right'}}>从</span>
                            <Select defaultValue="质押账户（可用）" style={{ width: 166 }} disabled>
                            </Select>
                            <span className="headline" style={{margin:'0 20px 0 30px', width:'48px'}}>
                                划转到
                            </span>
                            <Select defaultValue="质押账户（冻结）" style={{ width: 166 }} disabled>
                            </Select>
                        </div>
                        <div className="clear pressure-return-modal-center" style={{marginTop:'18px'}}>
                            <span className="fl" style={{marginRight:' 23px', width:'80px', height:'24px'}}></span>
                            <p className="fl pressure-return-modal-number headline">
                                <span>{`可转数量 ${currentAmount}${currencyStr}`}</span>
                                <span style={{marginLeft:'10px', cursor: 'pointer'}} className="color-blue1" onClick={this.goFunc.bind(this)}>资金划转</span>
                            </p>
                        </div>
                        <div className="clear" style={{marginTop:'32px'}}>
                            <span className="fl headline" style={{marginRight:' 23px', width:'80px'}}>需追加数量</span>
                            <div className="pressure-return-modal-num fl">
                                <InputNumber formatter={this.limitDecimals.bind(this)} parser={this.limitDecimals.bind(this)} className={this.state.info ? "" : "account-input-border"} placeholder={`需追加 ${requiredAmount}${currencyStr}`} onChange={this.onChange.bind(this)} onBlur={this.blurFunc.bind(this)}/>
                            </div>
                        </div>
                        <div className="clear pressure-return-modal-center">
                            <span className="fl" style={{marginRight:' 23px', width:'80px', height:'24px'}}></span>
                            <p style={{fontSize:'12px'}} className={this.state.info ? "fl hide" : "fl color-red show"}>
                                <span>{this.state.msg}</span>
                            </p>
                        </div>

                    </div>
                    <div className="pressure-return-modal-submit" style={{marginTop:'39px'}}>
                        <button className="button-active-blue" onClick={this.highFunc.bind(this)}>立即追加</button>
                    </div>
                </Modal>
                <PressureReturnModal  {...this.props}/>
                <SuccessAlertModal addOrRepay={this.props.addOrRepay}  {...this.props}/>
            </div>
        );
    }
}