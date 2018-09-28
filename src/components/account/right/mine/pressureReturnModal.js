import React from "react";
import { Modal, Select, InputNumber } from 'antd';
const Option = Select.Option;
import { AccountExchangeCurrencyInfo, AccountLoanExchange } from './../../../../actions/account';
import SuccessModal from './../../../common/successModal';

export default class PressureReturnModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencyId: 3, //默认币种id
            currency: 'BTC', //默认币种
            valueFir: '1', //第一个默认账户
            valueSec: '2', //第二个默认账户
            flag: true,
            value: '',
            msg:''
        };
    }
    handleCancelFunc(){
        const { dispatch } = this.props;
        this.setState({
            currencyId: 3,
            currency: 'BTC'
        }, () => {
            dispatch({type: 'CLOSE_ACCOUNT_PRESSURE_MODAL'});
        });
    }
    currencyFunc (value) {
        const { dispatch } = this.props;
        const { valueFir } = this.state;
        const { data } = this.props.accountExchangeCurrency;
        const { symbol: currency } = data.find(item => item.id == value);
        let init = {
            currencyType: value,
            type: valueFir //1基本账户2质押账户
        };
        this.setState({
            currencyId: value,
            currency: currency
        }, () => {
            dispatch(AccountExchangeCurrencyInfo(init));
        });
    }
    valueFirFunc (value) {
        const { dispatch } = this.props;
        const { currencyId } = this.state;
        let init = {
            currencyType: currencyId,
            type: value //1基本账户2质押账户
        };
        this.setState({
            valueFir: value,
            valueSec: value === "1" ? "2" : "1"
        }, () => {
            dispatch(AccountExchangeCurrencyInfo(init));
        });
    }
    valueSecFunc (value) {
        const { dispatch } = this.props;
        const { currencyId } = this.state;
        let init = {
            currencyType: currencyId,
            type: value === "1" ? "2" : "1" //1基本账户2质押账户
        };
        this.setState({
            valueFir: value === "1" ? "2" : "1",
            valueSec: value
        }, () => {
            dispatch(AccountExchangeCurrencyInfo(init));
        });
    }
    onChange(value){
        this.setState({
            value: value
        });
    }
    blurFunc () {
        const { value, currency } = this.state;
        const { data } = this.props.accountExchangeCurrencyInfo;
        if (value === undefined || value <= 0 || value === ''){
            this.setState({
                flag: false,
                msg: '输入有误'
            });
        } else if (Number(value) > Number(data)) {
            this.setState({
                flag: false,
                msg: `可用数量 ${data}${currency} 数量不足`
            });
        } else{
            this.setState({
                flag: true
            });
        }
    }
    allFunc () {
        const { data } = this.props.accountExchangeCurrencyInfo;
        this.setState({
            value: data
        });
    }
    highFunc(){
        const { flag, value, currencyId, valueFir, valueSec, currency } = this.state;
        const { dispatch } = this.props;
        const { data } = this.props.accountExchangeCurrencyInfo;
        let init = {
            currencyType: currencyId,
            initAccount: valueFir,
            targetAccount: valueSec,
            amount: value
        };
        if(!flag || value === '') {
            this.setState({
                flag: false
            });
            return false;
        }else if (Number(value) > Number(data)) {
            this.setState({
                flag: false
            });
            return false;
        }else{
            this.setState({
                flag: true,
            });
        }
        dispatch(AccountLoanExchange(init));
    }
    resetStatus () {
        this.setState({
            currencyId: 3,
            currency: 'BTC'
        });
    }
    limitDecimals(value){
        const reg = /^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/;
        if(typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
        } else {
            return '';
        }
    }
    render() {
        const { pressureModal } = this.props;
        const { data } = this.props.accountExchangeCurrency;
        let accountAmount = this.props.accountExchangeCurrencyInfo.data;
        let item = data && data.map((cur, index, arr) => {
            return <Option key={index.toString()} value={cur.id.toString()}>{`${cur.symbolInChinese}(${cur.symbol})`}</Option>;
        });
        return (
            <div>
                <Modal
                    visible={pressureModal}
                    onCancel={this.handleCancelFunc.bind(this)}
                    footer={null}
                    width={587}
                >
                    <div className="pressure-return-modal">
                        <p className="pressure-return-modal-title headline">账户资金划转</p>
                        <div className="clear" style={{marginTop:'41px'}}>
                            <span className="fl headline" style={{marginRight:' 23px', width:'64px'}}>质押币种</span>
                            <Select value={`${this.state.currencyId}`} style={{ width: 430 }} onChange={this.currencyFunc.bind(this)}>
                                {item}
                            </Select>
                        </div>
                        <div className="clear pressure-return-modal-account" style={{marginTop:'19px'}}>
                            <span className="fl headline" style={{marginRight:' 23px', width:'64px', textAlign:'right'}}>从</span>
                            <Select value={`${this.state.valueFir}`} style={{ width: 166 }} onChange={this.valueFirFunc.bind(this)}>
                                <Option value="1">基本账户</Option>
                                <Option value="2">质押账户</Option>
                            </Select>
                            <span className="headline" style={{margin:'0 20px 0 30px', width:'48px'}}>
                                划转到
                            </span>
                            <Select value={`${this.state.valueSec}`} style={{ width: 166 }} onChange={this.valueSecFunc.bind(this)}>
                                <Option value="1">基本账户</Option>
                                <Option value="2">质押账户</Option>
                            </Select>
                        </div>
                        <div className="clear pressure-return-modal-center" style={{marginTop:'18px'}}>
                            <span className="fl" style={{marginRight:' 23px', width:'64px', height:'24px'}}></span>
                            <p className="fl pressure-return-modal-number headline">{`可转数量${accountAmount}${this.state.currency}`}</p>
                        </div>
                        <div className="clear" style={{marginTop:'32px'}}>
                            <span className="fl headline" style={{marginRight:' 23px', width:'64px'}}>划转数量</span>
                            <div className="pressure-return-modal-num fl">
                                <InputNumber formatter={this.limitDecimals.bind(this)} parser={this.limitDecimals.bind(this)} className={this.state.flag ? "" : "account-input-border"} value={this.state.value} onChange={this.onChange.bind(this)} onBlur={this.blurFunc.bind(this)}/>
                                <span className="color-blue1" onClick={this.allFunc.bind(this)}>全部</span>
                            </div>
                        </div>
                        <div className="clear">
                            <span className="fl" style={{marginRight:' 23px', width:'64px', height:'24px'}}></span>
                            <p className={this.state.flag ? "fl hide" : "fl color-red show"} style={{fontSize:'12px'}}>{this.state.msg}</p>
                        </div>
                    </div>
                    <div className="pressure-return-modal-submit" style={{marginTop:'39px'}}>
                        <button className="button-active-blue" onClick={this.highFunc.bind(this)}>立即划转</button>
                    </div>
                </Modal>
                <SuccessModal type1={this.state.valueFir} type2={this.state.valueSec} amount={this.state.value} coin={this.state.currency} resetStatusFunc={this.resetStatus.bind(this)} {...this.props}/>
            </div>
        );
    }
}