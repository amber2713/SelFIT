exports.handler = async (event, context) => {
  // 仅允许 POST 请求
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
    const modelId = "qwen3.6-chat"; // 使用指定的模型名称

    // 封装符合 OpenAI 规范的图文混合多模态 messages 结构
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
                url: image // 前端传过来的 data:image/jpeg;base64,... 字符串
              }
            }
          ]
        }
      ],
      stream: false, 
      temperature: 0.3
    };

    // 使用 Node 原生全局 fetch 请求 USTC 平台接口
    const response = await fetch('https://api.llm.ustc.edu.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // 拦截处理诸如 401/403/429 等平台状态码错误
    if (!response.ok || data.error) {
      return {
        statusCode: response.status || 400,
        body: JSON.stringify({ error: data?.error?.message || 'USTC 大模型平台服务异常' })
      };
    }

    // 解析并提取模型生成的文本
    const aiAnalysisResult = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report: aiAnalysisResult })
    };

  } catch (error) {
    console.error('USTC Analyze Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
