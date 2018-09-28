import React from "react";
import Header from "../common/header";
import Footer from "./../common/footer";
import FinancialCenter from './financialCenter';
import {connect} from 'react-redux';

class Financial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // componentWillMount () {
    //     if (!this.props.authenticated) {
    //         this.props.history.push("/user/signin");
    //         return false;
    //     }
    // }
    render() {
        return (
            <div className="financial">
                <Header/>
                <div className="financial-center">
                    <div className="financial-title container">
                        理财市场
                    </div>
                    <FinancialCenter {...this.props}/>
                </div>
                <Footer/>
            </div>

        );
    }
}

export default connect(state => {
    return {
        authenticated: state.auth.authenticated,
        financialDetailsList:state.financial.financialDetailsList
    };
})(Financial);


