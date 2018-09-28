import React from "react";
import { Pagination, Modal, Spin } from 'antd';
import { AccountDetailList, AccountListDetail } from './.././../../actions/account';

export default class AccountList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onChange(page) {
        const {dispatch} = this.props;
        let init = {
            pageNum: page,
            pageSize: 10
        };
        this.props.onChangePage(page);
        dispatch({
            type: 'ACCOUNT_LIST_LOADING',
            accountListLoading: true
        });
        dispatch(AccountDetailList(init));
    }

    clickDetail(id) {
        const {dispatch} = this.props;
        dispatch(AccountListDetail(id));
    }

    cancelFunc() {
        const {dispatch} = this.props;
        dispatch({
            type: 'GET_ACCOUNT_LIST_DETAIL',
            accountListDetailFlag: false,
            accountListDetail:{data:{}}
        });
    }

    componentDidMount() {
        const {dispatch} = this.props;
        let init = {
            pageNum: 1,
            pageSize: 10
        };
        dispatch(AccountDetailList(init));
    }

    render() {
        const {data, rowCount} = this.props.detailList;
        const {
            status,
            address,
            txHash,
            amount,
            fee,
            notarizeAmount,
            portfolioName,
            commission,
            championCountryName,
            runnerUpCountryName,
            thirdPlaceCountryName,
            cost,
            sessionInfo,
            country,
            winCountry,
            investAmount,
            winAmount,
            statusStr,
            exchangePair,
            currentRate,
            totalAmount,
            changeType
        } = this.props.accountListDetail.data;
        const { detailPage, accountListLoading } = this.props;
        if (accountListLoading) {
            return <div className="text-center h3 col-sm-12 g-pt-30 g-pb-60">
                <Spin tip="玩命加载中..."/>
            </div>;
        }
        let item = data && data.map((cur, index, arr) => {
            return <div className="account-list-center clear" key={index.toString()}>
                <div>{cur.operation}</div>
                <div>{cur.type}</div>
                <div>{cur.accountType}</div>
                <div>{cur.currencyName}</div>
                <div>{cur.createTimeStr}</div>
                <div>{cur.amount}</div>
                <div><span style={parseInt(cur.changeType) === 7 || parseInt(cur.changeType) === 14 || parseInt(cur.changeType) === 15 || parseInt(cur.changeType) === 16 || parseInt(cur.changeType) === 17 || parseInt(cur.changeType) === 9 || parseInt(cur.changeType) === 32 || parseInt(cur.changeType) === 19 || parseInt(cur.changeType) === 18 ? {color:'#e5e5e5'} : {}} onClick={ parseInt(cur.changeType) === 7 || parseInt(cur.changeType) === 14 || parseInt(cur.changeType) === 15 || parseInt(cur.changeType) === 16 || parseInt(cur.changeType) === 17 || parseInt(cur.changeType) === 9 || parseInt(cur.changeType) === 32 ? () => {} : this.clickDetail.bind(this, cur.id) }>详情</span></div>
            </div>;
        });
        return (
            <div className="account-list">
                <div className="account-list-main">
                    <div className="account-list-top clear">
                        <div>操作</div>
                        <div>类型</div>
                        <div>账户类型</div>
                        <div>币种</div>
                        <div>时间</div>
                        <div>数量</div>
                        <div>查看</div>
                    </div>
                    {item}
                </div>
                {!parseInt(rowCount) ? <div className="account-detail-list-pagination-none">
                    暂无记录
                </div> : <div className="account-list-pagination">
                    <Pagination current={parseInt(detailPage)} size="small" total={parseInt(rowCount)}
                                onChange={this.onChange.bind(this)}/>
                </div>
                }
                <Modal
                    visible={this.props.accountListDetailFlag}
                    footer={false}
                    width={600}
                    onCancel={this.cancelFunc.bind(this)}
                >
                    <div className="account-list-detail">
                        {parseInt(changeType) === 1 || parseInt(changeType) === 2 ? <div className="account-detail-list-last clear">
                            <div className="account-list-detail-other-top">
                                <div>状态</div>
                                <div>地址</div>
                                <div>txHash</div>
                                <div>数量</div>
                                <div>手续费</div>
                                <div>确认数量</div>
                            </div>
                            <div className="account-list-detail-other-bottom">
                                <div>{status}</div>
                                <div>{address}</div>
                                <div>{txHash}</div>
                                <div>{amount}</div>
                                <div>{fee}</div>
                                <div>{notarizeAmount}</div>
                            </div>
                        </div> : parseInt(changeType) === 26 || parseInt(changeType) === 27 || parseInt(changeType) === 28 ?
                            <div className="account-detail-list-last">
                                <div className="account-detail-list-last-title clear">
                                    <div>投资组合名称</div>
                                    <div>金额</div>
                                    <div>手续费</div>
                                    <div>确认数量</div>
                                </div>
                                <div className="account-detail-list-last-main clear">
                                    <div style={{lineHeight:'normal', paddingTop:'22px'}}>{portfolioName}</div>
                                    <div>{amount}</div>
                                    <div>{commission}</div>
                                    <div>{notarizeAmount}</div>
                                </div>
                            </div> : parseInt(changeType) === 10 ? <div className="account-detail-list-last">
                                <div className="account-detail-list-last-top clear">
                                    <div>冠军</div>
                                    <div>亚军</div>
                                    <div>季军</div>
                                    <div>数量</div>
                                    <div>手续费</div>
                                </div>
                                <div className="account-detail-list-last-bottom clear">
                                    <div>{championCountryName}</div>
                                    <div>{runnerUpCountryName}</div>
                                    <div>{thirdPlaceCountryName}</div>
                                    <div>{amount}</div>
                                    <div>{cost}</div>
                                </div>
                            </div> : parseInt(changeType) === 30 ? <div className="account-detail-list-last">
                                <div className="account-detail-list-last-top clear">
                                    <div>场次</div>
                                    <div>支持国家</div>
                                    <div>数量</div>
                                    <div>手续费</div>
                                    <div>状态</div>
                                </div>
                                <div className="account-detail-list-last-bottom clear">
                                    <div style={{lineHeight:'normal', paddingTop:'22px'}}>{sessionInfo}</div>
                                    <div>{country}</div>
                                    <div>{amount}</div>
                                    <div>{cost}</div>
                                    <div>{status}</div>
                                </div>
                            </div> : parseInt(changeType) === 29 ? <div className="account-detail-list-last">
                                <div className="account-detail-list-last-title clear">
                                    <div>场次</div>
                                    <div>获胜</div>
                                    <div>投入</div>
                                    <div>盈利</div>
                                </div>
                                <div className="account-detail-list-last-main clear">
                                    <div style={{lineHeight:'normal', paddingTop:'22px'}}>{sessionInfo}</div>
                                    <div>{winCountry}</div>
                                    <div>{investAmount}</div>
                                    <div>{winAmount}</div>
                                </div>
                            </div> : <div className="account-detail-list-last">
                                <div className="account-detail-list-last-top clear">
                                    <div>状态</div>
                                    <div>交易对</div>
                                    <div>价格</div>
                                    <div>交易量</div>
                                    <div>成交额</div>
                                </div>
                                <div className="account-detail-list-last-bottom clear">
                                    <div>{statusStr}</div>
                                    <div>{exchangePair}</div>
                                    <div>{currentRate}</div>
                                    <div>{amount}</div>
                                    <div>{totalAmount}</div>
                                </div>
                            </div>}
                    </div>
                </Modal>
            </div>
        );
    }
}




