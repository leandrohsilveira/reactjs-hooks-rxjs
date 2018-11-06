import { BehaviorSubject } from "rxjs";

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