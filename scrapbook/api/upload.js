import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      const uploadResult = await cloudinary.uploader.upload(files.file.filepath, {
        folder: "scrapbook",
      });

      res.status(200).json({
        url: uploadResult.secure_url,
        caption: fields.caption,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
