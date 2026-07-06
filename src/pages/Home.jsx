import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'

const Home = () => {
  // 模拟的静态展示数据，后续在完善Profile和DB后动态绑定
  const todaySummary = {
    activeTime: '45 min',
    streakDays: 12,
    lastAnalysis: 'Forward Head Posture (Mild)'
  }

  const shortcuts = [
    { title: 'AI Posture Analysis', desc: 'Check body symmetry', path: '/posture', icon: '📸' },
    { title: 'AI Tutorial', desc: 'Customized workouts', path: '/tutorial', icon: '🏋️‍♂️' },
    { title: 'Community', desc: 'Share your progress', path: '/community', icon: '🔥' },
    { title: 'Gym Buddy', desc: 'Realtime matching', path: '/buddy', icon: '⚡' }
  ]

  return (
    <div className="animate-fade-in">
      <header className="dashboard-header">
        <h1 className="welcome-title">Hello, Athlete</h1>
        <p className="welcome-subtitle">Your AI-driven fitness metrics look sharp today.</p>
      </header>

      <section className="overview-grid">
        <div className="analysis-preview-card glass-card">
          <div>
            <div className="status-badge">Latest Analysis Result</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              {todaySummary.lastAnalysis}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              Your cervical spinal alignment shows positive improvement compared to last week. Keep executing your prescribed stretch routine.
            </p>
          </div>
          <Link to="/profile/history" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600', fontSize: '14px', marginTop: '24px', display: 'inline-block' }}>
            View Full Report History →
          </Link>
        </div>

        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Streak Count</span>
            <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0' }}>
              {todaySummary.streakDays} <span style={{ fontSize: '20px', fontWeight: '500', color: 'var(--text-secondary)' }}>Days</span>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Today Active Time</span>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-blue)', marginTop: '4px' }}>
              {todaySummary.activeTime}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="quick-links-title">Core Capability Hub</h3>
        <div className="shortcut-grid">
          {shortcuts.map((card) => (
            <Link key={card.path} to={card.path} className="shortcut-card glass-card">
              <div className="shortcut-icon">{card.icon}</div>
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{card.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home