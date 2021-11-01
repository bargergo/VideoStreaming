import React, { useContext } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import HttpServiceContext from '../../misc/HttpServiceContext';

const LINKS = [
  {to: '/', text: 'Home'},
  {to: '/videos', text: 'Videos'},
  {to: '/upload', text: 'Upload'},
  {to: '/my-list', text: 'My List'}
];

const Navs = ({ username }) => {

  const httpService = useContext(HttpServiceContext);

  const profileItems = username == null
    ? (
    <>
      <li className="nav-item">
          <Nav.Link
            as={NavLink}
            className="nav-link"
            activeClassName="active"
            to='/login'
          >
            Login
          </Nav.Link>
      </li>
      <li className="nav-item">
          <Nav.Link
            as={NavLink}
            className="nav-link"
            activeClassName="active"
            to='/register'
          >
            Register
          </Nav.Link>
      </li>
    </>
    )
    : (
      <>
        <li className="nav-item">
            <span className="navbar-text">
              Hello, {username}!
            </span>
        </li>
        <li className="nav-item">
            <Nav.Link
              className="nav-link"
              onClick={() => httpService.logout()}
            >
              Logout
            </Nav.Link>
        </li>
      </>
    );

  return (
    <Navbar collapseOnSelect bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Link className="navbar-brand" to="/">Navbar</Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <ul className="navbar-nav mr-auto">
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
          <ul className="navbar-nav ml-auto">
            {profileItems}
          </ul>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default Navs;