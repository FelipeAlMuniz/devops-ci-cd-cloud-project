import { useEffect, useState } from "react"
import "./App.css"

const apiBaseUrl = import.meta.env.VITE_API_URL ?? ""

const topMetrics = [
  { label: "Availability", value: "99.98%", delta: "+0.12%", tone: "good" },
  { label: "Latency P95", value: "184ms", delta: "-21ms", tone: "good" },
  { label: "Error Rate", value: "0.18%", delta: "-0.05%", tone: "good" },
  { label: "Deploys", value: "23", delta: "7d", tone: "neutral" },
]

const serviceStatus = [
  { name: "API Gateway", status: "Healthy", uptime: "14d 06h", load: "41%" },
  { name: "ECS Service", status: "Healthy", uptime: "14d 06h", load: "67%" },
  { name: "CI Runner", status: "Healthy", uptime: "6d 18h", load: "33%" },
  { name: "Task Queue", status: "Degraded", uptime: "03h 11m", load: "89%" },
]

const incidentFeed = [
  {
    time: "09:14",
    title: "CPU spike on worker pool",
    detail: "Autoscaling absorbed the peak after new pipeline executions.",
    severity: "warning",
  },
  {
    time: "08:42",
    title: "Terraform plan completed",
    detail: "No destructive changes detected for production environment.",
    severity: "info",
  },
  {
    time: "07:58",
    title: "ALB target recovered",
    detail: "Health check returned to normal after container restart.",
    severity: "good",
  },
]

const regionBars = [
  { label: "us-east-1", value: 84 },
  { label: "sa-east-1", value: 62 },
  { label: "eu-west-1", value: 48 },
  { label: "ap-south-1", value: 37 },
]

const sparkline = [42, 58, 46, 71, 54, 76, 66, 82, 61, 88, 73, 92]

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
    <main className="dashboard-shell">
      <section className="hero-band">
        <div className="hero-copy">
          <span className="hero-badge">Observability Command Center</span>
          <h1>Cloud monitoring dashboard com atmosfera de NOC e visual inspirado em Grafana.</h1>
          <p>
            Uma página para apresentar o projeto como se ele já estivesse em operação:
            serviços monitorados, eventos recentes, saúde da stack e sinais de incidentes.
          </p>
        </div>

        <div className="hero-summary">
          <div className="summary-label">Current posture</div>
          <strong>Stable with minor pressure on queue workers</strong>
          <div className="summary-strip">
            <span>Terraform</span>
            <span>AWS</span>
            <span>ECS</span>
            <span>ALB</span>
            <span>CI/CD</span>
          </div>
        </div>
      </section>

      <section className="metrics-grid">
        {topMetrics.map((metric) => (
          <article className="metric-panel" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small className={`delta ${metric.tone}`}>{metric.delta}</small>
          </article>
        ))}
      </section>

      <section className="main-grid">
        <article className="panel panel-large">
          <div className="panel-head">
            <div>
              <span className="panel-tag">Traffic Insight</span>
              <h2>Request volume and response profile</h2>
            </div>
            <div className="pill success">Live</div>
          </div>

          <div className="chart-surface">
            <div className="chart-grid" />
            <div className="sparkline">
              {sparkline.map((point, index) => (
                <span
                  key={`${point}-${index}`}
                  style={{ height: `${point}%` }}
                  className="spark-bar"
                />
              ))}
            </div>
          </div>

          <div className="chart-footer">
            <div>
              <span>Peak throughput</span>
              <strong>1.8k req/min</strong>
            </div>
            <div>
              <span>Container saturation</span>
              <strong>67%</strong>
            </div>
            <div>
              <span>Healthy targets</span>
              <strong>4 / 4</strong>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <span className="panel-tag">Service Health</span>
              <h2>Runtime status</h2>
            </div>
          </div>

          <div className="service-list">
            {serviceStatus.map((service) => (
              <div className="service-row" key={service.name}>
                <div>
                  <strong>{service.name}</strong>
                  <span>{service.uptime}</span>
                </div>
                <div className="service-meta">
                  <span className={service.status === "Healthy" ? "good" : "warn"}>
                    {service.status}
                  </span>
                  <small>{service.load}</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="secondary-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <span className="panel-tag">Regional Load</span>
              <h2>Traffic distribution</h2>
            </div>
          </div>

          <div className="bar-list">
            {regionBars.map((region) => (
              <div className="bar-row" key={region.label}>
                <div className="bar-meta">
                  <span>{region.label}</span>
                  <strong>{region.value}%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${region.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <span className="panel-tag">Incident Feed</span>
              <h2>Recent signals</h2>
            </div>
          </div>

          <div className="incident-list">
            {incidentFeed.map((item) => (
              <article className="incident-item" key={`${item.time}-${item.title}`}>
                <div className={`incident-dot ${item.severity}`} />
                <div>
                  <div className="incident-topline">
                    <strong>{item.title}</strong>
                    <span>{item.time}</span>
                  </div>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="secondary-grid">
        <article className="panel panel-tasks">
          <div className="panel-head">
            <div>
              <span className="panel-tag">Ops Notes</span>
              <h2>Runbook and follow-ups</h2>
            </div>
            <div className="pill">{tasks.length} items</div>
          </div>

          <div className="task-input">
            <input
              placeholder="Ex.: revisar health check do worker queue"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button onClick={addTask}>Adicionar</button>
          </div>

          <div className="task-list">
            {loading ? <p className="empty-state">Carregando anotações operacionais...</p> : null}

            {!loading && tasks.length === 0 ? (
              <p className="empty-state">
                Nenhuma anotação ainda. Adicione itens para simular backlog de operação.
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

        <article className="panel panel-map">
          <div className="panel-head">
            <div>
              <span className="panel-tag">Architecture Pulse</span>
              <h2>Stack topology</h2>
            </div>
          </div>

          <div className="topology">
            <div className="topology-node active">GitHub Actions</div>
            <div className="topology-line" />
            <div className="topology-row">
              <div className="topology-node active">Amazon ECR</div>
              <div className="topology-node active">Terraform Apply</div>
            </div>
            <div className="topology-line" />
            <div className="topology-row">
              <div className="topology-node active">ECS Fargate</div>
              <div className="topology-node warning">Worker Queue</div>
              <div className="topology-node active">ALB</div>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
