import * as React from 'react';
import {Icon} from 'antd';
import './developing.scss';

export default class DevelopingComponent extends React.Component<any, any> {
    constructor(public props: any) {
        super(props);
    }

    public render() {
        return (
            <div className='kisure-developing'>
                <Icon className='smile' type="exception" />
                <p>开发中，敬请期待...</p>
            </div>
        )
    }
}
