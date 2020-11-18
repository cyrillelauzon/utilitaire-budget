import './App.css';

import TransactionsTable from './components/transactionsTable';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
function App() {
  return (
    <div className="App">
      <Container fluid="md">
        <Row >
          <Col md={"2"}></Col>
          <Col md={"8"}>
            <TransactionsTable />
          </Col>
          <Col md={"2"}></Col>
        </Row>
      </Container>
      
    </div>
  );
}

export default App;
