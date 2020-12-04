/*-------------------------------------------------------------------------
Component   TransactionsTable
Description: 
Display of a table of bank transactions objects
-------------------------------------------------------------------------*/
import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import './transactionsrow.scss';

class TransactionRow extends Component {
    constructor() {
        super();
    
        this.state = {
          dropDownValue: "Aucun"
        }
      }

    changeValue(text) {

        this.setState({dropDownValue: text})
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
                    <Dropdown  key={transaction.id +"dropdown"}>
                        <Dropdown.Toggle>
                            {transaction.category}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Header>Test</Dropdown.Header>
                            {this.props.categories.map((category) => {
                                
                                return <Dropdown.Item key={transaction.id + category._id +"33"} 
                                onClick={() => this.props.onCategory(category)}>{category.name}</Dropdown.Item>
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </td>


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