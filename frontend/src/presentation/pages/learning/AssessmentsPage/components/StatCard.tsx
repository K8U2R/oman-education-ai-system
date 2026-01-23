import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
    </div>
  )
}
