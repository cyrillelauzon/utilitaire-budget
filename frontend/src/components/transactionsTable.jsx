/*-------------------------------------------------------------------------
Component   transactionsTable
Description: 
Display of a table of bank transactions objects
-------------------------------------------------------------------------*/
import React, { Component } from 'react';

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
                <span>Count: {this.state.count}</span>
                <button onClick={() => this.renderLines("testrend")}>test</button>
            </React.Fragment>
        )
    }
}

export default TransactionsTable;