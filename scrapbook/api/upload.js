import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file[0];
    const upload = await cloudinary.uploader.upload(file.filepath, {
      folder: "album",
      resource_type: "image",
    });

    res.status(200).json({ url: upload.secure_url });
  });
}
