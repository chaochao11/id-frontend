import axios from 'axios';
import {getAuthorizedHeader, ROOT_ACCOUNT, ROOT_USER, ROOT_PORTFOLIO, ROOT_COUPON} from "./types";
import {message} from 'antd';
import { signOutUser } from './auth';

//我的账户
export function MineAccount() {
    return dispatch => {
        axios.get(`${ROOT_ACCOUNT}/wallet/account`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_INFO',
                        account: response.data
                    });
                }
            });
    };
}

//立即激活
export function AccountActivation(currencyType) {
    return dispatch => {
        axios.get(`${ROOT_ACCOUNT}/wallet/address/${currencyType}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch(AccountPrimaryStatus(true));
                    dispatch({type: 'ACTIVATION_STATUS', activationStatus: true});
                    dispatch(MineAccount());
                } else{
                    message.error(response.data.message);
                }
            });
    };
}

//我的投资
export function AccountInvestmentList(init) {
    return dispatch => {
        axios.get(`${ROOT_PORTFOLIO}/portfolio/invest/${init.pageSize}/${init.pageNum}/${init.status}`, {headers: getAuthorizedHeader()})
            .then(response => {
                dispatch({
                    type: 'GET_ACCOUNT_INVESTMENT_LIST_LOADING',
                    investmentListLoading: false
                });
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_INVESTMENT_LIST',
                        investmentList: response.data
                    });
                }
            });
    };
}

//财务明细
export function AccountDetailList(init) {
    return dispatch => {
        axios.get(`${ROOT_ACCOUNT}/account/finance/${init.pageSize}/${init.pageNum}`, {headers: getAuthorizedHeader()})
            .then(response => {
                dispatch({
                    type: 'ACCOUNT_LIST_LOADING',
                    accountListLoading: false
                });
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_DETAIL_LIST',
                        detailList: response.data
                    });
                }
            });
    };
}

//我的奖励
export function AccountRewardList(init) {
    return dispatch => {
        axios.get(`${ROOT_COUPON}/activity/award/${init.pageSize}/${init.pageNum}`, {headers: getAuthorizedHeader()})
            .then(response => {
                dispatch({
                    type: 'ACCOUNT_REWARD_LOADING',
                    accountRewardLoading: false
                });
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_REWARD_LIST',
                        accountRewardList: response.data
                    });
                }
            });
    };
}

//领取奖励
export function AccountReceiveRewardList(init, item) {
    return dispatch => {
        axios.get(`${ROOT_COUPON}/activity/award/get/${init.aid}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    message.success('领取成功');
                    dispatch(AccountRewardList(item));
                }else{
                    message.error(response.data.message);
                }
            });
    };
}

//我的邀请码
export function AccountInvitedCode(init) {
    return dispatch => {
        axios.get(`${ROOT_USER}/user/invite/${init.pageSize}/${init.pageNum}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_INVITED_LIST',
                        accountInvitedCodeList: response.data
                    });
                }
            });
    };
}

//账户安全
export function AccountSecurityInfo() {
    return dispatch => {
        axios.get(`${ROOT_USER}/user/security`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_SECURITY_INFO',
                        accountSecurityInfo: response.data
                    });
                }
            });
    };
}

//绑定邮箱
export function AccountSecurityBindEmail(init, email, code, sendBtn) {
    return dispatch => {
        axios.post(`${ROOT_USER}/user/bind/email`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                sendBtn.removeAttribute('disabled', 'disabled');
                let list = {
                    phoneNum: 0,
                    emailNum: 0,
                    authNum: 0,
                    nameAuthNum: 0,
                    openGa: 0,
                    closeGa: 0,
                    changeGa: 0,
                    accountFlag: true
                };
                if (response.status === 200 && response.data.status === 1) {
                    message.success("绑定成功");
                    email.value = '';
                    code.value = '';
                    dispatch(AccountHighStatus(list));
                    dispatch(AccountSecurityInfo());
                }else {
                    message.error(response.data.message);
                }
            });
    };
}

//获取邮箱验证码
export function AccountSecuritySendEmail(init) {
    return dispatch => {
        axios.get(`${ROOT_USER}/vcode/mail_v1/${init.email}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    message.success('您的验证码已发送到您的邮箱，请登录邮箱查看并填写');
                } else{
                    message.error(response.data.message);
                }
            });
    };
}

