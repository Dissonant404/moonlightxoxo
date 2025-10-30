import fs from 'fs';
import path from 'path';

const IMAGES_FILE = path.join(process.cwd(), 'data', 'images.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(IMAGES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Get all images
export async function getImages() {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(IMAGES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(IMAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading images:', error);
    return [];
  }
}

// Save a new image
export async function saveImage(image) {
  try {
    ensureDataDirectory();
    const images = await getImages();
    images.push(image);
    fs.writeFileSync(IMAGES_FILE, JSON.stringify(images, null, 2));
    return image;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}