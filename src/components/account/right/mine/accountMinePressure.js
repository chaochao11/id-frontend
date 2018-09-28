import React from "react";
import { Icon } from 'antd';
import PressureReturnModal from './pressureReturnModal';
import { AccountExchangeCurrency, AccountExchangeCurrencyInfo } from "../../../../actions/account";

export default class AccountMinePressure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    loanFunc () {
        this.props.history.push('/loan/loanApply');
    }
    listFunc () {
        this.props.history.push('/user/account');
        localStorage.setItem('defaultActiveKey', 3);
    }
    goFunc(){
        const { dispatch } = this.props;
        let init = {
            currencyType: 3,
            type: 1 //1基本账户2质押账户
        };
        dispatch({type: 'OPEN_ACCOUNT_PRESSURE_MODAL'});
        dispatch(AccountExchangeCurrency());
        dispatch(AccountExchangeCurrencyInfo(init));
    }
    render() {
        const { loanAccountSingleVoList, closePosition, totalAssets } = this.props.accountPressureInfo.data;
        let item = loanAccountSingleVoList && loanAccountSingleVoList.map((cur, index, arr) => {
            return <div className="account-mine-pressure-list-center clear" key={index.toString()}>
                <div>{cur.currency}</div>
                <div>{cur.balance}</div>
                <div>{cur.assets}</div>
                <div>{cur.frozenAssets}</div>
                <div>{`${cur.borrowNumber} USDT`}</div>
                <div>
                    <div className="color-blue1" onClick={this.loanFunc.bind(this)}>申请借贷</div>
                    <div className="color-blue1" onClick={this.goFunc.bind(this)}>资金划转</div>
                    <div className="color-blue1" onClick={this.listFunc.bind(this)}>质押记录</div>
                </div>
            </div>;
        });
        return (
            <div className="account-mine-pressure">
                <div className="account-mine-pressure-top clear">
                    <p className="fl">
                        <span>总资产估值：</span>
                        <span>{`${totalAssets} USDT`}</span>
                    </p>
                    <p className="fl" style={{marginLeft:'20px'}}>
                        <span>平仓结余：</span>
                        <span>{`${closePosition} USDT`}</span>
                        <span className="color-blue1" style={{marginLeft:'20px', cursor: 'pointer'}} onClick={this.goFunc.bind(this)}>资金划转</span>
                    </p>
                </div>
                <div className="account-mine-pressure-list">
                    <div className="account-mine-pressure-list-top clear">
                        <div>币种</div>
                        <div>余额</div>
                        <div>可用</div>
                        <div>已冻结</div>
                        <div>已借</div>
                        <div></div>
                    </div>
                    {item}
                </div>
                <div className="account-mine-pressure-hint">
                    <Icon type="exclamation-circle" />
                    <i style={{marginLeft: '11px'}}>当风险率> 90%时，账户将触发平仓以归还借贷资金</i>
                </div>
                <PressureReturnModal {...this.props}/>
            </div>
        );
    }
}


