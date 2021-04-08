import React from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
  {to: '/', text: 'Home'},
  {to: '/video', text: 'Video'},
  {to: '/upload', text: 'Upload'}
];

const Navs = () => {
  return (
    <div>
      <ul>
      {
        LINKS.map(item => <li key={item.to}><Link to={item.to}>{item.text}</Link></li>)
      }
      </ul>
    </div>
  )
};

export default Navs;