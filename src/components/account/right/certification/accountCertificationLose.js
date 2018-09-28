import React from "react";
import { Icon } from 'antd';

export default class AccountCertificationLose extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    returnAuth () {
        const { dispatch } = this.props;
        dispatch({type: 'ACCOUNT_RES_SHOW_INFO'});
    }
    render() {
        const { qicFailDesc } = this.props.accountSecurityInfo.data;
        return (
            <div className="account-certification-lose">
                <div className="account-certification-lose-center">
                    <p><Icon type="close" /> 高级实名认证失败！</p>
                    <p><span>失败原因：</span><span>{qicFailDesc}</span></p>
                    <button onClick={this.returnAuth.bind(this)}>重新认证</button>
                </div>
            </div>

        );
    }
}


