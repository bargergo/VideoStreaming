import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

const SearchForm = ({onSearch, onShowAll}) => {

  const [searchText, setSearchText] = useState('');

  const submit = (event) => {
    event.preventDefault();
    onSearch(searchText);
  };

  const showAll = () => {
    onShowAll();
  }

  return (
    <Form className="mb-3" onSubmit={submit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label sm="2">Search for video</Form.Label>
        <Form.Control type="text" placeholder="Title" onChange={(event) => setSearchText(event.target.value)} value={searchText}/>
      </Form.Group>
      <Button type="submit" variant="primary">Search</Button>{' '}
      <Button type="button" variant="outline-primary" onClick={showAll}>Show all videos</Button>
    </Form>
  );
};

export default SearchForm;