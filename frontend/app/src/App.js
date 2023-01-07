import './App.css';
import Login from './Components/login.jsx';
import Home from './Components/home.jsx';
import Registration from './Components/registration.jsx'
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" component={Registration} exact />
      <Route path="/login" component={Login} />      
      <Route path="/home" component={Home} />      
    </Routes>
    <div>
      <Registration/>
    </div>
  </BrowserRouter>

  );
}

export default App;
