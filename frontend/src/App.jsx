import { useEffect, useState } from "react"
import "./App.css"

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000"

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")

  async function fetchTasks() {
    const response = await fetch(`${apiBaseUrl}/tasks`)
    const data = await response.json()
    setTasks(data)
  }

  useEffect(() => {
    async function loadTasks() {
      const response = await fetch(`${apiBaseUrl}/tasks`)
      const data = await response.json()
      setTasks(data)
    }

    loadTasks()
  }, [])

  async function addTask() {
    if (!title.trim()) {
      return
    }

    await fetch(`${apiBaseUrl}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })

    setTitle("")
    await fetchTasks()
  }

  return (
    <div className="container">
      <header>
        <h1>Felipe Alves Muniz</h1>
        <p>DevOps Engineer | Cloud | CI/CD | Containers</p>
      </header>

      <section className="stats">
        <div className="card">
          <h3>Deployments</h3>
          <p>12</p>
        </div>

        <div className="card">
          <h3>Pipelines</h3>
          <p>5</p>
        </div>

        <div className="card">
          <h3>Containers</h3>
          <p>8</p>
        </div>

        <div className="card">
          <h3>Builds</h3>
          <p>23</p>
        </div>
      </section>

      <section className="task-box">
        <h2>DevOps Task Manager</h2>

        <div className="task-input">
          <input
            placeholder="Nova tarefa"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <button onClick={addTask}>Adicionar</button>
        </div>

        <p>Total de tarefas: {tasks.length}</p>

        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      </section>

      <footer>
        <a href="https://github.com/fepa11" target="_blank" rel="noreferrer">
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/felipe-alves-muniz"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </footer>
    </div>
  )
}

export default App
