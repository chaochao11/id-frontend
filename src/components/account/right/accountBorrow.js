import React from "react";
import {siblings} from "./../../../tools/utils";
import AccountBorrowApply from './borrow/accountBorrowApply';
import AccountBorrowWait from './borrow/accountBorrowWait';
import AccountBorrowFlat from './borrow/accountBorrowFlat';
import AccountBorrowFinish from './borrow/accountBorrowFinish';
import {AccountApplyOrWait, AccountFlatOrFinish} from './../../../actions/account';

export default class AccountBorrow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            page: 1
        };
    }

    checkType() {
        siblings(this).forEach((item, index, arr) => {
            arr[index].style.background = '#f5f5f5';
            arr[index].style.color = '#a7a7a7';
        });
        this.style.background = 'linear-gradient(-90deg, #62D2FE 0%, #62D2FE 0%, #167AFF 100%, #167AFF 100%)';
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

    statusFunc(type) {
        const {dispatch} = this.props;
        let init = {
            pageNum: 1,
            pageSize: 10,
            status: type === 1 ? 2 : type === 2 ? 5 : type === 3 ? 4 : 2
        };
        this.setState({
            type: type,
            page: 1
        });
        dispatch({
            type: 'ACCOUNT_BORROW_FLAG',
            accountBorrowFlag: true
        });
        if (type === 1) {
            dispatch(AccountApplyOrWait(init));
        } else {
            dispatch(AccountFlatOrFinish(init));
        }
    }

    changePage(page) {
        this.setState({
            page: page
        });
    }

    componentDidMount() {
        const {dispatch} = this.props;
        let init = {
            pageNum: 1,
            pageSize: 10,
            status: 2,
        };
        dispatch(AccountApplyOrWait(init));
        this.addEvent();
    }

    render() {
        return (
            <div className="account-borrow">
                <div className="clear account-borrow-select" ref='type'>
                        {/*<div onClick={this.statusFunc.bind(this, 1)}>申请中</div>*/}
                        <div onClick={this.statusFunc.bind(this, 1)}>待还款</div>
                        <div onClick={this.statusFunc.bind(this, 2)}>已平仓</div>
                        <div onClick={this.statusFunc.bind(this, 3)}>已完成</div>
                </div>
                {this.state.type === 1 ?
                    <AccountBorrowWait onChangePageFunc={this.changePage.bind(this)} {...this.props}
                                       page={this.state.page}/> : this.state.type === 2 ?
                        <AccountBorrowFlat onChangePageFunc={this.changePage.bind(this)} {...this.props}
                                           page={this.state.page}/> : this.state.type === 3 ?
                            <AccountBorrowFinish onChangePageFunc={this.changePage.bind(this)} {...this.props}
                                                 page={this.state.page}/> : ""}
            </div>
        );
    }
}


