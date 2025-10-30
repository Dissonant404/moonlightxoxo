import { saveImage, getImages } from '../config.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // For Vercel, we'll use a simple JSON file storage
      // In production, you might want to use Vercel Blob Storage or similar
      const formData = await parseFormData(req);
      const imageFile = formData.get('image');
      
      if (!imageFile) {
        return res.status(400).json({ error: 'No image provided' });
      }

      // Convert file to base64
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString('base64');
      
      const newImage = {
        id: Date.now().toString(),
        caption: formData.get('caption') || 'Untitled',
        page: parseInt(formData.get('page')) || 1,
        data: `data:${imageFile.type};base64,${base64Image}`,
        url: `data:${imageFile.type};base64,${base64Image}`, // Using data URL for simplicity
        timestamp: new Date().toISOString()
      };

      await saveImage(newImage);
      res.status(200).json(newImage);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Helper function to parse form data
function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    const busboy = require('busboy');
    
    const bb = busboy({ headers: req.headers });
    
    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      const chunks = [];
      file.on('data', (chunk) => chunks.push(chunk));
      file.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const blob = new Blob([buffer], { type: mimeType });
        formData.set(name, blob, filename);
      });
    });
    
    bb.on('field', (name, value) => {
      formData.set(name, value);
    });
    
    bb.on('close', () => {
      resolve(formData);
    });
    
    bb.on('error', (err) => {
      reject(err);
    });
    
    req.pipe(bb);
  });
}