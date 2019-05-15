import * as React from 'react';
import * as PropTypes from 'prop-types';
import UserLogin from './login/login';
import UserRegister from './register/register';

export default class UserContainer extends React.Component<any, any> {
    static propTypes = {
        param: PropTypes.string.isRequired,
        history: PropTypes.any.isRequired
    }

    constructor(public props: any) {
        super(props);
    }

    public render() {
        const loginProps = {
            history: this.props.history
        };

        return <div className='user-container-box'>
                    {
                        this.props.param === 'login' ?
                        <UserLogin {...loginProps}/> :
                        <UserRegister />
                    } 
                </div>
    }
} 