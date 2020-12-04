/*-------------------------------------------------------------------------
Component   AppNav
Description: 
Display application navbar
-------------------------------------------------------------------------*/
import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar'

class NavBar extends Component {
    state = {}
    render() {
        return (
            <Navbar expand="lg" bg="white">
                <Navbar.Brand href="#">Transactions</Navbar.Brand>
            </Navbar>


        );
    }
}

export default NavBar;