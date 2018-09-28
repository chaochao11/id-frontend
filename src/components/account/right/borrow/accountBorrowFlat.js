import React from "react";
import {Pagination, Spin} from "antd";
import moment from "moment";
import { AccountFlatOrFinish } from "./../../../../actions/account";

export default class AccountBorrowFlat extends React.Component {
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
            status: 5,
        };
        dispatch({
            type: 'ACCOUNT_BORROW_FLAG',
            accountBorrowFlag: true
        });
        dispatch(AccountFlatOrFinish(init));
    }
    render() {
        const { page, accountBorrowFlag } = this.props;
        const { count, list } = this.props.accountFlatOrFinish.data;
        if (accountBorrowFlag) {
            return <div className="text-center h3 col-sm-12 g-pt-30 g-pb-60">
                <Spin tip="玩命加载中..."/>
            </div>;
        }
        let item = list && list.map((cur, index, arr) => {
            return <div className="account-borrow-finish-center clear" key={index.toString()}>
                <div>{`${cur.loanAmount} USDT`}</div>
                <div>{cur.depositAmount}</div>
                <div>{cur.currencyStr}</div>
                <div>{`${cur.interestRate}%`}</div>
                <div>{`${cur.actualLoanPeriod}天`}</div>
                <div>{moment(cur.recordDate).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>{`${cur.interest} USDT`}</div>
                <div>{`${cur.interestPenalty} USDT`}</div>
                <div>{`${cur.serviceFee} USDT`}</div>
                <div>{`${cur.totalPayback} USDT`}</div>
            </div>;
        });
        return (
            <div>
                <div className="account-borrow-finish">
                    <div className="account-borrow-finish-top clear">
                        <div>申请数量</div>
                        <div>质押数量</div>
                        <div>质押币种</div>
                        <div>借款利率</div>
                        <div>实际借款期限</div>
                        <div>平仓日</div>
                        <div>利息</div>
                        <div>罚息</div>
                        <div>服务费</div>
                        <div>还款总数量</div>
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