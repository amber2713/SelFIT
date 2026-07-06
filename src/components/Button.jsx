import React from 'react'

const Button = ({ children, onClick, type = 'button', variant = 'primary', loading = false, disabled = false }) => {
  const baseStyle = {
    padding: '14px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
    transition: 'var(--transition-smooth)',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px'
  }

  const variants = {
    primary: {
      backgroundColor: 'var(--accent-blue)',
      color: '#FFFFFF',
    },
    secondary: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#FFFFFF',
      backdropFilter: 'var(--blur-glass)'
    }
  }

  const currentStyle = { ...baseStyle, ...variants[variant] }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled || loading}
      style={currentStyle}
      onMouseOver={(e) => {
        if (!disabled && !loading) e.currentTarget.style.filter = 'brightness(1.1)'
      }}
      onMouseOut={(e) => {
        if (!disabled && !loading) e.currentTarget.style.filter = 'brightness(1)'
      }}
    >
      {loading ? 'Processing...' : children}
    </button>
  )
}

export default Button