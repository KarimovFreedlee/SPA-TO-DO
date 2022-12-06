import React from 'react';
import './App.css';
import Projects from './components/projects/Projects';
import Tasks from "./components/taskScene/Tasks"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Projects/>} />
          <Route path="/project" element={<Tasks />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
