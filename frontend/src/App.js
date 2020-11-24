/*-------------------------------------------------------------------------
Component   App.js
Description: 
Main container and logic for transactions manipulations
-------------------------------------------------------------------------*/
import './App.scss';

import React, { Component } from 'react';
import axios from 'axios';
import TransactionsTable from './components/TransactionsTable';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



class App extends Component {

  state = {
    transactions: [],/* [{ "id": "01", "date": "2020-01-31", "description": "Ikea", "category": "Restaurant", "amount": -12, "balance": 546, "isapproved": false },
    { "id": "02", "date": "2020-01-30", "description": "Ikea", "category": "Restaurant", "amount": -9.49, "balance": null, "isapproved": false },
    { "id": "03", "date": "2020-01-29", "description": "Ikea", "category": "Restaurant", "amount": -6.44, "balance": 1583, "isapproved": false },
    { "id": "04", "date": "2020-01-27", "description": "Ikea", "category": "Restaurant", "amount": -4, "balance": 1312, "isapproved": false },
    { "id": "05", "date": "2020-01-24", "description": "Ikea", "category": "Revenu", "amount": 911.89, "balance": 1322, "isapproved": true },
    { "id": "06", "date": "2020-01-24", "description": "Ikea", "category": "Restaurant", "amount": -4, "balance": 1318, "isapproved": false },
    { "id": "07", "date": "2020-01-24", "description": "Ikea", "category": "Restaurant", "amount": -1.47, "balance": 1316, "isapproved": false },
    { "id": "08", "date": "2020-01-23", "description": "Ikea", "category": "Restaurant", "amount": -4, "balance": 410, "isapproved": false },
    { "id": "09", "date": "2020-01-22", "description": "Ikea", "category": "Restaurant", "amount": -3.91, "balance": 414, "isapproved": false },
    { "id": "10", "date": "2020-01-17", "description": "Ikea", "category": "Restaurant", "amount": -4, "balance": 1152, "isapproved": false },
    { "id": "11", "date": "2020-01-16", "description": "Ikea", "category": "Ameublement", "amount": -71.31, "balance": 1175, "isapproved": false },
    { "id": "12", "date": "2020-01-16", "description": "Ikea", "category": "Restaurant", "amount": -6.44, "balance": 1246, "isapproved": false },
    { "id": "13", "date": "2020-01-11", "description": "Ikea", "category": "Restaurant", "amount": -4, "balance": null, "isapproved": false },
    { "id": "14", "date": "2020-01-10", "description": "Ikea", "category": "Revenu", "amount": 1179.94, "balance": 1922, "isapproved": true },
    { "id": "15", "date": "2020-01-10", "description": "Ikea", "category": "Restaurant", "amount": -4, "balance": 1318, "isapproved": false },
    { "id": "16", "date": "2020-01-05", "description": "Ikea", "category": "Restaurant", "amount": -4, "balance": null, "isapproved": false },
    { "id": "17", "date": "2020-01-02", "description": "Ikea", "category": "Restaurant", "amount": -3.91, "balance": 850 }]*/
    curMonth:1
  };


  /**
   * @description
   * @memberof App
   */
  async componentDidMount() {
    const { data: transactions } = await axios.get('http://localhost:5000/transactions/Marche%20Royal/2020/01');

    console.log("did mount");
    console.log(transactions);

    this.setState({ transactions });

  }

  /**
   * @description
   * @memberof App
   */
  handleApprove = (tr) => {
    console.log("parent handleapp" + tr);
    const transactions = [...this.state.transactions];
    const index = transactions.indexOf(tr);
    transactions[index] = { ...transactions[index] };
    transactions[index].isapproved = !transactions[index].isapproved;
    this.setState({ transactions });
  }

  /**
   * @description
   * @memberof App
   */
  handleCurMonthClick = () =>{
    let curMonth = this.state.curMonth;
    curMonth = new Date().getMonth() + 1; //getMonth() returns value from 0-11
    this.setState({curMonth});
  }

  /**
   * @description
   * @returns
   * @memberof App
   */
  render() {
    return (
      <div className="App">
        <Container fluid="md">
          <Row >
            <Col md={"1"}></Col>
            <Col md={"10"}>
              <TransactionsTable curMonth={this.state.curMonth} transactions={this.state.transactions}
                onApprove={this.handleApprove}
                onCurMonthClick={() => this.handleCurMonthClick()} />
            </Col>
            <Col md={"1"}></Col>
          </Row>
        </Container>

      </div>
    );
  }
}

export default App;
