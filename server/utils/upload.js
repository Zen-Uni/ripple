const multer = require("@koa/multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./public/uploads/')
  },
  filename: function (req, file, cb) {
    const type = file.originalname.split(".");
    cb(
      null,
      `${file.fieldname}-${Date.now().toString(16)}.${type[type.length - 1]}`
    );
  },
});

const limits = {
    fields: 10,//非文件字段的数量
    fileSize: 500 * 1024,//文件大小 单位 b
    files: 1//文件数量
}
const upload = multer({storage})

module.exports = upload
