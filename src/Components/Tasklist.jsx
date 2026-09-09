import React, { useState } from 'react'

function isOverdue(task) {
  return task.dueDate && !task.completed &&
    new Date(`${task.dueDate}T23:59:59`) < new Date()
}

export default function Tasklist({ tasks, updateTask, deleteTask, toggleComplete }) {
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const startEdit = (task) => {
    setEditingId(task.id)
    setEditText(task.text)
  }

  const saveEdit = (id) => {
    const text = editText.trim()
    if (text) updateTask(id, { text })
    setEditingId(null)
  }

  if (!tasks.length) return null

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue(task) ? 'overdue' : ''}`} key={task.id}>
          <button
            className={`check-btn ${task.completed ? 'checked' : ''}`}
            onClick={() => toggleComplete(task.id)}
            aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.completed ? '✓' : ''}
          </button>

          <div className="task-content">
            {editingId === task.id ? (
              <input
                className="edit-input"
                value={editText}
                autoFocus
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveEdit(task.id)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                onBlur={() => saveEdit(task.id)}
              />
            ) : (
              <div className="task-title">{task.text}</div>
            )}

            <div className="task-meta">
              <span className={`priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
              <span className="category-badge">{task.category}</span>
              {task.dueDate && (
                <span className={`due-badge ${isOverdue(task) ? 'late' : ''}`}>
                  {isOverdue(task) ? '⚠ Overdue · ' : '📅 '}{new Date(`${task.dueDate}T00:00:00`).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="task-actions">
            <button className="icon-btn" onClick={() => startEdit(task)} title="Edit task">✎</button>
            <button className="icon-btn delete-icon" onClick={() => deleteTask(task.id)} title="Delete task">🗑</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
