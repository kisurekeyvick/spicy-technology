import * as React from 'react';
import { Redirect  } from "react-router-dom";
// Route, Switch
import { CookieService } from '../../common/utils/cookie';
import * as _ from 'lodash';
import './route-guard.scss';

export default class RouterGuard extends React.PureComponent<any, any> {
    public config: any;
    private _cookie: CookieService;

    constructor(public props: any) {
        super(props);

        this.state = {
            loading: true,
            authority: false
        };

        this.config = {
            routes: _.cloneDeep([])
        };

        this._cookie = new CookieService();
    }

    public componentDidMount() {
        const token: string | null = this._cookie.getCookie('_token');

        if(token) {
            
        } else {
            this.setState({
                loading: false
            });
        }
    }

    public render() {
        // const { location } = this.props;
        
        return (
            this.state.loading === true ? 
            <div id="loading">
                <div id="loading-center">
                    <div id="loading-center-absolute">
                        <div className="object" id="object_four"/>
                        <div className="object" id="object_three"/>
                        <div className="object" id="object_two"/>
                        <div className="object" id="object_one"/>
                    </div>
                </div> 
            </div> :
            this.state.authority === true ?
            <div>hello</div> :
            <Redirect from='/' to='/user/login'/> 
        );
    }
}