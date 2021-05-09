import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const DATA = [
  { id: 'OyVdqf4FYoJ_JVJ4AYlNT', name: 'Eat', completed: true },
  { id: 'a0CJRrAGXMMuk_5SSSruE', name: 'Sleep', completed: false },
  { id: 'O-jGq69sWyjIHDRP9npXV', name: 'Repeat', completed: false },
];

ReactDOM.render(
  <React.StrictMode>
    <App tasks={DATA} />
  </React.StrictMode>,
  document.getElementById('root')
);
