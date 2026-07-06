import fetch from 'node-fetch'

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { target, postureContext } = JSON.parse(event.body)
    if (!target) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing fitness target' }) }
    }

    const apiKey = process.env.XUNFEI_API_KEY
    const apiSecret = process.env.XUNFEI_API_SECRET

    let systemPrompt = '你 health 领域的专家及明星健身教练。请根据用户的核心目标和体态背景，为其制定一套结构化的、极简精炼的健身训练计划。'
    let userContent = `用户核心目标：${target}。`
    if (postureContext) {
      userContent += `用户最近的 AI 体态分析诊断结论为：${postureContext}。请在推荐动作中特别加入针对该体态的康复纠正动作。`
    }

    userContent += '\n请严格按照以下 JSON 格式返回，不要包含任何多余的 Markdown 标记或问候语：\n{\n  "planName": "计划名称",\n  "overview": "整体计划概述",\n  "exercises": [\n    {"name": "动作名称", "reps": "每组次数/时长", "sets": "组数", "tip": "动作核心要领"}\n  ],\n  "weeklySchedule": [\n    {"day": "周一", "content": "训练内容概要"}\n  ]\n}'

    const response = await fetch('https://spark-api.xf-yun.com/v1.1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}:${apiSecret}`
      },
      body: JSON.stringify({
        model: 'spark-max', // 使用逻辑推理能力更强的模型进行方案编写
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.3 // 降低随机性，确保严格输出符合规范的 JSON
      })
    })

    const data = await response.json()
    const rawContent = data.choices[0].message.content.trim()
    
    // 清洗模型可能夹带的 ```json ``` 标记
    const cleanJson = rawContent.replace(/^```json\s*/i, '').replace(/```$/, '').trim()

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: cleanJson
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate workout tutorial.' })
    }
  }
}