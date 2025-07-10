const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../utils/s3');
const path = require('path');

const bucketName = process.env.AWS_BUCKET_NAME;

const upload = multer({
  storage: multerS3({
    s3,
    bucket: bucketName,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileExt = path.extname(file.originalname);
      const fileName = `resumes/${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
      cb(null, fileName);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
      return cb(new Error('Only .pdf, .doc, and .docx files are allowed!'));
    }
    cb(null, true);
  }
});

module.exports = upload;
