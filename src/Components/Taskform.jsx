import React, { useState } from 'react'

export default function Taskform({ addTask }) {
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState('General')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = task.trim()
    if (!text) return

    addTask({ text, priority, category, dueDate, completed: false })
    setTask('')
    setPriority('Medium')
    setCategory('General')
    setDueDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="task-input-row">
        <input
          className="task-input"
          type="text"
          placeholder="What needs to be done?"
          value={task}
          maxLength={120}
          onChange={e => setTask(e.target.value)}
          autoComplete="off"
        />
        <button className="primary-btn" type="submit">＋ Add Task</button>
      </div>

      <div className="task-options">
        <label>
          Priority
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </label>

        <label>
          Category
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option>General</option>
            <option>Personal</option>
            <option>Work</option>
            <option>Study</option>
          </select>
        </label>

        <label>
          Due date
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </label>
      </div>
    </form>
  )
}
