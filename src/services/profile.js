import { supabase } from './supabase'

/**
 * 获取用户的社区发帖总数统计
 */
export const getUserStats = async (userId) => {
  const { count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true }) // head: true 表示只获取总条数而不拉取实际行内容，极高提升性能
    .eq('user_id', userId)

  if (error) throw error
  return { postCount: count || 0 }
}

/**
 * 获取用户全量的历史体态诊断报告记录列表（按时间倒序排列）
 */
export const getUserPostureHistory = async (userId) => {
  const { data, error } = await supabase
    .from('posture_records')
    .select('id, created_at, report_text')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}