//修改手机号
export function AccountSecurityChangePhone(init, sendBtn) {
    return dispatch => {
        axios.post(`${ROOT_USER}/user/change/phone`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                sendBtn.removeAttribute('disabled', 'disabled');
                if (response.status === 200 && response.data.status === 1) {
                    message.success("绑定成功");
                    dispatch(signOutUser());
                } else {
                    message.error(response.data.message);
                }
            });
    };
}
//绑定手机号
export function AccountSecurityBindPhone(init, phone, code, sendBtn) {
    return dispatch => {
        axios.post(`${ROOT_USER}/user/bind/phone`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                sendBtn.removeAttribute('disabled', 'disabled');
                let list = {
                    phoneNum: 0,
                    emailNum: 0,
                    authNum: 0,
                    nameAuthNum: 0,
                    openGa: 0,
                    closeGa: 0,
                    changeGa: 0,
                    accountFlag: true
                };
                if (response.status === 200 && response.data.status === 1) {
                    message.success("绑定成功");
                    phone.value = '';
                    code.value = '';
                    dispatch(AccountHighStatus(list));
                    dispatch(AccountSecurityInfo());
                } else {
                    message.error(response.data.message);
                }
            });
    };
}

//获取手机验证码
export function AccountSecuritySendPhone(init) {
    return dispatch => {
        axios.get(`${ROOT_USER}/vcode/phone_v1/${init.phone}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (!response.status === 200 || !response.data.status === 1) {
                    message.error(response.data.message);
                }
            });
    };
}

//提交身份证照片
export function AccountSecurityCommitAuthImg(init) {
    return dispatch => {
        axios.post(`${ROOT_USER}/user/advanced_qic`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    message.success("上传成功");
                    dispatch(AccountSecurityInfo());
                } else {
                    message.error(response.data.message);
                }
            });
    };
}

//提币
export function AccountSecurityWithDrawalurrency(init, address, ga, func) {
    return dispatch => {
        axios.post(`${ROOT_ACCOUNT}/wallet/apply`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    message.success("提币成功");
                    address.value = '';
                    ga.value = '';
                    func();
                    dispatch(MineAccount());
                } else {
                    message.error(response.data.message);
                }
            });
    };
}

//初级认证状态
export function AccountPrimaryStatus(flag) {
    return dispatch => {
        return Promise.resolve(
            dispatch({
            type: 'GET_ACCOUNT_PRIMARY_STATUS',
            accountPrimaryStatus: flag
        }));
    };
}

//高级认证
export function AccountHighStatus(num) {
    return dispatch => {
        dispatch({
            type: 'GET_ACCOUNT_HIGH_STATUS',
            accountHighStatus: num
        });
    };
}

//一键兑换
export function AccountExChnage(init, exChange) {
    return dispatch => {
        axios.post(`${ROOT_USER}/user/exchange`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    message.success("兑换成功");
                    exChange();
                    dispatch(MineAccount());
                } else {
                    message.error(response.data.message);
                }
            });
    };
}
//财务明细详情
export function AccountListDetail( infoId ) {
    return dispatch => {
        axios.get(`${ROOT_ACCOUNT}/account/finance/info/${infoId}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_LIST_DETAIL',
                        accountListDetail: response.data,
                        accountListDetailFlag:true
                    });
                } else{
                    message.error(response.data.message);
                }
            });
    };
}

