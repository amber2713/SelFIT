import React from 'react'

const Loading = () => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="animate-pulse-glow" style={{
        width: '50px',
        height: '50px',
        border: '3px solid var(--accent-blue)',
        borderRadius: '50%',
        borderTopColor: 'transparent'
      }}></div>
    </div>
  )
}

export default Loading