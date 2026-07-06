exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { target, postureContext } = JSON.parse(event.body);

    const apiKey = process.env.USTC_API_KEY;
    const modelId = "qwen3.6-chat"; 

    // 构建上下文纯文本 Prompt
    let userPrompt = `我的健身/改善目标是：${target}。`;
    if (postureContext) {
      userPrompt += `结合我之前的体态诊断报告：【${postureContext}】，请为我量身定制一套规避体态风险、矫正体态并达成目标的健身训练计划教程。`;
    } else {
      userPrompt += `请为我定制一套科学的健身训练计划教程。`;
    }

    const requestBody = {
      model: modelId,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      stream: false,
      temperature: 0.5,
      max_tokens: 2048
    };

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

    const tutorialPlan = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutorial: tutorialPlan })
    };

  } catch (error) {
    console.error('USTC Tutorial Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
