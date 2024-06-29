import {BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import React from 'react';
import Home from './screens/Home';
import Signup from './screens/Signup';
import Login from './screens/Login';
import './App.css'

function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App;