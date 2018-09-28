/**
 * Created by fengxiaoli on 2017/12/12.
 */
import {combineReducers} from 'redux';
import authReducer from './auth_reducer';
import portfolioReducer from './portfolio_reducer';
// import activityReducer from './activity_reducer';
import accountReducer from './account_reducer';
// import predictionReducer from './prediction_reducer';
import financialReducer from './financial_reducer';
import companyReducer from './company_reducer';
import LoanReducer from "./loan_reducer";
import AnnouncementReducer from "./announcement_reducer";

const rootReducer = combineReducers({
    auth: authReducer,
    account: accountReducer,
    portfolio: portfolioReducer,
    // activity: activityReducer,
    // prediction: predictionReducer,
    financial: financialReducer,
    company: companyReducer,
    loan: LoanReducer,
    announcement: AnnouncementReducer,
});

export default rootReducer;