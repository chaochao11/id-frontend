import React from "react";
import {connect} from 'react-redux';
import { getQueryString } from "./../../common/language";

class AccountInvite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    register () {
        let code = getQueryString('code');
        this.props.history.push(`/user/signup/?inviteCode=${code}`);
    }
    render() {
        let phone = getQueryString('phone');
        document.title="IDT - 来自好友的邀请注册";
        return (
            <div className="account-invited-wrap">
                <div className="account-invited">
                    <div className="account-invited-center">
                        <p>{`您的好友 ${phone}`}</p>
                        <p>邀请您注册 IDT</p>
                        <button onClick={this.register.bind(this)}>立即注册</button>
                    </div>
                </div>
            </div>

        );
    }
}

export default connect(state => {
    return {
        ...state
    };
})(AccountInvite);


