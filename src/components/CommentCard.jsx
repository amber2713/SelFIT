import React from 'react'

const CommentCard = ({ comment }) => {
  return (
    <div style={{
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '8px',
      marginBottom: '8px',
      fontSize: '14px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>{comment.author_name}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {new Date(comment.created_at).toLocaleDateString()}
        </span>
      </div>
      <p style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>{comment.content}</p>
    </div>
  )
}

export default CommentCard