//谷歌认证信息
export function OpenGaAuth( ) {
    return dispatch => {
        axios.get(`${ROOT_USER}/authgooglecode/secretkey`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_OPEN_GA_AUTH_INFO',
                        openGaAuthInfo: response.data,
                    });
                } else{
                    message.error(response.data.message);
                }
            });
    };
}
//绑定谷歌认证
export function BindGaAuth( init ) {
    return dispatch => {
        axios.post(`${ROOT_USER}/authgooglecode/bind`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                let par = {
                    phoneNum: 0,
                    emailNum: 0,
                    authNum: 0,
                    nameAuthNum: 0,
                    openGa: 0,
                    closeGa: 0,
                    changeGa: 0,
                    accountFlag: true
                };
                if (response.status === 200 && response.data.status === 1) {
                    message.success("绑定成功");
                    dispatch(AccountHighStatus(par));
                    dispatch(AccountSecurityInfo());
                } else {
                    message.error(response.data.message);
                }
            });
    };
}

//更换谷歌认证

export function ChangeGaAuth( init ) {
    return dispatch => {
        axios.post(`${ROOT_USER}/authgooglecode/put`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                let par = {
                    phoneNum: 0,
                    emailNum: 0,
                    authNum: 0,
                    nameAuthNum: 0,
                    openGa: 0,
                    closeGa: 0,
                    changeGa: 0,
                    accountFlag: true
                };
                if (response.status === 200 && response.data.status === 1) {
                    message.success("更换成功");
                    dispatch(AccountHighStatus(par));
                    dispatch(AccountSecurityInfo());
                } else {
                    message.error(response.data.message);
                }
            });
    };
}

//关闭谷歌认证
export function CloseGaAuth( init ) {
    return dispatch => {
        axios.post(`${ROOT_USER}/authgooglecode/close`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                let par = {
                    phoneNum: 0,
                    emailNum: 0,
                    authNum: 0,
                    nameAuthNum: 0,
                    openGa: 0,
                    closeGa: 0,
                    changeGa: 0,
                    accountFlag: true
                };
                if (response.status === 200 && response.data.status === 1) {
                    message.success("关闭成功");
                    dispatch(AccountHighStatus(par));
                    dispatch(AccountSecurityInfo());
                } else {
                    message.error(response.data.message);
                }
            });
    };
}

//关闭之后开启
export function AgainOpenGaAuth( init ) {
    return dispatch => {
        axios.post(`${ROOT_USER}/authgooglecode/open`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                let par = {
                    phoneNum: 0,
                    emailNum: 0,
                    authNum: 0,
                    nameAuthNum: 0,
                    openGa: 0,
                    closeGa: 0,
                    changeGa: 0,
                    accountFlag: true
                };
                if (response.status === 200 && response.data.status === 1) {
                    message.success("开启成功");
                    dispatch(AccountHighStatus(par));
                    dispatch(AccountSecurityInfo());
                } else {
                    message.error(response.data.message);
                }
            });
    };
}

//优惠券列表

export function AccountListCoupon( init ) {
    return dispatch => {
        axios.get(`${ROOT_COUPON}/activity/list/myCoupon/${init.status}/${init.pageNum}/${init.pageSize}`, {headers: getAuthorizedHeader()})
            .then(response => {
                dispatch({
                    type: 'GET_ACCOUNT_LIST_COUPON_LOADING',
                    accountCouponListLoading: false
                });
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_LIST_COUPON',
                        accountCouponList: response.data
                    });
                } else{
                    message.error(response.data.message);
                }
            });
    };
}

//领取优惠券
export function AccountListGetCoupon( init, par ) {
    return dispatch => {
        axios.post(`${ROOT_USER}/activity/update/coupon`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    message.success("使用成功");
                    dispatch(AccountListCoupon(par));
                } else {
                    message.error(response.data.message);
                }
            });
    };
}

//质押账户
export function AccountPressureInfo() {
    return dispatch => {
        axios.get(`${ROOT_ACCOUNT}/wallet/loan/account`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_PRESSURE_INFO',
                        accountPressureInfo: response.data
                    });
                } else{
                    message.error(response.data.message);
                }
            });
    };
}

