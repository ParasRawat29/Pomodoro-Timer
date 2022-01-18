import React from "react";

function TodoCard({
  todo,
  deleteTodo,
  setTodoComplete,
  editTodo,
  isCompleted,
}) {
  return (
    <li className="todo">
      <h6 className={`title ${isCompleted ? "completed" : ""}`}>
        {todo.title}
      </h6>
      <div className="cardBtns">
        <button
          onClick={() => setTodoComplete(todo.id)}
          style={{ color: "#2fa89c" }}
        >
          {isCompleted ? (
            <i class="bi bi-arrow-counterclockwise"></i>
          ) : (
            <i class="bi bi-check-circle-fill"></i>
          )}
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          style={{ color: "indianred" }}
        >
          <i class="bi bi-trash-fill"></i>
        </button>
      </div>
      <h2 className={`todoTime ${isCompleted ? "completed" : ""}`}>
        {todo.time + " mins"}
      </h2>
    </li>
  );
}

export default TodoCard;
