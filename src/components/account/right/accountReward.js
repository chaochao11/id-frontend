import React from "react";
import { Pagination, Spin } from 'antd';
import { AccountRewardList, AccountReceiveRewardList } from './../../../actions/account';

export default class AccountReward extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
    }

    rewardFunc (id) {
        const { dispatch } = this.props;
        let init = {
            aid:id
        };
        let item = {
            pageSize: 10,
            pageNum: this.state.page
        };
        dispatch(AccountReceiveRewardList(init, item));
    }
    onChange (page) {
        const { dispatch } = this.props;
        let init = {
            pageSize: 10,
            pageNum: page,
        };
        this.setState({
            page:page
        }, () => {
            dispatch({
                type: 'ACCOUNT_REWARD_LOADING',
                accountRewardLoading: true
            });
            dispatch(AccountRewardList(init));
        });
    }
    componentDidMount () {
        const { dispatch } = this.props;
        let init = {
            pageSize: 10,
            pageNum: 1,
        };
        dispatch(AccountRewardList(init));
    }
    render() {
        const { count, qicActivityRecordVoList } = this.props.accountRewardList.data;
        const { accountRewardLoading } = this.props;
        if (accountRewardLoading) {
            return <div className="text-center h3 col-sm-12 g-pt-30 g-pb-60">
                <Spin tip="玩命加载中..."/>
            </div>;
        }
        let item = qicActivityRecordVoList && qicActivityRecordVoList.map((cur, index, arr) => {
            return <div className="account-reward-center-middle clear" key={index.toString()}>
                <div>{cur.operationStr}</div>
                <div>{cur.stmStr}</div>
                <div>{`${cur.number} ${cur.coinType}`}</div>
                <div>
                    <button style={parseInt(cur.status) === 1 ? {} : {background : '#ccc'} } onClick={ parseInt(cur.status) === 1 ? this.rewardFunc.bind(this, cur.aid) : () => {}}>
                        { parseInt(cur.status) === 1 ? "领取" : "已领取"}
                    </button>
                </div>
            </div>;
        });
        return (
            <div className="account-reward">
                <div className="account-reward-title">
                    奖励明细
                </div>
                <div className="account-reward-list">
                    <div className="account-reward-center">
                        <div className="account-reward-center-top clear">
                            <div>奖励操作</div>
                            <div>时间</div>
                            <div>奖励金额</div>
                            <div>状态</div>
                        </div>
                        {item}
                    </div>
                    { !parseInt(count) ? <div className="account-reward-list-pagination-none">
                        暂无记录
                    </div> : <div className="account-reward-list-pagination">
                        <Pagination current={parseInt(this.state.page)} size="small" total={parseInt(count)}
                                    onChange={this.onChange.bind(this)}/>
                    </div>
                    }
                </div>
            </div>
        );
    }
}


