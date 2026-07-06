/**
 * 核心：发起体态照片分析请求
 * @param {string} base64Image - 图片的 Base64 字符串
 */
export const requestPostureAnalysis = async (base64Image) => {
  const response = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: base64Image })
  })

  if (!response.ok) {
    const errData = await response.json()
    throw new Error(errData.error || 'Failed to analyze posture via Serverless Function.')
  }

  return await response.json()
}