import * as React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import { CookieService } from '../../common/utils/cookie';
import SlideLayout from '../layout/slider-layout/slider-layout';
import { sliderRouter, ILoadableRoute } from '../../routers/router';
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
            routes: _.cloneDeep(sliderRouter)
        };

        this._cookie = new CookieService();
    }

    public componentDidMount() {
        /**
         * Todo: （1）这里需要验证token
         *       （2）判断是否有权限显示菜单按钮
         */
        const token: string | null = this._cookie.getCookie('_token');

        if(token) {
            this.setState({
                loading: false,
                authority: true
            })
        } else {
            this.setState({
                loading: false
            });
        }
    }

    public buildRoutes = () => {
        return this.config.routes.map((route: ILoadableRoute, index: number) => {
            const rest: any = { }; 
            if (route.exact)
                rest.exact = route.exact;

            return <Route key={`route-` + route.key} {...rest} path={route.path} component={route.component}/>;
        });
    };

    public render() {
        const { location } = this.props;
        const routes = this.buildRoutes();
        
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
            <SlideLayout loaction={location}>
                <div>
                    <Switch>
                        { routes }
                    </Switch>
                </div>
            </SlideLayout> :
            <Redirect from='/' to='/user/login'/> 
        );
    }
}