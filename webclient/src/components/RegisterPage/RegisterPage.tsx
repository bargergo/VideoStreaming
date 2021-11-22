import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { Alert, Button, FormControl, FormGroup, FormLabel, InputGroup } from "react-bootstrap";
import Feedback from "react-bootstrap/esm/Feedback";
import { useHistory } from "react-router";
import * as Yup from "yup";
import { register } from "../../misc/api";
import { HttpStatusError } from "../../models/HttpStatusError";
import { ValidationErrorResponse } from "../../models/ValidationErrorResponse";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const history = useHistory();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const passwordInputRef = useRef<HTMLInputElement>();

  const showHide = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword((prev) => !prev);
    passwordInputRef.current?.focus();
  };

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Required")
      .min(4, "Must be at least 4 characters long."),
    password: Yup.string()
      .required("Required")
      .min(8, "Must be at least 8 characters long.")
      .test("hasDigit", "Must contain a digit", (value) => /[0-9]/.test(value))
      .test("hasLowercase", "Must contain a lowercase letter", (value) =>
        /[a-z]/.test(value)
      )
      .test("hasUppercase", "Must contain a uppercase letter", (value) =>
        /[A-Z]/.test(value)
      ),
  });

  const onSubmit = async (
    values: { username: string; password: string },
    { setSubmitting }
  ) => {
    setErrors([]);
    setSubmitting(true);
    try {
      const response = await register({
        username: values.username,
        password: values.password,
      });
      if (response["errors"] == null) {
        history.push("./login", { fromRegistration: true });
      } else {
        const validationErrorResponse = response as ValidationErrorResponse;
        const validationErrors: string[] = [];
        for (const key in validationErrorResponse.errors) {
          validationErrors.push(...validationErrorResponse.errors[key]);
        }
        setErrors(validationErrors);
      }
    } catch (e: any) {
      if (e instanceof HttpStatusError) {
        if (e.statusCode === 401) {
          setErrors(["The username is already taken."]);
        } else if (e.statusCode === 400) {
        } else {
          setErrors([`Unexpected error: ${e.statusCode} ${e.message}`]);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Register</h1>
      <div className="row">
        <div className="col-md-6">
          {errors.map((errorMessage, idx) => (
            <Alert variant="danger" key={idx}>
              {errorMessage}
            </Alert>
          ))}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, touched, errors, isValid }) => (
              <Form noValidate>
                <FormGroup className="mb-3" controlId="formUsername">
                  <FormLabel>Username</FormLabel>
                  <Field
                    as={FormControl}
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    isInvalid={touched.username && errors.username}
                  />
                  <Feedback type="invalid">{errors.username}</Feedback>
                </FormGroup>

                <FormGroup className="mb-3">
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Field
                      as={FormControl}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      isInvalid={touched.password && errors.password}
                    />
                    <InputGroup.Text id="show-password-icon-ig" onClick={showHide}>
                      <FontAwesomeIcon 
                        icon={showPassword ?  faEyeSlash : faEye}
                      ></FontAwesomeIcon>
                    </InputGroup.Text>
                    <Feedback type="invalid">{errors.password}</Feedback>
                  </InputGroup>
                  
                </FormGroup>
                <Alert variant="info">
                  Password requirements: it must contain at least 1 digit, 1
                  uppercase letter and 1 lowercase letter.
                </Alert>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Register
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
