import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { uploadPostImage, createPost } from '../services/post'
import Button from '../components/Button'
import Loading from '../components/Loading'
import '../styles/community.css'

const CreatePost = () => {
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return alert('Post content cannot be empty.')
    
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Authentication expired. Please re-login.')

      let uploadedUrl = ''
      if (imageFile) {
        uploadedUrl = await uploadPostImage(imageFile)
      }

      await createPost(content, uploadedUrl, session.user.id, session.user.email)
      navigate('/community')
    } catch (err) {
      alert(err.message || 'Failed to dispatch post.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="community-container animate-fade-in" style={{ maxWidth: '600px' }}>
      {loading && <Loading />}
      <header style={{ marginBottom: '32px' }}>
        <h1 className="welcome-title">Create Post</h1>
        <p className="welcome-subtitle">Publish text and high-res gym transformations.</p>
      </header>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }}>
        <div className="form-group">
          <label className="form-label">What's on your mind?</label>
          <textarea 
            className="form-input" 
            style={{ minHeight: '140px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5' }}
            placeholder="Log your workout metrics, routines or AI posture wins..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '32px' }}>
          <label className="form-label">Attach Photo (Optional)</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            style={{ color: 'var(--text-secondary)', fontSize: '14px' }}
          />
          {imagePreview && (
            <div className="post-image-wrapper" style={{ marginTop: '16px', maxHeight: '240px' }}>
              <img src={imagePreview} alt="Upload Preview" className="post-image" />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Button variant="secondary" onClick={() => navigate('/community')}>Cancel</Button>
          <Button type="submit">Publish Post</Button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost