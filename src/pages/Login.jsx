import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../services/auth'
import Button from '../components/Button'
import '../styles/login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed, please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card glass-card animate-fade-in">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in to your SelFIT account</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
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
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p style={{ color: '#FF453A', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}
          <Button type="submit" loading={loading}>Log In</Button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register</Link>
        </div>
      </div>
    </div>
  )
}

export default Login