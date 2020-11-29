/*-------------------------------------------------------------------------
Component   TransactionsTable
Description: 
Display of a table of bank transactions objects
-------------------------------------------------------------------------*/
import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import TransactionRow from './TransactionRow';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class TransactionsTable extends Component {


    /**
     * @description
     * @param {*} curMonth
     * @returns string
     * @memberof TransactionsTable
     */
    GetMonth(curMonth) {
        var m_names = ['Janvier', 'Février', 'Mars',
            'Avril', 'Mai', 'Juin', 'Juillet',
            'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        return m_names[curMonth - 1];
    }

    render() {
        if (this.props.transactions === undefined || this.props.transactions === "") return (<p>No transactions found</p>)

        return (

            <React.Fragment>

                <ButtonToolbar>
                    <ButtonGroup  className="mr-2" aria-label="Month View">
                        <Button variant="secondary" onClick={this.props.onPreviousMonthClick}><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-left-short" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
                        </svg></Button>
                        <Button className="btnCurMonth" variant="secondary" onClick={this.props.onCurMonthClick}>{this.GetMonth(this.props.curMonth)}</Button>
                        <Button variant="secondary" onClick={this.props.onNextMonthClick}><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-right-short" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
                        </svg></Button>
                    </ButtonGroup>

                    <ButtonGroup aria-label="Year View">
                        <Button variant="secondary"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-left-short" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
                        </svg></Button>
                        <Button variant="secondary">2020</Button>
                        <Button variant="secondary"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-right-short" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
                        </svg></Button>
                    </ButtonGroup>
                </ButtonToolbar>

                <Table>
                    <thead>
                        <tr>
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