import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { requestFitnessTutorial } from '../services/ai'
import Button from '../components/Button'
import Loading from '../components/Loading'
import TutorialCard from '../components/TutorialCard'
import '../styles/tutorial.css'

const Tutorial = () => {
  const [target, setTarget] = useState('')
  const [customTarget, setCustomTarget] = useState('')
  const [postureContext, setPostureContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)

  const quickTargets = ['Improve posture', 'Lose weight', 'Gain muscle', 'Cardio Endurance']

  // 核心机制：挂载时自动提取 Supabase 数据库中该用户最近一次的体态诊断数据
  useEffect(() => {
    const fetchLatestPosture = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from('posture_records')
        .select('report_text')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (data && data.length > 0) {
        setPostureContext(data[0].report_text)
      }
    }
    fetchLatestPosture()
  }, [])

  const handleGeneratePlan = async () => {
    const finalTarget = customTarget || target
    if (!finalTarget) return alert('Please select or type a fitness goal first.')

    setLoading(true)
    try {
      const generatedPlan = await requestFitnessTutorial(finalTarget, postureContext)
      setPlan(generatedPlan)
    } catch (err) {
      alert(err.message || 'Server error. Failed to retrieve AI plan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tutorial-container animate-fade-in">
      {loading && <Loading />}
      <header style={{ marginBottom: '40px' }}>
        <h1 className="welcome-title">AI Fitness Tutorial</h1>
        <p className="welcome-subtitle">Hyper-personalized routines powered by your clinical posture alignment data.</p>
      </header>

      {postureContext && (
        <div className="glass-card" style={{ padding: '16px 24px', marginBottom: '32px', borderColor: 'rgba(10, 132, 255, 0.3)', background: 'rgba(10, 132, 255, 0.03)' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)' }}>💡 AUTO-SYNCED POSTURE DATA</span>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Linked: {postureContext}
          </p>
        </div>
      )}

      <div className="input-pill-group">
        {quickTargets.map((t) => (
          <div 
            key={t} 
            className={`target-pill ${target === t && !customTarget ? 'active' : ''}`}
            onClick={() => { setTarget(t); setCustomTarget(''); }}
          >
            {t}
          </div>
        ))}
      </div>

      <div className="custom-input-box">
        <input 
          type="text" 
          className="form-input" 
          placeholder="Or type a specific custom goal (e.g., Relieve lower back pain)..."
          value={customTarget}
          onChange={(e) => setCustomTarget(e.target.value)}
        />
        <div style={{ width: '200px' }}>
          <Button onClick={handleGeneratePlan}>Generate Plan</Button>
        </div>
      </div>

      {plan && (
        <div className="animate-fade-in">
          <hr style={{ borderColor: 'var(--border-color)', margin: '40px 0' }} />
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>{plan.planName}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>{plan.overview}</p>

          <h3 style={{ fontSize: '20px', fontWeight: '700', marginTop: '40px' }}>Recommended Exercises</h3>
          <div className="exercise-grid">
            {plan.exercises?.map((ex, i) => (
              <TutorialCard key={i} name={ex.name} reps={ex.reps} sets={ex.sets} tip={ex.tip} />
            ))}
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '700', marginTop: '40px' }}>Weekly Schedule</h3>
          <div className="schedule-list">
            {plan.weeklySchedule?.map((sched, i) => (
              <div key={i} className="glass-card schedule-row">
                <div className="schedule-day">{sched.day}</div>
                <div style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{sched.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Tutorial