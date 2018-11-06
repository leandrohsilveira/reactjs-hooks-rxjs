import React from "react";
import taskStore from './task/taskStore';
import TaskForm from './task/TaskForm';
import AllTasks from './task/AllTasks';
import PendingTasks from './task/PendingTasks';
import DoneTasks from './task/DoneTasks';

function App() {
  return (
    <div>
      <TaskForm onSubmit={taskStore.add} />
      <div style={{width: '30%', float: 'left'}}>
        <AllTasks />
      </div>
      <div style={{width: '30%', float: 'left'}}>
        <PendingTasks />
      </div>
      <div style={{width: '30%', float: 'left'}}>
        <DoneTasks />
      </div>
    </div>
  );
}

export default App;
