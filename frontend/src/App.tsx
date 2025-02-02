import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './pages/home.tsx';
import Header from './components/Header.tsx';

function App() {
  return (
    <>
    <Header />
    
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
    </>
  );
}

export default App;
