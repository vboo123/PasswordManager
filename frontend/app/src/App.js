import './App.css';
import Login from './Components/login.jsx';
import Home from './Components/home.jsx';
import Registration from './Components/registration.jsx'
import Vault from './Components/vault.jsx'
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
        <Route path="/home/vault/:id/:vaultName" element={<Vault/>} />
      </Routes>
      
    </Router>
  );
}

export default App;
