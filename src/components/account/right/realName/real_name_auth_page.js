import React, {Component} from "react";
import {connect} from 'react-redux';
import RealNameAuthComponent from './real_name_auth_component.js';
import './real_name_auth_page.css';


class RealNameAuthPage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (!this.props.authenticated) {
            this.props.history.push("/user/signin");
            return;
        }
        const authState = localStorage.getItem("authState");
        if (authState == 1) {
            this.props.history.push("/user/account");
            return false;
        }
    }

    render() {
        const { accountFlag, nameAuthNum } = this.props.accountHighStatus;
        return (
            <div style={{backgroundColor: "#f5f5f5"}}>
                <div className={`real-name-auth-wrapper ${!accountFlag && nameAuthNum === 4 ? "show" : "hide"}`}>
                    <RealNameAuthComponent {...this.props}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authenticated: state.auth.authenticated,
    };
};

export default connect(mapStateToProps, null)(RealNameAuthPage);
