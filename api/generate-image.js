// api/generate-image.js - 图片生成接口
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { recipeName } = req.body;
    const apiKey = process.env.SILICONFLOW_API_KEY;

    // 使用 FLUX 模型生成美食图片
    const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell",
        prompt: `Professional food photography of ${recipeName}, Chinese cuisine, appetizing, high resolution, studio lighting, top view, natural colors, delicious looking`,
        image_size: "512x512",
        seed: Math.floor(Math.random() * 1000000)
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    
    // 检查是否有图片返回
    if (data.images && data.images.length > 0) {
      return res.status(200).json({ 
        success: true, 
        imageUrl: data.images[0].url 
      });
    } else {
      return res.status(500).json({ error: 'No image data returned' });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
