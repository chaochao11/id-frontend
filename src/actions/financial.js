import axios from 'axios';
import {getAuthorizedHeader, ROOT_PORTFOLIO, ROOT_ACCOUNT, ROOT_COUPON, ROOT_USER} from "./types";
import {message} from "antd";
import {AccountHighStatus, AccountSecurityInfo} from "./account";

//我要理财列表
export function FinancialDetailsList(init) {
    return dispatch => {
        axios.get(`${ROOT_PORTFOLIO}/portfolio/list/${init.pageNum}/${init.pageSize}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_FINANCIAL_DETAILS_LIST',
                        financialDetailsList: response.data
                    });
                }
            });
    };
}

//我要理财详情
export function FinancialDetailsInfo(init, callback) {
    return dispatch => {
        axios.get(`${ROOT_PORTFOLIO}/portfolio/get/preview/${init.portfolioCode}`, {headers: getAuthorizedHeader()})
            .then(response => {
                dispatch({
                    type: 'GET_PORTFOLIO_LOADING',
                    getPortfolioLoading: false
                });
                if (response.status === 200 && response.data.status === 1) {
                    callback(response.data.data);
                    dispatch({
                        type: 'GET_FINANCIAL_DETAILS_INFO',
                        financialDetailsInfo: response.data
                    });
                }
            });
    };
}

//优惠券列表
export function FinancialDetailsCouponList(init) {
    return dispatch => {
        axios.post(`${ROOT_PORTFOLIO}/portfolioTrading/post/confirm`, init, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_FINANCIAL_DETAILS_COUPON_LIST',
                        financialCouponList: response.data
                    });
                }
            });
    };
}

//获取ETH价格
export function FinancialDetailETH (currencyId) {
    return dispatch => {
        axios.get(`${ROOT_ACCOUNT}/wallet/eth/${currencyId}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_FINANCIAL_DETAILS_ETH',
                        financialDetailETH: response.data
                    });
                }
            });
    };
}

//领取优惠劵
export function GetActivityCoupon(init) {
    return dispatch => {
        axios.get(`${ROOT_COUPON}/activity/insert/couponInfo/${init.phoneNumber}/${init.activityCode}/${init.uid}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_ACTIVITY_COUPON',
                        getActivityCouponInfo: response.data,
                        getActivityCouponFlag: true
                    });
                }else {
                    message.error(response.data.message);
                }
            });
    };
}

//获取uid

export function GetUserUid() {
    return dispatch => {
        axios.get(`${ROOT_USER}/auth/uid`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({
                        type: 'GET_USER_UID',
                        userUid: response.data
                    });
                }else {
                    message.error(response.data.message);
                }
            });
    };
}