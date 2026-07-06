import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import '../styles/posture.css'

const Result = () => {
  const { state } = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()

  // 降级兜底保护，防止直接敲击 URL 导致无状态白屏
  const image = state?.image
  const report = state?.report || 'No diagnostic data found.'

  return (
    <div className="posture-container animate-fade-in">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="welcome-title">Diagnostic Assessment</h1>
          <p className="welcome-subtitle">Report ID: Reference #{id}</p>
        </div>
        <div style={{ width: '160px' }}>
          <Button variant="secondary" onClick={() => navigate('/posture')}>New Scan</Button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }} className="result-layout-grid">
        {image && (
          <div>
            <div className="preview-image-container" style={{ marginTop: 0 }}>
              <img src={image} alt="Analyzed Silhouette" className="preview-image" />
            </div>
          </div>
        )}
        
        <div className="glass-card report-card" style={{ marginTop: 0 }}>
          <div className="report-section">
            <h2 style={{ fontSize: '22px', marginBottom: '24px', fontWeight: '800' }}>Biomechanical Profile</h2>
            {/* 将大模型的纯文本换行进行规范化优雅降级展示 */}
            {report.split('\n').map((paragraph, index) => (
              <p key={index} style={{ marginBottom: '12px', color: 'rgba(255,255,255,0.9)', fontSize: '15px' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result