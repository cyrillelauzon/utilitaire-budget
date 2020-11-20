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
                <h3>Transactions: count: {this.state.count}</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Description</th>
                            <th>Catégorie</th>
                            <th>Montant</th>
                            <th>Approved</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TransactionRow key={10} description={"test desc"} isApproved={true}/>
                        <TransactionRow key={10} description={"test desc"} isApproved={false}/>
                    </tbody>
                </Table>
            </React.Fragment>
        )
    }
}

export default TransactionsTable;