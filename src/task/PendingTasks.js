import React from 'react';
import { useObservable } from '../utils/hooks';
import taskStore from './taskStore';
import TaskList from './TaskList';

import { map } from 'rxjs/operators';

const pendings = taskStore.tasks.pipe(map(tasks => tasks.filter(task => !task.done)));

function PendingTasks() {
    const tasks = useObservable(pendings, []);

    return (
        <React.Fragment>
            <h2>Pending tasks</h2>
            <TaskList tasks={tasks} emptyMessage="You have no pending tasks :)" />
        </React.Fragment>
    )
}

export default PendingTasks;