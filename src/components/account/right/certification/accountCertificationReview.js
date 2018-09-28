import React from "react";
import { AccountHighStatus } from './../../../../actions/account';

export default class AccountCertificationReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    cancleFunc () {
        const {dispatch} = this.props;
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
    }
    render() {
        return (
            <div className="account-certification-review">
                <div className="account-certification-review-center">
                    <p>您的认证已提交，IDT将会尽快审核</p>
                    <p>预计审核时间1~3天，请耐心等待</p>
                    <button onClick={this.cancleFunc.bind(this)}>返回</button>
                </div>
            </div>

        );
    }
}


