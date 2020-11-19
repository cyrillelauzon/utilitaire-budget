/*-------------------------------------------------------------------------
Component   TransactionsTable
Description: 
Display of a table of bank transactions objects
-------------------------------------------------------------------------*/
import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import TransactionRow from './TtransactionRow';

class TransactionsTable extends Component {
    state = { count: 1 }

/*     constructor(){
        super();
        
    }
 */
    renderLines = (idline) => {
        if(this.state.count === 0) return <p>table is empty!</p>
        this.setState({count: this.state.count + 1});
        console.log(idline);
        return <p>Table content</p>
    }

    render() {
        return (
            <React.Fragment>
                <h3>Transactions: count: {this.state.count}</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Description</th>
                            <th>Catégorie</th>
                            <th>Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TransactionRow key={10} description={"test desc"}/>
                    </tbody>
                </Table>
            </React.Fragment>
        )
    }
}

export default TransactionsTable;