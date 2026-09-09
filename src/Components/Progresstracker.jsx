import React from 'react'

export default function Progresstracker({ tasks }) {
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  return (
    <div className="progress-tracker">
      <div className="progress-copy">
        <div>
          <h2>Progress</h2>
          <p>Keep going — every completed task counts.</p>
        </div>
        <strong>{progress}%</strong>
      </div>
      <div className="progress-bar" aria-label={`${progress}% completed`}>
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-count">{completedTasks} of {totalTasks} tasks completed</p>
    </div>
  )
}
