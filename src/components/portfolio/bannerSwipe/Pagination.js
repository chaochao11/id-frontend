import React from 'react';
import PropTypes from 'prop-types';
import PaginationDot from './PaginationDot';

class Pagination extends React.Component {
    handleClick = (event, index) => {
        this.props.onChangeIndex(index);
    };
    render() {
        const { index, dots, bottom} = this.props;
        const styles = {
            root: {
                position: 'absolute',
                bottom: bottom,
                display: 'flex',
                flexDirection: 'row',
                width:"100%"
            },
        };

        const children = [];

        for (let i = 0; i < dots; i += 1) {
            children.push(
                <PaginationDot key={i} index={i} active={i === index} onClick={this.handleClick} />,
            );
        }

        return <div style={styles.root}>
                    <div style={{margin:"auto"}}>
                        {children}
                    </div>
                </div>;
    }
}

Pagination.propTypes = {
    dots: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    onChangeIndex: PropTypes.func.isRequired,
};

export default Pagination;