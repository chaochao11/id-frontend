import React from "react";
import {siblings} from "../../../tools/utils";
import AccountStaleCoupon from './coupons/accountStaleCoupon';
import AccountUnusedCoupon from './coupons/accountUnusedCoupon';
import AccountUsedCoupon from './coupons/accountUsedCoupon';
import { AccountListCoupon } from "./../../../actions/account";

export default class AccountCoupon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 1,
            current: 1
        };
    }

    checkType() {
        siblings(this).forEach((item, index, arr) => {
            arr[index].style.background = '#f5f5f5';
            arr[index].style.color = '#a7a7a7';
        });
        this.style.background = 'linear-gradient(-90deg, rgba(98, 210, 254, 1) 0%, rgba(98, 210, 254, 1) 0%, rgba(22, 122, 255, 1) 100%, rgba(22, 122, 255, 1) 100%)';
        this.style.color = '#fff';
    }

    addEvent() {
        let arr = this.refs.type.children;
        let ways = [];
        for (let i = 0; i < arr.length; i++) {
            ways.push(arr[i]);
        }
        Array.prototype.forEach.call(ways, (item) => {
            item.addEventListener('click', this.checkType);
        });
    }

    onChangeType(id) {
        const { dispatch } = this.props;
        let init = {
            status: id,
            pageNum: 1,
            pageSize: 10
        };
        this.setState({
            id: id,
            current: 1
        }, () => {
            dispatch({
                type: 'GET_ACCOUNT_LIST_COUPON_LOADING',
                accountCouponListLoading: true
            });
            dispatch(AccountListCoupon(init));
        });
    }

    componentDidMount() {
        const { dispatch } = this.props;
        let init = {
            status: 1,
            pageNum: 1,
            pageSize: 10
        };
        dispatch(AccountListCoupon(init));
        this.addEvent();
    }

    render() {
        return (
            <div className="account-coupon">
                <div className="account-coupon-select clear" ref="type">
                    <div className="fl" onClick={this.onChangeType.bind(this, 1)}>未使用</div>
                    <div className="fl" onClick={this.onChangeType.bind(this, 2)}>已使用</div>
                    <div className="fl" onClick={this.onChangeType.bind(this, 3)}>已过期</div>
                </div>
                {this.state.id === 1 ? <AccountUnusedCoupon defaultCurrent={this.state.current} {...this.props}/> : this.state.id === 2 ?
                    <AccountUsedCoupon defaultCurrent={this.state.current} {...this.props}/> : this.state.id === 3 ? <AccountStaleCoupon defaultCurrent={this.state.current} {...this.props}/> : ""}
            </div>
        );
    }
}


