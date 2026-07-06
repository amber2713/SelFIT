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

    // 从环境变量读取你的新版 Key 和 ModelID
    const apiKey = process.env.XUNFEI_API_KEY;
    const modelId = process.env.XUNFEI_MODEL_ID || 'xqwen2d5s32bvl'; // 依据文档示例默认或自定义

    // 1. 严格按照文档 2.2 与 2.2.1 要求的结构体封装 messages
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
                url: image // 前端传过来的完整的 data:image/jpeg;base64,... 字符串
              }
            }
          ]
        }
      ],
      stream: false, // 统一转接不流式，一次性返回给前端
      temperature: 0.3, // 降低随机性，保证评估结果科学准确
      max_tokens: 2048
    };

    // 2. 发起符合 MaaS v2 协议的 HTTP POST 请求
    const response = await fetch('https://maas-api.cn-huabei-1.xf-yun.com/v2/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // 3. 拦截文档中提及的业务逻辑错误（如敏感词审核、授权错误）
    if (data.error) {
      return {
        statusCode: response.status || 400,
        body: JSON.stringify({ error: data.error.message || 'AI 诊断服务异常' })
      };
    }

    // 4. 解析并提取大模型返回的文本内容
    const aiAnalysisResult = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report: aiAnalysisResult })
    };

  } catch (error) {
    console.error('Analyze Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
