import multer from "multer";

// using memory storage so we can upload buffer directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		if (!file.mimetype || !file.mimetype.startsWith("image/")) {
			return cb(new Error("Only image uploads are allowed"));
		}
		return cb(null, true);
	},
});

export default upload;
