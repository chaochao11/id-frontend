const init = {
    financialDetailsList: {
        data: {
            list: [],
            total: 0
        }
    },
    financialDetailsInfo: {
        data: {
            annualProfit: 0,
            fixedAnnualProfit : 0,
            minAnnualProfit : 0,
            closedPeriod: 1,
            portfolioName: '',
            portfolioTags: [],
            activityCodes: [],
            openDate: 0,
            idtInsurance : 1,
            runningStatus : 0,
            totalAmount: 0,
            closedPeriodEndDate : 0,
            portfolioDetail:{
                buyingDesc:'',
                holdingDesc:'',
                redemptionDesc:'',
                productionDesc:'',
                teamDesc:'',
                platformDesc:'',
                productionAdvatage:'',
                redemptionFee:0,
                botDesc:'',
                earningsDesc: ''
            },
            currenciesList:[{
                assets: 0,
                availableAssets: 0,
                currency: '',
                singleTradeMax: '',
                singleTradeMin: '',
                totalAmount: '',
                totalSell: '',
                ethPrice: '',
                currencyId: ''
            }],
            portfolioFee:{
                applyFee:0,
                bonus:0,
                depositFee:'',
                checkoutPeroid:'',
                depositFeel:'',
                managementFee:0,
                managmentPeriod:'',
                maxDrawdown:0,
                redemptionPeriod:'',
                lastYearProfit:'',
                remark:'',
                remarkVOList: {
                    name: '',
                    value: ''
                }
            },
            echart: {
                series:{
                    data:[]
                },
                xaxis:[]
            },
            type: 0,
        }
    },
    getPortfolioLoading: true,
    financialCouponList: {
        data: {
            currenyTypeStr: '',
            fullReductionDtoList: []
        }
    },
    getActivityCouponFlag: false,
    getActivityCouponInfo: {
        data: {
            currencyType: "IDT",
            fullAmount: 0,
            status: 0,
            subAmount: 0
        },
    },
    financialDetailETH: {
        data: 0
    },
    userUid: 0
};

export default (state = init, action) => {
    switch (action.type) {
        case 'GET_FINANCIAL_DETAILS_LIST':
            return {
                ...state,
                financialDetailsList: action.financialDetailsList
            };
        case 'GET_FINANCIAL_DETAILS_INFO':
            return {
                ...state,
                financialDetailsInfo: action.financialDetailsInfo
            };
        case 'GET_PORTFOLIO_LOADING':
            return {
                ...state,
                getPortfolioLoading: action.getPortfolioLoading
            };
        case 'GET_FINANCIAL_DETAILS_COUPON_LIST':
            return {
                ...state,
                financialCouponList: action.financialCouponList
            };
        case 'GET_ACTIVITY_COUPON':
            return {
                ...state,
                getActivityCouponFlag: action.getActivityCouponFlag,
                getActivityCouponInfo: action.getActivityCouponInfo,
            };
        case 'GET_FINANCIAL_DETAILS_ETH':
            return {
                ...state,
                financialDetailETH: action.financialDetailETH
            };
        case 'GET_USER_UID':
            return {
                ...state,
                userUid: action.userUid
            };

    }
    return state;
};

