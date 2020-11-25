/*-------------------------------------------------------------------------
Component   TransactionsTable
Description: 
Display of a table of bank transactions objects
-------------------------------------------------------------------------*/
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import './transactionsrow.scss';

class TransactionRow extends Component {

    render() {

        let transaction = this.props.transaction;
        let bgClass = "bg-table-row";
        if(transaction.isapproved === true) bgClass+="-selected";
        
        return (
            <tr className={bgClass}>
                <td>{transaction.date}</td>
                <td>{transaction.amount +"$"}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td><Form.Check
                custom
                inline
                onChange={this.props.onApprove}
                id={transaction.id}
                checked={transaction.isapproved}
              /></td>
            </tr>)
    }
}

export default TransactionRow;