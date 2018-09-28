import React from "react";
import { Pagination, Icon, Popover, Spin } from 'antd';
import moment from 'moment';
import NA from 'number-accuracy';
import { AccountListCoupon, AccountListGetCoupon } from "./../../../../actions/account";


//一天毫秒数
let dayTime = 86400000;
const content = (
    <div style={{width: '150px'}}>
        <p>满减劵是平台为了给用户增加所投项目年化收益所推出的虚拟卡种。用户可根据所使用的满减劵，获得金额的抵扣。</p>
    </div>
);
export default class AccountUnusedCoupon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1
        };
    }
    onChange(key) {
        const { dispatch } = this.props;
        let init = {
            status: 1,
            pageNum: key,
            pageSize: 10
        };
        this.setState({
            key: key
        }, () => {
            dispatch({
                type: 'GET_ACCOUNT_LIST_COUPON_LOADING',
                accountCouponListLoading: true
            });
            dispatch(AccountListCoupon(init));
        });
    }
    getCoupon (id) {
        const { dispatch } = this.props;
        let key = this.state.key;
        let init = {
            couponRecordId: id
        };
        let par = {
            status: 1,
            pageNum: key,
            pageSize: 10
        };
        dispatch(AccountListGetCoupon(init, par));
    }
    render() {
        const { list, count } = this.props.accountCouponList.data;
        const { accountCouponListLoading } = this.props;
        if (accountCouponListLoading) {
            return <div className="text-center h3 col-sm-12 g-pt-30 g-pb-30">
                <Spin tip="玩命加载中..."/>
            </div>;
        }
        let item = list && list.map((cur, index, arr) => {
            return <div className="clear account-stale-coupon-main-item" style={cur.templateType === 2 ? {background:'linear-gradient(90deg, #F7F1D9 0%, #F5DCA1 100%)'} : {background:'linear-gradient(90deg, #F7F1D9 0%, #F5DCA1 100%)'}} key={index.toString()}>
                <div className="fl account-stale-coupon-main-item-left">
                    <p>{cur.name}</p>
                    <p>{cur.templateType === 2 ? `满${JSON.parse(cur.rule).fullAmount} ${cur.currencyStr}减${JSON.parse(cur.rule).subAmount}` : `返${JSON.parse(cur.rule).backAmount} ${cur.currencyStr}`}</p>
                    <p>{`有效期至 ${moment(NA.plus(cur.receivedTime, NA.times(cur.expiredDate, dayTime))).format('YYYY-MM-DD')}`}</p>
                </div>
                <div className="fr account-stale-coupon-main-item-right">
                    {cur.templateType === 2 ? "未使用" : "使用"}
                </div>
                <b className="account-stale-coupon-main-item-bgc"></b>
            </div>;
        });
        return (
            <div className="account-stale-coupon">
                <div className="account-stale-coupon-main">
                    { list.length == 0 || list == null ? <div className="account-coupon-pagination-none">
                            暂无赠劵
                        </div> :
                        <div className="account-stale-coupon-center clear">
                            {item}
                        </div>}
                    <p className="account-coupon-note">
                        <Popover placement="top" content={content} width={150} trigger="hover">
                            <span>
                                <Icon type="question-circle" />
                                <span>什么是满减券？</span>
                            </span>
                        </Popover>
                    </p>
                </div>
                <div className={!count ? "account-coupon-pagination hide" : "account-coupon-pagination show"}>
                    <Pagination size="small" total={parseInt(count)}
                                onChange={this.onChange.bind(this)}/>
                </div>
            </div>
        );
    }
}


