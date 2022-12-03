import React from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import { ITask } from './components/taskScene/Task';
import Tasks, { ITaskColumn } from "./components/taskScene/Tasks"
import { readLocalStorage } from './localStorage/LocalStorage';
import { setColumns, setTasks } from './redux/actions/TaskActions';

function App() {
  return (
    <div className="App">
      <Tasks/>
    </div>
  );
}

export default App;
