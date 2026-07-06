import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { getUserStats, getUserPostureHistory } from '../services/profile'
import Button from '../components/Button'
import Loading from '../components/Loading'
import '../styles/profile.css'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ postCount: 0 })
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          navigate('/login')
          return
        }
        setUser(session.user)

        // 并发聚合请求数据层，压低等待网络耗时
        const [statsData, historyData] = await Promise.all([
          getUserStats(session.user.id),
          getUserPostureHistory(session.user.id)
        ])

        setStats(statsData)
        setHistory(historyData)
      } catch (err) {
        console.error('Failed to load profile dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [navigate])

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) return <Loading />

  return (
    <div className="profile-container animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 className="welcome-title">Personal Center</h1>
        <p className="welcome-subtitle">Monitor your growth, logs, and biometric evolution records.</p>
      </header>

      {user && (
        <div className="glass-card profile-hero">
          <div className="profile-avatar-large">
            {user.email.substring(0, 1).toUpperCase()}
          </div>
          <div className="profile-meta">
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
              {user.email.split('@')[0]}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>UUID: {user.id}</p>
          </div>
          <div style={{ width: '120px' }}>
            <Button variant="secondary" onClick={handleLogout}>Sign Out</Button>
          </div>
        </div>
      )}

      <div className="profile-dashboard-grid">
        <div className="glass-card" style={{ padding: '24px' }}>
          <div className="stat-num">{stats.postCount}</div>
          <div className="stat-label">Community Posts</div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div className="stat-num">{history.length}</div>
          <div className="stat-label">AI Diagnosis Completed</div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div className="stat-num" style={{ color: 'var(--accent-blue)' }}>Active</div>
          <div className="stat-label">Ecosystem Status</div>
        </div>
      </div>

      <section style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Biometric Evaluation History</h3>
        
        {history.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', marginTop: '16px', color: 'var(--text-secondary)' }}>
            No posture records found. Go to the "Posture" section to start your first evaluation!
          </div>
        ) : (
          <div className="history-timeline">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="glass-card history-item"
                onClick={() => navigate(`/posture/result/${item.id}`)} // 精准下钻跳转至历史报告
              >
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                    体态评估报告 (ID: {item.id.substring(0, 8)})
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.report_text}
                  </p>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                  {new Date(item.created_at).toLocaleDateString()} ➔
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Profile