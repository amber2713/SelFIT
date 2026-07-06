import { supabase } from './supabase'

/**
 * 上传图片到 Supabase Storage 的 community-photos 存储桶
 * @param {File} file 
 */
export const uploadPostImage = async (file) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `posts/${fileName}`

  const { data, error } = await supabase.storage
    .from('community-photos')
    .upload(filePath, file)

  if (error) throw error

  // 获取上传成功后的公网访问持久化 URL
  const { data: { publicUrl } } = supabase.storage
    .from('community-photos')
    .getPublicUrl(filePath)

  return publicUrl
}

/**
 * 创建新帖子
 */
export const createPost = async (content, imageUrl, userId, userEmail) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([
      { 
        content, 
        image_url: imageUrl, 
        user_id: userId, 
        author_name: userEmail.split('@')[0], // 临时截取邮箱作为昵称
        likes_count: 0,
        created_at: new Date().toISOString()
      }
    ])
    .select()

  if (error) throw error
  return data[0]
}

/**
 * 拉取所有帖子列表（按时间倒序）
 */
export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * 点赞帖子自增
 */
export const likePost = async (postId, currentLikes) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ likes_count: currentLikes + 1 })
    .eq('id', postId)
    .select()

  if (error) throw error
  return data[0]
}

/**
 * 发表评论
 */
export const createComment = async (postId, content, userId, userEmail) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        post_id: postId,
        content,
        user_id: userId,
        author_name: userEmail.split('@')[0],
        created_at: new Date().toISOString()
      }
    ])
    .select()

  if (error) throw error
  return data[0]
}

/**
 * 拉取指定帖子的所有二级评论
 */
export const fetchComments = async (postId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}