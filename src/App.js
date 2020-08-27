import React from 'react';
import { Button } from 'react-bootstrap';
import Authentication from './components/Authentication';
import './App.module.scss';

function App() {
  return (
    <div className="App">
      <Button>App</Button>
      <Authentication />
    </div>
  );
}

export default App;
