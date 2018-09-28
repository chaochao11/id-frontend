import React from "react";
import AddModal from './addModal';

export default class AccountBorrowAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addModal: false
        };
    }

    cancelHandler() {
        this.setState({
            addModal: false
        });
    }

    addFunc() {
        this.setState({
            addModal: true
        });
    }

    render() {
        return (
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
                <div className="account-borrow-wait-center clear">
                    <div>15000.00 USDT</div>
                    <div>34.1232345</div>
                    <div>BTC</div>
                    <div>0.1%</div>
                    <div>30天</div>
                    <div>2018-8-7</div>
                    <div>2018-8-7</div>
                    <div>90%</div>
                    <div>待审核</div>
                    <div className="account-borrow-wait-center-repay">
                        <button className="button-active-blue" onClick={this.addFunc.bind(this)}>追加</button>
                    </div>
                </div>
                <AddModal addModal={this.state.addModal} cancelFunc={this.cancelHandler.bind(this)} {...this.props}/>
            </div>
        );
    }
}