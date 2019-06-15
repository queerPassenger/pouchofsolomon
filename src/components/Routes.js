import React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import HomePage from './HomePage';
import AccountPage from './AccountPage';


const Routes = (props) => {
    return (
        <Router history={props.history}>
            <Switch>
                <Route
                    exact path='/'
                    render={(_props) => <HomePage {..._props} {...props}/>}
                />
                <Route
                    exact path='/account'
                    render={(_props) => <AccountPage {..._props} {...props}/>}
                />
            </Switch>
        </Router>
    )
};
export default Routes;