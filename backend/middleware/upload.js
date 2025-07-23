const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/';
    
    // Organize files by type
    if (file.fieldname === 'logo') {
      folder += 'logos/';
    } else if (file.fieldname.includes('image')) {
      folder += 'sections/';
    }
    
    // Create folder if it doesn't exist
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  }
});

// Handle multiple file fields
const uploadGameFiles = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'sections[overview][image]', maxCount: 1 },
  { name: 'sections[versions][image]', maxCount: 1 },
  { name: 'sections[uses][image]', maxCount: 1 },
  { name: 'sections[features][image]', maxCount: 1 },
  { name: 'sections[system][image]', maxCount: 1 }
]);

module.exports = { upload, uploadGameFiles };