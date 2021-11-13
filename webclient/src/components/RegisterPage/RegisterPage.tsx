import React, { FormEvent, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useHistory } from "react-router";
import { register } from "../../misc/api";
import { HttpStatusError } from "../../models/HttpStatusError";
import "./RegisterPage.css";

const RegisterPage = () => {

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const onSubmit = async (event: FormEvent) => {
    setError(null);
    event.preventDefault();
    try {
      await register({ username: username, password: password });
      history.push('./login', { fromRegistration: true });
    } catch (e: any) {
      if (e instanceof HttpStatusError) {
        if (e.statusCode === 401) {
          setError("The username is already taken.");
        } else {
          setError(`Unexpected error: ${e.statusCode} ${e.message}`);
        }
      }
    }
  };

  const errorMessage =
    error != null ? <Alert variant="danger">{error}</Alert> : null;

  return (
    <div className="container">
      <h1 className="mb-4">Register</h1>
      <div className="col-6 pl-0">
        {errorMessage}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(event) => setUsername(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
