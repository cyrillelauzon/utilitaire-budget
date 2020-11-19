import React, { Component } from 'react';

class TransactionRow extends Component {
    state = {
        description: this.props.description
    }
    render() {
        return (
            <tr>
                <td>bla</td>
                <td>{this.state.description}</td>
                <td>cat</td>
                <td>10</td>
            </tr>)
    }
}

export default TransactionRow;