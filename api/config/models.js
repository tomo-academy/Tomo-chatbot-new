import { getModels } from '../../lib/config/models.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const models = await getModels();
    
    res.status(200).json({ 
      models,
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60'
      }
    });
  } catch (error) {
    console.error('Failed to fetch models from /api/config/models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
}