// api/generate-image.js
export default async function handler(req, res) {
  // 1. 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipeName } = req.body;

    if (!recipeName) {
      return res.status(400).json({ error: '缺少菜名参数' });
    }

    const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY;

    if (!SILICONFLOW_API_KEY) {
      console.error('未配置 SILICONFLOW_API_KEY');
      return res.status(500).json({ 
        error: 'API Key 未配置',
        hint: '请在 Vercel 环境变量中配置 SILICONFLOW_API_KEY'
      });
    }

    const prompt = `Professional food photography of ${recipeName}, Chinese cuisine, appetizing, high resolution, studio lighting, top view, natural colors, delicious looking, 4k quality`;

    console.log(`正在生成图片: ${recipeName}`);

    // 直接使用内置 fetch
    const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell',
        prompt: prompt,
        image_size: '512x512',
        num_inference_steps: 4,
        seed: Math.floor(Math.random() * 1000000)
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('硅基流动 API 错误:', errorText);
      return res.status(response.status).json({ 
        error: '图片生成失败',
        details: errorText
      });
    }

    const data = await response.json();

    if (data.images && data.images.length > 0) {
      console.log('图片生成成功');
      return res.status(200).json({
        success: true,
        imageUrl: data.images[0].url,
        recipeName: recipeName
      });
    } else {
      return res.status(500).json({ 
        error: '未返回图片数据'
      });
    }

  } catch (error) {
    console.error('服务器错误:', error.message);
    return res.status(500).json({ 
      error: '服务器内部错误',
      message: error.message
    });
  }
}
