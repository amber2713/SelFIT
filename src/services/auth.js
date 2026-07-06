import { supabase } from './supabase'

/**
 * 用户注册逻辑
 * @param {string} email 
 * @param {string} password 
 */
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

/**
 * 用户登录逻辑
 * @param {string} email 
 * @param {string} password 
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

/**
 * 退出登录
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * 获取当前用户会话
 */
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}