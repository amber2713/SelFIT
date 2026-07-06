import React from 'react'

const TutorialCard = ({ name, reps, sets, tip }) => {
  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{name}</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>{tip}</p>
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>SETS</span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{sets}</span>
        </div>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>REPS / TIME</span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent-blue)' }}>{reps}</span>
        </div>
      </div>
    </div>
  )
}

export default TutorialCard