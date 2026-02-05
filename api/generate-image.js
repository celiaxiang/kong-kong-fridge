export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
      console.error('❌ 未配置 SILICONFLOW_API_KEY');
      return res.status(500).json({ error: 'API Key 未配置' });
    }

    const prompt = `Professional food photography of ${recipeName}, Chinese cuisine, appetizing, high resolution, studio lighting, top view, natural colors, delicious looking, 4k quality`;

    console.log(`🎨 正在生成图片：${recipeName}`);

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
        num_inference_steps: 4
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API错误:', errorText);
      return res.status(response.status).json({ error: '图片生成失败' });
    }

    const data = await response.json();

    if (data.images && data.images.l
