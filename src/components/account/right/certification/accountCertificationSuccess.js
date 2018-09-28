import React from "react";
import { Icon } from 'antd';
import { AccountHighStatus } from './../../../../actions/account';

export default class AccountCertificationSuccess extends React.Component {
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
            <div className="account-certification-success">
                <div className="account-certification-success-center">
                    <p><Icon type="check" /> 恭喜，高级实名认证成功！</p>
                    <button onClick={this.cancleFunc.bind(this)}>返回</button>
                </div>
            </div>

        );
    }
}


