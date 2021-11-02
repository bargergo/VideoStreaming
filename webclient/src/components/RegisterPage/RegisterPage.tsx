import React, { FormEvent, useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import HttpServiceContext from '../../misc/HttpServiceContext';
import './RegisterPage.css';

const RegisterPage = () => {

  const httpService = useContext(HttpServiceContext);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    httpService.register({username: username, password: password});
  };

  return (
  <div className="container">
    <div className="col-4 mx-auto">
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={(event) => setUsername(event.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>

</div>
);
}

export default RegisterPage;