//申请中、待还款
export function AccountApplyOrWait( init ) {
    return dispatch => {
        axios.post(`${ROOT_ACCOUNT}/loan/list/loanRecordApplying`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                dispatch({
                    type: 'ACCOUNT_BORROW_FLAG',
                    accountBorrowFlag: false
                });
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_APPLY_OR_WAIT',
                        accountApplyOrWait: response.data
                    });
                } else {
                    message.error(response.data.message);
                }
            });
    };
}

//已平仓、已完成
export function AccountFlatOrFinish( init ) {
    return dispatch => {
        axios.post(`${ROOT_ACCOUNT}/loan/list/loanRecordFinished`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                dispatch({
                    type: 'ACCOUNT_BORROW_FLAG',
                    accountBorrowFlag: false
                });
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_FLAT_OR_FINISH',
                        accountFlatOrFinish: response.data
                    });
                } else {
                    message.error(response.data.message);
                }
            });
    };
}

//还款信息
export function AccountRepay( init ) {
    return dispatch => {
        axios.get(`${ROOT_ACCOUNT}/loan/get/loanRecordInfo/${init.id}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_REPAY_INFO',
                        accountRepayInfo: response.data
                    });
                } else{
                    message.error(response.data.message);
                }
            });
    };
}

//确认还款
export function AccountRepaySubmit( init, par, cancelFunc ) {
    return dispatch => {
        axios.post(`${ROOT_ACCOUNT}/loan/post/submitLoanApply`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    cancelFunc();
                    dispatch(AccountApplyOrWait(par));
                    dispatch({
                        type: 'SUCCESS_ALERT_MODAL_FLAG',
                        successModalInfo: response.data
                    });
                } else{
                    message.error(response.data.message);
                }
            });
    };
}

//追加信息
export function AccountAdd( init ) {
    return dispatch => {
        axios.get(`${ROOT_ACCOUNT}/loan/get/loanAccountAddInfo/${init.id}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACCOUNT_ADD_INFO',
                        accountAddInfo: response.data
                    });
                } else{
                    message.error(response.data.message);
                }
            });
    };
}

//追加
export function AccountAddSubmit( init, par, cancelFunc ) {
    return dispatch => {
        axios.get(`${ROOT_ACCOUNT}/loan/get/loanAccountAdd/${init.id}/${init.value}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    cancelFunc();
                    dispatch(AccountApplyOrWait(par));
                    dispatch({
                        type: 'SUCCESS_ALERT_MODAL_FLAG',
                        successModalInfo: response.data
                    });
                } else{
                    message.error(response.data.message);
                }
            });
    };
}

//账户划转币种
export function AccountExchangeCurrency () {
    return dispatch => {
        axios.get(`${ROOT_ACCOUNT}/loan/get/loanAccountExchange/currency`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'ACCOUNT_EXCHANGE_CURRENCY',
                        accountExchangeCurrency: response.data
                    });
                } else{
                    message.error(response.data.message);
                }
            });
    };
}

//账户划转信息
export function AccountExchangeCurrencyInfo ( init ) {
    return dispatch => {
        axios.get(`${ROOT_ACCOUNT}/loan/get/loanAccountExchange/${init.currencyType}/${init.type}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'ACCOUNT_EXCHANGE_CURRENCY_INFO',
                        accountExchangeCurrencyInfo: response.data
                    });
                } else{
                    message.error(response.data.message);
                }
            });
    };
}

//账户划账
export function AccountLoanExchange( init ) {
    return dispatch => {
        axios.post(`${ROOT_ACCOUNT}/loan/update/loanAccountExchange`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({type: 'CLOSE_ACCOUNT_PRESSURE_MODAL'});
                    dispatch({type: 'OPEN_SUCCESS_MODAL'});
                    dispatch(AccountPressureInfo());
                } else {
                    message.error(response.data.message);
                }
            });
    };
}

//意见反馈
export function OpinionFeedBack( init, func ) {
    return dispatch => {
        axios.post(`${ROOT_USER}/cms/suggestion`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    func();
                    message.success("提交成功");
                } else {
                    message.error(response.data.message);
                }
            });
    };
}