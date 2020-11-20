import './App.scss';

import React, { Component } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



class App extends Component {


componentDidMount(){
  //Ajax calls here
  //after this.setstate (transactions fetched)
}


  render() {
    return (
      <div className="App">
        <Container fluid="md">
          <Row >
            <Col md={"1"}></Col>
            <Col md={"10"}>
              <TransactionsTable />
            </Col>
            <Col md={"1"}></Col>
          </Row>
        </Container>

      </div>
    );
  }
}

export default App;
