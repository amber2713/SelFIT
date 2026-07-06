/**
 * 请求定制 AI 体态分析诊断
 * @param {string} base64Image - 经过转换后的体态影像 Base64 编码字符串
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
    throw new Error('AI Posture Analysis Server Error.')
  }

  return await response.json()
}

/**
 * 请求定制 AI 健身教程计划
 * @param {string} target - 用户的健身或体态改善目标
 * @param {string} postureContext - 可选，同步传入的体态分析历史背景
 */
export const requestFitnessTutorial = async (target, postureContext = '') => {
  const response = await fetch('/.netlify/functions/tutorial', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ target, postureContext })
  })

  if (!response.ok) {
    throw new Error('Failed to retrieve AI customized plan.')
  }

  return await response.json()
}