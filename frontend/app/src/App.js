import './App.css';
import Login from './Components/login.jsx';
import Home from './Components/home.jsx';
import Registration from './Components/registration.jsx'
import React from 'react';
import * as ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />      
        <Route path="/home/:id" element={<Home/>} /> 
      </Routes>
      
    </Router>
  );
}

export default App;
