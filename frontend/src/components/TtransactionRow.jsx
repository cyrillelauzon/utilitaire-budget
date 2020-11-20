import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import './transactionsrow.scss';

class TransactionRow extends Component {

    render() {

        let bgClass = "bg-table-row";
        if(this.props.isApproved) bgClass+="-selected";

        return (
            <tr className={bgClass}>
                <td>bla</td>
                <td>{this.props.description}</td>
                <td>cat</td>
                <td>10</td>
                <td><Form.Check
                custom
                inline
                id={"selected"}
              /></td>
            </tr>)
    }
}

export default TransactionRow;