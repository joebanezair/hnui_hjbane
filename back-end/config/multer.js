// config/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage engine
// - destination: always points to uploads/ folder
// - filename: prepend current timestamp to original filename for uniqueness
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

// File filter function
// - Block dangerous extensions (executables, installers, scripts)
// - Allow all other file types
const fileFilter = (req, file, cb) => {
  const blocked = [
    ".exe", ".msi", ".bat", ".cmd", ".sh", ".apk", ".deb", ".rpm", ".pkg",
  ];
  const ext = path.extname(file.originalname).toLowerCase();

  if (blocked.includes(ext)) {
    cb(new Error("Executable or installable files are not allowed!"), false);
  } else {
    cb(null, true);
  }
};

// Multer configuration
// - storage: use custom disk storage defined above
// - fileFilter: apply security filter
// - limits: restrict max file size to 50MB per file
const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Export Multer instance
// Use upload.array("files", 10) in routes to accept up to 10 files
module.exports = multerUpload;
