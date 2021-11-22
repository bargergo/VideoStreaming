import { Field, Form, Formik } from 'formik';
import React from 'react';
import { Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import Feedback from 'react-bootstrap/esm/Feedback';
import * as Yup from "yup";

const SearchForm = ({onSearch, onShowAll}) => {

  const initialValues = {
    searchText: ''
  };

  const validationSchema = Yup.object({
    searchText: Yup.string()
      .required('Required')
      .min(2, 'Enter at least 2 characters')
  });

  const submit = (
    values: { searchText: string },
    { setSubmitting }
  ) => {
    setSubmitting(true);
    try {
      onSearch(values.searchText);
    } finally {
      setSubmitting(false);
    }
  }

  const showAll = () => {
    onShowAll();
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
    >
      {({ isSubmitting, touched, errors }) => (
        <Form noValidate className="mb-3">
          <FormGroup className="mb-3" controlId="exampleForm.ControlInput1">
            <FormLabel sm="2">Search for video</FormLabel>
            <Field
              as={FormControl}
              type="text"
              placeholder="Title"
              name="searchText"
              isInvalid={touched.searchText && errors.searchText}
            />
            <Feedback type="invalid">{errors.searchText}</Feedback>
          </FormGroup>
          <Button type="submit" variant="primary">
            Search
          </Button>{" "}
          <Button type="button" variant="outline-primary" onClick={showAll}>
            Show all videos
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SearchForm;