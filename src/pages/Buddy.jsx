import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { enterMatchQueue, findAndConnectBuddy, leaveMatchQueue, getBuddyProfile } from '../services/buddy'
import Button from '../components/Button'
import BuddyCard from '../components/BuddyCard'
import '../styles/buddy.css'

const Buddy = () => {
  const [user, setUser] = useState(null)
  const [matchStatus, setMatchStatus] = useState('idle') // idle | matching | matched
  const [currentQueueRecord, setCurrentQueueRecord] = useState(null)
  const [partner, setPartner] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setUser(session.user)
    }
    fetchUser()

    // 卸载组件时安全撤离匹配队列，防止死桩脏数据
    return () => {
      if (user) leaveMatchQueue(user.id)
    }
  }, [])

  // 核心机制：利用 WebSockets 建立实时行级状态过滤器
  useEffect(() => {
    if (!currentQueueRecord || matchStatus !== 'matching') return

    // 建立针对当前用户匹配队列行的特定监听频道
    const channel = supabase
      .channel(`match_${currentQueueRecord.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'match_queue',
          filter: `id=eq.${currentQueueRecord.id}` // 仅仅关注当前用户这一行数据的变更
        },
        async (payload) => {
          const updatedRow = payload.new
          // 如果数据库端被其他并发碰撞进来的用户将状态修改成了 matched
          if (updatedRow.status === 'matched' && updatedRow.matched_with) {
            const buddyInfo = await getBuddyProfile(updatedRow.matched_with)
            setPartner(buddyInfo)
            setMatchStatus('matched')
            channel.unsubscribe() // 配对成功后及时断开实时流
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentQueueRecord, matchStatus])

  const handleStartMatching = async () => {
    if (!user) return alert('Please log in to use the Gym Buddy feature.')
    setMatchStatus('matching')

    try {
      // 1. 向云端数据库队列插桩挂载
      const record = await enterMatchQueue(user.id, user.email)
      setCurrentQueueRecord(record)

      // 2. 尝试主动进行第一轮并发重合度检测碰撞
      const collisionResult = await findAndConnectBuddy(record.id, user.id)
      
      // 3. 碰撞成功（当前恰好有另一个用户在Searching等待，瞬间结合）
      if (collisionResult.success) {
        setPartner(collisionResult.buddy)
        setMatchStatus('matched')
      }
      // 4. 若没撞成功，则组件内静默等待，交给上面挂载的 Realtime WebSocket 监听对方来撞自己
    } catch (err) {
      alert('Matching system error. Redirecting...')
      setMatchStatus('idle')
    }
  }

  const handleCancelMatching = async () => {
    setMatchStatus('idle')
    setPartner(null)
    if (user) {
      await leaveMatchQueue(user.id)
    }
  }

  return (
    <div className="buddy-container animate-fade-in">
      {matchStatus === 'idle' && (
        <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 className="welcome-title">Gym Buddy Match</h1>
            <p className="welcome-subtitle">Instantly connect with other fitness enthusiasts in the ecosystem for collaborative training.</p>
          </header>
          <Button onClick={handleStartMatching}>Find My Gym Buddy</Button>
        </div>
      )}

      {matchStatus === 'matching' && (
        <div className="radar-wrapper">
          <div className="radar-circle">⏳</div>
          <h3 className="matching-status-text">Matching Live...</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '40px' }}>
            Awaiting alignment with a distributed digital fitness partner.
          </p>
          <div style={{ width: '160px' }}>
            <Button variant="secondary" onClick={handleCancelMatching}>Cancel</Button>
          </div>
        </div>
      )}

      {matchStatus === 'matched' && partner && (
        <BuddyCard buddy={partner} onCancel={handleCancelMatching} />
      )}
    </div>
  )
}

export default Buddy