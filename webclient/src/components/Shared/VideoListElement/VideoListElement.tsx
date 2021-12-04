import React from 'react';
import { Button, Card, Row } from "react-bootstrap";
import { useHistory } from "react-router";
import { updateList } from '../../../misc/api';
import './VideoListElement.css';

const str = `<svg xmlns="http://www.w3.org/2000/svg" width="338" height="190" viewBox="0 0 338 190">
  <rect fill="#ddd" width="338" height="190"/>
  <text fill="rgba(0,0,0,0.5)" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">No image</text>
</svg>`;

const cleaned = str
  .replace(/[\t\n\r]/gim, '') // Strip newlines and tabs
  .replace(/\s\s+/g, ' ') // Condense multiple spaces
  .replace(/'/gim, '\\i'); // Normalize quotes

const encoded = encodeURIComponent(cleaned)
  .replace(/\(/g, '%28') // Encode brackets
  .replace(/\)/g, '%29');


const defaultImage = `data:image/svg+xml;charset=UTF-8,${encoded}`;

const VideoListElement = ({title, description, url, imageUrl, id, addedToList, onListChanged}) => {

  const history = useHistory();

  const goToVideo = () => {
    history.push(url);
  };

  const addToList = async () => {
    await updateList({videosToAdd: [id], videosToRemove: []});
    if (onListChanged != null) {
      onListChanged();
    }
  }

  const removeFromList = async () => {
    await updateList({videosToAdd: [], videosToRemove: [id]});
    if (onListChanged != null) {
      onListChanged();
    }
  }

  const addToOrRemoveFromList = onListChanged == null
    ? null
    : !!addedToList
      ? (<Button variant="outline-danger" onClick={removeFromList}>Remove from list</Button>)
      : (<Button variant="outline-primary" onClick={addToList}>Add to list</Button>);

  const shortenedDescription = description != null && description.length > 64
    ? description.substring(0, 64) + '...'
    : description;

  return (
    <Card style={{ minHeight: '26rem' }}>
      <Card.Img variant="top" src={imageUrl || defaultImage} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          {shortenedDescription}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Row id="buttons-row">
          <Button variant="primary" onClick={goToVideo}>Go to video</Button>{' '}
          {addToOrRemoveFromList}
        </Row>
      </Card.Footer>
    </Card>
  );
}

export default VideoListElement;