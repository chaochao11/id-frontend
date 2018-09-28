import React from "react";
import { Pagination, Icon, Popover, Spin } from 'antd';
import moment from "moment";
import NA from 'number-accuracy';
import { AccountListCoupon } from "./../../../../actions/account";

let flag = true;
//一天毫秒数
let dayTime = 86400000;
const content = (
    <div style={{width: '150px'}}>
        <p>满减劵是平台为了给用户增加所投项目年化收益所推出的虚拟卡种。用户可根据所使用的满减劵，获得金额的抵扣。</p>
    </div>
);
export default class AccountStaleCoupon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    onChange(key) {
        const { dispatch } = this.props;
        let init = {
            status: 3,
            pageNum: key,
            pageSize: 10
        };
        dispatch({
            type: 'GET_ACCOUNT_LIST_COUPON_LOADING',
            accountCouponListLoading: true
        });
        dispatch(AccountListCoupon(init));
    }
    render() {
        const { list, count } = this.props.accountCouponList.data;
        const { accountCouponListLoading } = this.props;
        let item = list && list.map((cur, index, arr) => {
            return <div className="clear account-stale-coupon-main-item" style={{background:'linear-gradient(90deg, #ECECEB 0%, #C7C6C3 100%)'}} key={index.toString()}>
                <div className="fl account-stale-coupon-main-item-left">
                    <p style={{backgroundColor:'#C5C5C5'}}>{cur.name}</p>
                    <p style={{color:'#828282'}}>{cur.templateType === 2 ? `满${JSON.parse(cur.rule).fullAmount} ${cur.currencyStr}减${JSON.parse(cur.rule).subAmount}` : `返${JSON.parse(cur.rule).backAmount} ${cur.currencyStr}`}</p>
                    <p style={{color:'#828282'}}>{`有效期至 ${moment(NA.plus(cur.receivedTime, NA.times(cur.expiredDate, dayTime))).format('YYYY-MM-DD')}`}</p>
                </div>
                <div className="fr account-stale-coupon-main-item-right" style={{color:'#666666'}}>
                    已过期
                </div>
                <b className="account-stale-coupon-main-item-bgc"></b>
            </div>;
        });
        if (accountCouponListLoading) {
            return <div className="text-center h3 col-sm-12 g-pt-30 g-pb-30">
                <Spin tip="玩命加载中..."/>
            </div>;
        }
        return (
            <div className="account-stale-coupon">
                <div className="account-stale-coupon-main clear">
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


