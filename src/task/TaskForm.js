import React, { useState } from "react";

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