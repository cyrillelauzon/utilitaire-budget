/*-------------------------------------------------------------------------
Component   TransactionsTable
Description: 
Display of a table of bank transactions objects
-------------------------------------------------------------------------*/
import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import TransactionRow from './TtransactionRow';


class TransactionsTable extends Component {


    //test functions
    /*     renderLines = (idline) => {
            if(this.state.count === 0) return <p>table is empty!</p>
            this.setState({count: this.state.count + 1});
            console.log(idline);
            return <p>Table content</p>


        } */



    render() {
        return (
            <React.Fragment>
                <p>Transactions: count: {this.props.transactions.length}</p>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Description</th>
                            <th>Catégorie</th>
                            <th>Approved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.transactions.map((transaction) => {
                            return <TransactionRow key={transaction.id} transaction={transaction}  onApprove={() => this.props.onApprove(transaction)} />
                        })}
                    </tbody>
                </Table>
                <ul>

                </ul>
            </React.Fragment>
        )
    }
}

export default TransactionsTable;