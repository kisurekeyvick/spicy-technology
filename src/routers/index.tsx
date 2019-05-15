import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginRegisterLayout from '../containers/layout/login-register-layout/login-register-layout';

export default class RouteIndex extends React.Component<any, any> {
    constructor(public props: any){
        super(props);
    }

    public render() {
        return <Router>
                    <Switch>
                        <Route exact={true} path='/user/:status' component={LoginRegisterLayout}/>
                    </Switch>
                </Router>
    }
}
