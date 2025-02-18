import { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/_index.css';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get<Todo[]>('http://localhost:4000/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      await axios.post('http://localhost:4000/todos', { title: newTodo, completed: false });
      setNewTodo('');
      fetchTodos();
    }
  };

  const toggleTodo = async (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (todoToUpdate) {
      await axios.patch(`http://localhost:4000/todos/${id}`, { completed: !todoToUpdate.completed });
      fetchTodos();
    }
  };

  const deleteTodo = async (id: number) => {
    await axios.delete(`http://localhost:4000/todos/${id}`);
    fetchTodos();
  };

  return (
    <div>
      <h1>待做清单（点击任务修改状态）</h1>
      <input 
        type="text" 
        value={newTodo} 
        onChange={(e) => setNewTodo(e.target.value)} 
        placeholder="输入新的待办事项"
      />
      <button onClick={addTodo}>添加</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span 
              style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }} 
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}