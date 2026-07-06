import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadBox from '../components/UploadBox'
import Button from '../components/Button'
import Loading from '../components/Loading'
import { requestPostureAnalysis } from '../services/ai'
import { supabase } from '../services/supabase'
import '../styles/posture.css'

const Posture = () => {
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleImageSelect = (base64) => {
    setImage(base64)
  }

  const handleStartAnalysis = async () => {
    if (!image) return
    setLoading(true)
    try {
      // 1. 调用 Netlify Functions 安全网关，从讯飞星辰 API 换取分析文字报告
      const result = await requestPostureAnalysis(image)
      
      // 2. 获取当前登录用户的 Session ID
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || null

      // 3. 将分析记录同步持久化保存到 Supabase 数据库
      const { data, error } = await supabase
        .from('posture_records')
        .insert([
          { 
            user_id: userId, 
            image_data: image, 
            report_text: result.report,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      // 4. 带上刚生成的记录主键 ID 路由跳转至结果结果报告页面
      const recordId = data && data[0] ? data[0].id : 'temp'
      navigate(`/posture/result/${recordId}`, { state: { image, report: result.report } })
    } catch (err) {
      alert(err.message || 'Analysis failed. Connection to XUNFEI server gateway timed out.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="posture-container animate-fade-in">
      {loading && <Loading />}
      <header style={{ marginBottom: '40px' }}>
        <h1 className="welcome-title">AI Posture Analysis</h1>
        <p className="welcome-subtitle">Unlock precise biomechanical symmetry insights using advanced computer vision.</p>
      </header>

      {!image ? (
        <UploadBox onImageSelected={handleImageSelect} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div className="preview-image-container">
            <img src={image} alt="Selected Silhouette" className="preview-image" />
          </div>
          <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '400px' }}>
            <Button variant="secondary" onClick={() => setImage(null)}>Re-upload</Button>
            <Button variant="primary" onClick={handleStartAnalysis}>Analyze Target</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Posture