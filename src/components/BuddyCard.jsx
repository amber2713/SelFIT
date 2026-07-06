import React from 'react'
import Button from './Button'

const BuddyCard = ({ buddy, onCancel }) => {
  return (
    <div className="glass-card animate-fade-in" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ width: '80px', height: '80px', background: 'rgba(10, 132, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 24px auto' }}>
        ⚡
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Match Successful!</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px' }}>
        Your training partner for today is <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{buddy.email.split('@')[0]}</span>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Button onClick={() => alert('Realtime Chat system interface initialized. Stay tuned for next updates!')}>
          💬 Start Chatting
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Leave Session
        </Button>
      </div>
    </div>
  )
}

export default BuddyCard