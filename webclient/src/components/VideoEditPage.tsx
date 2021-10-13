import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { fetchVideoInfo, updateVideo } from "../misc/api-calls";
import { VideoInfo } from "../models/VideoInfo";
import './VideoEditPage.css';

type VideoParams = {
  id: string;
};

const VideoEditPage = () => {

  const { id } = useParams<VideoParams>();
  const history = useHistory();
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');

  const goBack = () => {
    history.push(history.location.pathname.substring(0, history.location.pathname.lastIndexOf('/')));
  };

  const submit = async (event: any) => {
    event.preventDefault();
    await updateVideo(id, {title: enteredTitle, description: enteredDescription});
    goBack();
  };

  useEffect(() => {
    fetchVideoInfo(id)
      .then((result: VideoInfo) => {
        setEnteredTitle(result.name);
        setEnteredDescription(result.description || '');
      })
      .catch(err => {
        console.log(err);
      });
    return;
  }, [id]);

  return (<div>
    <Form onSubmit={submit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" onChange={(event) => setEnteredTitle(event.target.value)} value={enteredTitle} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={3} onChange={(event) => setEnteredDescription(event.target.value)} value={enteredDescription} />
      </Form.Group>
      <Button type="button" variant="outline-primary" onClick={goBack} >Cancel</Button>{' '}
      <Button type="submit" variant="primary">Submit</Button>
    </Form>
    </div>);
}

export default VideoEditPage;