import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../services/auth'
import Button from '../components/Button'
import '../styles/login.css'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) return setError('Passwords do not match')
    
    setLoading(true)
    setError('')
    try {
      await signUp(email, password)
      alert('Verification email sent! Please check your inbox.')
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card glass-card animate-fade-in">
        <h1 className="auth-title">Join SelFIT</h1>
        <p className="auth-subtitle">Start your tech-driven fitness journey</p>
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: '#FF453A', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}
          <Button type="submit" loading={loading}>Create Account</Button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log In</Link>
        </div>
      </div>
    </div>
  )
}

export default Register