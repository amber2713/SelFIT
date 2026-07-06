import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { fetchPosts } from '../services/post'
import PostCard from '../components/PostCard'
import Button from '../components/Button'
import Loading from '../components/Loading'
import '../styles/community.css'

const Community = () => {
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeCommunity = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) setUser(session.user)
        
        const data = await fetchPosts()
        setPosts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    initializeCommunity()
  }, [])

  return (
    <div className="community-container animate-fade-in">
      {loading && <Loading />}
      <header className="community-top-bar">
        <div>
          <h1 className="welcome-title">Community Hub</h1>
          <p className="welcome-subtitle">Connect, inspire, and crush fitness goals together.</p>
        </div>
        {user && (
          <div style={{ width: '140px' }}>
            <Button onClick={() => navigate('/community/create')}>Share Today</Button>
          </div>
        )}
      </header>

      <div style={{ marginTop: '24px' }}>
        {posts.map(p => (
          <PostCard key={p.id} post={p} currentUser={user} />
        ))}
      </div>
    </div>
  )
}

export default Community