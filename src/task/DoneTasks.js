import React from 'react';
import { useObservable } from '../utils/hooks';
import taskStore from './taskStore';
import TaskList from './TaskList';

import { map } from 'rxjs/operators';

const dones = taskStore.tasks.pipe(map(tasks => tasks.filter(task => task.done)));

function DoneTasks() {
    const tasks = useObservable(dones, []);

    return (
        <React.Fragment>
            <h2>Tasks done</h2>
            <TaskList tasks={tasks} emptyMessage="You have done nothing yet :(" />
        </React.Fragment>
    )
}

export default DoneTasks;