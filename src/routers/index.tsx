import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginRegisterLayout from '../containers/layout/login-register-layout/login-register-layout';
import RouterGuard from '../containers/route-guard/route-guard';
import { ENVConfig } from '../environment/environment';

export default class RouteIndex extends React.Component<any, any> {
    constructor(public props: any){
        super(props);
    }

    public render() {
        const needLogin:boolean = ENVConfig.needLogin;

        return <React.Fragment>
            {
                !needLogin ?
                <Router><Switch><RouterGuard /></Switch></Router>:
                <Router>
                    <Switch>
                        <Route exact={true} path='/user/:status' component={LoginRegisterLayout}/>
                        <RouterGuard />
                    </Switch>
                </Router>
            }
        </React.Fragment>
    }
}
