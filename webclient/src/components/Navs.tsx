import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

const LINKS = [
  {to: '/', text: 'Home'},
  {to: '/videos', text: 'Videos'},
  {to: '/upload', text: 'Upload'}
];

const Navs = () => {

  return (
    <Navbar collapseOnSelect bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Link className="navbar-brand" to="/">Navbar</Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <ul className="navbar-nav">
          {
            LINKS.map(item => 
            <li
                className="nav-item"
                key={item.to}
              >
                <Nav.Link
                  as={NavLink}
                  className="nav-link"
                  activeClassName="active"
                  exact={item.to === "/"}
                  to={item.to}
                >
                  {item.text}
                </Nav.Link>
            </li>)
          }
          </ul>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default Navs;