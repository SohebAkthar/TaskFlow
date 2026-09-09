import React, { useEffect, useMemo, useState } from 'react'
import Taskform from './Components/Taskform'
import Tasklist from './Components/Tasklist'
import Progresstracker from './Components/Progresstracker'
import './App.css'

const STORAGE_KEY = 'taskflow-tasks'
const THEME_KEY = 'taskflow-theme'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [priority, setPriority] = useState('all')
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const addTask = (task) => {
    setTasks(prev => [{ ...task, id: crypto.randomUUID(), createdAt: Date.now() }, ...prev])
  }

  const updateTask = (id, updatedTask) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updatedTask } : task))
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const toggleComplete = (id) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const clearCompleted = () => setTasks(prev => prev.filter(task => !task.completed))
  const clearTasks = () => {
    if (window.confirm('Delete all tasks? This cannot be undone.')) setTasks([])
  }

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter(task => {
      const matchesSearch = !query ||
        task.text.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
      const matchesStatus =
        status === 'all' ||
        (status === 'completed' && task.completed) ||
        (status === 'pending' && !task.completed)
      const matchesCategory = category === 'all' || task.category === category
      const matchesPriority = priority === 'all' || task.priority === priority
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority
    })
  }, [tasks, search, status, category, priority])

  const completed = tasks.filter(t => t.completed).length
  const pending = tasks.length - completed

  return (
    <div className="app-shell">
      <header className="hero-header">
        <div>
          <div className="brand"><span className="brand-mark">✓</span> TaskFlow</div>
          <p>Plan. Organize. Accomplish.</p>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <main>
        <section className="dashboard-grid">
          <div className="stat-card"><span>Total Tasks</span><strong>{tasks.length}</strong></div>
          <div className="stat-card"><span>Pending</span><strong>{pending}</strong></div>
          <div className="stat-card"><span>Completed</span><strong>{completed}</strong></div>
          <div className="stat-card"><span>Completion</span><strong>{tasks.length ? Math.round(completed / tasks.length * 100) : 0}%</strong></div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Create a task</h2>
              <p>Add priorities, categories and optional due dates.</p>
            </div>
          </div>
          <Taskform addTask={addTask} />
        </section>

        <section className="panel">
          <div className="section-heading task-heading">
            <div>
              <h2>Your tasks</h2>
              <p>{filteredTasks.length} shown · {tasks.length} total</p>
            </div>
          </div>

          <div className="toolbar">
            <div className="search-wrap">
              <span>⌕</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tasks..."
              />
            </div>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="all">All priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="all">All categories</option>
              <option value="General">General</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Study">Study</option>
            </select>
          </div>

          <Tasklist
            tasks={filteredTasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
            toggleComplete={toggleComplete}
          />

          {tasks.length === 0 && (
            <div className="empty-state">
              <div>📋</div>
              <h3>No tasks yet</h3>
              <p>Create your first task above and start making progress.</p>
            </div>
          )}

          {tasks.length > 0 && filteredTasks.length === 0 && (
            <div className="empty-state compact">
              <div>🔎</div>
              <h3>No matching tasks</h3>
              <p>Try changing your search or filters.</p>
            </div>
          )}
        </section>

        <section className="panel progress-panel">
          <Progresstracker tasks={tasks} />
        </section>

        {tasks.length > 0 && (
          <div className="footer-actions">
            <button className="secondary-btn" onClick={clearCompleted}>Clear completed</button>
            <button className="danger-btn" onClick={clearTasks}>Clear all tasks</button>
          </div>
        )}
      </main>

      <footer>TaskFlow · Your simple task management system</footer>
    </div>
  )
}
