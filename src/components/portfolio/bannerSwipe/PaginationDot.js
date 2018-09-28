import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    root: {
        height: 18,
        width: 25,
        cursor: 'pointer',
        border: 0,
        background: 'none',
        padding: 0,
        outline:'none',
    },
    dot: {
        backgroundColor: '#b5b5b5',
        height:6,
        width: 6,
        borderRadius: 6,
        margin:'auto',
    },
    active: {
        backgroundColor: '#fff',
        width: 22,
    },
};

class PaginationDot extends React.Component {
    handleClick = event => {
        this.props.onClick(event, this.props.index);
    };

    render() {
        const { active } = this.props;

        let styleDot;

        if (active) {
            styleDot = Object.assign({}, styles.dot, styles.active);
        } else {
            styleDot = styles.dot;
        }

        return (
            <button style={styles.root} onClick={this.handleClick}>
                <div style={styleDot} />
            </button>
        );
    }
}

PaginationDot.propTypes = {
    active: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default PaginationDot;