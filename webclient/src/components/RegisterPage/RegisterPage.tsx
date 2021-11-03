import React, { FormEvent, useContext, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import HttpServiceContext from '../../misc/HttpServiceContext';
import { HttpStatusError } from '../../models/HttpStatusError';
import './RegisterPage.css';

const RegisterPage = () => {

  const httpService = useContext(HttpServiceContext);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    setError(null);
    event.preventDefault();
    try {
      await httpService.register({username: username, password: password});
    } catch (e: any) {
      if (e instanceof HttpStatusError) {
        if (e.statusCode === 401) {
          setError('The username is already taken.');
        } else {
          setError(`Unexpected error: ${e.statusCode} ${e.message}`);
        }
      }
    }
  };

  const errorMessage = error != null ? (
    <Alert variant="danger">{error}</Alert>
  ) : null;

  return (
  <div className="container">
    <div className="col-6 mx-auto">
      {errorMessage}
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