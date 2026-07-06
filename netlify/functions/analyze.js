exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { image } = JSON.parse(event.body);
    if (!image) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing image data' }) };
    }

    // 从环境变量读取 USTC 平台的 API Key
    const apiKey = process.env.USTC_API_KEY; 
    const modelId = "qwen3.6-chat"; 

    // 【核心修复】：如果环境没有原生 fetch，主动 fallback 到模拟
    const activeFetch = typeof fetch !== 'undefined' ? fetch : require('node-fetch');

    const requestBody = {
      model: modelId,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '你是一位专业的 AI 物理治疗师与体态康复专家。请精确评估这张人体透视或实拍照片中的骨骼对齐与体态问题（如：高低肩、头前引、圆肩驼背、骨盆前倾等），并给出专业的诊断结论。'
            },
            {
              type: 'image_url',
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      stream: false, 
      temperature: 0.3
    };

    // 使用兼容后的 activeFetch 发送请求
    const response = await activeFetch('https://api.llm.ustc.edu.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        statusCode: response.status || 400,
        body: JSON.stringify({ error: data?.error?.message || 'USTC 大模型平台服务异常' })
      };
    }

    const aiAnalysisResult = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // 允许跨域顺便带上
      },
      body: JSON.stringify({ report: aiAnalysisResult })
    };

  } catch (error) {
    console.error('USTC Analyze Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};
