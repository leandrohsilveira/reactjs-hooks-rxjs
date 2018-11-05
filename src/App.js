import React from "react";
import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

function useObservable(observable, initialState) {
  const [value, setValue] = useState(initialState);

  useEffect(() => {
    const subscription = observable.subscribe(newValue => {
      setValue(newValue);
    });
    return () => subscription.unsubscribe();
  }, []);

  return value;
}

const taskStore = {
  __sequence: 0,
  __tasks: [],

  tasks: new BehaviorSubject([]),

  add(task) {
    task.id = taskStore.__sequence++;
    taskStore.__tasks = [...taskStore.__tasks, task];
    taskStore.tasks.next(taskStore.__tasks);
  },

  switchDone(id) {
    taskStore.__tasks = taskStore.__tasks.map(task => {
      if (task.id === +id) {
        return {
          ...task,
          done: !task.done
        };
      }
      return task;
    });
    taskStore.tasks.next(taskStore.__tasks);
  },

  remove(id) {
    taskStore.__tasks = taskStore.__tasks.filter(task => task.id !== +id);
    taskStore.tasks.next(taskStore.__tasks);
  }
};

function TaskList({ tasks = [], onSwitch, onRemove }) {

  function handleSwitchClick(e) {
    if (typeof onSwitch === "function") {
      const { name: taskId } = e.currentTarget;
      onSwitch(+taskId);
    }
  }
  
  function handleRemoveClick(e) {
    if (typeof onRemove === "function") {
      const { name: taskId } = e.currentTarget;
      onRemove(+taskId);
    }
  }

  return (
    <ul>
      {tasks.map(task => (
        <li
          key={task.id}
          style={{ textDecoration: task.done ? "line-through" : "unset" }}
        >
          <span>{task.description}</span>
          <button 
            name={task.id} 
            type="button" 
            onClick={handleSwitchClick}
          >
            {task.done ? "Undone" : "Done"}
          </button>
          <button 
            name={task.id} 
            type="button" 
            onClick={handleRemoveClick}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

function TaskForm({ onSubmit }) {
  const [description, setDescription] = useState("");

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setDescription("");
    if (typeof onSubmit === "function") {
      onSubmit({ description, done: false });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="description"
        onChange={handleDescriptionChange}
        value={description}
      />
      <button type="submit">Add</button>
    </form>
  );
}

function App() {
  const tasks = useObservable(taskStore.tasks, []);

  return (
    <div>
      <TaskForm onSubmit={taskStore.add} />
      <TaskList 
        tasks={tasks} 
        onSwitch={taskStore.switchDone} 
        onRemove={taskStore.remove}
      />
    </div>
  );
}

export default App;
