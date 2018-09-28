import React from "react";
import {Pagination, Popover, Spin} from 'antd';
import {AccountInvestmentList} from "../../../actions/account";
import {siblings} from "../../../tools/utils";

export default class AccountInvestment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 1,
            type: 1
        };
    }

    onChange(page) {
        const {dispatch} = this.props;
        let init = {
            pageNum: page,
            pageSize: 10,
            status: this.state.status
        };
        this.props.onChangeDetail(page);
        dispatch({
            type: 'GET_ACCOUNT_INVESTMENT_LIST_LOADING',
            investmentListLoading: true
        });
        dispatch(AccountInvestmentList(init));

    }

    lookFunc(portfolioCode, productType) {
        if (parseInt(productType) === 0) {
            this.props.history.push(`/portfolio/${portfolioCode}`);
            return false;
        }
        this.props.history.push(`/financial/details/${portfolioCode}`);

    }

    checkType() {
        siblings(this).forEach((item, index, arr) => {
            arr[0].style.background = '#f5f5f5';
            arr[0].style.color = '#a7a7a7';
        });
        this.style.background = 'linear-gradient(-90deg, rgba(98, 210, 254, 1) 0%, rgba(98, 210, 254, 1) 0%, rgba(22, 122, 255, 1) 100%, rgba(22, 122, 255, 1) 100%)';
        this.style.color = '#fff';
    }

    addEvent() {
        let arr_1 = this.refs.type.children[0];
        let arr_2 = this.refs.type.children[1];
        let ways = [];
        ways.push(arr_1);
        ways.push(arr_2);
        Array.prototype.forEach.call(ways, (item) => {
            item.addEventListener('click', this.checkType);
        });
    }

    statusFunc(status) {
        const {dispatch} = this.props;
        let init = {
            pageNum: 1,
            pageSize: 10,
            status: status
        };
        this.setState({
            type: status
        });
        dispatch({
            type: 'GET_ACCOUNT_INVESTMENT_LIST_LOADING',
            investmentListLoading: true
        });
        this.props.onChangeDetail(1);
        dispatch(AccountInvestmentList(init));
    }

    componentDidMount() {
        const {dispatch} = this.props;
        let init = {
            pageNum: 1,
            pageSize: 10,
            status: 1
        };
        this.addEvent();
        dispatch(AccountInvestmentList(init));
    }

    render() {
        const { currentReturn, currentReturnPer, totalAsset, myInvestEveryList, countInvest } = this.props.investmentList.data;
        const { investmentPage, investmentListLoading } = this.props;
        let item = myInvestEveryList && myInvestEveryList.map((cur, index, arr) => {
            return <div className="account-investment-list-center clear" key={index.toString()}>
                <div>{cur.name}</div>
                <div>{cur.currencyType}</div>
                <div>{cur.buyNumber}</div>
                <div>{cur.buyTime}</div>
                <div>{cur.totalPosition}</div>
                <div>{cur.buyValuation == null || cur.buyValuation == "" ? "--" : cur.buyValuation}</div>
                <div className={ Number(cur.returnPer) > 0 ? "account-green" : "account-red"}>{Number(cur.returnPer) > 0 ? `+${cur.returnPer}` : cur.returnPer}</div>
                <div>{cur.returnValue}</div>
                <div>{cur.status}</div>
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <span style={{cursor: 'pointer', color: '#167aff'}} className="show"
                          onClick={this.lookFunc.bind(this, cur.portfolioCode, cur.productType)}>查看</span>
                    {/*<span style={{cursor: 'not-allowed'}} className="show account-common-color">赎回</span>*/}
                </div>
            </div>;
        });
        let list = myInvestEveryList && myInvestEveryList.map((cur, index, arr) => {
            return <div className="account-investment-other-list-center clear" key={index.toString()}>
                <div>{cur.name}</div>
                <div>{cur.currencyType}</div>
                <div>{cur.endTime}</div>
                <div>{cur.totalPosition}</div>
                <div>{cur.buyValuation == null || cur.buyValuation == "" ? "--" : cur.buyValuation}</div>
                <div>{cur.returnPer}</div>
                <div className={ Number(cur.returnValue) > 0 ? "account-green" : "account-red"}>{Number(cur.returnPer) > 0 ? `+${cur.returnValue}` : cur.returnValue}</div>
                <div>{cur.status}</div>
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <span style={{cursor: 'pointer', color: '#167aff'}} className="show"
                          onClick={this.lookFunc.bind(this, cur.portfolioCode, cur.productType)}>查看</span>
                </div>
            </div>;
        });
        return (
            <div className="account-investment">
                <div className="account-investment-select clear" ref='type'>
                    <div onClick={this.statusFunc.bind(this, 1)}>
                        持有中
                    </div>
                    <div onClick={this.statusFunc.bind(this, 2)}>
                        已完成
                    </div>
                </div>
                <div className="account-investment-top clear">
                    <div className="fl">
                        <span>总资产估值：</span>
                        <span>{`${totalAsset} USDT`}</span>
                    </div>
                    <div className="fl">
                        <span>收益盈亏：</span>
                        <span
                            className={Number(currentReturn) > 0 ? "account-green" : "account-red"}>{Number(currentReturn) > 0 ? `+${currentReturn}` : `${currentReturn} `}</span>
                        <span>USDT</span>
                    </div>
                    {/*<div className="fl">*/}
                    {/*<span>收益率：</span>*/}
                    {/*<span className={ Number(currentReturn) > 0 ? "account-green" : "account-red" }>{Number(currentReturnPer) > 0 ? `+${currentReturnPer} %` : `${currentReturnPer} %`}</span>*/}
                    {/*</div>*/}
                </div>
                {this.state.type === 1 ? <div className="account-investment-list-main">
                    <div className="account-investment-list-top clear">
                        <div>产品名称</div>
                        <div>币种</div>
                        <div>购买金额</div>
                        <div>购买时间</div>
                        <div>持仓总量</div>
                        <div>买入估值</div>
                        <div>盈亏比</div>
                        <div>收益估值</div>
                        <div>状态</div>
                        <div>操作</div>
                    </div>
                    { investmentListLoading ? <div className="text-center h3 col-sm-12 g-pt-100 g-pb-100">
                        <Spin tip="玩命加载中..."/>
                    </div> : item }
                </div> : <div className="account-investment-other-list-main">
                        <div className="account-investment-other-list-top clear">
                            <div>产品名称</div>
                            <div>币种</div>
                            <div>赎回时间</div>
                            <div>赎回量</div>
                            <div>买入估值</div>
                            <div>盈亏比</div>
                            <div>收益值</div>
                            <div>状态</div>
                            <div>操作</div>
                        </div>
                    { investmentListLoading ? <div className="text-center h3 col-sm-12 g-pt-100 g-pb-100">
                        <Spin tip="玩命加载中..."/>
                    </div> : list }
                </div>}
                {!parseInt(countInvest) ? <div className="account-investment-list-pagination-none">
                    暂无记录
                </div> : <div className="account-investment-list-pagination">
                    <Pagination current={parseInt(investmentPage)} size="small" total={parseInt(countInvest)}
                                onChange={this.onChange.bind(this)}/>
                </div>
                }
            </div>
        );
    }
}


