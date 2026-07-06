exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { image } = JSON.parse(event.body);
    if (!image) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing image data' }) };
    }

    const apiKey = process.env.USTC_API_KEY; 
    const modelId = "qwen3.6-chat"; 

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

    // 直接使用环境自带的全局原生 fetch，没有任何第三方依赖包
    const response = await fetch('https://api.llm.ustc.edu.cn/v1/chat/completions', {
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
        'Access-Control-Allow-Origin': '*'
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
