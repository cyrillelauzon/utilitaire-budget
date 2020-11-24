/*-------------------------------------------------------------------------
Component   TransactionsTable
Description: 
Display of a table of bank transactions objects
-------------------------------------------------------------------------*/
import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import TransactionRow from './TtransactionRow';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


class TransactionsTable extends Component {


    /**
     * @description
     * @param {*} curMonth
     * @returns string
     * @memberof TransactionsTable
     */
    GetMonth(curMonth){
        var m_names = ['January', 'February', 'March', 
               'April', 'May', 'June', 'July', 
               'August', 'September', 'October', 'November', 'December'];
        return m_names[curMonth -1];   
    }

    render() {
        return (
            <React.Fragment>

                <Row >
                    <Col md={"4"}>
                    <h3> {this.GetMonth(this.props.curMonth)}</h3>        
                    <Button onClick={this.props.onCurMonthClick}>Mois courant</Button>
                        

                    </Col>
                    <Col md={"4"}>

                    </Col>
                    <Col md={"4"}></Col>
                </Row>
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
                            return <TransactionRow key={transaction.id} transaction={transaction} onApprove={() => this.props.onApprove(transaction)} />
                        })}
                    </tbody>
                </Table>
                <p>Transactions: count: {this.props.transactions.length}</p>
            </React.Fragment>
        )
    }
}

export default TransactionsTable;