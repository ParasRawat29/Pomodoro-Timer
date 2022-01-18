import React, { useEffect, useState } from "react";
import "./todo.css";
import TodoCard from "./TodoCard";

function Todo({ todoIsOpen, setTodoIsOpen }) {
  const [todos, setTodos] = useState([]);

  let [todo, setTodo] = useState({
    title: "",
    time: "",
    id: "",
    completed: false,
  });

  const addTodo = (e) => {
    e.preventDefault();
    if (todo.time <= 2 || todo.title.split() === "" || todo.time >= 12 * 60) {
      alert("wrong input");
      return;
    }
    const newTodo = todos.concat(todo);
    setTodos(newTodo);
    setTodo({ title: "", time: "", completed: false });
  };

  const handleTodoChange = (e) => {
    const ele = e.target.name;
    const value = e.target.value;
    setTodo((pre) => {
      return {
        ...pre,
        [ele]: value,
        id: Math.floor(Math.random() * 10000),
      };
    });
  };

  const deleteTodo = (id) => {
    console.log(id);
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    console.log("filtered todos", filteredTodos);
    setTodos(filteredTodos);
  };

  const editTodo = () => {};

  const setTodoComplete = (id) => {
    console.log(id);
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      } else return todo;
    });

    setTodos(newTodos);
  };

  useEffect(() => {
    const localTodos = JSON.parse(localStorage.getItem("todos"));
    console.log(localTodos);
    setTodos(localTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <div className={`todoContainer ${todoIsOpen ? "todoOpen" : "todoClose"}`}>
      <button
        className="todoCloseBtn"
        onClick={() => {
          setTodoIsOpen((pre) => !pre);
        }}
      >
        <i class="bi bi-x-lg"></i>
      </button>
      <h2>Tasks</h2>
      <div className="addTodoContainer">
        <form action="" onSubmit={addTodo}>
          <textarea
            placeholder="Title"
            value={todo.title}
            onChange={handleTodoChange}
            name="title"
          />
          <input
            placeholder="time in minutes"
            type="number"
            value={todo.time}
            onChange={handleTodoChange}
            name="time"
            min="0"
          />
          <button type="submit">
            <i class="bi bi-plus"></i>
          </button>
        </form>
      </div>
      <ul>
        {todos.map((todo) => {
          return (
            <TodoCard
              todo={todo}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              setTodoComplete={setTodoComplete}
              isCompleted={todo.completed}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default Todo;
