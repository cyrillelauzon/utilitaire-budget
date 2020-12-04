/*-------------------------------------------------------------------------
Component   App.js
Description: 
Main container and logic for transactions manipulations
-------------------------------------------------------------------------*/
import './App.scss';

import React, { Component } from 'react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TransactionsTable from './components/TransactionsTable';
import NavBar from './components/NavBar';


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
    categories: [],
    curMonth: 1,
    curYear: 0
  };

  /**
   *Creates an instance of App.
   * @param {*} props
   * @memberof App
   */
  constructor(props) {
    super(props);
    let curMonth = this.getCurMonth();
    let curYear = this.getCurYear();
    this.state = {
      transactions: [],
      categories: [],
      curMonth: curMonth,
      curYear: curYear
    }
  }


  /**
   * @description
   * @returns
   * @memberof App
   */
  getCurMonth() {
    return new Date().getMonth() + 1;  //getMonth() returns value from 0-11
  }

  /**
 * @description
 * @returns
 * @memberof App
 */
  getCurYear() {
    return new Date().getFullYear();
  }


  /**
   * @description
   * @memberof App
   */
  async componentDidMount() {
    const { data: transactions } = await axios.get(`http://localhost:5000/transactions/*/${this.state.curYear}/${this.state.curMonth}`);
    const { data: categories } = await axios.get(`http://localhost:5000/categories/test`);
    this.handleCurMonthClick();
    this.setState({ transactions, categories });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.curMonth !== this.state.curMonth || prevState.curYear !== this.state.curYear) {
      console.log("Month changed");
      const { data: transactions } = await axios.get(`http://localhost:5000/transactions/*/${this.state.curYear}/${this.state.curMonth}`);
      this.setState({ transactions });
    }
  }

  handlePreviousYearClick() {
    let curYear = this.state.curYear;
    curYear -= 1;
    if (curYear <= 1900) {
      curYear -= this.getCurYear();
    }
    this.setState({ curYear });
  }
  handleNextYearClick() {
    let curYear = this.state.curYear;
    curYear += 1;
    if (curYear >= this.getCurYear()) curYear = this.getCurYear();
    this.setState({ curYear });
  }

  handleCurYearClick() {
    let curYear = this.state.curYear;
    curYear = this.getCurYear();
    this.setState({ curYear });
  }
  /**
   * @description
   * @memberof App
   */
  handleCurMonthClick = async () => {
    let curMonth = this.state.curMonth;
    curMonth = this.getCurMonth();
    this.setState({ curMonth });
  }

  /**
   * @description
   * @memberof App
   */
  handlePreviousMonthClick = async () => {
    let curMonth = this.state.curMonth;
    let curYear = this.state.curYear;
    curMonth -= 1;
    if (curMonth <= 0) {
      curMonth = 12;
      curYear -= 1;
    }
    this.setState({ curMonth, curYear });
  }

  /**
   * @description
   * @memberof App
   */
  handleNextMonthClick = async () => {
    let curMonth = this.state.curMonth;
    let curYear = this.state.curYear;
    curMonth += 1;
    if (curMonth >= this.getCurMonth() && curYear === this.getCurYear()) {
      curMonth = this.getCurMonth();
      curYear = this.getCurYear();
    }
    else {
      if (curMonth >= 13) {
        curMonth = 1;
        curYear += 1;
      }
    }

    this.setState({ curMonth, curYear });
  }

  /**
   * @description
   * @memberof App
   */
  handleApprove = async (tr) => {
    const transactions = [...this.state.transactions];
    const originalTransactions = [...this.state.transactions];

    const index = transactions.indexOf(tr);
    transactions[index] = { ...transactions[index] };
    transactions[index].isapproved = !transactions[index].isapproved;

    //TESTING to send a request with bad ID to server:
    //transactions[index].id += "temp_to_verify_if_errors";

    try {
      await axios.put("http://localhost:5000/transactions", transactions[index]);
      this.setState({ transactions });

    } catch (error) {
      console.log("Error while updating post: ");
      this.setState({ originalTransactions });
    }
  }

  //FIXME Refactor these 2 functions to eliminate redundant code
  /**
   * @description
   * @memberof App
   */
  handleCategory = async (tr, category) => {
    console.log("new category" + category);

    const transactions = [...this.state.transactions];
    const originalTransactions = [...this.state.transactions];

    const index = transactions.indexOf(tr);
    transactions[index] = { ...transactions[index] };
    transactions[index].category = category.name;
    transactions[index].category_id = category._id;

    try {
      console.log("updating cat");
      console.log(transactions[index]);
      await axios.put("http://localhost:5000/transactions", transactions[index]);
      this.setState({ transactions });

    } catch (error) {
      console.log("Error while updating post: ");
      this.setState({ originalTransactions });
    }

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
              <NavBar />
              <TransactionsTable curYear={this.state.curYear} curMonth={this.state.curMonth} transactions={this.state.transactions}
                categories={this.state.categories}
                onApprove={this.handleApprove}
                onCurYearClick={() => this.handleCurYearClick()}
                onNextYearClick={() => this.handleNextYearClick()}
                onPreviousYearClick={() => this.handlePreviousYearClick()}
                onCurMonthClick={() => this.handleCurMonthClick()}
                onNextMonthClick={() => this.handleNextMonthClick()}
                onPreviousMonthClick={() => this.handlePreviousMonthClick()}
                onCategory={this.handleCategory} />
            </Col>
            <Col md={"1"}></Col>
          </Row>
        </Container>

      </div>
    );
  }

}

export default App;
