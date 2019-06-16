import * as React from 'react';
import { connect } from 'react-redux';
import DevelopingComponent from '../../component/developing/developing';
import './home.scss';

class HomeContainer extends React.PureComponent<any, any> {
    constructor(public props: any) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    public render() {
        return (
            <div className='home-layout'>
                <DevelopingComponent/>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        // menu: state.saasCommon.menu
    }
}

function mapDispatchToProps() {
    return { }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps()
)(HomeContainer);
