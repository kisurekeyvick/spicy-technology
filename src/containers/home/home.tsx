import * as React from 'react';
import { connect } from 'react-redux';

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
            <div>hello kisure</div>
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
