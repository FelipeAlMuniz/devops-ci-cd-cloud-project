import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    setTasks(data);
  }

  async function addTask() {
    if (!newTask.trim()) return;

    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask })
    });

    setNewTask("");
    fetchTasks();
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>DevOps Task Dashboard 🚀</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nova tarefa"
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={addTask}>Adicionar</button>
      </div>

      <h3>Total de tarefas: {tasks.length}</h3>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;