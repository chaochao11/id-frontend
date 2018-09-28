import React from "react";
import {Tabs} from 'antd';
import AccountMine from './accountMine';
import AccountList from './accountList';
import AccountBorrow from './accountBorrow';
import AccountInvestment from './accountInvestment';
import AccountInvite from './accountInvite';
import AccountReward from './accountReward';
import AccountCoupon from './accountCoupon';
import AccountSecurity from './accountSecurity';
import { AccountSecurityInfo, MineAccount, AccountHighStatus } from "../../../actions/account";

const TabPane = Tabs.TabPane;
export default class AccountRight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailPage: 1,
            investmentPage: 1,
            key: "1"
        };
    }
    callback (key) {
        localStorage.removeItem("defaultActiveKey");
        const {dispatch} = this.props;
        if (parseInt(key) === 1) {
            dispatch(MineAccount());
            dispatch(AccountSecurityInfo());
        }
        let init = {
            phoneNum:0,
            emailNum:0,
            authNum:0,
            nameAuthNum:0,
            openGa:0,
            closeGa:0,
            changeGa:0,
            accountFlag:true
        };
        dispatch(AccountHighStatus(init));
        this.setState({
            key: key
        });
    }
    investmentFunc (investmentPage) {
        this.setState({
            investmentPage:investmentPage
        });
    }
    detailFunc (detailPage) {
        this.setState({
            detailPage:detailPage
        });
    }
    render() {
        const defaultActiveKey = localStorage.getItem("defaultActiveKey");
        return (
            <div className="account-right col-lg-12">
                <Tabs activeKey={!defaultActiveKey ? this.state.key : defaultActiveKey} onChange={this.callback.bind(this)}>
                    <TabPane tab="我的账户" key="1">
                        <AccountMine {...this.props}/>
                    </TabPane>
                    <TabPane tab="我的投资" key="2">
                        <AccountInvestment onChangeDetail={this.investmentFunc.bind(this)} investmentPage={this.state.investmentPage} {...this.props}/>
                    </TabPane>
                    <TabPane tab="我的借款" key="3">
                        <AccountBorrow  {...this.props}/>
                    </TabPane>
                    <TabPane tab="财务明细" key="4">
                        <AccountList onChangePage={this.detailFunc.bind(this)} detailPage={this.state.detailPage} {...this.props}/>
                    </TabPane>
                    <TabPane tab="我的邀请码" key="5">
                        <AccountInvite {...this.props}/>
                    </TabPane>
                    <TabPane tab="我的奖励" key="6">
                        <AccountReward {...this.props}/>
                    </TabPane>
                    <TabPane tab="我的赠券" key="7">
                        <AccountCoupon {...this.props}/>
                    </TabPane>
                    <TabPane tab="账户安全" key="8">
                        <AccountSecurity {...this.props}/>
                    </TabPane>
                </Tabs>
            </div>

        );
    }
}


