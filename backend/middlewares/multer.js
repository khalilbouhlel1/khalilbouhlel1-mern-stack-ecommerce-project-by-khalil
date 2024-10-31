import multer from "multer";
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});
export default upload;

