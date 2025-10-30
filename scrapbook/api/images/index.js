import { getImages } from '../config.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const images = await getImages();
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}