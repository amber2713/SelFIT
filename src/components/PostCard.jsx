import React, { useState, useEffect } from 'react'
import { likePost, fetchComments, createComment } from '../services/post'
import CommentCard from './CommentCard'

const PostCard = ({ post, currentUser }) => {
  const [likes, setLikes] = useState(post.likes_count)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    if (showComments) {
      loadComments()
    }
  }, [showComments])

  const loadComments = async () => {
    try {
      const data = await fetchComments(post.id)
      setComments(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLike = async (e) => {
    e.stopPropagation()
    try {
      const updatedPost = await likePost(post.id, likes)
      setLikes(updatedPost.likes_count)
    } catch (err) {
      alert('Failed to like post.')
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUser) return
    try {
      const inserted = await createComment(post.id, newComment, currentUser.id, currentUser.email)
      setComments([...comments, inserted])
      setNewComment('')
    } catch (err) {
      alert('Failed to submit comment.')
    }
  }

  return (
    <div className="glass-card post-card animate-fade-in">
      <div className="post-header">
        <div className="post-avatar">🏋️</div>
        <div>
          <h4 className="post-author">{post.author_name}</h4>
          <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      <p className="post-content">{post.content}</p>
      
      {post.image_url && (
        <div className="post-image-wrapper">
          <img src={post.image_url} alt="Post Attachment" className="post-image" />
        </div>
      )}

      <div className="post-actions">
        <button className="action-btn" onClick={handleLike}>
          ❤️ <span style={{ marginLeft: '4px', color: 'var(--text-primary)' }}>{likes}</span>
        </button>
        <button className="action-btn" onClick={() => setShowComments(!showComments)}>
          💬 <span style={{ marginLeft: '4px', color: 'var(--text-primary)' }}>Comment</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map(c => (
              <CommentCard key={c.id} comment={c} />
            ))}
          </div>
          {currentUser && (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input 
                type="text" 
                className="form-input comment-input" 
                placeholder="Write a supportive comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default PostCard