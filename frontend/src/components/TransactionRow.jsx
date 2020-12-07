/*-------------------------------------------------------------------------
Component   TransactionsTable
Description: 
Display of a table of bank transactions objects
-------------------------------------------------------------------------*/
import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/esm/Button';
import './css/transactionsrow.scss';

class TransactionRow extends Component {
    constructor() {
        super();

        this.state = {
            dropDownValue: "Aucun"
        }
    }

    /**
     * @description Display checked or unchecked Icon for isApproved button for transaction
     * @param {*} isapproved
     * @memberof TransactionRow
     */
    GetIcon(isapproved) {
        if (isapproved) {
            return (<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>);
        }
        else {
            return (<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>);
        }
    }

    /**
     * @description Display a single category in category Dropdown
     * @param {*} transaction
     * @param {*} category
     * @memberof TransactionRow
     */
    GetSingleCategory(transaction, category) {
        
        if (category.child_categories != null) {
            
            return (
                <React.Fragment>
                    <Dropdown.Header key={transaction.id + category._id}>{category.name}</Dropdown.Header>
        
                    {category.child_categories.map((child_category) => {
                        return (
                            <React.Fragment>
                                <Dropdown.Item key={transaction.id + child_category._id + "33"}
                                onClick={() => this.props.onCategory(child_category)}>{child_category.name}</Dropdown.Item>
                            </React.Fragment>)
                        })}

                </React.Fragment>)
        }

    }

    render() {

        let transaction = this.props.transaction;
        let bgClass = "bg-table-row";
        if (transaction.isapproved == true) bgClass += "-selected";

        /* //TODO Implement categories as custom bootstrap dropdown toggle
        //https://react-bootstrap.github.io/components/dropdowns/#custom-dropdocdwn-components */
        return (
            <tr className={bgClass}>
                <td>{transaction.date}</td>
                <td>{transaction.amount + "$"}</td>
                <td>{transaction.description}</td>


                <td>
                    <Dropdown key={transaction.id + "dropdown"}>
                        <Dropdown.Toggle className="plain-btn">
                            {transaction.category}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {this.props.categories.map((category) => { return (this.GetSingleCategory(transaction, category)) })}
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
                <td>
                    <Button variant="secondary btn-sm" id={transaction.id} onClick={this.props.onApprove}>{this.GetIcon(transaction.isapproved)}</Button>
                </td>

            </tr>)
    }
}

export default TransactionRow;