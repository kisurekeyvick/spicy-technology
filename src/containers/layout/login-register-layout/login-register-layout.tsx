import * as React from 'react';
import UserContainer from '../../user/user';
import { ENVConfig } from '../../../environment/environment';
import { Row, Col} from 'antd';
import BGParticle from '../../../common/utils/bgParticle';
import './login-register-layout.scss';

export default class LoginRegisterLayout extends React.PureComponent<any, any> {
    public config: any;

    constructor(public props: any) {
        super(props);

        this.config = {
            particle: null
        };
    }

    componentDidMount() {
        this.config.particle = new BGParticle('#gsapBox');
        this.config.particle.init();
    }

    componentWillUnmount() {
        this.config.particle.destory();
    }

    public render() {
        const userProps = {
            param: this.props.match.params['status'],
            history: this.props.history
        };

        return (
            <div className='layout-login-box' >
                <Row>
                    <Col span={24}>
                        <div className='layout-login-box-head'>
                            <img alt='logo' src={ENVConfig.loginLogo} />
                        </div>
                    </Col>
                    <Col span={24}>
                        <UserContainer {...userProps}/>
                    </Col>
                </Row>
                <div id='gsapBox' />
            </div>
        );
    }
}
