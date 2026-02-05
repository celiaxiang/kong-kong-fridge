// api/chat.js (专用于生成食谱文字)
export default async function handler(req, res) {
  // 1. 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // 2. 从环境变量获取 SiliconFlow 的 Key
    const apiKey = process.env.SILICONFLOW_API_KEY; 
    if (!apiKey) {
      return res.status(500).json({ error: '后端未配置 API Key' });
    }

    // 3. 呼叫 SiliconFlow 的对话接口 (Chat Completions)
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // ⚠️ 硅基流动的模型名称通常是 'deepseek-ai/DeepSeek-V3' 或 'deepseek-ai/DeepSeek-R1'
        // 这里我们强制指定一个稳定的模型，或者使用前端传来的 model
        model: "deepseek-ai/DeepSeek-V3", 
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SiliconFlow API Error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
