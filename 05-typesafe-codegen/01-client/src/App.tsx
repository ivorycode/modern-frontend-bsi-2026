import { useEffect, useState, type FormEvent } from 'react'
import { api, type Project, type Task } from './api/client'

// Same app as 10-spa-rest – but every request below is type-checked
// against the backend's OpenAPI spec: paths, params, bodies, responses.
export function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    // data is fully typed as Project[] – derived from the OpenAPI spec.
    api.GET('/projects').then(({ data }) => {
      setProjects(data ?? [])
      setProjectId(data?.[0]?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (projectId === null) return
    api
      .GET('/tasks', { params: { query: { projectId } } })
      .then(({ data }) => setTasks(data ?? []))
  }, [projectId])

  async function handleAdd(event: FormEvent) {
    event.preventDefault()
    if (projectId === null) return
    const { data } = await api.POST('/tasks', { body: { projectId, title } })
    if (data) {
      setTasks((current) => [...current, data])
      setTitle('')
    }
  }

  async function handleToggle(id: number) {
    const { data } = await api.PATCH('/tasks/{id}/toggle', {
      params: { path: { id } },
    })
    if (data) {
      setTasks((current) => current.map((t) => (t.id === data.id ? data : t)))
    }
  }

  // Exercise 3: the path is a type-checked literal and `data` is a Task –
  // both derived from the regenerated OpenAPI spec.
  async function handleDelete(id: number) {
    const { data } = await api.DELETE('/tasks/{id}', {
      params: { path: { id } },
    })
    if (data) {
      setTasks((current) => current.filter((t) => t.id !== data.id))
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: '3rem auto', fontFamily: 'system-ui' }}>
      <h1>Task Board</h1>
      <p style={{ color: '#666' }}>
        Every request is type-checked against the backend's OpenAPI spec. (Solution)
      </p>
      <select
        value={projectId ?? ''}
        onChange={(e) => setProjectId(Number(e.target.value))}
        style={{ padding: 8, marginBottom: 16 }}
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task…"
          required
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
              <input type="checkbox" checked={task.done} onChange={() => handleToggle(task.id)} />
              <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                {task.title}
              </span>
              {task.dueDate && <small style={{ color: '#999' }}>due {task.dueDate}</small>}
            </label>
            <button onClick={() => handleDelete(task.id)} aria-label={`Delete ${task.title}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
