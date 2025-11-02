import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dtivrj36d",
  api_key: "664961363634893",
  api_secret: "UzgyWm6us1f5HcEWOcA-rKpcm34",
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
