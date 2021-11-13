import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { logout } from '../../misc/api';
import { useAppSelector } from '../../misc/store-hooks';

const Navs = () => {

  const username = useAppSelector((state) => state.user.name);

  const LINKS = [
    {to: '/', text: 'Videos'},
    {to: '/about', text: 'About'},
  ];

  if (username != null) {
    LINKS.splice(1, 0,
      {to: '/upload', text: 'Upload'},
      {to: '/my-list', text: 'My List'}
    );
  }

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
            <button
              className="btn btn-link nav-link"
              onClick={() => logout()}
            >
              Logout
            </button>
        </li>
      </>
    );

  return (
    <Navbar collapseOnSelect bg="dark" variant="dark" expand="lg">
      <Container className="my-0">
        <Link className="navbar-brand" to="/">VideoStreaming</Link>
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