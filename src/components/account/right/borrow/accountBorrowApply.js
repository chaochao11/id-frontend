import React from "react";
import { Pagination, Spin } from 'antd';
import moment from 'moment';
import { AccountApplyOrWait } from "./../../../../actions/account";

export default class AccountBorrowApply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    onChange(page) {
        const { dispatch } = this.props;
        this.props.onChangePageFunc(page);
        let init = {
            pageNum: page,
            pageSize: 10,
            status: 1,
        };
        dispatch({
            type: 'ACCOUNT_BORROW_FLAG',
            accountBorrowFlag: true
        });
        dispatch(AccountApplyOrWait(init));
    }
    render() {
        const { page, accountBorrowFlag } = this.props;
        const { count, list } = this.props.accountApplyOrWait.data;
        if (accountBorrowFlag) {
            return <div className="text-center h3 col-sm-12 g-pt-30 g-pb-60">
                <Spin tip="玩命加载中..."/>
            </div>;
        }
        let item = list && list.map((cur, index, arr) => {
            return <div className="account-borrow-apply-center clear" key={index.toString()}>
                <div>{`${cur.loanAmount} USDT`}</div>
                <div>{cur.depositAmount}</div>
                <div>{cur.currencyStr}</div>
                <div>{`${cur.interestRate}%`}</div>
                <div>{`${cur.loanPeriod}天`}</div>
                <div>{moment(cur.recordDate).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>{cur.statusStr}</div>
            </div>;
        });
        return (
            <div>
                <div className="account-borrow-apply">
                    <div className="account-borrow-apply-top clear">
                        <div>借款数量</div>
                        <div>质押数量</div>
                        <div>质押币种</div>
                        <div>借款利率</div>
                        <div>借款期限</div>
                        <div>借款申请时间</div>
                        <div>借款状态</div>
                    </div>
                    {item}
                </div>
                {!parseInt(count) ? <div className="account-borrow-pagination-none">
                    暂无记录
                </div> : <div className="account-borrow-pagination">
                    <Pagination current={parseInt(page)} size="small" total={parseInt(count)}
                                onChange={this.onChange.bind(this)}/>
                </div>}
            </div>
        );
    }
}