
import React from 'react';
import { hot } from 'react-hot-loader';
import { createHashHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import HomePage from './HomePage';

const hist = createHashHistory();
const App = () => (
    <Router history={hist}>
        <Switch>
            <Route path="/" component={HomePage} />
        </Switch>
    </Router>
);

export default hot(module)(App);