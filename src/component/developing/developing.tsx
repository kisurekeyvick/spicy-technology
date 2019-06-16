import * as React from 'react';
import './developing.scss';

export default class DevelopingComponent extends React.Component<any, any> {
    constructor(public props: any) {
        super(props);
    }

    public render() {
        return (
            <div className='kisure-developing'>
                <img alt='开发中......' src='https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg' />
                <p>开发中，敬请期待......</p>
            </div>
        )
    }
}
