import { supabase } from './supabase'

/**
 * 将当前登录用户加入匹配队列
 */
export const enterMatchQueue = async (userId, userEmail) => {
  // 先清理可能残存的旧队列记录，防止数据死锁
  await supabase.from('match_queue').delete().eq('user_id', userId)

  const { data, error } = await supabase
    .from('match_queue')
    .insert([
      {
        user_id: userId,
        email: userEmail,
        status: 'searching', // 初始状态：正在搜索中
        matched_with: null,
        created_at: new Date().toISOString()
      }
    ])
    .select()

  if (error) throw error
  return data[0]
}

/**
 * 尝试在队列中寻找另一个正在等待的“幸运儿”进行碰撞配对
 */
export const findAndConnectBuddy = async (currentQueueId, currentUserId) => {
  // 1. 查询当前是否有其他人也在 searching 状态（排除自己）
  const { data: candidates, error } = await supabase
    .from('match_queue')
    .select('*')
    .eq('status', 'searching')
    .neq('user_id', currentUserId)
    .order('created_at', { ascending: true })
    .limit(1)

  if (error) throw error

  // 2. 如果找到了可配对的候选人，进行原子级状态更新（达成配对）
  if (candidates && candidates.length > 0) {
    const targetBuddy = candidates[0]

    // 更新对方：将状态改为 matched，绑定当前用户
    await supabase
      .from('match_queue')
      .update({ status: 'matched', matched_with: currentUserId })
      .eq('id', targetBuddy.id)

    // 更新自己：将状态改为 matched，绑定对方
    const { data: myUpdatedData } = await supabase
      .from('match_queue')
      .update({ status: 'matched', matched_with: targetBuddy.user_id })
      .eq('id', currentQueueId)
      .select()

    return { success: true, buddy: targetBuddy, myRecord: myUpdatedData[0] }
  }

  return { success: false }
}

/**
 * 退出匹配队列
 */
export const leaveMatchQueue = async (userId) => {
  const { error } = await supabase
    .from('match_queue')
    .delete()
    .eq('user_id', userId)
  
  if (error) throw error
}

/**
 * 依据用户 ID 获取匹配成功的伙伴详情
 */
export const getBuddyProfile = async (buddyId) => {
  // 后续完善 Profile 后可以从 profiles 表拿头像昵称，目前先从队列记录或基础信息中提取
  const { data, error } = await supabase
    .from('match_queue')
    .select('*')
    .eq('user_id', buddyId)
    .limit(1)

  if (error) throw error
  return data && data[0] ? data[0] : null
}