/*-------------------------------------------------------------------------
Component   TransactionsTable
Description: 
Display of a table of bank transactions objects
-------------------------------------------------------------------------*/
import React, { Component } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import './transactionsrow.scss';

class TransactionRow extends Component {

    render() {

        let transaction = this.props.transaction;
        let bgClass = "bg-table-row";
        if (transaction.isapproved == true) bgClass += "-selected";
        
        /* //TODO Implement categories as custom bootstrap dropdown toggle
        //https://react-bootstrap.github.io/components/dropdowns/#custom-dropdown-components */
        return (
            <tr className={bgClass}>
                <td>{transaction.date}</td>
                <td>{transaction.amount + "$"}</td>
                <td>{transaction.description}</td>


                
                <td><Form.Control as="select">
                    {this.props.categories.map((category) => {
                        return <option key={category.id}>{category.name}</option>
                    })}
                </Form.Control></td>


                <td><Form.Check
                    custom
                    inline
                    onChange={this.props.onApprove}
                    id={transaction.id}
                    checked={transaction.isapproved}
                />
                </td>
            </tr>)
    }
}

export default TransactionRow;