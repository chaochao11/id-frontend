import React from "react";
import RepayModal from './repayModal';
import AddModal from './addModal';
import {Pagination, Spin} from "antd";
import moment from "moment";
import { AccountApplyOrWait, AccountRepay, AccountAdd } from "./../../../../actions/account";

export default class AccountBorrowWait extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            repayModal: false,
            addModal: false,
            id: '',
            pageNumber: 1,
            addOrRepay: 1//1还款2追加
        };
    }
    cancelHandler () {
        this.setState({
            repayModal: false
        });
    }
    cancelHandler1 () {
        this.setState({
            addModal: false
        });
    }
    onChange(page) {
        const { dispatch } = this.props;
        this.props.onChangePageFunc(page);
        let init = {
            pageNum: page,
            pageSize: 10,
            status: 2,
        };
        this.setState({
            pageNumber: page
        }, () => {
            dispatch({
                type: 'ACCOUNT_BORROW_FLAG',
                accountBorrowFlag: true
            });
            dispatch(AccountApplyOrWait(init));
        });
    }
    repayFunc (id) {
        const { dispatch } = this.props;
        let init = {
            id: id,
        };
        this.setState({
            repayModal: true,
            id: id,
            addOrRepay:1
        }, () => {
            dispatch(AccountRepay(init));
        });
    }
    addFunc (id) {
        const { dispatch } = this.props;
        let init = {
            id: id,
        };
        this.setState({
            addModal: true,
            id: id,
            addOrRepay:2
        }, () => {
            dispatch(AccountAdd(init));
        });
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
            return <div className="account-borrow-wait-center clear" style={ cur.riskIndex >= 80 && cur.riskIndex < 90 ? { backgroundColor: "#fff2f2" } : cur.riskIndex >= 90 && cur.riskIndex <= 100 ? { backgroundColor: "#ffc6c6" } : {} } key={index.toString()}>
                <div>{`${cur.loanAmount} USDT`}</div>
                <div>{cur.depositAmount}</div>
                <div>{cur.currencyStr}</div>
                <div>{`${cur.interestRate}%`}</div>
                <div>{`${cur.loanPeriod}天`}</div>
                <div>{moment(cur.recordDate).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>{moment(cur.expiredDate).format('YYYY-MM-DD')}</div>
                <div>{`${cur.riskIndex}%`}</div>
                <div>{cur.statusStr}</div>
                {cur.riskIndex >= 80 ? <div className="account-borrow-wait-center-repay" style={{justifyContent: 'space-around'}}>
                    <span className="color-blue1" onClick={this.repayFunc.bind(this, cur.recordId)}>还款</span>
                    <span className="color-blue1" onClick={this.addFunc.bind(this, cur.recordId)}>追加</span>
                </div> : <div className="account-borrow-wait-center-repay" style={{justifyContent: 'center'}}>
                    <span className="color-blue1" onClick={this.repayFunc.bind(this, cur.recordId)}>还款</span>
                    </div>}
            </div>;
        });
        return (
            <div>
                <div className="account-borrow-wait">
                    <div className="account-borrow-wait-top clear">
                        <div>借款数量</div>
                        <div>质押数量</div>
                        <div>质押币种</div>
                        <div>借款利率</div>
                        <div>借款期限</div>
                        <div>放款时间</div>
                        <div>到期日</div>
                        <div>风险指数</div>
                        <div>借款状态</div>
                        <div></div>
                    </div>
                    {item}
                    <RepayModal addOrRepay={this.state.addOrRepay} pageNumber={this.state.pageNumber} repayModal={this.state.repayModal} id={this.state.id} cancelFunc={this.cancelHandler.bind(this)} {...this.props}/>
                    <AddModal addOrRepay={this.state.addOrRepay} pageNumber={this.state.pageNumber} addModal={this.state.addModal} id={this.state.id} returnFunc={this.cancelHandler1.bind(this)} {...this.props}/>
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