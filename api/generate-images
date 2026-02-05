// Vercel Serverless Function
// 文件路径: /api/generate-image.js

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipeName } = req.body;

    // 验证参数
    if (!recipeName) {
      return res.status(400).json({ error: '缺少菜名参数' });
    }

    // API Key 从环境变量读取（安全）
    const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY;

    if (!SILICONFLOW_API_KEY) {
      console.error('❌ 未配置 SILICONFLOW_API_KEY 环境变量');
      return res.status(500).json({ error: 'API Key 未配置' });
    }

    // 构建提示词
    const prompt = `Professional food photography of ${recipeName}, Chinese cuisine, appetizing, high resolution, studio lighting, top view, natural colors, delicious looking, 4k quality`;

    console.log(`🎨 正在为《${recipeName}》生成图片...`);

    // 调用硅基流动 API
    const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell",
        prompt: prompt,
        image_size: "512x512",
        num_inference_steps: 4,
        seed: Math.floor(Math.random() * 1000000) // 随机种子，确保每次生成不同
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 硅基流动 API 错误:', errorText);
      return res.status(response.status).json({ 
        error: '图片生成失败', 
        details: errorText 
      });
    }

    const data = await response.json();

    if (data.images && data.images.length > 0) {
      console.log('✅ 图片生成成功');
      return res.status(200).json({
        success: true,
        imageUrl: data.images[0].url,
        recipeName: recipeName
      });
    } else {
      return res.status(500).json({ error: '未返回图片数据' });
    }

  } catch (error) {
    console.error('❌ 服务器错误:', error);
    return res.status(500).json({ 
      error: '服务器内部错误', 
      message: error.message 
    });
  }
}
