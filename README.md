# ReactJS 16.7 Hooks + RxJS

The ReactJS hooks feature introduced by the first 16.7 alpha release is being considered the new state of art of the React. It’s goal is to provide a more simple way to manage component’s internal state and lifecycle as an alternative to class components.

Adventurers javascript developers may wish to use RXJS to go full reactive instead of redux. But who try to use pure RXJS and React faces a boring boilerplate: subscribing and unsubscribing to observables and setting changes to component internal state, for EVERY connected component.

```jsx
import React, { Component } from 'react';
import fooStore from './fooStore';

class Foo extends Component {

  state = {
    name: ''
  };
  
  componentWillMount() {
    this.subscription = fooStore.name.subscribe(name => this.setState({name}));
  }
  
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
  
  [...]

}

```

Some developers appeal to decorators to avoid this, but this is one of the known causes of the “component tree wrapper hell” that mobilized the React Team to introduce the hooks feature. 

They also appeal to other libraries like “Recycle JS” that abstracts away the observable subscription/unsubscription.

## The magical hook
No more extra libraries or decorators. Just one hook and your components are ready to react to any RXJS Observable changes:

```js
import {useState, useEffect} from 'react';

function useObservable(observable, initialValue) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const subscription = observable.subscribe(newValue => {
      setValue(newValue);
    });
    return () => subscription.unsubscribe();
  }, []);

  return value;
}

function FooComponent() {
  
  const value = useObservable(fooObservable, 'Hello!');
  
  // render it :)
  
}
```

It abstracts away the observable subscription and unsubscription and subscribes to observable changes updating it to component internal state, pretty simple huh?

## Task list example
To be more pactical, let's implement a classic TODO List example using ReactJS and RXJS.

### Task store
Here we control the task list state as an application state.
```js
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

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

export default taskStore;
```

### Task list component
Component to display the task list and trigger the "switch done/undone" and "remove" actions to parent component.
```jsx
import React from "react";

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

export default TaskList;
```

### Task form component
Component to provide a "description" field and a "submit" event.

```jsx
import React from "react";

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

export default TaskForm;
```

### App component
Finally, the App component, where everything are controlled.

```jsx
import React from "react";
import TaskForm from './task/TaskForm';
import TaskList from './task/TaskList';
import taskStore from './task/taskStore';

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
```
