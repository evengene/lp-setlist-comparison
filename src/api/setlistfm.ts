// api/setlistfm.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = process.env.SETLISTFM_API_KEY;
const API_BASE = 'https://api.setlist.fm/rest/1.0';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the path (everything after /api/setlistfm)
  const path = req.url?.replace('/api/setlistfm', '') || '';

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'x-api-key': API_KEY || '',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Setlist.fm API error: ${response.status}`);
    }

    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=3600');

    return res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch from Setlist.fm',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
