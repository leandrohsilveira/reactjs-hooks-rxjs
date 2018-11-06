import React from 'react';
import { useObservable } from '../utils/hooks';
import taskStore from './taskStore';
import TaskList from './TaskList';

function AllTasks() {
    const tasks = useObservable(taskStore.tasks, taskStore.__tasks);

    return (
        <React.Fragment>
            <h2>All tasks</h2>
            <TaskList tasks={tasks} onSwitch={taskStore.switchDone} onRemove={taskStore.remove} />
        </React.Fragment>
    )
}

export default AllTasks;