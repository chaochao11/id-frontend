import React from "react";
import Header from "../common/header";
import Footer from "./../common/footer";
import {connect} from 'react-redux';
import AccountRight from './right/accountRight';

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount () {
        if (!this.props.authenticated) {
            this.props.history.push("/user/signin");
            return false;
        }
    }
    render() {
        if (!this.props.authenticated) return false;
        return (
            <div className="account">
                <Header/>
                <div className="my-account">
                    <div className="account-center container">
                        <AccountRight {...this.props}/>
                    </div>
                </div>
                <Footer/>
            </div>

        );
    }
}

export default connect(state => {
    return {
        authenticated: state.auth.authenticated,
        account: state.account.account,
        investmentList: state.account.investmentList,
        detailList: state.account.detailList,
        activationStatus: state.account.activationStatus,
        accountRewardList: state.account.accountRewardList,
        accountInvitedCodeList: state.account.accountInvitedCodeList,
        accountSecurityInfo: state.account.accountSecurityInfo,
        showInfo: state.account.showInfo,
        accountPrimaryStatus: state.account.accountPrimaryStatus,
        accountHighStatus: state.account.accountHighStatus,
        accountListDetail: state.account.accountListDetail,
        accountListDetailFlag:state.account.accountListDetailFlag,
        openGaAuthInfo:state.account.openGaAuthInfo,
        accountCouponList:state.account.accountCouponList,
        accountCouponListLoading:state.account.accountCouponListLoading,
        investmentListLoading:state.account.investmentListLoading,
        financialDetailETH:state.account.financialDetailETH,
        accountPressureInfo:state.account.accountPressureInfo,
        accountBorrowFlag:state.account.accountBorrowFlag,
        accountApplyOrWait:state.account.accountApplyOrWait,
        accountFlatOrFinish:state.account.accountFlatOrFinish,
        accountRepayInfo:state.account.accountRepayInfo,
        successModalInfo:state.account.successModalInfo,
        successAlertFlag:state.account.successAlertFlag,
        accountAddInfo:state.account.accountAddInfo,
        pressureModal:state.account.pressureModal,
        accountExchangeCurrency:state.account.accountExchangeCurrency,
        accountExchangeCurrencyInfo:state.account.accountExchangeCurrencyInfo,
        successModal:state.account.successModal,
        accountListLoading:state.account.accountListLoading,
        accountRewardLoading:state.account.accountRewardLoading,
    };
})(Account);


