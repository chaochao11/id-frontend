const init = {
    account: {
        data: {
            assets: {
                IDT: 0,
                USDT:0,
                ETH:0,
                BTC:0,
            },
            currentReturn: 0,
            currentReturnPer: 0,
            totalAsset: 0,
            totalReturn: 0,
            idtAssets: 0,
            idtRate: 0,
            userAccountVoList: [{
                address: null,
                addressBase64: null,
                addressType: null,
                availableAssets: 0,
                cnyValuation: 0,
                currencyName: "--",
                currencyType: 1,
                frozenAssets: 0,
                isBindAddress: 2
            }]
        }
    },
    investmentList: {
        data: {
            currentReturn: 0,
            currentReturnPer: 0,
            myInvestEveryList: [],
            totalAsset: 0,
            countInvest: 0
        }
    },
    detailList: {
        data: [],
        rowCount: 0
    },
    activationStatus: false,
    accountRewardList: {
        data: {
            count: 0,
            qicActivityRecordVoList: []
        }
    },
    accountInvitedCodeList: {
        data: {
            inviteCode: '',
            inviteNum: 0,
            reward: 0,
            userInviteRecordVos: [],
            totalNum: 0
        }
    },
    accountSecurityInfo: {
        data: {
            email: '--',
            loginname: '--',
            mobilephone: '--',
            uid: '--',
            googleSecretStatus: 1,
            highQICStatus: 0,
            qicFailDesc: ''
        }
    },
    showInfo: true,
    accountPrimaryStatus: false,
    accountHighStatus: {
        phoneNum: 0,
        emailNum: 0,
        authNum: 0,
        nameAuthNum: 0,
        openGa: 0,
        closeGa: 0,
        changeGa: 0,
        accountFlag: true
    },
    accountListDetail: {
        data: {
            status: '',
            address: '',
            txHash: '',
            amount: '',
            fee: '',
            notarizeAmount: '',
            portfolioName: '',
            commission: '',
            championCountryName: '',
            runnerUpCountryName: '',
            thirdPlaceCountryName: '',
            cost: '',
            sessionInfo: '',
            country: '',
            winCountry: '',
            investAmount: '',
            winAmount: '',
            statusStr: '',
            exchangePair: '',
            currentRate: '',
            totalAmount: '',
            changeType: ''
        }
    },
    accountListDetailFlag: false,
    openGaAuthInfo: {
        data: {
            secretKey: '',
            secretKeyBase64: ''
        }
    },
    accountCouponList: {
        data:{
            count:1,
            list:[]
        }
    },
    accountCouponListLoading: true,
    investmentListLoading: true,
    accountBorrowFlag: true,
    accountPressureInfo: {
        data: {
            closePosition: 0,
            totalAssets: 0,
            loanAccountSingleVoList: []
        }
    },
    accountApplyOrWait: {
        data: {
            count: 0,
            list: []
        }
    },
    accountFlatOrFinish: {
        data: {
            count: 0,
            list: []
        }
    },
    accountRepayInfo: {
        data:{
            actualLoanPeriod: 0,
            currentAmout: 0,
            initAmount: 0,
            interestAmount: 0,
            interestRate: 0,
            penlityInterestAmount: 0,
            serviceFee: 0,
            totalAmount: 0,
        }
    },
    successModalInfo: {
        data: ''
    },
    successAlertFlag: false,
    accountAddInfo:{
        data:{
            currencyStr:'',
            currency: 0,
            currencyUsdPrice: 0,
            currentAmount: 0,
            loanNum: 0,
            requiredAmount: 0,
            targetAmount: 0
        }
    },
    pressureModal: false,
    accountExchangeCurrency:{
        data:[]
    },
    accountExchangeCurrencyInfo:{
        data: 0
    },
    successModal: false,
    accountListLoading: true,
    accountRewardLoading: true
};
let status = null;
export default (state = init, action) => {
    switch (action.type) {
        case 'GET_ACCOUNT_INFO':
            return {
                ...state,
                account: action.account
            };
        case 'GET_ACCOUNT_INVESTMENT_LIST':
            return {
                ...state,
                investmentList: action.investmentList
            };
        case 'GET_ACCOUNT_DETAIL_LIST':
            return {
                ...state,
                detailList: action.detailList
            };
        case 'ACTIVATION_STATUS':
            return {
                ...state,
                activationStatus: action.activationStatus
            };
        case 'GET_ACCOUNT_REWARD_LIST':
            return {
                ...state,
                accountRewardList: action.accountRewardList
            };
        case 'GET_ACCOUNT_INVITED_LIST':
            return {
                ...state,
                accountInvitedCodeList: action.accountInvitedCodeList
            };
        case 'GET_ACCOUNT_SECURITY_INFO':
            status = !action.accountSecurityInfo.data.highQICStatus ? true : false;
            return {
                ...state,
                accountSecurityInfo: action.accountSecurityInfo,
                showInfo: status
            };
        case 'ACCOUNT_RES_SHOW_INFO':
            return {
                ...state,
                showInfo: true
            };
        case 'GET_ACCOUNT_PRIMARY_STATUS':
            return {
                ...state,
                accountPrimaryStatus: action.accountPrimaryStatus
            };
        case 'GET_ACCOUNT_HIGH_STATUS':
            return {
                ...state,
                accountHighStatus: action.accountHighStatus
            };
        case 'GET_ACCOUNT_LIST_DETAIL':
            return {
                ...state,
                accountListDetail: action.accountListDetail,
                accountListDetailFlag: action.accountListDetailFlag
            };
        case 'GET_OPEN_GA_AUTH_INFO':
            return {
                ...state,
                openGaAuthInfo: action.openGaAuthInfo,
            };
        case 'GET_ACCOUNT_LIST_COUPON':
            return {
                ...state,
                accountCouponList: action.accountCouponList,
            };
        case 'GET_ACCOUNT_LIST_COUPON_LOADING':
            return {
                ...state,
                accountCouponListLoading: action.accountCouponListLoading,
            };
        case 'GET_ACCOUNT_INVESTMENT_LIST_LOADING':
            return {
                ...state,
                investmentListLoading: action.investmentListLoading,
            };
        case 'ACCOUNT_BORROW_FLAG':
            return {
                ...state,
                accountBorrowFlag: action.accountBorrowFlag,
            };
        case 'GET_ACCOUNT_PRESSURE_INFO':
            return {
                ...state,
                accountPressureInfo: action.accountPressureInfo,
            };
        case 'GET_ACCOUNT_APPLY_OR_WAIT':
            return {
                ...state,
                accountApplyOrWait: action.accountApplyOrWait,
            };
        case 'GET_ACCOUNT_FLAT_OR_FINISH':
            return {
                ...state,
                accountFlatOrFinish: action.accountFlatOrFinish,
            };
        case 'GET_ACCOUNT_REPAY_INFO':
            return {
                ...state,
                accountRepayInfo: action.accountRepayInfo,
            };
        case 'SUCCESS_ALERT_MODAL_FLAG':
            return {
                ...state,
                successModalInfo: action.successModalInfo,
                successAlertFlag: !action.successModalInfo.status  ? false : true
            };
        case 'CLOSE_SUCCESS_ALERT_MODAL_FLAG':
            return {
                ...state,
                successAlertFlag: false
            };
        case 'GET_ACCOUNT_ADD_INFO':
            return {
                ...state,
                accountAddInfo: action.accountAddInfo
            };
        case 'OPEN_ACCOUNT_PRESSURE_MODAL':
            return {
                ...state,
                pressureModal: true
            };
        case 'CLOSE_ACCOUNT_PRESSURE_MODAL':
            return {
                ...state,
                pressureModal: false
            };
        case 'ACCOUNT_EXCHANGE_CURRENCY':
            return {
                ...state,
                accountExchangeCurrency: action.accountExchangeCurrency
            };
        case 'ACCOUNT_EXCHANGE_CURRENCY_INFO':
            return {
                ...state,
                accountExchangeCurrencyInfo: action.accountExchangeCurrencyInfo
            };
        case 'OPEN_SUCCESS_MODAL':
            return {
                ...state,
                successModal: true
            };
        case 'CLOSE_SUCCESS_MODAL':
            return {
                ...state,
                successModal: false
            };
        case 'ACCOUNT_LIST_LOADING':
            return {
                ...state,
                accountListLoading: action.accountListLoading
            };
        case 'ACCOUNT_REWARD_LOADING':
            return {
                ...state,
                accountRewardLoading: action.accountRewardLoading
            };
    }
    return state;
};

