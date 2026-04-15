import { useEffect, useState } from "react"
import "./App.css"

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000"

const metrics = [
  { label: "Infra modules", value: "07", detail: "VPC, ECR, ECS, ALB e mais" },
  { label: "Pipeline stages", value: "06", detail: "Test, lint, build e deploy" },
  { label: "Cloud focus", value: "AWS", detail: "Fargate, CloudWatch e OIDC" },
]

const highlights = [
  "Terraform para provisionamento de infraestrutura",
  "GitHub Actions com fluxo CI/CD completo",
  "Containers com Docker e deploy em ECS Fargate",
]

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true)

  async function fetchTasks() {
    const response = await fetch(`${apiBaseUrl}/tasks`)
    const data = await response.json()
    setTasks(data)
    setLoading(false)
  }

  useEffect(() => {
    async function loadTasks() {
      try {
        await fetchTasks()
      } catch {
        setLoading(false)
      }
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
    <main className="page-shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Cloud • DevOps • Infrastructure as Code</span>
          <h1>Portfólio de Infraestrutura com design de produto e mentalidade de automação.</h1>
          <p className="hero-text">
            Um dashboard pensado para apresentar competências em Terraform, CI/CD,
            containers e AWS de forma mais visual, clara e publicável.
          </p>

          <div className="hero-actions">
            <a
              className="primary-action"
              href="https://github.com/fepa11"
              target="_blank"
              rel="noreferrer"
            >
              Ver GitHub
            </a>
            <a
              className="secondary-action"
              href="https://www.linkedin.com/in/felipe-alves-muniz"
              target="_blank"
              rel="noreferrer"
            >
              Ver LinkedIn
            </a>
          </div>

          <ul className="highlight-list">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <aside className="hero-panel">
          <div className="panel-label">Profile Card</div>
          <h2>Felipe Alves Muniz</h2>
          <p className="panel-role">Infrastructure Analyst • Cloud & AI DevOps Student</p>

          <div className="metrics-grid">
            {metrics.map((metric) => (
              <article className="metric-card" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.detail}</small>
              </article>
            ))}
          </div>

          <div className="signal-bar">
            <span>Readiness</span>
            <div className="signal-track">
              <div className="signal-fill" />
            </div>
            <strong>Portfolio Ready</strong>
          </div>
        </aside>
      </section>

      <section className="content-grid">
        <article className="story-card">
          <div className="section-tag">Project Story</div>
          <h2>DevOps Cloud Project</h2>
          <p>
            Aplicação de demonstração para exibir uma jornada completa: código,
            containerização, validação automatizada e entrega contínua em cloud.
          </p>

          <div className="timeline">
            <div>
              <span>01</span>
              <p>Provisionamento com Terraform para AWS.</p>
            </div>
            <div>
              <span>02</span>
              <p>Empacotamento da aplicação com Docker.</p>
            </div>
            <div>
              <span>03</span>
              <p>Pipeline CI/CD com GitHub Actions e deploy automatizado.</p>
            </div>
          </div>
        </article>

        <article className="task-card-shell">
          <div className="section-tag">Live Task Board</div>
          <div className="task-header">
            <div>
              <h2>DevOps Task Manager</h2>
              <p>Use esta área para registrar entregas e ideias do projeto.</p>
            </div>
            <div className="task-badge">{tasks.length} tasks</div>
          </div>

          <div className="task-input">
            <input
              placeholder="Ex.: Adicionar terraform plan no pull request"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <button onClick={addTask}>Criar</button>
          </div>

          <div className="task-list">
            {loading ? <p className="empty-state">Carregando tarefas...</p> : null}

            {!loading && tasks.length === 0 ? (
              <p className="empty-state">
                Nenhuma tarefa ainda. Crie a primeira para usar o dashboard como demo.
              </p>
            ) : null}

            {tasks.map((task, index) => (
              <article className="task-item" key={task.id}>
                <span className="task-index">{String(index + 1).padStart(2, "0")}</span>
                <p>{task.title}</p>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
