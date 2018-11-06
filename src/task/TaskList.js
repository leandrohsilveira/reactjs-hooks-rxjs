import React from "react";

function TaskList({
  onSwitch,
  onRemove,
  tasks = [],
  emptyMessage = "Your todo list is empty!"
}) {
  const showSwitchButton = typeof onSwitch === "function";
  const showRemoveButton = typeof onRemove === "function";

  function handleSwitchClick(e) {
    if (showSwitchButton) {
      const { name: taskId } = e.currentTarget;
      onSwitch(+taskId);
    }
  }

  function handleRemoveClick(e) {
    if (showRemoveButton) {
      const { name: taskId } = e.currentTarget;
      onRemove(+taskId);
    }
  }

  return (
    <ul>
      {!!tasks.length &&
        tasks.map(task => (
          <li
            key={task.id}
            style={{ textDecoration: task.done ? "line-through" : "unset" }}
          >
            <span>{task.description}</span>
            
            {showSwitchButton && (
                <button name={task.id} type="button" onClick={handleSwitchClick}>
                {task.done ? "Undone" : "Done"}
                </button>
            )}
            {showRemoveButton && (
                <button name={task.id} type="button" onClick={handleRemoveClick}>
                Remove
                </button>
            )}
          </li>
        ))}
      {!tasks.length && <li>{emptyMessage}</li>}
    </ul>
  );
}

export default TaskList;
